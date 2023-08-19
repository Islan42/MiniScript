import ScoreBoard from "./scoreboard.js"

const animate = {
  canvas: '',
  ctx: '',
  assets: '',
  
  reset(){
    this.spriteKey = 0;
    this.spriteLorem = 0;
    this.spritePen = 0;
    this.spriteRestart = 0;
    this.negativeAnim = false;
    
    this.isHighScore = ''
    this.isHighScoreSubmited = ''
    this.msgGameOver = ''
    this.labelNewColorBlue = true
  },
  
  loadAssets(){
    const aux = randomAPI.random(1,2)
    const lorem = new Image();
    lorem.src = "/static/game/assets/img/lorem.png"
    const desk = new Image();
    desk.src = `/static/game/assets/img/desk${aux}.png`
    const key = new Image();
    key.src = "/static/game/assets/img/key.png"
    const spacebar = new Image();
    spacebar.src = "/static/game/assets/img/spacebar.png"
    const penalties = new Image();
    penalties.src = "/static/game/assets/img/penalties.png"
    const bugs = new Image()
    bugs.src = "/static/game/assets/img/bugs.png"
    this.assets = { lorem, desk, key, spacebar, penalties, bugs };
  },
  
  drawDesk() {
    this.ctx.save() // SAVE 01: DESK
    if (this.negativeAnim) {
      let randX = randomAPI.random(-10,10)
      let randY = randomAPI.random(-10,10)
      this.ctx.translate(randX,randY)
    }
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(this.assets.desk, 0, 0, this.canvas.width, this.canvas.height);
    
  },
  
  drawLorem() {
    const bgColor = lvlControl.lvl.maxLvl < 10 ? "#ededed" : "#272822";
    const fgColor = lvlControl.lvl.maxLvl < 10 ? "#000000" : "#ededed";
    const width = this.canvas.width
    
    const dWidth = width / (500/200)
    const dHeight = width / (500/84)
    const dX = (width - dWidth)/2
    const dY = width / (500/33)
    
    this.ctx.drawImage(
      this.assets.lorem,
      0,
      21 * this.spriteLorem + 1,
      200,
      83,
      dX,
      dY,
      dWidth,
      dHeight
    );
    
    this.ctx.save()
    this.ctx.globalCompositeOperation = "source-atop"
    this.ctx.fillStyle = fgColor;
    this.ctx.fillRect(dX,dY,dWidth,dHeight)
    this.ctx.restore()
    
    if (bugsTimeControl.bugsON.end) {
      this.ctx.save()
      this.ctx.globalCompositeOperation = "source-atop"
      this.ctx.fillStyle = "#f4192c"
      this.ctx.fillRect(dX,dY,dWidth,dHeight)
      this.ctx.restore()
    }
    
    this.ctx.save()
    this.ctx.fillStyle = bgColor;
    this.ctx.globalCompositeOperation = "destination-atop"
    this.ctx.fillRect(0,0, this.canvas.width, this.canvas.height)
    this.ctx.restore()
    
    this.ctx.restore() // RESTORE 01: DESK
    
    if (timeControl.controlFR % 13 === 0) {
      if (!(this.spriteLorem % 3 === 0)) {
        this.spriteLorem++;
      } else if (this.spriteLorem === 18) {
        this.spriteLorem = 1;
      }
    }
  },
  
  drawBars() {
    this.ctx.save()
    const width = this.canvas.width
    
    //CODING
    const dWidth = width/(500/100)
    const dHeight = width/(500/13)
    const dY = width/(500/25)
    
    const diference = lvlControl.lvl.nextLvl - lvlControl.lvl.prevLvl;
    const percentage = ((gameControl.coding - lvlControl.lvl.prevLvl) / diference);
    this.ctx.fillStyle = "rgb(0,0,0)";
    this.ctx.fillRect(5, dY - 2, dWidth + 4, dHeight + 4);
    if (percentage >= 0) {
      this.ctx.fillStyle = "rgb(127, 127, 227)";
      this.ctx.fillRect(7, dY, percentage * dWidth, dHeight);
    }

    // LVL
    const font = width/(500/18);
    this.ctx.font = `${font}px sans-serif`;
    this.ctx.fillStyle = "rgb(0,0,0)";
    const lvlText = bugsTimeControl.bugsON.end
      ? `BUGS LVL: ${bugsTimeControl.bugsLvl.lvl - 1}`
      : `LVL: ${lvlControl.lvl.lvl}`;
    this.ctx.fillText(lvlText, 5, width/(500/60));

    // SCORE
    this.ctx.fillText(`SCORE: ${gameControl.score}`, 5, width/(500/80));

    //BOOST
    const boostText =
      bugsTimeControl.bugsON.end
        ? `${gameControl.pointsMultiplicator}x ${gameControl.boostMultiplicator.toFixed(1)}`
        : `${gameControl.boostMultiplicator.toFixed(1)}`;
    this.ctx.fillText(boostText, 5, width/(500/100));
    
    this.ctx.restore()
  },
  
  drawToPress() {
    const width = this.canvas.width
    const height = this.canvas.height
     
    const dHeight = width / (500/52)
    const dY = height - dHeight - 5
    if (inputGame.keytopress === " ") {
      const dWidth = width / (500/150)
      const dX = width / 2 - dWidth/2
      this.ctx.drawImage(this.assets.spacebar, 0, 27 * this.spriteKey, 75, 26, dX, dY, dWidth,dHeight )
    } else {
      const dWidth = width / (500/50)
      const dX = width / 2 - dWidth/2
      this.ctx.drawImage(
        this.assets.key,
        26 * this.spriteKey,
        0,
        25,
        26,
        dX,
        dY,
        dWidth,
        dHeight
      );
    }
    
    this.ctx.save();
    this.ctx.fillStyle = "rgb(255,0,0)";
    const font = width < 500 ? 16 : 18;
    this.ctx.font = `bold ${font}px sans-serif`;
    this.ctx.textAlign = "center"
    const keyText =
      inputGame.keytopress === " " ? "SPACEBAR" : `${inputGame.keytopress}`;
    this.ctx.fillText(
      keyText,
      width/(500/250) - 7 * this.spriteKey,
      width/(500/169) + 6 * this.spriteKey
    );
    this.ctx.restore();

    if (timeControl.controlFR % 31 === 0) {
      if (this.spriteKey === 1) {
        this.spriteKey = 0;
      } else {
        this.spriteKey++;
      }
    }
  },
  
  drawPenalties() {
    const width = this.canvas.width
    const tlX = width/(500/470)
    const tlY = width/(500/5)
    const size = width/(500/21)
    if(gameControl.penalties === 1){
      this.ctx.save()
      this.ctx.translate(tlX,tlY)
      this.ctx.rotate(Math.PI/4)
      this.ctx.drawImage(this.assets.penalties, 21 * this.spritePen,0,21,21,0,0,size,size)
      this.ctx.restore()
      
      if (timeControl.controlFR % 21 === 0) {
        if (this.spritePen !== 6) {
          this.spritePen++;
        }
      }
    }
  },
  
  drawBugs() {
    const width = this.canvas.width
    if (bugsTimeControl.bugsCount.length) {
      for (let bug of bugsTimeControl.bugsCount) {
        this.ctx.save()
        this.ctx.translate(bug.posX,bug.posY)
        this.ctx.rotate(bug.rads)
        this.ctx.drawImage(this.assets.bugs, 21 * bug.sprite, 0, 21, 21, 0, 0, bug.size, bug.size)
        this.ctx.restore()
      }
      if (timeControl.controlFR % 61 === 0) {
        for (let i = 0; i < bugsTimeControl.bugsCount.length; i ++) {
          const rads = randomAPI.random(0, Math.PI * 2)
          const sprite = randomAPI.random(0,4)
          const size = randomAPI.random (width/(500/15),width/(500/42))
          const posX = randomAPI.random(0, this.canvas.width - size/2)
          const posY = randomAPI.random(0, this.canvas.height - size/2)
          
          bugsTimeControl.bugsCount[i] = { posX, posY, rads, sprite, size };
        }
      }
    }
    
    if (timeControl.controlFR % 61 === 0 && bugsTimeControl.bugsCount.length < bugsTimeControl.bugsLvl.bugs) {
      const maxIterator = Math.ceil(bugsTimeControl.bugsLvl.bugs / 15) // Velocidade com que a tela enche de bugs
      // console.log(maxIterator)  //DEBUG
      for (let i = 0; i < maxIterator; i++){
        const posX = randomAPI.random(0, this.canvas.width)
        const posY = randomAPI.random(0, this.canvas.height)
        const rads = randomAPI.random(0, Math.PI * 2)
        const sprite = randomAPI.random(0,4)
        const size = randomAPI.random (width/(500/15),width/(500/42))
        
        const newBug = { posX, posY, rads, sprite, size }
        bugsTimeControl.bugsCount.push(newBug)        
      }
      // console.log(this.bugsCount.length)  //DEBUG
    }
  },
  
  drawBugsTimer(){
    const ctx = this.ctx
    const width = this.canvas.width
    
    const posX = width / (500/430)
    const posY = width / (500/28)
    const fontSize = width / (500/20) > 15 ? width / (500/20) : 15
    // ctx.lineWidth = 0.5    // VAI DEPENDER DA COR
    
    ctx.save()
    ctx.fillStyle = "rgb(255,0,0)"
    ctx.strokeStyle = "rgb(0,0,0)"
    ctx.font = `bold ${fontSize}px sans-serif`
    ctx.fillText(bugsTimeControl.bugsLvl.timer, posX, posY)
    ctx.strokeText(bugsTimeControl.bugsLvl.timer, posX, posY)
    ctx.restore()
  },
  
  drawGameOver() {
    const width = this.canvas.width
    const ctx = this.ctx;
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.save();
    const a = width/(500/100)
    const b = width/(500/25)
    const c = width/(500/300)
    const d = width/(500/150)
    ctx.lineWidth = 5;
    ctx.fillStyle = "rgb(220,220,220)";
    ctx.fillRect(a, b, c, d);
    ctx.strokeRect(a, b, c, d);
    ctx.restore();

    ctx.save();
    ctx.fillStyle = "rgb(220,0,0)";
    let font = width/(500/30)
    ctx.font = `bold ${font}px sans-serif`;
    const measureGOX = ctx.measureText("GAME OVER");
    const posGOX = width/2 - measureGOX.width/2;
    
    ctx.fillText("GAME OVER", posGOX, width/(500/80));
    font = width/(500/18)
    ctx.font = `bold ${font}px sans-serif`;
    const measureLvlX = ctx.measureText(`LVL: ${lvlControl.lvl.maxLvl}`);
    const posLvlX = width/2 - measureLvlX.width/2;
    ctx.fillText(`LVL: ${lvlControl.lvl.maxLvl}`, posLvlX, width/(500/105));
    
    //DRAW SCORE TEXT
    ctx.save()
      const scoreColor = animate.isHighScore ? (animate.isHighScoreSubmited ? "rgb(0,220,0)": "rgb(0,0,220)") : "rgb(220,0,0)"
      
      const measureScoreX = ctx.measureText(`SCORE: ${gameControl.score}`);
      const posScoreX = width/2 - measureScoreX.width/2;
      ctx.fillText(`SCORE: `, posScoreX, width/(500/130));
      
      const measureScoreXLabel = ctx.measureText(`SCORE: `);
      const posScoreXScore = posScoreX + measureScoreXLabel.width
      ctx.fillStyle = scoreColor
      ctx.fillText(`${gameControl.score}`, posScoreXScore, width/(500/130));
      
      if(animate.isHighScore){
        ctx.fillStyle = animate.labelNewColorBlue ? "rgb(0,0,220)" : "rgb(220,0,0)"
        ctx.textAlign = 'center'
        font = width/(500/14)
        ctx.font = `bold ${font}px sans-serif`;
        const measureLabelNew = ctx.measureText(`SCORE: ${gameControl.score}`)
        const posXLabelNew = posScoreX + measureLabelNew.width + width/(500/75)
        
        ctx.fillText(`NEW`, posXLabelNew, width/(500/130));
        
        if(animate.msgGameOver){
          // const posXMsgLabel = posXLabelNew + width/(500/18)
          ctx.textAlign = 'center'
          font = width/(500/12)
          ctx.font = `bold ${font}px sans-serif`;
          switch(animate.msgGameOver){
            case 'SUBMIT ERROR':
              ctx.fillStyle = "rgb(220,0,0)"
              ctx.fillText(`SUBMIT`, posXLabelNew, width/(500/150));
              ctx.fillText(`ERROR`, posXLabelNew, width/(500/165));
              break
            case 'SUCCESS':
              ctx.fillStyle = "rgb(0,220,00)"
              ctx.fillText(`SUCCESS`, posXLabelNew, width/(500/150));
              break
            case 'PRESS ENTER TO SUBMIT':
              ctx.fillStyle = "rgb(0,0,220)"
              ctx.fillText(`PRESS ENTER`, posXLabelNew, width/(500/150));
              ctx.fillText(`TO SUBMIT`, posXLabelNew, width/(500/165));
              break
          }
          // ctx.fillText(`${animate.msgGameOver}`, posXLabelNew, width/(500/150));
        }
      }
      
    ctx.restore()
    
    if (timeControl.controlFR % 31 === 0) {
      if (this.spriteRestart === 1) {
        this.spriteRestart = 0
      } else {
        this.spriteRestart = 1
      }
      animate.labelNewColorBlue = !animate.labelNewColorBlue
    }
    const measureRestartX = ctx.measureText(`RESTART`);
    const posRestartX = width/2 - measureRestartX.width/2;
    ctx.fillText(`RESTART`, posRestartX + 3 * this.spriteRestart, width/(500/155) - 3 * this.spriteRestart);
    ctx.restore();
  },
  
  drawGameOverHighScore(){
    return
  }
}

