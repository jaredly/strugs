var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'eval',
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    './app/index'
  ],
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/app/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  resolve: {
    extensions: ['', '.js'],
    alias: {
      react: path.join(__dirname, 'node_modules/react'),
    },
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
      include: [
        path.join(__dirname, '../nm/flammable'),
        // path.join(__dirname, '../css')
      ]
    },
    {
      test: /\.js$/,
      loaders: ['react-hot', 'babel'],
      include: [
        path.join(__dirname, 'app'),
        // path.join(__dirname, '../css')
      ]
    }]
  }
};

