const http = require('http');
const reqests = require('./requests')
// const helpers = require('./helpers')

const hostname = '127.0.0.1';
const port = 4000;

const handlers = {
  '/sum': sum,
  '/api/articles/readall': reqests.readAll,
  '/api/articles/read': reqests.read,
  '/api/articles/create': reqests.createArtickle,
  '/api/articles/update': reqests.updateArtickle,
  '/api/articles/delete': reqests.deleteArtickle,
  '/api/comments/create': reqests.createComment,
  '/api/comments/delete': reqests.deleteComment
}

const server = http.createServer((req, res) => {
  parseBody(req, (err, payload) => {
    const handler = getHandler(req.url);
    // const { url, params } = helpers.parseURL(req.url)
    // const handler = getHandler(url)
    handler(req, res, payload, (err, result) => {
      if (err) {
        res.writeHead(err.code, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(err));
        return
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result))
    })
  })
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

function getHandler(url) {
  const parsedUrl = url.split('?')[0];
  return handlers[parsedUrl] || notFound404;
}

function sum(req, res, payload, cb) {
  const result = { c: payload.a + payload.b }
  cb(null, result)
}

function notFound404(req, res, payload, cb) {
  cb({ code: 404, message: 'Not found!' })
}

function parseBody(req, cb) {
  const body = [];
  req.on('data', (chunk) => {
    body.push(chunk)
  }).on('end', () => {
    const data = Buffer.concat(body).toString();
    if (data) {
      const params = JSON.parse(data)
      cb(null, params)
    } else {
      cb(null, null)
    }

  })
}