const canvasAux = {
  cacheRootWidth: 0,
  
  setCanvasArea() {
    if (gameMain.root.clientWidth > 500) {
      animate.canvas.width = 500;
    } else {
      animate.canvas.width = gameMain.root.clientWidth
    }
    const b = animate.canvas.width/2.5
    animate.canvas.height = b;
    
    if (this.cacheRootWidth !== gameMain.root.clientWidth && bugsTimeControl.bugsON && inputGame.pivot) {
      const pos = bugsTimeControl.bugsON.end ? "random" : "initial"
      canvasAux.setPivot(pos)  //GAMBIARRA???? KKKKKKKKKKKKKKKKKKKKKKKKKKKKK
    }
    this.cacheRootWidth = gameMain.root.clientWidth
  },
  
  setPivot(pos){
    let aux = (gameMain.root.clientWidth - animate.canvas.width)/2
    if (aux < 0) {
      aux = 0
    }
    const width = animate.canvas.width
    const height = animate.canvas.height
    if (pos === "initial") {
      const mid = animate.canvas.width / 2 - 25
      inputGame.pivot.style.top = `${height - 50}px`
      inputGame.pivot.style.left = `${aux + mid}px`
    } else {
      const randX = randomAPI.random(0, width - 50)
      const randY = randomAPI.random(0, height - 50)
      inputGame.pivot.style.top = `${randY}px`
      inputGame.pivot.style.left = `${aux + randX}px`
    }
  },
}

