export default {
  data() {
    return {
      scoreArray: [{id: 0, score: 2200, nickname: 'LocoAbreu', platform: 'Mobile'}, ],
    }
  },
  emit: ['teste'],
  template: 
  `
    <p>High Scores</p>
    <ol>
      <li v-for="score in scoreArray">{{ score.score }} - {{ score.nickname }} - {{ score.platform }}</li>
    </ol>
  `
}