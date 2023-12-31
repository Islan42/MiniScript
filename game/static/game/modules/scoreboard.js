export default {
  highScoreMobile: {},
  highScoreDesktop: {},
  scoresArray: [],
  div: '',
  nickInput: '',
  csrftoken: '',
  
  async init(div){
    // window.localStorage.removeItem('ms_hs_mobile')  //DEBUG
    // window.localStorage.removeItem('ms_hs_desktop') //DEBUG
    this.setDiv(div)
    this.getLocalStorage('ML')
    this.getLocalStorage('DT')
    this.setCSRFToken()
    await this.render()
    
    // console.log(this.submitScore({Nickname: 'Unico'})) //DEBUG
    console.log('Successfully initialized') //DEBUG
  },
  
  setDiv(div){
    this.div = div
  },
  
  setNickInput(){
    const input = document.getElementById('nick-input')
    this.nickInput = input
  },
  
  getLocalStorage(platform){
    let URL
    let attr
    switch(platform){
      case 'ML':
      case 'mobile':
        URL = 'ms_hs_mobile'
        attr = 'highScoreMobile'
        break
      case 'DT':
      case 'desktop':
        URL = 'ms_hs_desktop'
        attr = 'highScoreDesktop'
        break
      default:
        throw new Error('platform argument not specified')
    }
    
    const score = JSON.parse(window.localStorage.getItem(URL))
    if(score && score.Score && score.Nickname && score.Platform && score.Published !== null){
      this[attr] = score
    } else {
      const abcPl = URL === 'ms_hs_mobile' ? 'ML' : 'DT'
      const abc = { Nickname: 'ABC', Score: -1, Platform: abcPl, Date: new Date, Published: true } //DEBUG AGORA
      this.setLocalStorage(URL, abc)
      this.getLocalStorage(platform)
    }
  },
  setLocalStorage(URL, content){
    const newContent = JSON.stringify(content)
    window.localStorage.setItem(URL, newContent)
  },
  
  setCSRFToken(){
    this.csrftoken = getCookie('csrftoken');
    
    function getCookie(name) {
      let cookieValue = null;
      
      if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          // Does this cookie string begin with the name we want?
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
            break;
          }
        }
      }
      return cookieValue;
    }
  },
  
  getRequestReadScores(platform = ''){
    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest()
      
      request.addEventListener('load', () => {
        const requestType = Math.floor(request.status/100)
        
        if(requestType === 4 || requestType === 5){
          return reject(`Error ${request.status}: ${request.statusText}`)
        }
        
        const parsed = JSON.parse(request.response)
        this.scoresArray = parsed
        resolve(parsed)
      })
      request.addEventListener('error', () => {
        reject(`Error ${request.status}: ${request.statusText}`)
      })
      
      let URL = '/score/'
      switch(platform){
        case 'ML':
        case 'mobile':
          URL += 'mobile/'
          break
        case 'DT':
        case 'desktop':
          URL += 'desktop/'
        default:
          break
      }
      request.open('GET', URL)
      request.send()      
    })
  },  
  postRequestCreateScore(body){
    return new Promise ((resolve, reject) =>{
      const request = new XMLHttpRequest()
      
      request.addEventListener('load', () => {
        const requestType = Math.floor(request.status/100)
        
        if(requestType === 4 || requestType === 5){
          return reject(`Error ${request.status}: ${request.statusText}`)
        }
        
        resolve(request.response)
      })
      request.addEventListener('error', () => {
        reject(`Error ${request.status}: ${request.statusText}`)
      })
      
      request.open('POST', '/score/create/')
      request.setRequestHeader('X-CSRFToken', this.csrftoken)
      request.send(body) 
    })
  },
  
  async render(platform = ''){
    const array = await this.getRequestReadScores(platform)
    
    // console.log(array) //DEBUG
    // console.log(this.highScoreMobile)  //DEBUG
    // console.log(this.highScoreDesktop) //DEBUG
    
    this.generateHTML(array)
    this.createEventHandlers()
    this.setNickInput()
  },
  
  rerender(platform = ''){
    this.render(platform)
  },
  
  async submitScore(score){
    if(score && score.Nickname && score.Score && score.Score > 0 && score.Platform && score.Published !== null){
      const newScore = JSON.stringify(score)
      // score = JSON.parse(await this.postRequestCreateScore(newScore))   //TESTAR
      //test if continues after throwing an error: Se nao usar await, o código continua executando os códigos abaixo, sem captura o Erro
      await this.postRequestCreateScore(newScore)
      
      score.Date = new Date
      score.Published = true //
      
      this.setNewLocalStorage(score)
      
    } else {
      throw new Error('Score object doesnt match the requirements')
    }
  },
  setNewLocalStorage(score){
    if(score && score.Nickname && score.Score && score.Platform && score.Published !== null){
      if(score.Platform === 'ML'){
        this.setLocalStorage('ms_hs_mobile', score)
      } else {
        this.setLocalStorage('ms_hs_desktop', score)
      }
      this.getLocalStorage(score.Platform)
      this.rerender(score.Platform)
    } else {
      throw new Error('Score object doesnt match the requirements')
    }
    
  },
  
  generateHTML(array){
    let html
    const desktopHSClass = this.highScoreDesktop.Published ? 'published' : 'unpublished' //REMOVER EXCLAMAÇÃO AIAIAIAIAIAI
    const mobileHSClass = this.highScoreMobile.Published ? 'published' : 'unpublished'
    
    html = 
    `<table>
      <thead>
        <tr>
          <th colspan="4">HIGH SCORE</th>
        </tr>
        <tr>
          <td colspan="4">
            <label for="nick-input">nickname:</label>
            <input id="nick-input" type="text" maxlength="12" />
          </td>
        </tr>
        <tr>
          <td colspan="4" id="desktop-hs" class="${desktopHSClass}">
            Your highest score: ${this.highScoreDesktop.Score} - Desktop
            ${addSubmitButton(desktopHSClass === 'unpublished')}
          </td>
        </tr>          
        <tr>
          <td colspan="4" id="mobile-hs" class="${mobileHSClass}">
            Your highest score: ${this.highScoreMobile.Score} - Mobile
            ${addSubmitButton(mobileHSClass === 'unpublished')}
          </td>
        </tr>
      </thead>
      
      <tbody>
        <tr>
          <td>&nbsp;</td>
          <th scope="col">NICKNAME</th>
          <th scope="col">SCORE</th>
          <th scope="col">PLATFORM</th>
        </tr>
    `
    
    for (let i = 0; i < array.length; i++){
      html += 
      `
        <tr>
          <th scope="row">${i + 1}</th>
          <td>${array[i].Nickname}</td>
          <td>${array[i].Score}</td>
          <td>${array[i].Platform}</td>
        </tr>
      `
    }
    
    html += 
    `
        </tbody>
      </table>
    `
    
    this.div.innerHTML = html
    // console.log(html)
    
    function addSubmitButton(condition){
      let button
      
      if (condition){
        button = 
        `
              <button>submit</button>
        `
      } else {
        button = ''
      }
      
      return button
    }
  },
  createEventHandlers(){
    const mobileBtn = document.querySelector('thead #mobile-hs button')
    const desktopBtn = document.querySelector('thead #desktop-hs button')
    
    if (desktopBtn) {
      const score = this.highScoreDesktop
      desktopBtn.addEventListener('click', submitHandler.bind(this, score))
    }
    
    if (mobileBtn) {
      const score = this.highScoreMobile
      mobileBtn.addEventListener('click', submitHandler.bind(this, score))
    }
    
    async function submitHandler(score){
      try {
        const input = this.nickInput
        if(!(input && input.value)){
          throw new Error('You must provide a nickname')
        }
        const nickname = input.value
        score.Nickname = nickname
        
        await this.submitScore(score)
      } catch(error) {
        console.log(`${error}. Try Re-Submit.`)
      }
    }
  },
  
  isHighScore(score, platform){
    switch(platform){
      case 'DT':
      case 'desktop':
        return score.Score > this.highScoreDesktop.Score
        break
      case 'ML':
      case 'mobile':
        return score.Score > this.highScoreMobile.Score
        break
      default:
        throw new Error('Platform argument incorrect.')
    }
  },
}