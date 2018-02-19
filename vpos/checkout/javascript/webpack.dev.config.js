const Path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const Webpack = require('webpack');

module.exports = {
  entry: ['babel-polyfill', './src/index.js'],
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    hot: true,
  },
  plugins: [
    new CleanWebpackPlugin(['dist/*-dev.js'], { exclude: ['.keep'] }),
    new Webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      'process.env.VPOS_PORTAL': JSON.stringify('https://desa.infonet.com.py:8085'),
    }),
    new Webpack.NamedModulesPlugin(),
    new Webpack.HotModuleReplacementPlugin(),
  ],
  output: {
    filename: `bancard-checkout-${process.env.npm_package_version}-dev.js`,
    path: Path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules|specs/,
        loader: 'babel-loader',
      }
    ],
  },
};