const inputGame = {
  pivot: '',
  keytopress: '',
  
  reset(){
    this.clickHandlerBind = this.clickHandler.bind(this);
    this.keyHandlerBind = this.keyHandler.bind(this);
  },
  
  setClickInputListener() {
    if (this.pivot){
      gameMain.root.addEventListener("click", this.clickHandlerBind)
    }
  },
  
  setKeyInputListener(key) {
    if (this.keytopress) {
      document.removeEventListener("keydown", this.keyHandlerBind);
    }
    this.keytopress = key;
    document.addEventListener("keydown", this.keyHandlerBind);
  },
  
  clickHandler(event) {
    if (event.target === this.pivot) {
      gameControl.clicks++;
      gameControl.positiveCoding(gameControl.codepower);  
      gameControl.updateBoost(); 
      gameControl.updatePoints();  
      if (bugsTimeControl.bugsON.end) {
        canvasAux.setPivot("random")   
      }
    } else {
      gameControl.negativeCoding(Math.floor(gameControl.codepower * 0.6)); 
        animate.negativeAnim = true;
        setTimeout(() => animate.negativeAnim = false, 500)
    }
  },
  
  keyHandler(event) {
    if (event.key === " ") {
      event.preventDefault();
    }
    if (!event.repeat) {
      const match = event.key.toLowerCase() === this.keytopress.toLowerCase();
      if (match) {
        gameControl.clicks++;
        gameControl.positiveCoding(gameControl.codepower); 
        gameControl.updateBoost(); 
        gameControl.updatePoints();
        if (bugsTimeControl.bugsON.end) {
          inputGame.setRandomKey()
        }
      } else {
        gameControl.negativeCoding(Math.floor(gameControl.codepower * 0.6));
        animate.negativeAnim = true;
        setTimeout(() => animate.negativeAnim = false, 500)
      }
    }
  },
  
  setRandomKey() {
    const keys = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
    const newKey = keys[randomAPI.random(0, 25)];
    inputGame.setKeyInputListener(newKey);
  },
}

