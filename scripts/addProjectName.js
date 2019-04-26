// 重写文件中的项目名称

const fs = require("fs")
const path = require("path")

module.exports = async function addName(projectName, filename) {
  let src = path.resolve(projectName, filename)
  let data = await readFile(src)
  data = data.toString().replace(/\$\{projectName\}/g, projectName)
  await writeFile(src, data)
}

function readFile(src) {
  return new Promise((resolve, reject) => {
    fs.readFile(src, (err, data) => {
      if (err) {
        return reject(err)
      }
      return resolve(data)
    })
  })
}

function writeFile(src, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(src, data, err => {
      if (err) {
        return reject(err)
      }
      return resolve()
    })
  })
}