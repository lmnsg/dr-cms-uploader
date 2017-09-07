const path = require('path')
const fs = require('fs')
const ora = require('ora')
const readline = require('readline')
const chalk = require('chalk')
const configPath = path.resolve(process.env.HOME, '.cmsrc')

exports.startSpinner = (msg) => ora(msg).start()

exports.configPath = configPath
/**
 * 获取用户密码
 * @returns {Promise.<{}>}
 */
exports.getUser = async function getUser() {

  let auth = {}

  if (fs.existsSync(configPath)) return JSON.parse(fs.readFileSync(configPath, 'utf8'))

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  auth.user = await new Promise((resolve) => rl.question(chalk.red('username: '), resolve))
  auth.pass = await new Promise((resolve) => rl.question(chalk.red('password: '), resolve))
  rl.close()

  fs.writeFileSync(configPath, JSON.stringify(auth))
  console.log(chalk.green('已保存为默认用户.'))

  return auth
}