const gameControl = {
  
  reset(){
    this.coding = 50
    this.score = 0
    this.boost = 0
    this.clicks = 0
    this.penalties = 0
    this.codepower = 25
    this.fatiguepower = 5
    
    this.boostMultiplicator = 1
    this.pointsMultiplicator = 1
    this.boostTimeouts = []
    
    this.decreaseInterval = ''
    this.preventPenalties = false
  },
  
  updateBoost() {
    this.boost++;
    const timeout = setTimeout(() => this.boost --, 7000);
    this.boostTimeouts.push(timeout); 
  },
  
  checkBoost(){
    switch (true) {
      case this.boost < 5:
        this.boostMultiplicator = 1;
        break;
      case this.boost < 10:
        this.boostMultiplicator = 1.5;
        break;
      case this.boost < 15:
        this.boostMultiplicator = 2;
        break;
      case this.boost < 20:
        this.boostMultiplicator = 2.5;
        break;
      case this.boost < 25:
        this.boostMultiplicator = 3.0;
        break;
      case this.boost < 30:
        this.boostMultiplicator = 3.5;
        break;
      case this.boost < 35:
        this.boostMultiplicator = 4.0;
        break;
      case this.boost < 40:
        this.boostMultiplicator = 4.5;
        break;
      case this.boost < 45:
        this.boostMultiplicator = 5.0;
        break;
      case this.boost < 50:
        this.boostMultiplicator = 5.5;
        break;
      default:
        this.boostMultiplicator = 6.0;
        break;
    }
  },
  
  updatePoints() {
    const aux = this.clicks % 10;
    if (aux === 0) {
      this.score += 10 * this.pointsMultiplicator * this.boostMultiplicator;
      if (animate.spriteLorem % 3 === 0) {               //
        setTimeout(() => animate.spriteLorem++, 300);    //
      }
    }
  },
  
  negativeCoding(value = this.fatiguepower) {
    this.coding -= value;
    if (this.coding <= lvlControl.lvl.prevLvl) {
      if (!this.preventPenalties && this.penalties === 1) {
        gameMain.gameOver();
      } else {
        lvlControl.lvlDown();
      }
    }
  },
  
  positiveCoding(value) {
    this.coding += value;
    if (this.coding > lvlControl.lvl.nextLvl) {
      lvlControl.lvlUp();
    }
  },
  
  setDecreaseInterval(inter) {
    if (this.decreaseInterval) {
      clearInterval(this.decreaseInterval);
    }
    this.decreaseInterval = setInterval(this.negativeCoding.bind(this), inter);
  },
  
}

