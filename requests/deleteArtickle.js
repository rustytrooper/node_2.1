const fs = require('fs')
const helpers = require('../helpers')
const { logTime } = require('../helpers')

// /api/articles/delete -  удаляет статью по переданному id

function deleteArtickle(req, res, payload, cb) {
  const { url, params } = helpers.parseURL(req.url)
  const readableStream = fs.createReadStream('./artickles.json', 'utf-8')

  let data = ''
  readableStream.on('data', function (chunk) {
    data += chunk
  })

  readableStream.on('end', function () {
    try {
      const articlesObj = JSON.parse(data);
      const deletedArtickle = articlesObj.articles.filter(art => art.id != params.id)

      const newArticklesObj = {
        articles: deletedArtickle,
        comments: articlesObj.comments
      }

      const newArticklesJSON = JSON.stringify(newArticklesObj, null, 2)

      readableStream.close()

      const writableStream = fs.createWriteStream('./artickles.json', { flags: 'w' })
      const writeLogStream = fs.createWriteStream('readme.log', { flags: 'a' })

      writableStream.write(newArticklesJSON, function () {
        cb(null, deletedArtickle)
        const jsonPayload = JSON.stringify(payload)
        writeLogStream.write(logTime() + ' ' + req.url + ' ' + jsonPayload + ' ' + '\n')
      })
    } catch (err) {
      cb({ code: 500, message: 'error occured while deleting an artickle' })
    }

  })
}

module.exports = {
  deleteArtickle
}