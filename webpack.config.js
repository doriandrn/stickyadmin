const path = require('path')
const package = require('./package.json')
const webpack = require('webpack')
const CopyPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ZipPlugin = require('zip-webpack-plugin')

const stylusPlugins = [
  require('rupture')(),
  require('svg-stylus')()
]

const capitalize = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

module.exports = (env) => {
  // const { version, name, description } = package
  const distDir = env && env.variant ? `dist_${env.variant}` : 'dist'

  return {
    mode: 'production',

    entry: {
      index: './src/scripts/index.js',
      login: './src/scripts/login.js'
    },

    output: {
      path: path.resolve(__dirname, distDir)
    },
    node: {
      fs: 'empty'
    },
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader'
          }
        },
        {
          test: /\.styl$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: process.env.NODE_ENV === 'development'
              },
            },
            'css-loader',
            'postcss-loader',
            'stylus-loader',
          ]
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin(),

      // new webpack.DefinePlugin({
      //   'VARIANT': JSON.stringify(env.variant)
      // }),

      new webpack.LoaderOptionsPlugin({
        options: {
          context: __dirname,
          stylus: {
            use: stylusPlugins,
            preferPathResolver: 'webpack',
            options: ['resolve url']
          }
        }
      }),

      new CopyPlugin([
        {
          from: '**/*.php',
          to: './',
          context: 'src/php'
        }
      ]),

      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // all options are optional
        filename: 'index.css',
        chunkFilename: '[id].css',
        ignoreOrder: false, // Enable to remove warnings about conflicting order
      }),

      // new ZipPlugin({
      //   path: '../',
      //   filename: `sticky_${variant}`
      // })
    ]
  }
}
