const fs = require('fs')
const { logTime } = require('../helpers')

// /api/articles/readall

function readAll(req, res, payload, cb) {
  const readableStream = fs.createReadStream('./artickles.json', 'utf-8')
  let data = '';

  readableStream.on('data', function (chunk) {
    data += chunk
  })

  readableStream.on('end', function () {
    try {
      const articklesObj = JSON.parse(data)
      const artickles = articklesObj.articles
      const writeLogStream = fs.createWriteStream('readme.log', { flags: 'a' })
      cb(null, artickles)
      const jsonPayload = JSON.stringify(payload)
      writeLogStream.write(logTime() + ' ' + req.url + ' ' + jsonPayload + ' ' + '\n')
    } catch (err) {
      cb({ code: 500, message: 'error while reading all artickles' })
    }
  })
}

module.exports = {
  readAll
}