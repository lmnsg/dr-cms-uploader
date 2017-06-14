#!/usr/bin/env node
"use strict";
const program = require('commander')
const yml = require('js-yaml')
const del = require('del')

const fs = require('fs')
const path = require('path')

const packageJSON = require('../package.json')
const zipper = require('../libs/zip')
const uploader = require('../libs/upload')

program
  .version(packageJSON.version)
  .option('-d, --demo', 'demo环境上传')
  .option('-p, --production', 'production环境上传')
  .option('-s, --stay', '保留 zip 文件')
  .parse(process.argv)

const servers = []

program.demo && servers.push('https://cms-api-demo.dianrong.com/hp-landings/fepage')
program.production && servers.push('https://cms-api.dianrong.com/hp-landings/fepage')

const ENV = process.env
const projectPath = ENV.PWD
const home = ENV.HOME
const config = yml.safeLoad(fs.readFileSync(projectPath + '/cms.yml', 'utf-8'))

const dir = path.resolve(projectPath, config.path)
const cmsParams = config.cmsParams
const auth = JSON.parse(fs.readFileSync(home + '/.cmsrc', 'utf-8'))

const target = zipper(dir)

Promise.all(servers.map(url => uploader(target, { url, cmsParams, auth })))
  .then(() => {
    if (!program.stay) {
      del(target)
      console.log('zip has been clean!')
    }
  })
  .catch((err) => { throw err })




