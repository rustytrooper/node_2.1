const format = require('node.date-time')

function parseURL(url) {
  const [parsedUrl, paramsString] = url.split('?');
  let parsedParams = null;

  if (paramsString) {
    const splittedArr = paramsString.split('&')
    parsedParams = splittedArr.reduce((acc, el) => {
      const [key, value] = el.split('=')
      acc[key] = value
      return acc
    }, {})
  }

  return {
    url: parsedUrl,
    params: parsedParams
  }
}

function logTime() {
  return new Date().format('y-M-d H:M:S')
}


module.exports = {
  parseURL,
  logTime
}