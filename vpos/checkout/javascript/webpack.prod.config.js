const Path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: ['babel-polyfill', './src/index.js'],
  devtool: 'inline-source-map',
  plugins: [
    new CleanWebpackPlugin(['dist'], { exclude: ['.keep', 'index.html'] }),
  ],
  output: {
    filename: `bancard-checkout-${process.env.npm_package_version}.js`,
    path: Path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules|specs/,
        loader: 'babel-loader',
      },
    ],
  },
};
