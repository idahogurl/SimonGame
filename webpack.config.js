// In webpack.config.js
module.exports = {
  entry: [
    './typescript/index.js'
  ],
  module: {
    loaders: [
      {test: /\.tsx$/, exclude: /node_modules/, loader: "typescript-loader"}
    ]
  },
  output: {
    filename: "index_bundle.js",
    path: __dirname + '/dist'
  },
}