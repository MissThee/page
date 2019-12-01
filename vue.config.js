const path = require('path');
const webpack = require('webpack');
function resolve(dir) {
  //此处使用path.resolve 或path.join 可自行调整
  return path.join(__dirname, dir);
}
module.exports = {

  pages: {//多入口
    "dir1/home": {//如果写目录，打包后会增加目录
      entry: 'src/home/main.js',//入口js
      template: 'public/index.html',//入口模板。（webpack会将public下的文件拷贝到输出目录）
      filename: 'index.html',//打包后的名字，可写成路径。
    },
    docviewer: {
      entry: 'src/docviewer/main.js',
      template: 'public/docviewer/index.html',
      filename: 'docviewer/index.html',
    },

  },
  outputDir: 'main', // 打包文件输出路径，即打包到哪里
  assetsDir: 'static',// 静态资源地址
  lintOnSave: false, // eslint-loader 是否在保存的时候检查
  productionSourceMap: true,  // 生产环境是否生成 sourceMap 文件
  runtimeCompiler: true,
  filenameHashing: true, //打包文件名使用hash
  css: {
    extract: false,
    sourceMap: true, // 开启 CSS source maps
  },
  publicPath: './',//打包后引用路径为相对路径
  configureWebpack: {
    resolve: {
      alias: {
        'src': resolve('./src')
      }
    },
    externals: {
      'vue': 'Vue',
      'vue-router': 'VueRouter',
      'vuex': 'Vuex',
      'element-ui': 'ELEMENT',
      'jquery': '$',
      'axios': 'axios'
    },
    plugins: [
      new webpack.ProvidePlugin({
        $:"jquery",
        jQuery:"jquery",
        "windows.jQuery":"jquery"
      })
    ],
    devtool: process.env.NODE_ENV === 'development' ? 'inline-source-map' : 'none'
  },
};

