const fs = require('fs')
const { logTime } = require('../helpers')

// /api/comments/create - создает комментарий для статьи с переданными в теле запроса параметрами (в том числе articleId) 
// / id генерируется на сервере / сервер возвращает созданный комментарий

function createComment(req, res, payload, cb) {

  const readableStream = fs.createReadStream('./artickles.json', 'utf-8')
  let data = ''
  readableStream.on('data', function (chunk) {
    data += chunk;
  })

  readableStream.on('end', function () {
    try {
      const articlesObj = JSON.parse(data);
      const commentsLength = articlesObj.comments.length;
      const newComment = {
        id: commentsLength + 1,
        articleId: payload.articleId,
        text: payload.text,
        date: payload.date,
        author: payload.author
      }
      const foundArticle = articlesObj.articles.find(article => article.id === newComment.articleId);

      if (foundArticle) {
        foundArticle.comments.push(newComment);
      } else {
        return cb({ code: 404, message: 'Article not found' });
      }

      const newArticklesObj = {
        articles: articlesObj.articles,
        comments: [...articlesObj.comments, newComment]
      }

      const newArticklesJSON = JSON.stringify(newArticklesObj, null, 2)

      readableStream.close()
      const writableStream = fs.createWriteStream('./artickles.json', { flags: 'w' })
      const writeLogStream = fs.createWriteStream('readme.log', { flags: 'a' })

      writableStream.write(newArticklesJSON, function () {
        cb(null, newComment)
        const jsonPayload = JSON.stringify(payload)
        writeLogStream.write(logTime() + ' ' + req.url + ' ' + jsonPayload + ' ' + '\n')
      })


    } catch (err) {
      cb({ code: 500, message: 'error while creating new comment' })
    }
  })
}

module.exports = {
  createComment
}