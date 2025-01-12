const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

const browser = process.env.BROWSER || 'chrome';
const outputDir = browser === 'firefox' ? 'firefox' : 'chrome';

module.exports = {
  entry: {
    popup: './extension/src/popup/popup.tsx',
    background: './extension/src/background.ts'
  },
  output: {
    path: path.resolve(__dirname, `dist/${outputDir}`),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { 
          from: browser === 'firefox' ? "manifest-firefox.json" : "manifest.json",
          to: "manifest.json" 
        },
        { 
          from: "extension/src/popup/popup.html", 
          to: "popup.html",
          noErrorOnMissing: true
        }
      ],
    }),
  ],
}; 