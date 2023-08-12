export default {
  highScoreMobile: {},
  highScoreDesktop: {},
  scoresArray: [],
  div: '',
  csrftoken: '',
  
  init(div){
    this.setDiv(div)
    this.highScoreMobile = { Nickname: 'ABC', Score: 0, Platform: 'ML', Date: new Date, Published: true }
    this.highScoreDesktop = { Nickname: 'ABC', Score: 0, Platform: 'DT', Date: new Date, Published: true }
    this.getLSHighScoreMobile()
    this.getLSHighScoreDesktop()
    this.setCSRFToken()
    // console.log(this.csrftoken) //DEBUG
    // const json = JSON.stringify({Nickname: 'ABCDE', Score: 1, Platform: 'ML', Date: new Date, Published: true})
    // const json = JSON.stringify({a: 5})
    // this.postRequestCreateScore(json)
      // .then((res) => console.log(res))
      // .catch((error) => console.log(error))
    this.render()
    console.log('Successfully initialized')
  },
  
  setDiv(div){
    this.div = div
  },
  
  getLSHighScoreMobile(){
    const highScore = JSON.parse(window.localStorage.getItem('ms_hs_mobile'))
    
    if(highScore !== null){
      this.highScoreMobile = highScore
    } else {
      this.setLSHighScoreMobile()
    }
  },
  setLSHighScoreMobile(){
    const highScore = JSON.stringify(this.highScoreMobile)
    
    window.localStorage.setItem('ms_hs_mobile', highScore)
  },
  getLSHighScoreDesktop(){
    const highScore = JSON.parse(window.localStorage.getItem('ms_hs_desktop'))
    
    if(highScore !== null){
      this.highScoreDesktop = highScore
    } else {
      this.setLSHighScoreDesktop()
    }
  },
  setLSHighScoreDesktop(){
    const highScore = JSON.stringify(this.highScoreDesktop)
    
    window.localStorage.setItem('ms_hs_desktop', highScore)
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
      
      const URL = platform ? `/score/${platform}/` : '/score/'
      request.open('GET', URL)
      request.send()      
    })
  },  
  postRequestCreateScore(score){
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
      
      // const URL = platform ? `/score/${platform}/` : '/score/'
      request.open('POST', '/score/create/')
      request.setRequestHeader('X-CSRFToken', this.csrftoken)
      request.send(score) 
    })
  },
  
  async render(platform = ''){
    const array = await this.getRequestReadScores(platform)
    // console.log(array) //DEBUG
    // console.log(this.highScoreMobile)  //DEBUG
    // console.log(this.highScoreDesktop) //DEBUG
    
    this.generateHTML(array)
    this.addEventListener()

  },
  
  rerender(platform = ''){
    this.render(platform)
  },
  
  async submitScore(score){
    const result = this.postRequestCreateScore(score)
    
  }
  
  generateHTML(array){
    let html
    const desktopHSClass = !this.highScoreDesktop.Published ? 'published' : 'unpublished' //REMOVER EXCLAMAÇÃO AIAIAIAIAIAI
    const mobileHSClass = this.highScoreMobile.Published ? 'published' : 'unpublished'
    // console.log(mobileHSClass === 'unpublished') //DEBUG
    
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
  addEventListener(){
    return
  },
}