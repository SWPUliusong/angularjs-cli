const globby = require('globby');
const path = require("path")

module.exports = async (srcDir, destDir) => {
  // 获取所有文件路径
  let from = await globby(srcDir + "/**", {
    dot: true,
  });

  let to = from.map(item => {
    item = item.split(path.posix.sep).join(path.sep)
    return path.join(destDir, item.replace(srcDir, ""))
  })

  return { from, to }
}
