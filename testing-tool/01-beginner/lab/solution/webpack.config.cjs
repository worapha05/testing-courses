const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

const root = __dirname;

module.exports = (env, argv) => {
  const isProd = (argv?.mode ?? process.env.NODE_ENV) === 'production';

  return {
    context: root,
    entry: './src/index.js',
    output: {
      path: path.resolve(root, 'dist'),
      filename: isProd ? '[name].[contenthash].js' : '[name].js',
      clean: true,
      publicPath: '/',
    },
    mode: isProd ? 'production' : 'development',
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [['@babel/preset-env', { targets: 'defaults' }]],
            },
          },
        },
        {
          test: /\.scss$/,
          use: ['style-loader', 'css-loader', 'sass-loader'],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(root, 'public/index.html'),
        title: 'ToolShop',
      }),
      new Dotenv({
        path: path.resolve(root, '.env'),
        systemvars: true,
      }),
    ],
  };
};
