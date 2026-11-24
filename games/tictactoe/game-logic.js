// Pure Tic Tac Toe rules. No DOM access, so it can be unit tested in Node.

export const EMPTY = ''
export const PLAYER = 'player'
export const COMPUTER = 'computer'

export const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6] // diagonals
]

export const newBoard = () => Array(9).fill(EMPTY)

/** Returns { winner, line } for the first complete line, or null. */
export const getWinner = board => {
  for (const line of LINES) {
    const [a, b, c] = line
    if (board[a] !== EMPTY && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line }
    }
  }
  return null
}

export const isTie = board => !getWinner(board) && board.every(cell => cell !== EMPTY)

/** Finds a cell that completes a line for `who`, or -1. */
const findCompletingMove = (board, who) => {
  for (const line of LINES) {
    const marks = line.filter(i => board[i] === who).length
    const empty = line.find(i => board[i] === EMPTY)
    if (marks === 2 && empty !== undefined) return empty
  }
  return -1
}

/**
 * Computer move: win if possible, otherwise block, otherwise take the centre,
 * otherwise the first free cell. Returns -1 when the board is full.
 */
export const pickComputerMove = board => {
  const win = findCompletingMove(board, COMPUTER)
  if (win !== -1) return win
  const block = findCompletingMove(board, PLAYER)
  if (block !== -1) return block
  if (board[4] === EMPTY) return 4
  return board.indexOf(EMPTY)
}
