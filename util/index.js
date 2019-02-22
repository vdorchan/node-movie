const https = require('https')

const httpsGet = url => {
  console.log('https get:', url)
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let chunks = ''
  
      res.on('data', chunk => chunks += chunk )

      res.on('end', () => resolve(chunks))
    })
  })
}


const updateQueryStringParameter = (uri, key, value) => {
  var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i")
  var separator = uri.indexOf('?') !== -1 ? "&" : "?"
  if (uri.match(re)) {
    return uri.replace(re, '$1' + key + "=" + value + '$2')
  }
  else {
    return uri + separator + key + "=" + value
  }
}

exports.httpsGet = httpsGet
exports.updateQueryStringParameter = updateQueryStringParameter
