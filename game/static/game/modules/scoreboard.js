export default {
  highScoreMobile: {},
  highScoreDesktop: {},
  scoresArray: [],
  div: '',
  
  init(div){
    this.setDiv(div)
    this.highScoreMobile = { Nickname: 'ABC', Score: 0, Platform: 'ML', Date: new Date, Published: true }
    this.highScoreDesktop = { Nickname: 'ABC', Score: 0, Platform: 'DT', Date: new Date, Published: true }
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
  },
  rerender(platform = ''){
    this.render(platform)
  }
}