const gameMain = {
  root: '',
  desktop: '',
  gameOn: '',
  
  
  gameStart() {
    this.gameOn = true;
    
    animate.reset()
    inputGame.reset()
    gameControl.reset()
    lvlControl.reset()
    bugsTimeControl.reset()
    this.callGameStartBind = this.callGameStart.bind(this);
    timeControl.reset()
    
    if (this.desktop) {
      inputGame.setKeyInputListener(" ");
    } else {
      canvasAux.setPivot("initial")
      inputGame.setClickInputListener()
    }
    
    gameControl.setDecreaseInterval(500);
    bugsTimeControl.setBugsTimeout(bugsTimeControl.bugsTimeoutParam.min, bugsTimeControl.bugsTimeoutParam.max);
  },
  
  gameOver() {
    this.gameOn = false;
    
    if (this.desktop) {
      document.removeEventListener("keydown", inputGame.keyHandlerBind);
    } else {
      this.root.removeEventListener("click", inputGame.clickHandlerBind)
    }
    clearInterval(gameControl.decreaseInterval);
    clearTimeout(bugsTimeControl.bugsTimeout);
    for (let timeout of gameControl.boostTimeouts){
      clearTimeout(timeout)
    }

    animate.canvas.addEventListener("click", this.callGameStartBind)
    document.addEventListener("keydown", this.callGameStartBind)
    
    if(scoreboardAPI.isHighScore(gameControl.score, this.desktop)){
      scoreboardAPI.setNewLocalStorage(gameControl.score, this.desktop)
        animate.isHighScore = true
        animate.msgGameOver = 'PRESS ENTER TO SUBMIT'
      scoreboardAPI.createSubmitHandler(gameControl.score, this.desktop, this.root)
    }
  },
  
  callGameStart(event){
    event.stopPropagation()
    if (event.type === "click") {
      animate.canvas.removeEventListener("click", this.callGameStartBind)
      document.removeEventListener("keydown", this.callGameStartBind)
      scoreboardAPI.destroySubmitHandler(this.desktop, this.root)         //NAO IMPLEMENTAR SUBMIT HANDLER PARA MOBILE AINDA
        animate.isHighScore = false
        animate.msgGameOver = ''
        animate.isHighScoreSubmited = false
      this.gameStart()
    } else if (event.type === "keydown") {
      if (event.key === " ") {
        animate.canvas.removeEventListener("click", this.callGameStartBind)
        document.removeEventListener("keydown", this.callGameStartBind)
        scoreboardAPI.destroySubmitHandler(this.desktop, this.root)         //NAO IMPLEMENTAR SUBMIT HANDLER PARA MOBILE AINDA
          animate.isHighScore = false
          animate.msgGameOver = ''
          animate.isHighScoreSubmited = false
        event.preventDefault();
        this.gameStart()
      }
    }
  },
}

