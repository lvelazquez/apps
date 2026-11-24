import { test } from 'node:test'
import assert from 'node:assert/strict'
import { newBoard, getWinner, isTie, pickComputerMove, PLAYER, COMPUTER } from './game-logic.js'

const boardFrom = str =>
  [...str].map(c => (c === 'X' ? PLAYER : c === 'O' ? COMPUTER : ''))

test('empty board has no winner and is not a tie', () => {
  assert.equal(getWinner(newBoard()), null)
  assert.equal(isTie(newBoard()), false)
})

test('detects row, column and diagonal wins', () => {
  assert.deepEqual(getWinner(boardFrom('XXX......')).line, [0, 1, 2])
  assert.deepEqual(getWinner(boardFrom('.O..O..O.')).line, [1, 4, 7])
  assert.deepEqual(getWinner(boardFrom('..X.X.X..')).winner, PLAYER)
})

test('detects a tie', () => {
  assert.equal(isTie(boardFrom('XOXXOOOXX')), true)
})

test('a full board with a winner is not a tie', () => {
  assert.equal(isTie(boardFrom('XXXOOXOXO')), false)
})

test('computer wins when it can', () => {
  assert.equal(pickComputerMove(boardFrom('OO.XX....')), 2)
})

test('computer blocks the player', () => {
  assert.equal(pickComputerMove(boardFrom('XX.O.....')), 2)
})

test('computer takes the centre, then the first free cell', () => {
  assert.equal(pickComputerMove(boardFrom('X........')), 4)
  assert.equal(pickComputerMove(boardFrom('X...O....')), 1)
})

test('returns -1 on a full board', () => {
  assert.equal(pickComputerMove(boardFrom('XOXXOOOXX')), -1)
})
