const fs = require('fs')
const helpers = require('../helpers')

// /api/articles/read - возвращает статью с комментариями по переданному в теле запроса id
function read(req, res, payload, cb) {
  const { url, params } = helpers.parseURL(req.url);
  const readableStream = fs.createReadStream('./artickles.json', 'utf-8')

  let data = ''

  readableStream.on('data', function (chunk) {
    data += chunk
  })

  readableStream.on('end', function () {
    try {
      const articlesObj = JSON.parse(data)
      const artickleId = parseInt(params.id);

      const neededArt = articlesObj.articles.find(art => art.id === artickleId)
      if (neededArt) {
        cb(null, neededArt)
      } else {
        cb({ code: 404, message: 'Article not found' })
      }
    } catch (err) {
      cb({ code: 500, message: 'error occured while reading artickle' })
    }
  })

}

module.exports = {
  read
}