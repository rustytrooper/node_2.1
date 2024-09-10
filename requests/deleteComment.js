const fs = require('fs')
const helpers = require('../helpers')
const { logTime } = require('../helpers')


// /api/comments/delete - удаляет комментарий по переданному id

function deleteComment(req, res, payload, cb) {
  const { url, params } = helpers.parseURL(req.url)

  const readableStream = fs.createReadStream('./artickles.json', 'utf-8')

  let data = ''
  readableStream.on('data', function (chunk) {
    data += chunk
  })

  readableStream.on('end', function () {
    try {
      const articlesObj = JSON.parse(data);
      const filteredComments = articlesObj.comments.filter(art => art.id != params.id)

      articlesObj.articles.forEach(article => {
        article.comments = article.comments.filter(comment => comment.id != params.id);
      });

      const newArticklesObj = {
        articles: articlesObj.articles,
        comments: filteredComments
      }
      const newArtJson = JSON.stringify(newArticklesObj, null, 2)

      readableStream.close()

      const writableStream = fs.createWriteStream('./artickles.json', { flags: 'w' })
      const writeLogStream = fs.createWriteStream('readme.log', { flags: 'a' })

      writableStream.write(newArtJson, function () {
        cb(null, filteredComments)
        const jsonPayload = JSON.stringify(payload)
        writeLogStream.write(logTime() + ' ' + req.url + ' ' + jsonPayload + ' ' + '\n')
      })
    } catch (err) {
      cb({ code: 500, message: 'error occured while deleting comment' })
    }

  })
}
module.exports = {
  deleteComment
}