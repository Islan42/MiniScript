export default {
  highScore: 0,
  scoresArray: [],
  div: '',
  
  setDiv(div){
    this.div = div
  },
  
  getHighScore(){},
  setHighScore(){},
  
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
  
  async render(){
    const array = await this.getScoresArray()
    console.log(array)
  },
  rerender(){
    this.render()
  }
}