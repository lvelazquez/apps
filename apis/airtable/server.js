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
    base('Prefixes')
      .select({
        view: 'Grid view'
      })
      .eachPage(
        function (records) {
          const data = records.map(record => {
            return {
              id: record.get('PrefixId'),
              word: record.get('Prefixes')
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

const getPrefixData = async () => {
  return new Promise((resolve, reject) => {
    base('PrefixesData')
      .select({
        view: 'Grid view'
      })
      .eachPage(
        function (records) {
          const data = {}
          records.forEach(record => {
            const prefixId = record.get('PrefixId')
            data[prefixId] = {
              meaning: record.get('Meaning'),
              derived: record.get('Derived'),
              example: record.get('Example')
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
    .then(data => {
      res.status(200).send({
        success: 'true',
        message: 'data retrieved successfully',
        data
      })
    })
    .catch(err => {
      res.status(err.statusCode).send({
        success: 'false',
        message: err.message
      })
    })
})

app.get('/prefixesData', async (req, res) => {
  getPrefixData()
    .then(data => {
      res.status(200).send({
        success: 'true',
        message: 'data retrieved successfully',
        data
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
