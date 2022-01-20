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
    mode: development//开发环境 devtool使用cheap-module-eval-source-map
    mode: perduction//线上环境 devtool使用cheap-module-source-map
    //entry打包的入口文件
    entry: './index.js' ,
    devtool: source-map
    //output 打包输出配置
    output: {
      //filename 打包文件名称 index.js -> bundle.js
      fliename: 'bundle.js',
      //path  使用path需要引入node核心模块path
      //__dirname 代表webpack.config.js所在的文件目录路径
      //dist -> bundle
      path: path.resolve(__dirname, 'bundle')
    }
  }
  
  devtool: source-map //代码有错误时，不添source-map他只会提示打包后的js文件对应错的地方
  添source-map会和打包的文件产生映射关系，会提示对应打包js文件的错误位置
  devtool可填写的选项：inline : 填写source-map会生成一个map文件，加上inline会把map文件打包进对应的打包文件中 base64码形式
  eval：和sourcemap结合使用，会提高打包速度
  module：管理module中代码的错误
  cheap: 1.只提示多少行，不提示多少列，如果提示多少列会对打包速度有影响
         2.只提示业务代码中的错误，第三方库和插件中的错误不管

  entry拓展 如果想打包两个index.js可以这么配置
  entry里面写对象,output里面filename写上name占位符

  output拓展 如果js文件上传到cdn等服务器，希望打包的html中引入的script带又cdn地址
  可以配置output里面的pulicPath
  module.exports = {
    //entry打包的入口文件
    entry:{
      main: './src/index.js',
      sub: './src/index.js'
    }
    //output 打包输出配置
    output: {
      pulicPath:'http://cdn.com.cn'
      //filename 打包文件名称 index.js -> bundle.js
      fliename: '[name].js',
      //path  使用path需要引入node核心模块path
      //__dirname 代表webpack.config.js所在的文件目录路径
      //dist -> bundle
      path: path.resolve(__dirname, 'bundle')
    }
  }

六.如果有别的配置文件 可以输入 npx webpack --config （webpackconfig.js）目标配置文件名称
 
