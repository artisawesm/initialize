const path = require("path");

module.exports = {
  mode: "none",
  entry: "./src/js/index.js",
  devtool: "source-map",
  output: {
    path: path.join(__dirname, "/dist/assets/js"),
    filename: "app.min.js"
  },
  module: {
    rules: [
      {
        test: /\.jsx?/,
        exclude: /node_modules/,
        resolve: {
          extensions: [".js", ".jsx"]
        },
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-react"]
            }
          }
        ]
      }
    ]
  }
};
