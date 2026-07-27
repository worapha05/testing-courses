const path = require('path');
// intentionally broken — missing sass-loader and dotenv
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      // BUG: .scss ไม่มี loader → build พังเมื่อ import styles.scss
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './public/index.html' }),
    // BUG: ไม่มี Dotenv → process.env.API_URL เป็น undefined
  ],
};
