// generate a neologism

class Neolomatic {
  constructor (data = [], prefixData = [], limit = 2) {
    this.data = data
    this.prefixData = prefixData
    this.limit = limit
    this.resetBtn = document.getElementById('reset-btn')
    this.resetBtn.addEventListener('click', () => this.render())
    this.render()
  }

  getWordData () {
    const prevnum = {}
    const randIndexes = []
    while (randIndexes.length < this.limit) {
      let currentIndex = Math.floor(Math.random() * this.data.length)
      if (!prevnum[currentIndex]) {
        prevnum[currentIndex] = true
        randIndexes.push(currentIndex)
      }
    }

    const wordData = randIndexes.map(index => {
      const prefix = this.data[index]
      const prefixData = this.prefixData.find(({ prefixId }) => {
        return prefixId === prefix.id
      })

      return {
        word: prefix.word,
        meaning: prefixData.meaning,
        derived: prefixData.derived,
        example: prefixData.example
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
      .map(({ derived }) => derived)
      .join(' - ')
    document.getElementById('neolog-meaning').innerHTML = wordData
      .map(({ meaning }) => meaning)
      .join(' - ')
    document.getElementById('neolog-example').innerHTML = wordData
      .map(({ example }) => example)
      .join(' - ')
  }
}

window.onload = async function () {
  const prefixes = await (await fetch('/prefixes')).json()
  const prefixData = await (await fetch('/prefixesData')).json()
  if (prefixes.success && prefixData.success) {
    new Neolomatic(prefixes.data, prefixData.data)
  }
}
