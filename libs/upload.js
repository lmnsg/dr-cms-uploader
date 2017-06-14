const request = require('request')
const fs = require('fs')
const { startSpinner } = require('./util')

/**
 * upload zip to CMS
 * @param file { String }
 * @param url { String }
 * @param cmsParams { name<String>, description<String>, directory<String> }
 * @param auth  { user<String>, pass<String>}
 */
module.exports = (file, { url, cmsParams, auth }) => {
  if (!file) return console.error('not found file.', file)
  if (!url) return console.error('invalid url.', url)

  const formData = Object.assign({
    description: 'cms'
  }, cmsParams)

  let spinner = startSpinner('\x1b[32m load zip file from' + file)
  return new Promise((resolve, reject) => {
    fs.readFile(file, function (err, buffer) {
      if (err) throw err

      formData.file = {
        value: buffer,
        options: {
          filename: 'a.zip',
          contentType: 'application/zip'
        }
      }

      spinner.stop()
      spinner = startSpinner(`\x1b[32m upload zip file to ${url}`)

      request.put({
        url,
        auth,
        formData,
        gzip: true,
        timeout: 600000,
        headers: {
          'Accept-Language': 'en',
          Accept: '*/*',
          'User-Agent': 'request'
        }
      }, (err, response, body) => {
        spinner.stop()

        if (err) {
          reject(err)
          return console.error(err)
        } else {
          console.log('\x1b[32m CMS response %d %s', response.statusCode, response.statusMessage)
          console.log('\x1b[32m CMS response Headers: %s', JSON.stringify(response.rawHeaders, null, '  '))
          console.log('\x1b[32m body:', body)
          resolve()
        }
      })
    })
  })
}
