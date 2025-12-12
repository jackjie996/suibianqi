/*
音乐信息

感谢 @武恩赐 提供的 MetingAPI
https://api.wuenci.com/meting/api/

作者: imsyy
主页：https://www.imsyy.top/
GitHub：https://github.com/imsyy/home
版权所有，请勿删除
*/

// 音乐配置
let server = "tencent"; //netease: 网易云音乐; tencent: QQ音乐; kugou: 酷狗音乐; xiami: 虾米; kuwo: 酷我
let type = "playlist"; //song: 单曲; playlist: 歌单; album: 唱片
let id = "2751969066"; //封面 ID / 单曲 ID / 歌单 ID

// 备用音乐列表
const backupMusicList = [
    {
        name: "秋殇别恋",
        artist: "牙牙乐/格子兮",
        url: "./mp3/qiushangbielian.mp3",
        cover: "",
        lrc: ""
    }
];

// 尝试从API获取音乐列表，如果失败则使用备用列表
$.ajax({
    url: "https://api.wuenci.com/meting/api/?server=" + server + "&type=" + type + "&id=" + id,
    type: "GET",
    dataType: "JSON",
    timeout: 5000,
    success: function(data) {
        if (Array.isArray(data) && data.length > 0) {
            initPlayer(data);
        } else {
            initPlayer(backupMusicList);
        }
    },
    error: function() {
        initPlayer(backupMusicList);
    }
});

// 初始化播放器函数
function initPlayer(musicList) {
    const ap = new APlayer({
        container: document.getElementById('aplayer'),
        order: 'random',
        preload: 'auto',
        listMaxHeight: '336px',
        volume: '0.5',
        mutex: true,
        lrcType: 3,
        audio: musicList,
        autoplay: true
    });

    /* 底栏歌词（已关闭） */
    /* setInterval(function() {
        const lrcText = $('.aplayer-lrc-current').text();
        $('#lrc').html('<span class="lrc-show"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18"><path fill="none" d="M0 0h24v24H0z"/><path d="M12 13.535V3h8v3h-6v11a4 4 0 1 1-2-3.465z" fill="rgba(255,255,255,1)"/></svg>&nbsp;' + lrcText + '&nbsp;<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18"><path fill="none" d="M0 0h24v24H0z"/><path d="M12 13.535V3h8v3h-6v11a4 4 0 1 1-2-3.465z" fill="rgba(255,255,255,1)"/></svg></span>');
    }, 500); */
    
    // 确保歌词显示区域被隐藏
    $('#lrc').css('display', 'none !important');

    /* 音乐通知及控制 */
    ap.on('play', function() {
        const music = $('.aplayer-title').text() + $('.aplayer-author').text();
        iziToast.info({
            timeout: 4000,
            icon: "fa-solid fa-circle-play",
            displayMode: 'replace',
            message: music
        });
        $('#play').html('<i class="fa-solid fa-pause"></i>');
        $('#music-name').html(music);
        if ($(document).width() >= 990) {
            $('.power').css('display', 'block');
            // 保持歌词区域隐藏
            $('#lrc').css('display', 'none !important');
        }
    });

    ap.on('pause', function() {
        $('#play').html('<i class="fa-solid fa-play"></i>');
        if ($(document).width() >= 990) {
            $('#lrc').css('display', 'none !important');
            $('.power').css('display', 'block');
        }
    });

    // 音量控制悬停效果
    $('#music').hover(function() {
        $('.music-text').css('display', 'none');
        $('.music-volume').css('display', 'flex');
    }, function() {
        $('.music-text').css('display', 'block');
        $('.music-volume').css('display', 'none');
    });

    /* 一言与音乐切换 */
    $('#open-music').on('click', function() {
        $('#hitokoto').css('display', 'none');
        $('#music').css('display', 'flex');
    });

    $('#hitokoto').hover(function() {
        $('#open-music').css('display', 'flex');
    }, function() {
        $('#open-music').css('display', 'none');
    });

    $('#music-close').on('click', function() {
        $('#music').css('display', 'none');
        $('#hitokoto').css('display', 'flex');
    });

    /* 播放控制 */
    $('#play').on('click', function() {
        ap.toggle();
        const music = $('.aplayer-title').text() + $('.aplayer-author').text();
        $('#music-name').html(music);
    });

    $('#last').on('click', function() {
        ap.skipBack();
        ap.play();
        const music = $('.aplayer-title').text() + $('.aplayer-author').text();
        $('#music-name').html(music);
    });

    $('#next').on('click', function() {
        ap.skipForward();
        ap.play();
        const music = $('.aplayer-title').text() + $('.aplayer-author').text();
        $('#music-name').html(music);
    });

    // 键盘控制（空格键播放/暂停）
    window.onkeydown = function(e) {
        if (e.keyCode == 32) {
            ap.toggle();
        }
    };

    /* 打开音乐列表 */
    $('#music-open').on('click', function() {
        if ($(document).width() >= 990) {
            $('#box').css('display', 'block');
            $('#row').css('display', 'none');
            $('#more').css('display', 'none !important');
        }
    });

    // 音量调节
    $('#volume').on('input propertychange touchend', function() {
        const volume = parseFloat($('#volume').val());
        ap.volume(volume, true);
        if (volume === 0) {
            $('#volume-ico').html('<i class="fa-solid fa-volume-xmark"></i>');
        } else if (volume > 0 && volume <= 0.3) {
            $('#volume-ico').html('<i class="fa-solid fa-volume-off"></i>');
        } else if (volume > 0.3 && volume <= 0.6) {
            $('#volume-ico').html('<i class="fa-solid fa-volume-low"></i>');
        } else {
            $('#volume-ico').html('<i class="fa-solid fa-volume-high"></i>');
        }
    });
}