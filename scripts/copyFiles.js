const path = require("path")
const fs = require("fs")

const noop = () => { }

module.exports = async (from = [], to = [], cb = noop) => {
  for (let i = 0; i < to.length; i++) {
    mkdir(to[i])
    await pipe(from[i], to[i])
    cb()
  }
}

function mkdir(filePath = "") {
  let dirCell = filePath.split(path.sep)
  dirCell.reduce((prev, next) => {
    if (!fs.existsSync(prev)) {
      fs.mkdirSync(prev)
    }
    return [prev, next].join(path.sep)
  })
}

function pipe(src, dest) {
  return new Promise((resolve, reject) => {
    let read = fs.createReadStream(src)
    read.on("end", resolve)
    read.on("error", reject)
    read.pipe(fs.createWriteStream(dest))
  })
}
