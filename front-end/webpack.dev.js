const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
// const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'development',
  entry: {
    app: path.join(__dirname, 'src/app/index.js'),
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].bundle.js',
  },
  resolve: {
    alias: {
      '@': path.resolve('src'),
    }
  },
  devServer: {
    open: false,
    publicPath: '/',
    contentBase: path.join(__dirname, 'dist'),
    historyApiFallback: true,
    hot: true,
  },
  devtool: 'cheap-module-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.global.scss$/,
        use: [
          'css-hot-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /^((?!\.global).)*scss$/,
        use: [
          'css-hot-loader',
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true,
              // importLoaders: 3,
              localIdentName: 'pi-chat___[name]__[local]___[hash:base64:5]'
            }
          },
          'sass-loader',
          {
            loader: 'style-resources-loader',
            options: {
              patterns: [
                path.resolve(__dirname, 'src/style/utils/_variables.scss'),
              ]
            },
          },
        ],
      },
      {
        test: /\.(ttf|eot|woff|woff2|otf)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            // outputPath: 'dist/',
          },
        },
      },
    ],
  },
  plugins: [
    new ErrorOverlayPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: path.join('src/index.html'),
      inject: true,
    }),
    // need this or MiniCssExtractPlugin.loader will error out
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
    // new BrowserSyncPlugin({
    //   host: 'localhost',
    //   port: 3000,
    //   proxy: 'http://localhost:8080/',
    // }, 
    // {
    //   reload: false,
    // }),
  ],
};
