#!/usr/bin/env node

const program = require('commander');
const path = require('path');
const fs = require("fs")
const ProgressBar = require("progress")
const arrangePath = require("./scripts/arrangePath")
const copyFiles = require("./scripts/copyFiles")
const addProjectName = require("./scripts/addProjectName")

program
  .command('create <projectName>')
  // 指定创建的项目类型.
  // 可选值: simple: 简单(仅基础示例)；admin: 包含原项目的共用文件
  .option('-s, --simple', '基础示例')
  .option('-a, --admin', '包含原项目的共用样式和组件')
  .action(async function (projectName, cmd) {
    try {
      if (fs.existsSync(projectName)) {
        throw new Error(`${projectName}文件夹已存在!`)
      }
      let type = "simple"
      if (cmd.admin) {
        type = "simple"
      }

      let dir = path.resolve(__dirname, "templates", type)
      let { from, to } = await arrangePath(dir, projectName)
      let bar = new ProgressBar('[:bar] :percent', { total: from.length });
      await copyFiles(from, to, () => bar.tick())
      await Promise.all([
        addProjectName(projectName, "index.html"),
        addProjectName(projectName, "package.json"),
      ])
      console.log("To get started:\n")
      console.log(`  cd ${projectName}`)
      console.log("  npm i")
      console.log("  npm run dev\n")
    } catch (error) {
      console.error(error)
    }
  })

program.parse(process.argv)