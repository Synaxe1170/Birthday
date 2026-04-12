-- Hammerspoon config: press right Command + right Option to show Codex.
-- Install Hammerspoon, then place this file at ~/.hammerspoon/init.lua and reload.

local rightCommandKeyCode = 54
local rightOptionKeyCode = 61

local rightCommandDown = false
local rightOptionDown = false
local firedForCurrentPress = false

local function showCodex()
  hs.application.launchOrFocus("Codex")
end

local function updateModifierState(event)
  local keyCode = event:getKeyCode()

  if keyCode == rightCommandKeyCode then
    rightCommandDown = not rightCommandDown
  elseif keyCode == rightOptionKeyCode then
    rightOptionDown = not rightOptionDown
  else
    return false
  end

  if rightCommandDown and rightOptionDown then
    if not firedForCurrentPress then
      firedForCurrentPress = true
      showCodex()
    end
  else
    firedForCurrentPress = false
  end

  return false
end

rightCommandOptionWatcher = hs.eventtap.new(
  { hs.eventtap.event.types.flagsChanged },
  updateModifierState
)

rightCommandOptionWatcher:start()
hs.alert.show("Codex hotkey loaded: right Command + right Option")
