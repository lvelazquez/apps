// fetch data
// pick two random items from list
// display them into
// write some for display {meainig, }

class Neolomatic {
  constructor (data = []) {
    this.data = data
    this.limit = 2
    document
      .getElementById('reset-btn')
      .addEventListener('click', () => this.update())
    this.update()
  }

  update () {
    document.getElementById('neolog').innerHTML = this.getNewWord()
  }

  getRandomIndex () {
    return Math.floor(Math.random() * this.data.length)
  }

  getNewWord () {
    this.prevnum = {}
    this.randIndex = []
    let currentIndex
    while (this.randIndex.length < this.limit) {
      currentIndex = this.getRandomIndex()
      if (!this.prevnum[currentIndex]) {
        this.prevnum[currentIndex] = true
        this.randIndex.push(currentIndex)
      }
    }
    const newWord = this.randIndex.map(index => this.data[index].word).join('')
    if (newWord == this.prevWord) {
      return this.getNewWord()
    } else {
      this.prevWord = newWord
      return newWord
    }
  }
}
async function init () {
  // const data = await fetch('/prefixes').json()
  const data = [
    { word: 'bar', meaning: 'baz baz baz', uses: 'ghdh' },
    { word: 'foo', meaning: 'meh meh meh meh', uses: 'dcv' },
    { word: 'baz', meaning: 'bar bar ehmeh', uses: 'absad' }
  ]
  const nl = new Neolomatic(data)
}

window.onload = async function () {
  init()
}
