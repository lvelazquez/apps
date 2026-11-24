// Browser-console snippet (not run by the app). Paste it into the devtools console
// on the page below to export the CSVs imported into Airtable. Requires the
// `console.save` helper (e.g. the common devtools console-save snippet).
// http://users.uoa.gr/~nektar/history/language/greek_latin_derivatives.htm

const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
const ID_LENGTH = 8

function generateId () {
  let rtn = ''
  for (let i = 0; i < ID_LENGTH; i++) {
    rtn += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length))
  }
  return rtn
}

let csvPrefixes = 'PrefixId,Prefixes\n'
let csvPrefixData = 'PrefixId,Meaning,Derived,Example\n'

const it = document.querySelectorAll('tbody > tr').values()
it.next()
let result = it.next()
while (!result.done) {
  const prefixDataId = generateId()
  const [prefixData, derived, meaning, example] = result.value.cells
  const prefixes = prefixData.innerText.match(/\w+/g)
  if (prefixes) {
    csvPrefixes += prefixes.map(text => `${prefixDataId},${text}\n`).join('')
  }
  csvPrefixData += `${prefixDataId},"${derived.innerText}","${
    meaning.innerText
  }","${example.innerText.trim()}"\n`
  result = it.next()
}
// PrefixId, Prefixes
// PrefixId, Derived, Meaning, Example
console.save(csvPrefixes, 'csvPrefixes.csv')
console.save(csvPrefixData, 'csvPrefixData.csv')
