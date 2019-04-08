/* eslint-disable no-console */
require('dotenv').config()
const express = require('express')
const path = require('path')
const process = require('process')
const Airtable = require('airtable')

require('dotenv').config()

const base = new Airtable({ apiKey: process.env.AIRTABLEKEY || '' }).base(
  'appfUhvHQpgv3ncTU'
)

const getPrefixes = async () => {
  return new Promise((resolve, reject) => {
    base('Greek')
      .select({
        view: 'Grid view'
      })
      .eachPage(
        function (records) {
          console.log(records)
          const data = records.map(record => {
            return {
              meaning: record.get('meaning'),
              word: record.get('word'),
              uses: record.get('uses')
            }
          })

          resolve(data)
        },
        function done (err) {
          if (err) {
            reject(err)
          }
        }
      )
  })
}
const app = express()
app.use(express.static('.', { root: '/' }))
app.get('/', function (req, res) {
  res.sendFile(path.resolve(__dirname, 'index.html'))
})

app.get('/prefixes', async (req, res) => {
  getPrefixes()
    .then(prefixes => {
      res.status(200).send({
        success: 'true',
        message: 'data retrieved successfully',
        prefixes
      })
    })
    .catch(err => {
      res.status(err.statusCode).send({
        success: 'false',
        message: err.message
      })
    })
})

app.get('/data', function () {})

const server = app.listen(process.env.PORT, function () {
  const { address, port } = server.address()
  console.log('Running a API server at http://%s:%s', address, port)
})
