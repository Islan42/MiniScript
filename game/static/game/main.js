import MiniScript from "./modules/miniscript.js"
import ScoreBoard from "./modules/scoreboard.js"

const panel = document.getElementById("game-panel")
const button = document.getElementById("startBtn")
const scoreBoardPanel = document.getElementById('scoreboard')
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

ScoreBoard.render(scoreBoardPanel).then(() => console.log('TESTE2'))
console.log('TESTE')
// ScoreBoard.rerender(scoreBoardPanel)
// ScoreBoard.getScoresArray('desktop')
  // .then((array) => console.log(array))
  // .catch((error) => console.log(error))
