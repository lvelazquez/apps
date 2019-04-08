// generate a neologism

class Neolomatic {
  constructor (data = [], prefixData = [], limit = 2) {
    this.data = data
    this.prefixData = prefixData
    this.limit = limit
    document
      .getElementById('reset-btn')
      .addEventListener('click', () => this.render())
    this.render()
  }

  getRandomIndex () {
    const indexes = {}
    while (Object.keys(indexes).length < this.limit) {
      let currentIndex = Math.floor(Math.random() * this.data.length)
      if (!indexes[currentIndex]) {
        indexes[currentIndex] = true
      }
    }
    return Object.keys(indexes)
  }

  getWordData () {
    const randIndexes = this.getRandomIndex()
    const wordData = randIndexes.map(index => {
      const { id, word } = this.data[index]
      const { meaning, derived, example } = this.prefixData[id]
      return {
        word,
        meaning,
        derived,
        example
      }
    })

    const newWord = wordData.map(({ word }) => word).join('')

    if (newWord == this.prevWord) {
      return this.getWordData()
    } else {
      this.prevWord = newWord
      return wordData
    }
  }

  render () {
    const wordData = this.getWordData()
    document.getElementById('neolog').innerHTML = wordData
      .map(({ word }) => word)
      .join('')
    document.getElementById('neolog-derived').innerHTML = wordData
      .map(({ derived }) => `<span class="row derived">${derived}</span>`)
      .join('')
    document.getElementById('neolog-meaning').innerHTML = wordData
      .map(({ meaning }) => `<span class="row derived">${meaning}</span>`)
      .join('')
    document.getElementById('neolog-example').innerHTML = wordData
      .map(({ example }) => `<span class="row derived">${example}</span>`)
      .join('')
  }
}

window.onload = async function () {
  const prefixes = await (await fetch('/prefixes')).json()
  const prefixData = await (await fetch('/prefixesData')).json()
  if (prefixes.success && prefixData.success) {
    new Neolomatic(prefixes.data, prefixData.data)
  }
}
