#!/usr/bin/env node
'use strict';
const program = require('commander')
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const del = require('del')

const packageJSON = require('../package.json')
const zipper = require('../libs/zip')
const uploader = require('../libs/upload')
const { getUser, configPath } = require('../libs/util')

program
  .version(packageJSON.version)
  .option('-d, --demo', 'demo环境上传')
  .option('-p, --production', 'production环境上传')
  .option('-s, --stay', '保留 zip 文件')
  .parse(process.argv)

const servers = []

if (!program.demo && !program.production) program.demo = true

program.demo && servers.push('https://cms-api-demo.dianrong.com/hp-landings/fepage')
program.production && servers.push('https://cms-api.dianrong.com/hp-landings/fepage')

const ENV = process.env
const projectPath = ENV.PWD
const { name, dist, description, version, cms } = JSON.parse(fs.readFileSync(projectPath + '/package.json', 'utf-8'))

const cmsParams = Object.assign({
  name: name + (version ? '-' + version : ''),
  dist: dist || 'dist',
  description: description || name,
  directory: name + (version ? '/' + version : '')
}, cms)

if (!cmsParams.dist || !cmsParams.name || !cmsParams.directory) {
  return console.log(
    chalk.yellow(
      'config is invalid in package.json, ' +
      'please read https://github.com/lmnsg/dr-cms-upload/blob/master/README.md')
  )
}

if (cmsParams.dist[0] === '/') cmsParams.dist = '.' + cmsParams.dist

const target = zipper(path.resolve(projectPath, cmsParams.dist))

// pure cmsParams
delete cmsParams.dist

const doUpload = () => {
  getUser()
    .then((auth) => Promise.all(servers.map(url => uploader(target, { url, cmsParams }, auth))))
    .then(() => del(target))
    .catch((err) => {
      if (err === 'login') {
        console.log(chalk.red('用户名或密码需要重置'))
        fs.unlinkSync(configPath)
        return doUpload()
      }
      del(target)
    })
}
doUpload()
