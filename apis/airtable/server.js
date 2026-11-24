/* eslint-disable no-console */
require('dotenv').config()
const path = require('path')
const express = require('express')
const Airtable = require('airtable')

const DEFAULT_BASE_ID = 'appfUhvHQpgv3ncTU'
const DEFAULT_PORT = 3000
const VIEW = 'Grid view'

if (!process.env.AIRTABLEKEY) {
  console.error('Missing AIRTABLEKEY. Copy .env.example to .env and set it.')
  process.exit(1)
}

const base = new Airtable({ apiKey: process.env.AIRTABLEKEY }).base(
  process.env.AIRTABLE_BASE_ID || DEFAULT_BASE_ID
)

// Fetch every record of a table (all pages) and map each one with `mapRecord`.
const fetchAll = (table, mapRecord) =>
  base(table).select({ view: VIEW }).all().then(records => records.map(mapRecord))

const getPrefixes = () =>
  fetchAll('Prefixes', record => ({
    id: record.get('PrefixId'),
    word: record.get('Prefixes')
  }))

const getPrefixData = async () => {
  const rows = await fetchAll('PrefixesData', record => ({
    id: record.get('PrefixId'),
    meaning: record.get('Meaning'),
    derived: record.get('Derived'),
    example: record.get('Example')
  }))
  const data = {}
  rows.forEach(({ id, ...rest }) => {
    data[id] = rest
  })
  return data
}

const respond = loader => async (req, res) => {
  try {
    const data = await loader()
    res.status(200).send({ success: true, message: 'data retrieved successfully', data })
  } catch (err) {
    res.status(err.statusCode || 500).send({ success: false, message: err.message })
  }
}

const app = express()
// Serve only this folder (never the working directory).
app.use(express.static(__dirname))
app.get('/prefixes', respond(getPrefixes))
app.get('/prefixesData', respond(getPrefixData))

const port = Number(process.env.PORT) || DEFAULT_PORT
app.listen(port, () => {
  console.log(`Neolomatic running at http://localhost:${port}`)
})
