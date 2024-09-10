const fs = require('fs')
const helpers = require('../helpers')
const { logTime } = require('../helpers')

// /api/articles/update - обновляет статью с переданными параметрами по переданному id
function updateArtickle(req, res, payload, cb) {
  const { url, params } = helpers.parseURL(req.url)

  const readableStream = fs.createReadStream('./artickles.json', 'utf-8')
  let data = '';

  readableStream.on('data', function (chunk) {
    data += chunk
  })

  readableStream.on('end', function () {
    try {
      const articlesObj = JSON.parse(data);
      const updatedArtickle = articlesObj.articles.map(art => params.id != art.id ? art : {
        id: art.id,
        title: payload.title || art.title,
        text: payload.text || art.text,
        date: payload.date || art.date,
        author: payload.author || art.author,
        comments: art.comments
      })

      const newArticklesObj = {
        articles: updatedArtickle,
        comments: [...articlesObj.comments]
      }
      const newArtJson = JSON.stringify(newArticklesObj, null, 2)

      readableStream.close()

      const writableStream = fs.createWriteStream('./artickles.json', { flags: 'w' })
      const writeLogStream = fs.createWriteStream('readme.log', { flags: 'a' })

      writableStream.write(newArtJson, function () {
        cb(null, updatedArtickle)
        const jsonPayload = JSON.stringify(payload)
        writeLogStream.write(logTime() + ' ' + req.url + ' ' + jsonPayload + ' ' + '\n')
      })

    } catch (err) {
      cb({ code: 500, message: 'error while updating artickle' })
    }

  })
}
module.exports = {
  updateArtickle
}