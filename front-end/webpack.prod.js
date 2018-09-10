// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const path = require('path');
const glob = require('glob-all');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PurifyCssPlugin = require('purifycss-webpack');
const MinifyPlugin = require('babel-minify-webpack-plugin');

module.exports = {
  mode: 'production',
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
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /^((?!\.global).)*scss$/,
        use: [
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
  optimization: {
    minimizer: [new MinifyPlugin({}, {})],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join('src/index.html'),
      inject: true,
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
    new PurifyCssPlugin({
      paths: glob.sync([
        path.join(__dirname, 'src/index/*.html'),
        path.join(__dirname, 'src/js/index/*.js'),
      ]),
      purifyOptions: {
        whitelist: ['*pi-chat*']
      }
    }),
    // new MinifyPlugin({}, {
    //   exclude: /node_modules/
    // }),
    // new BundleAnalyzerPlugin()
  ],
};
