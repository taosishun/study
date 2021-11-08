;(function ($) {
    //jQuery.extend() 函数用于将一个或多个对象的内容合并到目标对象。
    //如果只为$.extend()指定了一个参数，则意味着参数target被省略。此时，target就是jQuery对象本身。通过这种方式，我们可以为全局对象jQuery添加新的函数。
    //2. 如果多个对象具有相同的属性，则后者会覆盖前者的属性值。
    s
    $.extend({
        loader: function (cfg) {
            var _this = this;
            //入口函数
            this.init = function () {
                // createjs里面包含了preloadj,使用LoadQueue,创建一个LoadQueue实例(_this.preloader)。参数需要设置为true，否则不生效
                _this.preloader = new createjs.LoadQueue(true);
                _this.preloader._crossOrigin = true;
                //设置并发数 设置最大加载资源为100个
                _this.preloader.setMaxConnections(100);
                _this.preloader.maintainScriptOrder=true;
                //如果需要加载音频就需要注册soundjs插件 installPlugin 安装插件
                _this.preloader.installPlugin(createjs.Sound);
                //preloader里面提供了监听事件 .on监听事件 fileload(每个单独的文件加载完成时触发) 以及_this.handleFileLoaded(定义的监听函数名称)
                _this.preloader.on("fileload", _this.handleFileLoaded);
                //preloader里面提供了监听事件 .on监听事件 progress对于整个队列进展已经改变触发(文件加载进度) 以及_this.handleFileLoaded(定义的监听函数名称)
                 _this.preloader.on('progress', _this.handleLoading);
                //preloader里面提供了监听事件 .on监听事件 complete(当所有的文件都加载完成时触发) 以及_this._this.handleComplete(定义的监听函数名称)
                _this.preloader.on('complete', _this.handleComplete);
                // console.log(cfg.staticResource);
                //自定义函数获取静态资源
                _this.getStaticResource();
                // console.log(cfg.staticResource);
                //加载外部资源
                _this.preloader.loadManifest(cfg.staticResource);
                //页面bgmCtrl是否存在，存在就进判断，设置bgm图标如果index页提供了bgmCtrlIcon，
                //就使用bgmCtrlIcon，否则使用本页面的
                if (cfg.bgmCtrl) {
                    _this.bgmCtrlIcon = cfg.bgmCtrlIcon ? cfg.bgmCtrlIcon : [
                        {src: 'https://public.pannacloud.com/img/music-open.png', id: 'music-open'},
                        {src: 'https://public.pannacloud.com/img/music-close.png', id: 'music-close'}
                    ]
                    //然后加载外部资源
                    _this.preloader.loadManifest(_this.bgmCtrlIcon);
                }
            };
            //定义的获取静态资源函数
            this.getStaticResource = function () {
                //body查找class为.preload的元素
                var img = $('body').find('.preload');
                //遍历这个元素
                img.each(function () {
                    //设置一个item类
                    var item = {};
                    //把全局this赋值给self
                    var self = $(this);
                    //attr 只填一个参数为获取该参数元素的属性值，两个参数为设置该元素的属性值
                    //获取data-src的属性值
                    var datasrc = self.attr('data-src');
                    //设置data-id的属性值为获取到的data-src的属性
                    self.attr('data-id',datasrc);
                    //如果存在datasrc
                    if(datasrc){
                        //把datasrc的值赋值给item的src
                        item.src = datasrc;
                        //把datasrc的值赋值给item的id
                        item.id = datasrc;
                        //加载外部资源，将itempush 到staticResource 也就是主页面的sourceData中
                        cfg.staticResource.push(item);
                    }
                });
                //获取body中class为 .prelaodBg的元素
                var imgBg = $('body').find('.preloadBg');
                //遍历这个元素
                imgBg.each(function () {
                    var item = {};
                    var self = $(this);
                    var datasrc = self.attr('data-src');
                    self.attr('data-id',datasrc);
                    if(datasrc){
                        item.src = datasrc;
                        item.id = datasrc;
                        cfg.staticResource.push(item);
                    }
                });
            };
            //单个元素加载完成出发的函数，如果index页面设置了handleFileLoaded 就使用handleFileLoaded(event)
            //这样写的意义是如果主页面设置了handleFileLoaded，就可以把handleFileLoaded中暴露出的参数带过去使用
            this.handleFileLoaded = function (event) {
                cfg.handleFileLoaded && cfg.handleFileLoaded(event);
            };
            //对于整个队列进展已经改变触发(文件加载进度)
            this.handleLoading = function (evt) {
                cfg.handleLoading && cfg.handleLoading(evt);
            };
            //所有文件加载完成触发
            this.handleComplete = function () {
                //使用传入的 src创建一个抽象声音实例
                _this.bgm = createjs.Sound.createInstance("bgm");
                //播放
                _this.audioAuto();
                //如果是在微信环境下走这里 loop循环次数
                if (window.WeixinJSBridge) {
                    WeixinJSBridge.invoke('getNetworkType', {}, function (e) {
                        _this.bgm.play({loop: 99});
                    });
                    //否则走这里
                } else {
                    _this.bgm.play({loop: 99});
                }

                //遍历图片标签
                //body查找class为.preload的元素
                var img = $('body').find('.preload');
                img.each(function () {
                    //如果没有报错
                    try {
                        var self = $(this);
                        //获取当前data-id的属性值
                        var dataid = self.attr('data-id');
                        //通过dataid来找出加载的图片
                        var imageblob = _this.preloader.getResult(dataid, true);
                        var imgWidth = _this.preloader.getResult(dataid).width;
                        //通过找出来的图片创建一个指向该对象的路径
                        var src = window.URL.createObjectURL(imageblob);
                        //设置给当前img的src
                        self.attr('src', src);
                        //如果有noResize类 做rem适配
                        if (!self.hasClass('noResize')) {
                            self.css({'width': imgWidth / 100 + 'rem'});
                        }
                        //如果有_sCenter类 做居中显示
                        // 是否设置center
                        if(self.hasClass('_sCenter')){
                            self.css({'left':'50%'});
                            self.css({'margin-left':-imgWidth/100/2 +'rem'});
                        }
                    } catch (err) {
                        console.log('dataid为'+dataid+'的资源出错。')
                    }

                });

                //遍历背景图片
                var imgbg = $('body').find('.preloadBg');
                imgbg.each(function () {
                    var self = $(this);
                    var dataid = self.attr('data-id');
                    var imageblob = _this.preloader.getResult(dataid, true);
                    var src = window.URL.createObjectURL(imageblob);
                    self.css('background-image', 'url(' + src + ')');
                });

                if (cfg.bgmCtrl) {
                    _this.musicCtrl()
                }

                var lt = setTimeout(function () {
                    cfg.handleComplete && cfg.handleComplete();
                    clearTimeout(lt);
                },500)

            };


            //自动播放
            this.audioAuto = function () {
                wx.ready(function () {

                });
            };


            //添加音乐控制图标
            this.musicCtrl = function () {
                var openSrc = window.URL.createObjectURL(_this.preloader.getResult('music-open', true));
                var closeSrc = window.URL.createObjectURL(_this.preloader.getResult('music-close', true));
                //页面没有#musicBtn类的元素，就使用这个
                if (!$("#musicBtn").length) {
                    $("body").prepend("<a href='javascript:;' class='musicBtn music_open' id='musicBtn'></a>");
                    $("#musicBtn").css('background-image', "url(" + openSrc + ")");
                }
                //添加一个visibilitychange的方法，获取当前页面是否是显示还是隐藏
                document.addEventListener('visibilitychange', function () {
                    var isHidden = document.hidden
                    //如果隐藏了 就暂停背景音乐
                    if (isHidden) {
                        _this.bgm.paused = true
                        // 如果要关闭页面释放下面的注释
                        // WeixinJSBridge.call('closeWindow')
                        //否则先查找id为musicBtn的元素上有没有music_open这个class ，有就播放背景音乐
                    } else {
                        if ($("#musicBtn").hasClass("music_open")) {
                            _this.bgm.paused = false
                        }
                    }
                })
                //点击背景音乐icon 暂停和播放bgm函数
                $("#musicBtn").click(function () {
                    if (_this.bgm.paused) {
                        _this.bgm.paused = false;
                        $("#musicBtn").addClass("music_open");
                        $("#musicBtn").css('background-image', "url(" + openSrc + ")");
                    } else {
                        _this.bgm.paused = true;
                        $("#musicBtn").removeClass("music_open");
                        $("#musicBtn").css('background-image', "url(" + closeSrc + ")");
                    }
                });
            };

            this.init();
            return this
        }
    })
})(jQuery)