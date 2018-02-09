/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
var host = 'https://5gzbnbin.qcloud.la';

var config = {

    // 下面的地址配合云端 Demo 工作
    service: {
        host,

        // 登录地址，用于建立会话
        loginUrl: `${host}/weapp/login`,

        // 测试的请求地址，用于测试会话
        requestUrl: `${host}/weapp/user`,

        // 热歌榜接口
        hotMusicUrl: `${host}/weapp/hotMusic`,

        // 新歌榜接口
        newMusicUrl: `${host}/weapp/newMusic`,

        // 搜索歌曲接口
        searchMusicUrl: `${host}/weapp/searchMusic`,

        // 搜索歌曲vkey接口
        vkeyMusicUrl: `${host}/weapp/vkeyMusic`,

        // 搜索歌曲lrc接口
        lrcMusicUrl: `${host}/weapp/lrcMusic`

    }
};

module.exports = config;
