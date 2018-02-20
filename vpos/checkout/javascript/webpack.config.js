const Path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const Webpack = require('webpack');

module.exports = {
  entry: ['babel-polyfill', './src/index.js'],
  plugins: [
    new CleanWebpackPlugin([`dist/bancard-checkout-${process.env.npm_package_version}.js`]),
    new Webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      'process.env.VPOS_PORTAL': JSON.stringify('https://vpos.infonet.com.py'),
    }),
    new Webpack.optimize.UglifyJsPlugin(),
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
