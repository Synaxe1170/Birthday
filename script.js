const defaults = {
  name: "beautiful",
  fromName: "me",
  heroMessage:
    "Today is for you: your smile, your softness, your beauty, and every little thing that makes being with you feel so special.",
  letterOne:
    "I hope today makes you feel as loved as you make me feel. You have this quiet magic about you: calm, elegant, funny, sweet, and unforgettable without even trying.",
  letterTwo:
    "I love the way you look at the world, the way you carry yourself, and the way every memory with you becomes something I want to keep. I am so grateful I get to love you.",
  memoryOneTitle: "When we dressed up together",
  memoryOneText:
    "I wish that night never ended. Seeing you laugh and dance couldn't have made me happier.",
  memoryTwoTitle: "The little everyday moments",
  memoryTwoText:
    "Even the simple pictures feel special because they are you, and because they remind me I get to know this side of you.",
  memoryThreeTitle: "Dates I never want to forget",
  memoryThreeText:
    "Being next to you is one of my favorite places to be. Somehow you make the whole table feel brighter.",
};

const reasons = [
  "You make every room feel softer just by being in it.",
  "You are beautiful in a way that feels calm and impossible to ignore.",
  "You make ordinary days feel like something worth remembering.",
  "I love your confidence, your softness, and your little serious face.",
  "Being next to you makes me feel lucky in the quietest, realest way.",
  "You have a kind of elegance that stays with me after you leave.",
  "I love that I get to be the person cheering for you today.",
];

const dateIdeas = [
  "Dinner somewhere pretty, dessert after, and photos before we leave.",
  "Flowers first, then a slow walk with your favorite drink.",
  "A dressed-up date night with no rushing and no boring errands.",
  "A cozy movie night after dinner, with snacks chosen by you only.",
  "A little shopping trip, a sweet treat, and a picture we keep forever.",
  "A late-night drive with music, dessert, and my hand in yours.",
];

const storageKey = "birthday-site-personalization-v3";
const fields = document.querySelectorAll("[data-field]");
const editForm = document.querySelector("#editForm");
const reasonText = document.querySelector("#reasonText");
const reasonButton = document.querySelector("#reasonButton");
const dateIdea = document.querySelector("#dateIdea");
const dateButton = document.querySelector("#dateButton");
const resetButton = document.querySelector("#resetButton");
const celebrateButton = document.querySelector("#celebrateButton");
const countdownNumber = document.querySelector("#countdownNumber");
const countdownLabel = document.querySelector("#countdownLabel");
const canvas = document.querySelector("#confetti");
const context = canvas.getContext("2d");

let reasonIndex = 0;
let dateIndex = 0;
let confettiPieces = [];

function loadState() {
  try {
    return { ...defaults, ...JSON.parse(localStorage.getItem(storageKey)) };
  } catch {
    return { ...defaults };
  }
}

function saveState(state) {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function renderState(state) {
  fields.forEach((field) => {
    const key = field.dataset.field;
    field.textContent = state[key] || defaults[key] || "";
  });

  if (editForm) {
    Object.entries(state).forEach(([key, value]) => {
      const input = editForm.elements[key];
      if (input) {
        input.value = value;
      }
    });
  }
}

function nextFrom(list, currentIndex) {
  return (currentIndex + 1) % list.length;
}

function setCountdown() {
  countdownNumber.textContent = "1210";
  countdownLabel.textContent = "days in, 101 days loved this year";
}

function resizeCanvas() {
  canvas.width = window.innerWidth * window.devicePixelRatio;
  canvas.height = window.innerHeight * window.devicePixelRatio;
  context.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
}

function createConfetti() {
  const colors = ["#d83f65", "#0e8a83", "#f5c85b", "#ffffff", "#ff8fab"];
  confettiPieces = Array.from({ length: 130 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * -window.innerHeight,
    size: Math.random() * 8 + 5,
    speed: Math.random() * 3 + 2,
    drift: Math.random() * 2 - 1,
    rotation: Math.random() * Math.PI,
    color: colors[Math.floor(Math.random() * colors.length)],
  }));
}

function drawConfetti() {
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);

  confettiPieces.forEach((piece) => {
    piece.y += piece.speed;
    piece.x += piece.drift;
    piece.rotation += 0.08;

    context.save();
    context.translate(piece.x, piece.y);
    context.rotate(piece.rotation);
    context.fillStyle = piece.color;
    context.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size / 2);
    context.restore();
  });

  confettiPieces = confettiPieces.filter((piece) => piece.y < window.innerHeight + 20);

  if (confettiPieces.length > 0) {
    requestAnimationFrame(drawConfetti);
  } else {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }
}

function celebrate() {
  createConfetti();
  drawConfetti();
}

if (editForm) {
  editForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(editForm);
    const current = loadState();
    const next = { ...current };

    for (const [key, value] of formData.entries()) {
      next[key] = String(value).trim() || defaults[key] || "";
    }

    saveState(next);
    renderState(next);
    celebrate();
  });
}

if (resetButton) {
  resetButton.addEventListener("click", () => {
    localStorage.removeItem(storageKey);
    renderState({ ...defaults });
    celebrate();
  });
}

reasonButton.addEventListener("click", () => {
  reasonIndex = nextFrom(reasons, reasonIndex);
  reasonText.textContent = reasons[reasonIndex];
});

dateButton.addEventListener("click", () => {
  dateIndex = nextFrom(dateIdeas, dateIndex);
  dateIdea.textContent = dateIdeas[dateIndex];
});

celebrateButton.addEventListener("click", celebrate);
window.addEventListener("resize", resizeCanvas);

resizeCanvas();
setCountdown();
renderState(loadState());
