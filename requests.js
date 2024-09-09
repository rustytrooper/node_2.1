const fs = require('fs')
const helpers = require('./helpers')

// /api/articles/readall

function readAll(req, res, payload, cb) {
  fs.readFile('artickles.json', 'utf-8', function (err, data) {
    if (err) {
      cb({ code: 500, message: 'Internal Serever Error' })
    } else {
      cb(null, JSON.parse(data))
    }
  })
}

// /api/articles/read - возвращает статью с комментариями по переданному в теле запроса id
function read(req, res, payload, cb) {
  const { url, params } = helpers.parseURL(req.url);
  fs.readFile('artickles.json', 'utf-8', function (err, data) {
    if (err) {
      cb({ code: 500, message: 'Internal Serever Error' })
    } else {
      const articlesObj = JSON.parse(data)
      const artickleId = parseInt(params.id);

      const neededArt = articlesObj.articles.find(art => art.id === artickleId)
      if (neededArt) {
        cb(null, neededArt)
      } else {
        cb({ code: 404, message: 'Article not found' })
      }
    }
  })
}

// /api/articles/create - создает статью с переданными в теле запроса параметрами / id генерируется на сервере / сервер возвращает созданную статью
function createArtickle(req, res, payload, cb) {
  fs.readFile('artickles.json', 'utf-8', function (err, data) {
    if (err) {
      cb({ code: 500, message: "can't create new article" })
    }
    const articlesObj = JSON.parse(data)
    const articklesLength = articlesObj.articles.length
    const newArt = {
      id: articklesLength + 1,
      title: payload.title,
      text: payload.text,
      date: payload.date,
      author: payload.author,
      comments: []
    }
    const newArticklesObj = {
      articles: [...articlesObj.artickles, newArt],
      comments: [...articlesObj.comments]
    }
    const newArtJson = JSON.stringify(newArticklesObj, null, 2)

    cb(null, newArt)
    fs.writeFile('artickles.json', newArtJson, 'utf-8', function (err) {
      if (err) {
        cb({ code: 500, message: 'something went wrong' });
      }
    })
  })
}

// /api/articles/update - обновляет статью с переданными параметрами по переданному id
function updateArtickle(req, res, payload, cb) {
  const { url, params } = helpers.parseURL(req.url)
  fs.readFile('artickles.json', 'utf-8', function (err, data) {
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
    cb(null, updatedArtickle)
    fs.writeFile('artickles.json', newArtJson, 'utf-8', function (err) {
      if (err) {
        cb({ code: 500, message: 'something went wrong' });
      }
    })
  })
}

// /api/articles/delete -  удаляет статью по переданному id

function deleteArtickle(req, res, payload, cb) {
  const { url, params } = helpers.parseURL(req.url)
  fs.readFile('artickles.json', 'utf-8', function (err, data) {
    const articlesObj = JSON.parse(data);
    const deletedArtickle = articlesObj.articles.filter(art => art.id != params.id)

    const newArticklesObj = {
      articles: deletedArtickle,
      comments: articlesObj.comments
    }

    const newArticklesJSON = JSON.stringify(newArticklesObj, null, 2)
    cb(null, deletedArtickle)
    fs.writeFile('artickles.json', newArticklesJSON, 'utf-8', function (err) {
      if (err) {
        cb({ code: 500, message: 'something went wrong' })
      }
    })
  })
}

// /api/comments/create - создает комментарий для статьи с переданными в теле запроса параметрами (в том числе articleId) 
// / id генерируется на сервере / сервер возвращает созданный комментарий
function createComment(req, res, payload, cb) {
  fs.readFile('artickles.json', 'utf-8', function (err, data) {
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
    cb(null, newComment)

    fs.writeFile('artickles.json', newArticklesJSON, 'utf-8', function (err) {
      if (err) {
        cb({ code: 500, message: 'something went wrong' })
      }
    })

  })
}

// /api/comments/delete - удаляет комментарий по переданному id

function deleteComment(req, res, payload, cb) {
  const { url, params } = helpers.parseURL(req.url)
  fs.readFile('artickles.json', 'utf-8', function (err, data) {
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
    cb(null, filteredComments)
    fs.writeFile('artickles.json', newArtJson, 'utf-8', function (err) {
      if (err) {
        cb({ code: 500, message: 'something went wrong' })
      }
    })
  })
}

module.exports = {
  readAll,
  read,
  createArtickle,
  updateArtickle,
  deleteArtickle,
  createComment,
  deleteComment
}