const lvlControl = {
  
  reset(){
    this.lvl = { lvl: 0, prevLvl: 0, nextLvl: 100, maxLvl: 0 }
  },
  
  lvlUp() {
    if (!gameControl.preventPenalties) {
      gameControl.preventPenalties = true;
      setTimeout(() => (gameControl.preventPenalties = false), 500);
    }
    if (bugsTimeControl.bugsON.start) {
      bugsTimeControl.itsBugsTime();
    } else if (bugsTimeControl.bugsON.end) {
      bugsTimeControl.itsNotBugsTime();
    }

    this.lvl.lvl++;
    if (this.lvl.lvl > this.lvl.maxLvl) {
      this.lvl.maxLvl ++;
    }
    this.setNextLvl();
    if (bugsTimeControl.bugsON.end) {
      bugsTimeControl.itsBugsLvl();
    }
  },
  
  lvlDown() {
    if (this.lvl.lvl > 0) {
      this.lvl.lvl--;
      this.setPrevLvl();
    }

    if (!gameControl.preventPenalties) {
      gameControl.penalties++;
      gameControl.preventPenalties = true;
      setTimeout(() => (gameControl.preventPenalties = false), 2500);
      animate.spritePen = 0;
    }
  },
  
  setNextLvl() {
    this.lvl.prevLvl = this.lvl.nextLvl;
    let skip;
    let newFatigue;
    let newDecInter;
    let newCodePower;  
    let bugsParam = {}
    switch (true) {
      case this.lvl.lvl < 5: 
        skip = 200;
        newFatigue = 15;
        newDecInter = 250;
        newCodePower = 30;
        bugsParam = {min: 10, max: 16}
        break;
      case this.lvl.lvl < 10: 
        skip = 400;
        newFatigue = 18;
        newDecInter = 250;
        newCodePower = 40;
        bugsParam = {min: 12, max: 18}
        break;
      case this.lvl.lvl < 15:
        skip = 600;
        newFatigue = 21;
        newDecInter = 200;
        newCodePower = 45;
        bugsParam = {min: 14, max: 22}
        break;
      case this.lvl.lvl < 20:
        skip = 1000;
        newFatigue = 24;
        newDecInter = 200;
        newCodePower = 50;
        bugsParam = {min: 18, max: 28}
        break;
      default:
        skip = 1500;
        newFatigue = 27;
        newDecInter = 150;
        newCodePower = 55;
        bugsParam = {min: 20, max: 32}
    }
    this.lvl.nextLvl += skip;
    gameControl.fatiguepower = newFatigue;
    gameControl.codepower = newCodePower;
    gameControl.setDecreaseInterval(newDecInter);
    bugsTimeControl.bugsTimeoutParam = bugsParam;
  },
  
  setPrevLvl() {
    this.lvl.nextLvl = this.lvl.prevLvl;
    let skip;
    let newFatigue;
    let newDecInter;
    let newCodePower;
    let bugsParam = {}
    switch (true) {
      case this.lvl.lvl === 0:
        skip = 100;
        newFatigue = 5;
        newDecInter = 500;
        newCodePower = 25;
        bugsParam = {min: 10, max: 16}
        break;
      case this.lvl.lvl < 5:
        skip = 200;
        newFatigue = 15;
        newDecInter = 250;
        newCodePower = 30;
        bugsParam = {min: 10, max: 16}
        break;
      case this.lvl.lvl < 10:
        skip = 400;
        newFatigue = 18;
        newDecInter = 250;
        newCodePower = 40;
        bugsParam = {min: 12, max: 18}
        break;
      case this.lvl.lvl < 15:
        skip = 600;
        newFatigue = 21;
        newDecInter = 200;
        newCodePower = 45;
        bugsParam = {min: 14, max: 22}
        break;
      case this.lvl.lvl < 20:
        skip = 1000;
        newFatigue = 24;
        newDecInter = 200;
        newCodePower = 50;
        bugsParam = {min: 18, max: 28}
        break;
      default:
        skip = 1500;
        newFatigue = 27;
        newDecInter = 150;
        newCodePower = 55;
        bugsParam = {min: 20, max: 32}
    }
    this.lvl.prevLvl -= skip;
    gameControl.fatiguepower = newFatigue;
    gameControl.codepower = newCodePower;
    gameControl.setDecreaseInterval(newDecInter);
    bugsTimeControl.bugsTimeoutParam = bugsParam
  },
  
}

