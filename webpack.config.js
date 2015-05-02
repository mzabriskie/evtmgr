var webpack = require('webpack');
var plugins = [];

if (process.env.MINIFY) {
  plugins.push(
    new webpack.optimize.UglifyJsPlugin()
  );
}

module.exports = {
  output: {
    library: 'evtmgr',
    libraryTarget: 'umd'
  },

  module: {
    loaders: [
      { test: /\.js$/, excludes: /node_modules/, loader: 'babel-loader' }
    ]
  },

  plugins: plugins
};
