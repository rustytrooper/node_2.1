const fs = require('fs')
const { logTime } = require('../helpers')

// /api/articles/create - создает статью с переданными в теле запроса параметрами / id генерируется на сервере / сервер возвращает созданную статью


function createArtickle(req, res, payload, cb) {
  const readableStream = fs.createReadStream('./artickles.json', 'utf-8');

  let data = '';

  readableStream.on('data', function (chunk) {
    data += chunk;
  });

  readableStream.on('end', function () {
    try {
      if (!payload.title || !payload.text || !payload.date || !payload.author) {
        cb({ code: 400, message: "Request invalid" })
      }
      const articlesObj = JSON.parse(data);
      const articklesLength = articlesObj.articles.length;
      const newArt = {
        id: articklesLength + 1,
        title: payload.title,
        text: payload.text,
        date: payload.date,
        author: payload.author,
        comments: []
      };
      const newArticklesObj = {
        articles: [...articlesObj.articles, newArt],
        comments: [...articlesObj.comments]
      };
      const newArtJson = JSON.stringify(newArticklesObj, null, 2);

      readableStream.close()
      const writableStream = fs.createWriteStream('./artickles.json', { flags: 'w' })
      const writeLogStream = fs.createWriteStream('readme.log', { flags: 'a' })

      writableStream.write(newArtJson, function () {
        cb(null, newArt);
        const jsonPayload = JSON.stringify(payload)
        writeLogStream.write(logTime() + ' ' + req.url + ' ' + jsonPayload + ' ' + '\n')
      });
    } catch (err) {
      cb({ code: 400, message: err });
    }
  });
}

module.exports = {
  createArtickle
}