const bugsTimeControl = {
  reset(){
    this.bugsON = { start: false, end: false }
    this.bugsLvl = { lvl: 0, prevLvl: 0, nextLvl: 1000, bugs: 30, timer: 30 }
    this.bugsSaveNormal = { prevLvl: 0, nextLvl: 100 }   //MUDAR NOME PARA bugsCacheNormal
    this.bugsCount = []
    this.bugsTimeout = ''
    this.bugsTimeoutParam = { min: 10, max: 16 }
  },
  
  setBugsTimeout(min, max) {
    const time = randomAPI.random(min, max);
    if (this.bugsTimeout) {
      clearTimeout(this.bugsTimeout);
    }
    this.bugsTimeout = setTimeout(
      () => {
        this.bugsON.start = true
      },
      time * 1000
    );
  },
  
  itsBugsTime() { 
    if (gameMain.desktop) {
      inputGame.setRandomKey()
    } else {
      canvasAux.setPivot("random")
    }
    gameControl.pointsMultiplicator = 2 + (2 * this.bugsLvl.lvl) <= 10 ? 2 + (2 * this.bugsLvl.lvl) : 10;
    gameControl.penalties = 1;
    gameControl.preventPenalties = false;
    animate.spritePen = 0;
    this.bugsON = {
      start: false,
      end: true,
    };
    this.bugsCount = [];
  },
  
  itsBugsLvl() {
    this.bugsSaveNormal = {
      prevLvl: lvlControl.lvl.prevLvl,
      nextLvl: lvlControl.lvl.nextLvl,
    };
    lvlControl.lvl.prevLvl = this.bugsLvl.prevLvl;
    lvlControl.lvl.nextLvl = this.bugsLvl.nextLvl;
    gameControl.coding = lvlControl.lvl.nextLvl * (4/10);
    let lvl = this.bugsLvl.lvl;
    let newFatigue;
    let newDecInter;
    let nextNextLvl;
    // let newBugs; //CONST ABAIXO
    // let newTimer;  //CONST ABAIXO

    switch (lvl) {
      case 0:
        newFatigue = 6;
        newDecInter = 500;
        nextNextLvl = 1200;
        break;
      case 1:
        newFatigue = 7;
        newDecInter = 450;
        nextNextLvl = 1400;
        break;
      case 2:
        newFatigue = 8;
        newDecInter = 400;
        nextNextLvl = 1600;
        break;
      case 3:
        newFatigue = 9;
        newDecInter = 350;
        nextNextLvl = 1800;
        break;
      default:
        newFatigue = 10;
        newDecInter = 300;
        nextNextLvl = 2000;
    }
    const newBugs = 50 + (10 * lvl)
    // const newTimer = 30 - (2 * lvl) > 20 ? 30 - (2 * lvl) : 20
    const newTimer = 20 + (5 * lvl) < 40 ? 20 + (5 * lvl) : 40
    console.log(newBugs, newTimer)  //DEBUG
    gameControl.setDecreaseInterval(newDecInter);
    gameControl.fatiguepower = newFatigue;
    this.bugsLvl = { lvl: ++lvl, prevLvl: 0, nextLvl: nextNextLvl, bugs: newBugs, timer: newTimer };
  },
  
  itsNotBugsTime() {
    if (gameMain.desktop) {
      inputGame.setKeyInputListener(" ");
    } else {
      canvasAux.setPivot("initial")  
    }
    this.setBugsTimeout(this.bugsTimeoutParam.min, this.bugsTimeoutParam.max);
    gameControl.pointsMultiplicator = 1;
    gameControl.penalties = 0;
    this.bugsON = { start: false, end: false };

    gameControl.coding = this.bugsSaveNormal.nextLvl;
    lvlControl.lvl.prevLvl = this.bugsSaveNormal.prevLvl;
    lvlControl.lvl.nextLvl = this.bugsSaveNormal.nextLvl;
  },
}

