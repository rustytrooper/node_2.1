const { read } = require('./requests/read')
const { readAll } = require('./requests/readAll')
const { createArtickle } = require('./requests/createArtickle')
const { updateArtickle } = require('./requests/updateArtickle')
const { deleteArtickle } = require('./requests/deleteArtickle')
const { createComment } = require('./requests/createComment')
const { deleteComment } = require('./requests/deleteComment')

module.exports = {
  readAll,
  read,
  createArtickle,
  updateArtickle,
  deleteArtickle,
  createComment,
  deleteComment
}

