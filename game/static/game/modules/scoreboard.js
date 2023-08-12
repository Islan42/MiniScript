export default {
  highScoreMobile: {},
  highScoreDesktop: {},
  scoresArray: [],
  div: '',
  
  init(div){
    this.setDiv(div)
    this.highScoreMobile = { Nickname: 'ABC', Score: 0, Platform: 'ML', Date: new Date, Published: false }
    this.highScoreDesktop = { Nickname: 'ABC', Score: 0, Platform: 'DT', Date: new Date, Published: false }
    this.getLSHighScoreMobile()
    this.getLSHighScoreDesktop()
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
  
  getScoresArray(platform = ''){
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
  
  setScore(score){
    return ''
  },
  
  async render(platform = ''){
    const array = await this.getScoresArray(platform)
    console.log(array)
    console.log(this.highScoreMobile)
    console.log(this.highScoreDesktop)
    
    this.generateHTML(array)
    this.addEventListener()

  },
  rerender(platform = ''){
    this.render(platform)
  },
  
  generateHTML(array){
    let html
    const desktopHSClass = this.highScoreDesktop.Published ? 'published' : 'unpublished'
    const mobileHSClass = this.highScoreMobile.Published ? 'published' : 'unpublished'
    console.log(mobileHSClass === 'unpublished')
    
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
          <td colspan="4" id="mobile-hs">
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