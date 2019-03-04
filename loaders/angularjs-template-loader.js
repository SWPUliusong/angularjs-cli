/**
 * 解析所有js文件中templateUrl的对应文件加载
 * 
 */

const fs = require("fs")
const path = require("path")
const config = require("../config")

function copyFile(filePath) {
  let filename = path.basename(filePath)

  let configPart = process.env.NODE_ENV === 'production' ? config.build : config.dev;
  let { assetsSubDirectory, assetsPublicPath } = configPart
  let root = path.join(process.cwd(), assetsPublicPath)

  let targetPath = path.resolve(root, assetsSubDirectory, filename)

  if (!fs.existsSync(targetPath)) {
    fs.writeFileSync(targetPath, fs.readFileSync(filePath))
  }

  if (assetsPublicPath.slice(-1) === "/") {
    return assetsPublicPath + assetsSubDirectory + "/" + filename
  }

  return [assetsPublicPath, assetsSubDirectory, filename].join("/")
}

module.exports = function (source) {
  const { resourcePath } = this
  // 模板路径正则
  const tempRegexp = /templateUrl\:\s*['"](\S+\.html)['"]/g
  // 匹配模板中的src，替换路径
  const srcRegexp = /src\=['"](\S+\.(?:png|jpe?g|gif|svg))['"]/g

  return source.replace(tempRegexp, function (match, relativePath) {
    // 根据相对路径解析出模板绝对路径
    let htmlPath = path.resolve(path.dirname(resourcePath), relativePath)
    let htmlStr = fs.readFileSync(htmlPath).toString()
    // 替换html中src路径
    htmlStr = htmlStr.replace(srcRegexp, function (match, src) {
      let imgPath = path.resolve(path.dirname(htmlPath), src)
      let publicPath = copyFile(imgPath)
      return `src="${publicPath}"`
    })

    return `template: \`${htmlStr}\``
  })

}