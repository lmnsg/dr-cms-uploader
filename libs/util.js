const path = require('path')
const fs = require('fs')
const ora = require('ora')

exports.startSpinner = (msg) => ora(msg).start()