const timeControl = {
  reset(){
    this.controlFR = 0;
    this.controlBugsTimerFR = 0;
  },
  
  nextFrame(){
    if (this.controlFR === 60) {      //MUDAR PARA 59
      this.controlFR = 0;
    } else {
      this.controlFR++;
    }      
  },
  
  updateBugsTimer(){
    if (bugsTimeControl.bugsON.end){
      if (this.controlBugsTimerFR === 60){    //MUDAR PARA 59
        this.controlBugsTimerFR = 0
        
        if (bugsTimeControl.bugsLvl.timer > 0){
          bugsTimeControl.bugsLvl.timer--
        } else {
          gameMain.gameOver()
        }
      } else {
        this.controlBugsTimerFR++
      }
    }
  },
  
}

const scoreboardAPI = {
  bindDesktopSubmitHandler: '',
  bindMobileSubmitHandler: '',
  
  isHighScore(pts, desktop){
    const platform = desktop ? 'DT' : 'ML'
    const score = { Score: pts }
    return ScoreBoard.isHighScore(score, platform)
  },
  
  setNewLocalStorage(pts, desktop){
    try {
      const score = this.createScoreObject(pts, desktop, 'ABC')
      ScoreBoard.setNewLocalStorage(score)
    } catch (error){
      console.log(error)
    }
  },
  
  createSubmitHandler(pts, desktop, root = ''){
    if(desktop){
      this.bindDesktopSubmitHandler = this.desktopSubmitHandler.bind(this, pts, desktop)
      document.addEventListener('keydown', this.bindDesktopSubmitHandler)
    } else {
      this.bindMobileSubmitHandler = this.mobileSubmitHandler.bind(this, pts, desktop)
      root.addEventListener('click', this.bindMobileSubmitHandler)
    }
  },
  destroySubmitHandler(desktop, root = ''){
    if(desktop){
      if(this.bindDesktopSubmitHandler){
        document.removeEventListener('keydown', this.bindDesktopSubmitHandler)
        // this.bindDesktopSubmitHandler = ''  // DEBUG PERMANENT
        // console.log(this.bindDesktopSubmitHandler)
      }
    } else {
      if(this.bindMobileSubmitHandler){
        root.removeEventListener('click', this.bindMobileSubmitHandler)
        // this.bindMobileSubmitHandler = ''   // DEBUG PERMANENT
        // console.log(this.bindMobileSubmitHandler)
      }
    }
  },
  async desktopSubmitHandler(pts, desktop, event){
    if(event.key.toLowerCase() === 'enter'){
      try {
        await this.submitScore(pts, desktop)
        animate.msgGameOver = 'SUCCESS'
        animate.isHighScoreSubmited = true
      } catch(error){
        console.log(error)
        animate.msgGameOver = 'SUBMIT ERROR'
      }
    }
  },
  mobileSubmitHandler(event, pts, desktop){
    return  //  AINDA NÃO É NECESSÁRIO
  },
  
  submitScore(pts, desktop, root = ''){
    const score = this.createScoreObject(pts, desktop)
    return ScoreBoard.submitScore(score)  //RETURN PROMISE
      .then(() => {
        this.destroySubmitHandler(desktop, root)
        console.log('success')  //DEBUG
        // return true     //PROVAVELMENTE USAR VARIAVES DE MINISCRIPT.JS PARA ESPERAR POR UM VALOR
      })
      .catch(() => {
        ScoreBoard.setNewLocalStorage(score)
        console.log('fail')   // DEBUG
        // return false    //PROVAVELMENTE USAR VARIAVES DE MINISCRIPT.JS PARA ESPERAR POR UM VALOR
      })
  },
  
  createScoreObject(pts, desktop, nickname = ''){
    if(!nickname){
      if(ScoreBoard.nickInput && ScoreBoard.nickInput.value){
        nickname = ScoreBoard.nickInput.value
      } else {
        throw 'Nickname must be provided.'
      }
    }
    const platform = desktop ? 'DT' : 'ML'
    const score = { Nickname: nickname, Score: pts, Platform: platform, Published: false }
    return score
  },
}

const randomAPI = {
  random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
}

export { animate, canvasAux, inputGame, gameControl, gameMain, lvlControl, bugsTimeControl, timeControl, scoreboardAPI, randomAPI }