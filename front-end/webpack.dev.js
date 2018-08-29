const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
// const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

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
    // publicPath: '/',
    // contentBase: path.join(__dirname, 'dist'),
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
        test: /\.scss$/,
        use: [
          'css-hot-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join('src/index.html'),
      inject: true,
    }),
    new webpack.HotModuleReplacementPlugin(),
    // need this or MiniCssExtractPlugin.loader will error out
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
    new ErrorOverlayPlugin(),
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
