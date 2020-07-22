const path = require('path')
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const webpack = require('webpack'); // 用于访问内置插件

module.exports = {
  mode: 'development',
  optimization: { minimize: false },
  entry: path.resolve('./src/index.js'),
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js',
    // filename: '[name].[hash].js',
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // 匹配文件路径的正则表达式，通常我们都是匹配文件类型后缀
        // 指定哪些路径下的文件需要经过 loader 处理
        // include: [
        //     path.resolve(__dirname, './src')
        // ],
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              [
                '@babel/plugin-transform-react-jsx',
                { pragma: 'KReact.createElement' },
              ],
            ],
          },
        },
      },
    ],
  },
  // plugins: [
  //     new CleanWebpackPlugin(),
  //     new HtmlWebpackPlugin({
  //         template: path.resolve('./src/document.html')
  //     }),
  //     new webpack.NamedModulesPlugin(), // 用于启动 HMR 时可以显示模块的相对路径
  //     new webpack.HotModuleReplacementPlugin(), // Hot Module Replacement 的插件
  // ],
  optimization: {
    minimize: false,
  },
  // devtool: 'cheap-module-eval-source-map',
  devServer: {
    // open: 'Chrome',
    // dev server 的配置要启动 hot，或者在命令行中带参数开启
    // hot: true
    // 将 devServer.publicPath 和 output.publicPath 的值保持一致
    // publicPath:'',
    // proxy: {
    //     '/api': {
    //       target: "http://localhost:3000", // 将 URL 中带有 /api 的请求代理到本地的 3000 端口的服务上
    //       pathRewrite: { '^/api': '' }, // 把 URL 中 path 部分的 `api` 移除掉
    //     },
    //   }
  },
}
