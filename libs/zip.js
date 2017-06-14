const zipper = require('zip-local')
const { startSpinner } = require('./util')

module.exports = (dir) => {
  const source = dir
  const spinner = startSpinner(`start do zip...<${source}>`)

  const target = source + '/' + new Date().toLocaleString().replace(/\//g, '-') + '.zip'
  zipper.sync.zip(source).compress().save(target)

  spinner.stop()
  return target
}