七. 配置打包指令 package.json
  1.监听源代码是否更改  如果有改变则会自动打包更新dist目录
    找到script配置
    srcipt: {
      "build":"webpack --watch"//加上watch之后更改源代码。监听源代码是否更改  如果有改变则会自动打包更新dist目录
    }
    然后运行npm run build
  2.watch只监听本地的 打包生成的文件没办法做一些ajax方面的调试而且每次打包完都需要手动刷新浏览器，如果想监听服务器端，可以配置devServer起一个服务器再监听 先安装webpack-dev-server
    srcipt: {
      "strat":"webpack-dev-server"
    }
    再配置
    module.exports = {
      //借助devServer开启一个服务器
      devServer: {
        contentBase: "./dist",//开启服务器的地址
        open: true,//默认在打包时会自动打开浏览器
        port: 8080,//默认端口号为8080 port可以修改端口号
      }
  }

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
          use: {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: '/images'
              }
          }
        },{
          test: /\.vue$/,
          use: {
              loader: 'vue-loader',
              options: {
                name: '[name]_[hash].[ext]'
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
                name: '[name].[ext]',
                outputPath: '/images',
                limit: 204800
              }
          }
        }
      ]
  }
  二.静态资源打包规则（css）

  css文件识别不出来时，打包后会使css文件内容不生效
  style-loader css-loader使用需要安装 npm install style-loader css-loader -D
  scss-loader使用需要安装 npm install npm uninstall sass-loader node-sass -D
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
            use: [
              // 'style-loader',
              // 'css-loader',
              {
                loader: 'css-loader,
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
            use: [
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
    modules: {
        entry:'./index.js',
        plugins: [
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
  三.hotmodulereplacement 热模块更新  
  webpack中的插件,安装webpack 
  const webpack = require('./webpack')

  module.exports = {
    
    devServer: {
      contentBase: "./dist",//开启服务器的地址
      open: true,//默认在打包时会自动打开浏览器
      port: 8080,//默认端口号为8080 port可以修改端口号
      hot: true,//开启热模块更行
      hotOnly: true,
    },
    plugins: [
      //里面可以接收html模板(打包之后运行)
      new HtmlWebpackPlugin(
        template: './src/idnex.html'
      ),
      //接收参数，里面填写每次打包时需要删除的文件名，他会删除目录里的所有内容(打包之前运行)
      new CleanWebpackPlugin('dist'),
      new webpack.HotModuleReplacementPlugin(),
    ]    
  }

  四.babel处理es6
  先安装 npm install --save-dev babel-loader @babel/core
  再安装 npm install @babel-preset-env --save-dev(包含所有es6转es5的规则)
  再安装 npm install --save @babel/polyfill map promise 识别不出来 但使用了打包出的js很大，可以配置useBuiltIns
  把polyfill 引入到所需js文件中 import "@babel/polyfill"
    module: {
      rules: [
        {
          test: /\js$/,//遇到js文件就执行转义
          exclude: '/node_modules',//如果是node_modules的第三方库就不进行转义
          loader: 'babel-loader',
          options:{
            presets: [['@babel-preset-env',{
              targets: {
                chrome: 67//如果浏览器兼支持es6，就不做es6转es5的操作
              },
              useBuiltIns: 'usage',
            }]]
          }
        }
      ]
    }

  这种方式可能处理不了组件库，第三方库，需要借助babel里面的transfrom-runtime
  五.对react框架打包
  安装  npm install --save-dev @babel/preset-react 

  module: {
    rules:[
      {
        test: /\js$/,//遇到js文件就执行转义
        exclude: '/node_modules',//如果是node_modules的第三方库就不进行转义
        loader: 'babel-loader',
        options: {
          presets: [
            [
              '@babel-preset-env',{
                targets: {
                  chrome:67//如果浏览器兼支持es6，就不做es6转es5的操作
                },
                useBuiltIns: 'usage',
              }
            ],
            '@babel/preset-react '
          ]
        }
      }
    ]
  }

  Tree Shaking 
  业务代码中 引入的方法 如果有的方法没有引入 或者不需要打包，可以使用TreeShaking
  只支持ES Module引入(import) 不支持require引入
  //开发环境下这样配置development
  module.exports = {
    mode: development
    optimization: {
      usedExports: true
    }
  }
  package.json中加一项配置
  sideEffects： false
  有需要进行特殊处理不希望对该文件起作用 这样写 sideEffects：['@babel/polly-fill']
  最常见就是配置css文件 sideEffects：['*.css']
  线上环境production 不需要optimization，package中的需要
  module.exports = {
    mode: production,
  }


  开发环境development 线上环境production 
  配置不同,创建两个webpack配置文件 一个webpack.dev.js（配置开发环境） 一个webpack.prod.js（配置线上环境）

  srcipts:{
    "dev" :"webpack-dev-server --config webpack.dev.js"
    "prod"(build) :"webpack --config webpack.prod.js"
  }

  有的框架中会把webpack.prod.js webpack.dev.js webpack.common.js放到一个build文件中
  这时候需要改
  srcipts:{
    "dev" :"webpack-dev-server --config ./build/webpack.dev.js"
    "prod"(build) :"webpack --config ./build/webpack.prod.js"
  }

  //如果有的框架中会把webpack.prod.js webpack.dev.js webpack.common.js
  放到一个build文件中  打包之后dist目录会打包到build目录中，因为webpack打包时生成的dirname参数就是webpack.config.js所在的当前目录，
  如果webpack.config.js放到build目录中，在打包时dirname参数的值就变成build目录，（也就是webpack.config.js在那个目录，打包之后的dist就会和webpack.config.js在同一级目录）这时候需要打包到根目录下
  需要更改配置 先更改output文件输出目录改为../dist
  output :{
    filename: '[name'.js,
    path: path.resolve(__dirname, '../dist')
  }
  再更改他需要删除的dist目录
  plugins:[
    //里面可以接收html模板(打包之后运行)
    new HtmlWebpackPlugin(
      template: './src/idnex.html'
    ),
    //接收参数，里面填写每次打包时需要删除的文件名，他会删除目录里的所有内容(打包之前运行)
    new CleanWebpackPlugin(['dist'], {
      root: path.resolve(__dirname, '../')
    })
  ]

  如果两个环境中有很多共同的代码配置，可以创建一个webpack.common.js
  将相同代码提取到里面再导出，但是这样需要安装一个插件 npm install webpack-merge -D

  到两个文件中分别引入 const merge = require('webpack-merge')和公共配置导出的配置const commonConfig = require('./webapck.common.js')
  将两个文件中的配置module.exports = {
    (线上配置或者开发配置)
  }
  **********
  改为(开发)
  const devConfig = {
    (开发配置)
  }
  module.exports = merge(commonConfig,devConfig)
  *************
  const prodConfig = {
    (线上配置)
  }
  module.exports = merge(commonConfig,prodConfig)
  *************


  webpack 和 Code Splitting
  Code Splitting(代码分割)
  如果有一个插件库1Mb,业务代码也1Mb都在一个文件中，用户需要加载2Mb的东西才能访问到东西,如果页面代码发生变化，则又需要加载2Mb的内容才能访问到
  但是如果把插件库和业务代码分割开引入到另外一个文件中，用户访问时加载则是 插件库1Mb 业务代码1Mb 但是业务代码发生变化时，用户只需要加载业务代码的1Mb即可以访问到内容
  all同步异步代码分割
  同步代码分割会走  cacheGroups -> vendors
  module.exports = {
    mode: development
    optimization: {
      splitChunks: {
        chunks: 'all',
        //如果需要分割的代码大于这个数的字节,再走cacheGroups 如果小于也会打包但是也需要走cacheGroups
        minSize: 30000,
        //如果打包出的js文件中最少有一次使用到该代码才进行单独打包
        minChunks: 1,
        maxAsyncrequests :5,
        //分割生成代码的文件名 所属组（vendors和default）和 入口文件中间的拼接符号
        aotumaticNameDelimiter:"~"
        cacheGroups: {
          //走到这一步看分割代码是否node_modules中有，有则会分割到vendors的filename对应的文件中去，没有则会分割到default的filename对应的文件中去
          vendors: {
            test: /[\\/]node-modules[\\/]/,
            priority: -10,
            //插件打包之后的名字
            filename:'vendors.js'
          },
          default: {
            //打包优先级，数字越大优先级约大
            priority: -20,
            //如果一个模块被打包过了，就忽略不打包，使用之前被打包过的模块
            reuseExitstingchunks: true
            //插件打包之后的名字
            filename: 'common.js'
          }
        }
      }
      
    }
  }
  异步代码分割
  module.exports = {
    mode: development
    optimization: {
      splitChunks: {
        chunks: 'async'
      }
    }
  }

  Lazy Loading 懒加载 chunk
  import引入一个组件时，没有用到时，就不加载，用到时再加载（比如点击时再加载，不点击不加载）
  dist目录下每一个js文件都是一个chunk

  打包分析 preloading(和核心代码一起加载) prefetching （核心代码加载完后有网络空闲就加载）
  打包分析 添加--profile --json > stats.json 生成一个json文件，里面存放打包过程的描述
  
  srcipts:{
    "dev" :"webpack-dev-server --config ./build/webpack.dev.js"
    "prod"(build) :"webpack --profile --json > stats.json --config ./build/webpack.prod.js"
  }
*
 * */
//import (/*webpackprefetching: true*/)


/**
 *
 * css文件代码分割
 * 借助MiniCssExtractPlugin插件(没有热更新，需要手动刷新页面看效果，所以只适合线上环境，不太适合开发者环境)
 * 先安装 引入
 * const MiniCssExtractPlugin =require('mini-css-extractplugin') 
 * const prodConfig = {
    (线上配置)
    optimization: {
      splitChunks: {
        chunks: 'async'
      }
    }
    module:{
      rules: [
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader,
              options :{
                importLoaders:2,
                modules:true
              }
            }
            'scss-loader',
            'postcss-loader'
          ]
        },{
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader',
            'postcss-loader'
          ]
        }
      ]
    },
    plugins : [
      new MiniCssExtractPlugin({
        //css文件时直接被html引用(被打包出来的html中script直接用  <script src="./index.css"> 这种)，则生成对应filename的名字
        filename:'[name].css',
        //间接使用chunkFilename名字 也就是css中套用了css文件
        chunkFilename: '[name].chunk.css'
      })
    ]
  }
  再更改package.json中的为
  sideEffects:['*.css']

  默认功能还有会把两个css文件 合并打包到一个main.css 间接未知
  如果需要压缩打包 则需要下载插件npm install optimize-css-assets-webpack-plugin -D
  引入 const OptimizeCssAssetsPlugin= require('optimize-css-assets-webpack-plugin')
  配置optimization的minimizer 如果有多个入口文件 module.exports = { entry:{ main: "./index",main1: "./index1"}},但是希望多个css 打包到一个main.css中也可以配置
  const prodConfig = {
    (线上配置)
    optimization: {
      minimizer :[new OptimizeCssAssetsPlugin({})]
      splitChunks: {
        chunks: 'async'
      }
    }
    module:{
      rules: [
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader,
              options :{
                importLoaders:2,
                modules:true
              }
            }
            'scss-loader',
            'postcss-loader'
          ]
        },{
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader',
            'postcss-loader'
          ]
        }
      ]
    },
    plugins : [
      new MiniCssExtractPlugin({
        //css文件时直接被html引用(被打包出来的html中script直接用  <script src="./index.css"> 这种)，则生成对应filename的名字
        filename:'[name].css',
        //间接使用chunkFilename名字 也就是css中套用了css文件
        chunkFilename: '[name].chunk.css'
      })
    ]
  }



  webpack与浏览器缓存 先上传一个dist到服务器，用户打开了服务器 有了缓存 看了内容1，如果我改了业务逻辑打包了新的dist再上传到服务器就会出问题 用户看到的还是原先的dist内容

  这适合需要使用新的配置
  contenthash:源代码不变化 hash值也不变化，用户使用原先的缓存 源代码变化了 hash值也变化 用户就需要加载新的js文件
  如果是老版本会存在hash还是会变化的问题，需要额外配置optimization中runtimeChunk

  const prodConfig = {
    (线上配置)
    optimization: {
      runtimeChunk: {
        name: runtime
      },
      minimizer :[new OptimizeCssAssetsPlugin({})]
      splitChunks: {
        chunks: 'async'
      }
    }
    module:{
      rules: [
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader,
              options :{
                importLoaders:2,
                modules:true
              }
            }
            'scss-loader',
            'postcss-loader'
          ]
        },{
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader',
            'postcss-loader'
          ]
        }
      ]
    },
    plugins : [
      new MiniCssExtractPlugin({
        //css文件时直接被html引用(被打包出来的html中script直接用  <script src="./index.css"> 这种)，则生成对应filename的名字
        filename:'[name].css',
        //间接使用chunkFilename名字 也就是css中套用了css文件
        chunkFilename: '[name].chunk.css'
      })
    ],
    output:{
      filename:[name].[contenthash].js,
      chunkFilename:[name].[contenthash].js
    }
      
  }

  shimming 垫片
  发现一个文件中使用了$ 就会自动帮你在那个文件中import引入jquery
  const webpack = require('webpack')
  module.exports = {
    pligins: {
      new webpack.ProvidePlugin({
        $:'jquery'
      })
    }
  }


  Library的打包
  如果在开发库文件，想给别人使用
  可以使用
  module.exports = {
    entry:'',
    filename:'',
    externals:['jquery'],
    //或者这种形式
    externals:{
      jquery:'jquery'//使用你的库的人 引用jquery时名字必须要是jquery   improt jquery from 'jquery'
    }
    output:{
      libraryTarget:"umd",//支持import require方式引入你的库 也可以配置下面的library来使用 （填this挂载到this上 使用 this.library.func）(填window挂载到window上 使用 window.library.func)
      library:'library',//支持<script src="library.js"><script>的方式引入 使用时 library.func (方法)
    },

  }

  如果你的库使用了jquery 用户也使用了jquery 那么用户进行打包时会打包两次jquery会造成问题 可以配置externals 遇到数组中的插件忽略不进行打包



  PWA的配置
  npm install workbox -webpack -plugin
  再引入，再到plugin中使用
  new WorkBoxPlugin.GenerateSW({
    clientClaim:true,
    skipWaiting:true
  })
  服务器挂掉之后 依然能展示页面内容 使用的是之前页面的缓存（前提是服务器未挂掉之前 用户进入过一次页面有缓存才行）

  Typescript 的打包配置
  先创建tsconfig.json文件 基本配置
  {
    "compilerOpitions": {
      "outDir": "./dist",
      "module": 'es6,
      "target": "es5",
      "allowJs": true//是否允许引入js模块
    }
  }
  安装ts-loader 和ts  npm install ts-laoder typescript -D
  module.exports = {
    mode:'prodution',
    entry:'index.js',
    module:{
      rules:[
        {
          test:/\.tsx?$/,
          use:'ts-loader',
          excluder:/'node_modules/'
        }
      ]
    },
    output :{
      filename : 'ts',
      path:path.resolve(__dirname, 'dist')
    }
  }


  使用webpackDevServer 实现请求转发
 * 
*/
