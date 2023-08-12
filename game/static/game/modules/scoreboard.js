export default {
  highScoreMobile: 'teste1',
  highScoreDesktop: 'teste2',
  scoresArray: [],
  div: '',
  csrftoken: '',
  
  init(div){
    // window.localStorage.removeItem('ms_hs_mobile')  //DEBUG
    // window.localStorage.removeItem('ms_hs_desktop') //DEBUG
    this.setDiv(div)
    this.getLocalStorage('ML')
    this.getLocalStorage('DT')
    this.setCSRFToken()
    this.render('desktop')
    // this.submitScore({ Nickname: 'ABC', Score: 2, Platform: 'ML', Date: new Date, Published: true }) //DEBUG
    console.log('Successfully initialized') //DEBUG
  },
  
  setDiv(div){
    this.div = div
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
    
    // console.log('Oi') //DEBUG
    
    const score = JSON.parse(window.localStorage.getItem(URL))
    if(score && score.Score && score.Nickname && score.Platform && score.Published){
      this[attr] = score
    } else {
      const abcPl = URL === 'ms_hs_mobile' ? 'ML' : 'DT'
      const abc = { Nickname: 'ABC', Score: -1, Platform: abcPl, Date: new Date, Published: true }
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

  },
  
  rerender(platform = ''){
    this.render(platform)
  },
  
  async submitScore(score){
    if(score && score.Score && score.Score > 0 && score.Nickname && score.Platform){
      const newScore = JSON.stringify(score)
      const published = this.postRequestCreateScore(newScore)
      
      score.Date = new Date
      score.Published = true
      
      if(score.Platform === 'ML'){
        this.setLocalStorage('ms_hs_mobile', score)
      } else {
        this.setLocalStorage('ms_hs_desktop', score)
      }
      this.getLocalStorage(score.Platform)
      this.rerender(score.Platform)
      
    } else {
      throw new Error('Object Score doesnt match the requirements')
    }
  },
  
  generateHTML(array){
    let html
    const desktopHSClass = !this.highScoreDesktop.Published ? 'published' : 'unpublished' //REMOVER EXCLAMAÇÃO AIAIAIAIAIAI
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
    return
  },
}