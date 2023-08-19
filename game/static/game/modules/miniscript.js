import { animate, canvasAux, inputGame, gameControl, gameMain, lvlControl, bugsTimeControl, timeControl, scoreboardAPI, randomAPI, } from "./gameaux.js"
import ScoreBoard from "./scoreboard.js"

export default class MiniScript {
  
  constructor(root, desktop) {
    gameMain.root = root
    gameMain.desktop = desktop
    
    while (gameMain.root.firstChild) {
      gameMain.root.removeChild(gameMain.root.firstChild);
    }
    
    if (!gameMain.desktop) {
      inputGame.pivot = document.createElement("div")
      gameMain.root.appendChild(inputGame.pivot);
      
      inputGame.pivot.id = "pivot"
    }

    animate.canvas = document.createElement("canvas");
    gameMain.root.appendChild(animate.canvas);
    animate.ctx = animate.canvas.getContext("2d");
    canvasAux.setCanvasArea()
    
    animate.loadAssets()
    gameMain.gameStart()
    this.main()
  }
  
  main(){
    timeControl.nextFrame()
    timeControl.updateBugsTimer()
    gameControl.checkBoost()
    this.animation()
    this.idRAF = requestAnimationFrame(this.main.bind(this))
  }
  

  animation() {
    canvasAux.setCanvasArea()
    
    if(gameMain.gameOn) {
      animate.drawDesk();
      animate.drawLorem(); 
      animate.drawBars();
      if (gameMain.desktop) {
        animate.drawToPress();
      }
      animate.drawPenalties();
      if (bugsTimeControl.bugsON.end) {
        animate.drawBugs()
        animate.drawBugsTimer()
      }
    } else {
      animate.drawGameOver()
    }
  }
  
  deleteThis(){
    gameMain.gameOver()
    animate.canvas.removeEventListener("click", gameMain.callGameStartBind)
    document.removeEventListener("keydown", gameMain.callGameStartBind)
    scoreboardAPI.destroySubmitHandler(gameMain.desktop, gameMain.root)         //NAO IMPLEMENTAR SUBMIT HANDLER PARA MOBILE AINDA
      animate.isHighScore = false
      animate.msgGameOver = ''
    cancelAnimationFrame(this.idRAF)
  }
  
  debug(){
    // Implement Later
  }
}
