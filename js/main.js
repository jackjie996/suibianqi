/*
作者: imsyy
主页：https://www.imsyy.top/
GitHub：https://github.com/imsyy/home
版权所有，请勿删除
*/

// 全局配置和初始化
const App = {
    // 初始化应用
    init() {
        this.initIziToast();
        this.initMouseStyle();
        this.bindEvents();
        this.initFeatures();
        this.loadEventListeners();
    },

    // 初始化弹窗样式
    initIziToast() {
        iziToast.settings({
            timeout: 10000,
            progressBar: false,
            close: false,
            closeOnEscape: true,
            position: 'topCenter',
            transitionIn: 'bounceInDown',
            transitionOut: 'flipOutX',
            displayMode: 'replace',
            layout: '1',
            backgroundColor: '#00000040',
            titleColor: '#efefef',
            messageColor: '#efefef',
            icon: 'Fontawesome',
            iconColor: '#efefef',
        });
    },

    // 鼠标样式功能
    mouseStyle: {
        body: null,
        element: null,
        element2: null,
        halfAlementWidth: 0,
        halfAlementWidth2: 0,

        setPosition(x, y) {
            if (this.element2 && this.halfAlementWidth2) {
                this.element2.style.transform = `translate(${x - this.halfAlementWidth2 + 1}px, ${y - this.halfAlementWidth2 + 1}px)`;
            }
        },

        init() {
            this.body = document.querySelector("body");
            this.element = document.getElementById("g-pointer-1");
            this.element2 = document.getElementById("g-pointer-2");
            
            if (this.element && this.element2) {
                this.halfAlementWidth = this.element.offsetWidth / 2;
                this.halfAlementWidth2 = this.element2.offsetWidth / 2;
                
                this.body.addEventListener('mousemove', (e) => {
                    window.requestAnimationFrame(() => {
                        this.setPosition(e.clientX, e.clientY);
                    });
                });
            }
        }
    },

    // 初始化鼠标样式
    initMouseStyle() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.mouseStyle.init());
        } else {
            this.mouseStyle.init();
        }
    },

    // 绑定事件
    bindEvents() {
        // 页面加载完成事件
        window.addEventListener('load', () => this.onLoad());
        
        // 一言点击事件
        this.bindHitokotoEvents();
        
        // 天气点击事件
        this.bindWeatherEvents();
        
        // 社交链接事件
        this.bindSocialLinkEvents();
        
        // 页面切换事件
        this.bindPageSwitchEvents();
        
        // 移动端适配事件
        this.bindMobileEvents();
        
        // 更多页面事件
        this.bindMorePageEvents();
        
        // 右键屏蔽事件
        this.bindContextMenuEvent();
    },

    // 页面加载完成处理
    onLoad() {
        // 载入动画
        this.loadingAnimation();
        
        // 用户欢迎
        this.userWelcome();
        
        // 延迟加载音乐播放器
        this.loadMusicPlayer();
        
        // 移动端去除鼠标样式
        this.mobileMouseStyle();
    },

    // 载入动画
    loadingAnimation() {
        $('#loading-box').attr('class', 'loaded');
        $('#bg').css("cssText", "transform: scale(1);filter: blur(0px);transition: ease 1.5s;");
        $('.cover').css("cssText", "opacity: 1;transition: ease 1.5s;");
        $('#section').css("cssText", "transform: scale(1) !important;opacity: 1 !important;filter: blur(0px) !important");
    },

    // 用户欢迎
    userWelcome() {
        let now = new Date();
        let hour = now.getHours();
        let hello = '';
        if (hour < 6) {
            hello = '凌晨好';
        } else if (hour < 12) {
            hello = '早上好';
        } else if (hour < 14) {
            hello = '中午好';
        } else if (hour < 18) {
            hello = '下午好';
        } else if (hour < 22) {
            hello = '晚上好';
        } else {
            hello = '夜深了';
        }
        setTimeout(() => {
            iziToast.show({
                timeout: 2500,
                icon: false,
                title: hello,
                message: '欢迎来到我的主页'
            });
        }, 800);
    },

    // 延迟加载音乐播放器
    loadMusicPlayer() {
        let element = document.createElement("script");
        element.src = "./js/music.js";
        document.body.appendChild(element);
    },

    // 移动端去除鼠标样式
    mobileMouseStyle() {
        if (Boolean(window.navigator.userAgent.match(/AppWebKit.*Mobile.*/))) {
            $('#g-pointer-2').css("display", "none");
        }
    },

    // 初始化功能
    initFeatures() {
        // 获取一言
        this.getHitokoto();
        
        // 获取天气
        this.getWeather();
        
        // 获取时间
        this.initTime();
        
        // 自动变灰
        this.autoGrayscale();
        
        // 控制台输出
        this.consoleOutput();
    },

    // 一言功能
    hitokoto: {
        times: 0,
        apiUrl: 'https://v1.hitokoto.cn?max_length=24',

        fetch() {
            fetch(this.apiUrl)
                .then(response => response.json())
                .then(data => {
                    $('#hitokoto_text').html(data.hitokoto);
                    $('#from_text').html(data.from);
                })
                .catch(console.error);
        },

        clickHandler() {
            if (this.times === 0) {
                this.times = 1;
                let index = setInterval(() => {
                    this.times--;
                    if (this.times === 0) {
                        clearInterval(index);
                    }
                }, 1000);
                this.fetch();
            } else {
                iziToast.show({
                    timeout: 1000,
                    icon: "fa-solid fa-circle-exclamation",
                    message: '你点太快了吧'
                });
            }
        }
    },

    // 获取一言
    getHitokoto() {
        this.hitokoto.fetch();
    },

    // 绑定一言事件
    bindHitokotoEvents() {
        $('#hitokoto').click(() => this.hitokoto.clickHandler());
    },

    // 天气功能
    weather: {
        add_id: "vcpmlmqiqnjpxwq1", // app_id
        app_secret: "PeYnsesgkmK7qREhIFppIcsoN0ZShv3c", // app_secret
        key: "691d007d585841c09e9b41e79853ecc2", // key
        wea: 0,

        fetch() {
            fetch(`https://www.mxnzp.com/api/ip/self?app_id=${this.add_id}&app_secret=${this.app_secret}`)
                .then(response => response.json())
                .then(data => {
                    let str = data.data.city;
                    let city = str.replace(/市/g, '');
                    $('#city_text').html(city);
                    return fetch(`https://geoapi.qweather.com/v2/city/lookup?location=${city}&number=1&key=${this.key}`);
                })
                .then(response => response.json())
                .then(location => {
                    let id = location.location[0].id;
                    return fetch(`https://devapi.qweather.com/v7/weather/now?location=${id}&key=${this.key}`);
                })
                .then(response => response.json())
                .then(weather => {
                    $('#wea_text').html(weather.now.text);
                    $('#tem_text').html(weather.now.temp + "°C&nbsp;");
                    $('#win_text').html(weather.now.windDir);
                    $('#win_speed').html(weather.now.windScale + "级");
                })
                .catch(console.error);
        },

        clickHandler() {
            if (this.wea === 0) {
                this.wea = 1;
                let index = setInterval(() => {
                    this.wea--;
                    if (this.wea === 0) {
                        clearInterval(index);
                    }
                }, 60000);
                this.fetch();
                iziToast.show({
                    timeout: 2000,
                    icon: "fa-solid fa-cloud-sun",
                    message: '实时天气已更新'
                });
            } else {
                iziToast.show({
                    timeout: 1000,
                    icon: "fa-solid fa-circle-exclamation",
                    message: '请稍后再更新哦'
                });
            }
        }
    },

    // 获取天气
    getWeather() {
        this.weather.fetch();
    },

    // 绑定天气事件
    bindWeatherEvents() {
        $('#upWeather').click(() => this.weather.clickHandler());
    },

    // 时间功能
    time: {
        t: null,

        update() {
            clearTimeout(this.t);
            let dt = new Date();
            let y = dt.getFullYear();
            let mm = dt.getMonth() + 1;
            let d = dt.getDate();
            let weekday = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
            let day = dt.getDay();
            let h = dt.getHours();
            let m = dt.getMinutes();
            let s = dt.getSeconds();
            if (h < 10) h = "0" + h;
            if (m < 10) m = "0" + m;
            if (s < 10) s = "0" + s;
            
            $("#time").html(y + "&nbsp;年&nbsp;" + mm + "&nbsp;月&nbsp;" + d + "&nbsp;日&nbsp;" + "<span class='weekday'>" + weekday[day] + "</span><br>" + "<span class='time-text'>" + h + ":" + m + ":" + s + "</span>");
            this.t = setTimeout(() => this.update(), 1000);
        }
    },

    // 初始化时间
    initTime() {
        this.time.update();
    },

    // 社交链接功能
    socialLinks: {
        init() {
            // 社交链接容器事件
            $("#social").mouseover(() => {
                $("#social").css({
                    "background": "rgb(0 0 0 / 25%)",
                    'border-radius': '6px',
                    "backdrop-filter": "blur(5px)"
                });
                $("#link-text").css({ "display": "block" });
            }).mouseout(() => {
                $("#social").css({
                    "background": "none",
                    "border-radius": "6px",
                    "backdrop-filter": "none"
                });
                $("#link-text").css({ "display": "none" });
            });

            // 为存在的社交链接添加提示文字
            const links = [
                { id: "github", tip: "去 Github 看看" },
                { id: "qq", tip: "有什么事吗" },
                { id: "email", tip: "来封 Email" },
                { id: "bilibili", tip: "来 B 站看看 ~" },
                { id: "facebook", tip: "来 Facebook 看看" }
            ];
            
            links.forEach(link => {
                const element = $(`#${link.id}`);
                if (element.length > 0) {
                    element.mouseover(() => {
                        $("#link-text").html(link.tip);
                    }).mouseout(() => {
                        $("#link-text").html("通过这里联系我");
                    });
                }
            });
        }
    },

    // 绑定社交链接事件
    bindSocialLinkEvents() {
        this.socialLinks.init();
    },

    // 自动变灰功能
    autoGrayscale() {
        let myDate = new Date();
        let mon = myDate.getMonth() + 1;
        let date = myDate.getDate();
        let days = ['4.4', '5.12', '7.7', '9.9', '9.18', '12.13'];
        for (let day of days) {
            let d = day.split('.');
            if (mon == d[0] && date == d[1]) {
                document.write(
                    '<style>html{-webkit-filter:grayscale(100%);-moz-filter:grayscale(100%);-ms-filter:grayscale(100%);-o-filter:grayscale(100%);filter:progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);_filter:none}</style>'
                );
                $("#change").html("Silence&nbsp;in&nbsp;silence");
                $("#change1").html("今天是中国国家纪念日，全站已切换为黑白模式");
                window.addEventListener('load', () => {
                    setTimeout(() => {
                        iziToast.show({
                            timeout: 14000,
                            icon: "fa-solid fa-clock",
                            message: '今天是中国国家纪念日'
                        });
                    }, 3800);
                }, false);
            }
        }
    },

    // 页面切换功能
    pageSwitch: {
        shoemore: false,

        init() {
            // 更多页面切换
            $('#switchmore').on('click', () => {
                this.shoemore = !this.shoemore;
                if (this.shoemore && $(document).width() >= 990) {
                    $('#container').attr('class', 'container mores');
                    $("#change").html("Oops&nbsp;!");
                    $("#change1").html("哎呀，这都被你发现了（ 再点击一次可关闭 ）");
                } else {
                    $('#container').attr('class', 'container');
                    $("#change").html("Hello&nbsp;World&nbsp;!");
                    $("#change1").html("一个建立于 21 世纪的小站，存活于互联网的边缘");
                }
            });

            // 更多页面关闭按钮
            $('#close').on('click', () => {
                $('#switchmore').click();
            });

            // 更多页面显示关闭按钮
            $("#more").hover(() => {
                $('#close').css("display", "block");
            }, () => {
                $('#close').css("display", "none");
            });
        }
    },

    // 绑定页面切换事件
    bindPageSwitchEvents() {
        this.pageSwitch.init();
    },

    // 移动端功能
    mobile: {
        switchmenu: false,
        changemore: false,

        init() {
            // 移动端菜单栏切换
            $('#switchmenu').on('click', () => {
                this.switchmenu = !this.switchmenu;
                if (this.switchmenu) {
                    $('#row').attr('class', 'row menus');
                    $("#menu").html("<i class='fa-solid fa-xmark'></i>");
                } else {
                    $('#row').attr('class', 'row');
                    $("#menu").html("<i class='fa-solid fa-bars'></i>");
                }
            });

            // 移动端切换功能区
            $('#changemore').on('click', () => {
                this.changemore = !this.changemore;
                if (this.changemore) {
                    $('#rightone').attr('class', 'row menus mobile');
                } else {
                    $('#rightone').attr('class', 'row menus');
                }
            });
        },

        resizeHandler() {
            // 关闭移动端样式
            if (window.innerWidth >= 600) {
                $('#row').attr('class', 'row');
                $("#menu").html("<i class='fa-solid fa-bars'></i>");
                // 移除移动端切换功能区
                $('#rightone').attr('class', 'row rightone');
            }

            if (window.innerWidth <= 990) {
                // 移动端隐藏更多页面
                $('#container').attr('class', 'container');
                $("#change").html("Hello&nbsp;World&nbsp;!");
                $("#change1").html("一个建立于 21 世纪的小站，存活于互联网的边缘");

                // 移动端隐藏弹窗页面
                $('#box').css("display", "none");
                $('#row').css("display", "flex");
                $('#more').css("display", "flex");
            }
        }
    },

    // 绑定移动端事件
    bindMobileEvents() {
        this.mobile.init();
    },

    // 更多弹窗页面功能
    morePopup: {
        init() {
            // 更多弹窗页面
            $('#openmore').on('click', () => {
                $('#box').css("display", "block");
                $('#row').css("display", "none");
                $('#more').css("cssText", "display:none !important");
            });
            $('#closemore').on('click', () => {
                $('#box').css("display", "none");
                $('#row').css("display", "flex");
                $('#more').css("display", "flex");
            });
        }
    },

    // 绑定更多页面事件
    bindMorePageEvents() {
        this.morePopup.init();
    },

    // 右键屏蔽功能
    bindContextMenuEvent() {
        document.oncontextmenu = () => {
            iziToast.show({
                timeout: 2000,
                icon: "fa-solid fa-circle-exclamation",
                message: '为了浏览体验，本站禁用右键'
            });
            return false;
        };
    },

    // 控制台输出功能
    consoleOutput() {
        // console.clear();
        let styleTitle1 = `
font-size: 20px;
font-weight: 600;
color: rgb(244,167,89);
`;
        let styleTitle2 = `
font-size:12px;
color: #425AEF;
`;
        let styleContent = `
color: rgb(30,152,255);
`;
        let title1 = 'Auroraの主页';
        let title2 = `

██████╗ ██╗   ██╗██╗    ██╗██╗███╗   ██╗██████╗ 
██╔══██╗╚██╗ ██╔╝██║    ██║██║████╗  ██║██╔══██╗
██████╔╝ ╚████╔╝ ██║ █╗ ██║██║██╔██╗ ██║██║  ██║
██╔══██╗  ╚██╔╝  ██║███╗██║██║██║╚██╗██║██║  ██║
██████╔╝   ██║   ╚███╔███╔╝██║██║ ╚████║██████╔╝
╚═════╝    ╚═╝    ╚══╝╚══╝ ╚═╝╚═╝  ╚═══╝╚═════╝                
`;
        let content = `
博客:  https://bolo.wuhobin.top
Github:  https://github.com/wuhobin
`;
        console.log(`%c${title1} %c${title2}
%c${content}`, styleTitle1, styleTitle2, styleContent);
    },

    // 加载事件监听器
    loadEventListeners() {
        // 监听网页宽度
        window.addEventListener('resize', () => this.mobile.resizeHandler());
        
        // 加载提示文字
        setTimeout(() => {
            const loadingText = document.getElementById('loading-text');
            if (loadingText) {
                loadingText.innerHTML = "字体及文件加载可能需要一定时间";
            }
        }, 3000);
    }
};

// 初始化应用
App.init();
