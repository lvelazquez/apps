import {
  EMPTY, PLAYER, COMPUTER, newBoard, getWinner, isTie, pickComputerMove
} from './game-logic.js'

const CLASS_A = 'player-color-a'
const CLASS_B = 'player-color-b'
const COMPUTER_DELAY_MS = 200
const COLOR_NAME = { [CLASS_A]: 'red', [CLASS_B]: 'blue' }

class TicTacToe {
  constructor () {
    this.board = newBoard()
    this.scores = { [PLAYER]: 0, [COMPUTER]: 0 }
    this.classes = { [PLAYER]: CLASS_A, [COMPUTER]: CLASS_B }
    this.paused = false
    this.over = true
    this.timer = null
    this.computerPending = false

    this.boardEl = document.getElementById('game-container')
    this.chooseModal = document.getElementById('choose-player-modal')
    this.winnerModal = document.getElementById('winner-modal')
    this.winnerText = document.getElementById('winner-text')
    this.score = document.getElementById('score')
    this.pauseBtn = document.getElementById('pause-btn')
    this.playAgainBtn = document.getElementById('play-again-btn')

    this.tiles = this.board.map((_, i) => {
      const tile = document.createElement('button')
      tile.type = 'button'
      tile.className = 'tile'
      tile.setAttribute('role', 'gridcell')
      tile.dataset.index = i
      tile.setAttribute('aria-label', this.tileLabel(i))
      tile.addEventListener('click', () => this.playerMove(i))
      this.boardEl.appendChild(tile)
      return tile
    })
    this.tiles.forEach(t => { t.disabled = true })

    this.chooseModal.querySelectorAll('[data-class]').forEach(btn =>
      btn.addEventListener('click', () => this.choose(btn.dataset.class))
    )
    this.playAgainBtn.addEventListener('click', () => this.restart())
    this.pauseBtn.addEventListener('click', () => this.setPaused(!this.paused))
    document.addEventListener('keydown', e => {
      if (e.key === 'p' || e.key === 'P') this.setPaused(!this.paused)
    })
    this.chooseModal.querySelector('button').focus()
  }

  tileLabel (i) {
    const row = Math.floor(i / 3) + 1
    const col = (i % 3) + 1
    const owner = this.board[i]
    const state = owner === EMPTY ? 'empty' : COLOR_NAME[this.classes[owner]]
    return `Row ${row}, column ${col}, ${state}`
  }

  choose (cls) {
    this.classes[PLAYER] = cls
    this.classes[COMPUTER] = cls === CLASS_A ? CLASS_B : CLASS_A
    this.chooseModal.classList.add('hidden')
    this.score.classList.remove('hidden')
    this.restart()
  }

  restart () {
    clearTimeout(this.timer)
    this.board = newBoard()
    this.over = false
    this.computerPending = false
    this.winnerModal.classList.add('hidden')
    this.tiles.forEach((tile, i) => {
      tile.classList.remove(CLASS_A, CLASS_B)
      tile.setAttribute('aria-label', this.tileLabel(i))
    })
    this.syncDisabled()
    this.tiles[0].focus()
  }

  setPaused (paused) {
    if (this.over && !this.paused) return
    this.paused = paused
    this.pauseBtn.setAttribute('aria-pressed', String(paused))
    this.pauseBtn.textContent = paused ? 'Resume' : 'Pause'
    this.score.classList.toggle('paused', paused)
    this.syncDisabled()
    if (!paused && !this.over && this.computerPending) this.scheduleComputer()
  }

  syncDisabled () {
    this.tiles.forEach((tile, i) => {
      tile.disabled = this.over || this.paused || this.board[i] !== EMPTY
    })
  }

  mark (i, who) {
    this.board[i] = who
    this.tiles[i].classList.add(this.classes[who])
    this.tiles[i].setAttribute('aria-label', this.tileLabel(i))
  }

  playerMove (i) {
    if (this.over || this.paused || this.board[i] !== EMPTY) return
    this.mark(i, PLAYER)
    if (!this.checkEnd()) {
      this.computerPending = true
      this.syncDisabled()
      this.scheduleComputer()
    }
  }

  scheduleComputer () {
    clearTimeout(this.timer)
    this.timer = setTimeout(() => this.computerMove(), COMPUTER_DELAY_MS)
  }

  computerMove () {
    if (this.paused || this.over) return
    this.computerPending = false
    const i = pickComputerMove(this.board)
    if (i !== -1) this.mark(i, COMPUTER)
    this.checkEnd()
    this.syncDisabled()
  }

  checkEnd () {
    const result = getWinner(this.board)
    if (!result && !isTie(this.board)) return false
    this.over = true
    if (result) {
      this.scores[result.winner] += 1
      document.querySelector(
        `[data-score="${this.classes[result.winner]}"]`
      ).textContent = this.scores[result.winner]
      this.winnerText.textContent = result.winner === PLAYER ? 'You win!' : 'Computer wins!'
    } else {
      this.winnerText.textContent = 'Game is tied!'
    }
    this.syncDisabled()
    this.winnerModal.classList.remove('hidden')
    this.playAgainBtn.focus()
    return true
  }
}

window.addEventListener('load', () => new TicTacToe())
