const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

const root = __dirname;

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';

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
    devtool: isProd ? 'source-map' : 'eval-cheap-module-source-map',
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
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          type: 'asset/resource',
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(root, 'public/index.html'),
        title: 'Webpack Basics',
      }),
      new Dotenv({
        path: path.resolve(root, '.env'),
        safe: false,
        systemvars: true,
      }),
    ],
    devServer: {
      static: path.resolve(root, 'public'),
      port: 3080,
      hot: true,
      historyApiFallback: true,
    },
    resolve: {
      extensions: ['.js', '.json'],
    },
  };
};
