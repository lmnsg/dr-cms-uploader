const request = require('request')
const fs = require('fs')
const { startSpinner } = require('./util')
const chalk = require('chalk')

/**
 * upload zip to CMS
 * @param file { String }
 * @param url { String }
 * @param cmsParams { name<String>, description<String>, directory<String> }
 * @param auth { user<String>, pass<String> }
 */
module.exports = (file, { url, cmsParams }, auth) => {
  if (!file) return console.error('not found file.', file)
  if (!url) return console.error('invalid url.', url)

  const formData = Object.assign({
    forcePush: 'true',
    description: 'upload by DrCmsUploader'
  }, cmsParams)

  let spinner = startSpinner(`load zip file from ${file}`)
  return new Promise((resolve, reject) => {
    fs.readFile(file, function(err, buffer) {
      if (err) throw err

      formData.file = {
        value: buffer,
        options: {
          filename: 'a.zip',
          contentType: 'application/zip'
        }
      }

      spinner.stop()
      spinner = startSpinner(`upload zip file to ${url}`)
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
        if (err) throw err

        let { result, errors } = JSON.parse(body)
        console.log(chalk.cyan('name: ' + formData.name + ', directory: ' + formData.directory))

        if (result === 'success') {
          return resolve(console.log(chalk.green('upload success!')))
        }

        console.log(
          chalk.red(
            errors
              .map(error => {
                if (typeof error === 'string') return error
                if (error.forbidden) {
                  return JSON.stringify(error.forbidden).replace(/,{/g, '\n{')
                }
              })
              .join('\n')
          )
        )
        return reject(result)
      })
    })
  })
}
