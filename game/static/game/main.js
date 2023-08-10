import MiniScript from "./modules/miniscript.js"
import ScoreBoard from "./modules/scoreboard.js"

const panel = document.getElementById("game-panel")
const button = document.getElementById("startBtn")
let minigame;

button.addEventListener("click", () => {
  button.blur()
  const desktop = document.getElementById("desktop")
  if (minigame) {
    minigame.deleteThis()
  }
  while(panel.firstChild) {
    panel.removeChild(panel.firstChild)
  }
  minigame = new MiniScript(panel, desktop.checked)
})

console.log(ScoreBoard.render())
