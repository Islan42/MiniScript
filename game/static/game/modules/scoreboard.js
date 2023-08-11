export default {
  get(platform = 'mobile'){
    const request = new XMLHttpRequest()
    let response
    
    request.addEventListener('loadend', () => console.log(JSON.parse(request.response)))
    
    request.open('GET', '../score/')
    request.send()
  },
  set(score){
    return ''
  },
  render(div){
    return ''
  },
  rerender(){
    return ''
  }
}