const Path = require('path');
const Webpack = require('webpack');

module.exports = {
  entry: './src/bancard-checkout.js',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    hot: true,
  },
  plugins: [
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
