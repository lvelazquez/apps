// Neolomatic: combines random Greek/Latin prefixes into a neologism.

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
    const picked = new Set()
    const count = Math.min(this.limit, this.data.length)
    while (picked.size < count) {
      picked.add(Math.floor(Math.random() * this.data.length))
    }
    return [...picked]
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

    if (newWord === this.prevWord && this.data.length > this.limit) {
      return this.getWordData()
    } else {
      this.prevWord = newWord
      return wordData
    }
  }

  render () {
    const wordData = this.getWordData()
    const setRows = (id, key) => {
      const el = document.getElementById(id)
      el.replaceChildren(
        ...wordData.map(item => {
          const row = document.createElement('span')
          row.className = 'row'
          row.textContent = item[key] || ''
          return row
        })
      )
    }
    document.getElementById('neolog').textContent = wordData
      .map(({ word }) => word)
      .join('')
    setRows('neolog-derived', 'derived')
    setRows('neolog-meaning', 'meaning')
    setRows('neolog-example', 'example')
  }
}

window.addEventListener('load', async () => {
  const errorEl = document.getElementById('error')
  try {
    const [prefixes, prefixData] = await Promise.all([
      fetch('/prefixes').then(r => r.json()),
      fetch('/prefixesData').then(r => r.json())
    ])
    if (!prefixes.success || !prefixData.success) {
      throw new Error(prefixes.message || prefixData.message)
    }
    document.getElementById('neolog-container').classList.remove('loading')
    new Neolomatic(prefixes.data, prefixData.data)
  } catch (err) {
    document.getElementById('neolog').textContent = 'Could not load data'
    errorEl.textContent = err.message
    errorEl.hidden = false
  }
})
