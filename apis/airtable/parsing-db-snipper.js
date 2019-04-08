// http://users.uoa.gr/~nektar/history/language/greek_latin_derivatives.htm

ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
ID_LENGTH = 8

function generateId () {
  var rtn = ''
  for (var i = 0; i < ID_LENGTH; i++) {
    rtn += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length))
  }
  return rtn
}

csvPrefixes = 'PrefixId,Prefixes\n'
csvPrefixData = 'PrefixId,Meaning,Derived,Example\n'

it = document.querySelectorAll('tbody > tr').values()
it.next()
result = it.next()
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

// prefixes, derived
