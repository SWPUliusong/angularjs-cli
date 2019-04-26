var path = require('path')
var utils = require('./utils')
var config = require('../config')

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  resolveLoader: {
    // 去哪些目录下寻找 Loader，有先后顺序之分
    modules: ['node_modules', './loaders/'],
  },
  entry: {
    app: [
      'babel-polyfill',
      './src/main.js'
    ]
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      '@': resolve('src')
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [resolve('src'), resolve('test')],
        use: [
          'babel-loader',
          'angularjs-template-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.html$/,
        loader: 'angularjs-template-loader',
      }
    ]
  }
}
