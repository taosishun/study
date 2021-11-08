/**
 * 
 *
一.什么是webpack
  文件打包工具 
二.安装webpack
  1.创建项目 并init生成package.json
  2.安装webpack npm install webpack -webpack-cli -g（全局安装--不推荐）
  3.webpack 进入项目主目录 npm install webpack-cli -D (项目中安装)
    会生成package-lock.json和webpack所需要的依赖包node_modules
    如果有多个项目需要webpack打包且项目的webpack版本不一样，会造成项目打包不成功
  4.安装固定版本webpack 如果不知道是否存在该版本，可输入npm info webpack查看所有版本
    npm install @webpack4.16.5 webpack-cli -D
三.全局删除webpack
  npm uninstall webpack -webpack-cli -g (全局删除webpack)
四.查看webpack版本 
  1.webapck -v（安装在全局使用）
  2.安装在项目中时使用 npx webpack -v

五.webpack 的默认配置文件为wepack.config.js (可自行创建配置)
  const path = require('path')
  module.exports = {
    //entry需要打包的文件
    entry:'./index.js' 
    //output 打包输出配置
    output: {
      //filename 打包文件名称 index.js -> bundle.js
      fliename: 'bundle.js',
      //path  使用path需要引入node核心模块path
      //__dirname 代表webpack.config.js所在的文件目录路径
      //dist -> bundle
      path:path.resolve(__dirname, 'bundle')
    }
  }

六.如果有别的配置文件 可以输入 npx webpack --config （webpackconfig.js）目标配置文件名称
 
七. 配置打包指令 package.json
  找到script配置
  srcipt: {
    "build": "webpack"
  }
  然后运行npm run build

八.模块打包配置
  
  在进行模块打包行，识别不出文件类型则需要配置打包规则，
  安装 npm install file-loader
  配置vue文件格式 npm install vue-loader

  一.图片打包规则 file-loader
    1.希望图片打包后名称后缀不变 配置options里面的name
      ext占位符，ext代表原始文件后缀，hash值代表打包文件对应的hash值
      打包不同的图片格式可以到test中添加
    2.如果希望图片打包到dist中时是在一个images文件下可以配置他的outputPath

  module: {
      rules: [
        {
          test: /\.(jpg|png|gif)$/,
          use:{
              loader:'file-loader',
              options: {
                name:'[name].[ext]',
                outputPath:'/images'
              }
          }
        },{
          test: /\.vue$/,
          use:{
              loader:'vue-loader',
              options: {
                name:'[name]_[hash].[ext]'
              }
          }
        }
      ]
  }
  图片打包规则 url-loader

  安装url-loader npm install url-loader -D
  url-loader：可以把图片转化为base64的字符串打包进js文件中，减少http请求
  坏处是图片过大，会造成页面加载过慢，所以需要配置limit
  limit : (204800)图片大小小于该值，则转base64，否则打包成对应文件

  module: {
      rules: [
        {
          test: /\.(jpg|png|gif)$/,
          use:{
              loader:'url-loader',
              options: {
                name:'[name].[ext]',
                outputPath:'/images',
                limit: 204800
              }
          }
        }
      ]
  }
  二.静态资源打包规则（css）

  css文件识别不出来时，打包后会使css文件内容不生效
  style-loader css-loader使用需要安装 npm install style-loader css-loader -D
  scss-loader使用需要安装 npm install sass-loader node-sass -D
  postcss-loader npm i -D postcss-loader 在创建postcss.config.js进行配置
  此时需要下载autoprefixer插件 npm install autoprefixer -D

  css-loader：分析出几个css文件的关系，合并成一段css
  style-loader：得到css-loader生成的内容后，会把这段内容挂载在页面hader部分
  scss-loader: 分析scss文件
  postcss-loader：可以处理其他一些打包操作，比如添加厂商前缀
  *****loader执行顺序 从下到上，从右到左

  1.如果需要对css进行配置,书写对象形式进行配置
    importLoaders:scss文件中如果还import引入了其他scss文件，
    importLoaders设置 2 时代表 这个scss文件被编译之前
    里面被引入的文件也需要走scss-loader postcss-loader这两个文件的流程
    modules:true 开启css模块化打包，以免css发生冲突，
    import './index.scss' 改为 import my from './index.scss'
    使用img.classList.add(my.acc),其他需要使用此css处 引入再使用
  2.webpack 打包字体文件 加一项规则配置项 使用file-loader
  module: {
      rules: [
        {
          test: /\.(css|scss)$/,
          use:[
            // 'style-loader',
            // 'css-loader',
            {
              loader:'css-loader,
              options :{
                importLoaders:2,
                modules:true
              }
            }
            // 'scss-loader',
            // 'postcss-loader'
            {

            }
          ]
        },
        {
          test: /\.(eot|ttf|svg)$/,
          use:[
            {
              loader:'file-loade
            }
          ]
        }
      ]
  }
  3.打包插件 html-webpack-plugin
  ****** npm install html-webpack-plugin -D
  打包时没有生成html文件 可以使用htmlwebpackplugin来配置生成html
  同时会把js文件自动引入到这个文件内
  module: {
      entry:'./index.js',
      plugins:[
        //里面可以接收html模板(打包之后运行)
        new HtmlWebpackPlugin(
          template: './src/idnex.html'
        ),
        //接收参数，里面填写每次打包时需要删除的文件名，他会删除目录里的所有内容(打包之前运行)
        new CleanWebpackPlugin('dist')
      ]
  }
  4.打包插件 clean-webpack-plugin
  ******安装 npm install clean-webpacl-plugin -D
* 
 * */

