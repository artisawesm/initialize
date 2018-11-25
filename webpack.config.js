const path = require("path");

module.exports = {
  mode: "none",
  entry: "./src/js/app.js",
  devtool: "source-map",
  output: {
    path: path.join(__dirname, "/dist/assets/js"),
    filename: "app.min.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        resolve: {
          extensions: [".js", ".jsx"]
        },
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"]
          }
        }
      }
    ]
  }
};
