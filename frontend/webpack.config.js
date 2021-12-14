const webpack = require('webpack');
require('dotenv').config({ path: '../.env' });

const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: process.env.ENV,
  entry: {
    app: ['./src/Index.tsx'],
    vendor: ['react', 'react-dom'],
  },
  watch: process.env.ENV === 'development',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'js/[name].build.js',
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.scss'],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          process.env.ENV === 'development' 
          ? 'style-loader'
          : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              esModule: false,
              sourceMap: true
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.(ts|js)x?$/i,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
          },
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        loader: 'file-loader',
        options: {
          name:
            process.env.ENV === 'development'
              ? 'assets/[folder]/[name].[ext]'
              : 'assets/[sha512:hash:base64:7].[ext]',
          esModule: false,
        },
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env),
    }),
    new MiniCssExtractPlugin({
      filename: `[name].[contenthash].css`,
      chunkFilename: `[id].css`
    }),
    new HtmlWebPackPlugin({
      template: './src/index.html',
      favicon: './src/assets/icon.ico',
    }),
  ],
};
