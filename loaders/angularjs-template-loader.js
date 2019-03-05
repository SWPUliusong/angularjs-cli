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
  const ext = path.extname(resourcePath)
  // 模板路径正则
  const tempRegexp = /templateUrl\:\s*['"](\S+\.html)['"]/g
  // 匹配模板中的src，替换路径
  const srcRegexp = /src\=['"](\S+\.(?:png|jpe?g|gif|svg))['"]/g

  if (ext === ".js") {
    return source.replace(tempRegexp, function (match, relativePath) {
      // 根据相对路径解析出模板绝对路径
      let htmlPath = path.resolve(path.dirname(resourcePath), relativePath)
      return `template: require("${htmlPath.replace(/\\/g, "\\\\")}")`
    })
  } else if (ext === ".html") {
    // 替换html中src路径
    const result = source
      .replace(srcRegexp, function (match, src) {
        let imgPath = path.resolve(path.dirname(resourcePath), src)
        let publicPath = copyFile(imgPath)
        return `src="${publicPath}"`
      })
      .replace(/\u2028/g, '\\u2028')
      .replace(/\u2029/g, '\\u2029')

    return `module.exports = \`${result}\``;
  }
}