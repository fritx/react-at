'use strict'
const path = require('path')
const webpack = require('webpack')
const CleanPlugin = require('clean-webpack-plugin')
const Notifier = require('webpack-notifier')

module.exports = {
  module: {
    preLoaders: [
      { test: /\.js$/, exclude: /\/dist\/|node_modules/, loader: 'eslint' },
    ],
    loaders: [
      { test: /\.js$/, loader: 'babel', exclude: /\/dist\/|node_modules/ },
      { test: /\.css$/, loader: 'style!css', exclude: /node_modules/ },
      { test: /\.scss$/, loader: 'style!css!sass', exclude: /node_modules/ },
    ]
  },

  resolve: {
    // alias: {
    //   'react': 'react-lite',
    //   'react-dom': 'react-lite'
    // },
    extensions: ['', '.js']
  },

  plugins: [
    new Notifier({ alwaysNotify: true }),
    new webpack.ExternalsPlugin('commonjs', [
      'path', 'fs', 'os',
    ]),
    new CleanPlugin(path.join(__dirname, 'dist')),
  ]
}
