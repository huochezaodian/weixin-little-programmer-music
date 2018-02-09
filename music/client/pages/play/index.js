// pages/play/index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
var ParseLrc = require('../../utils/parseLrc.js').parseLrc

Page({

  /**
   * 页面的初始数据
   */
  data: {
    poster: '',
    name: '',
    author: '',
    src: '',
    status: 'pause',
    progress: '0',
    currentTime: 0,
    time: '0:00',
    sec:0,
    top: 59,
    totalTime: '0:00',
    lrcObj:{},
    lrcList:[]
  },
  onLoad (options) {
    const data = options.info;
    const json = JSON.parse(data);
    this.setData({
      poster: "http://y.gtimg.cn/music/photo_new/T002R300x300M000"+ json.albummid +".jpg?max_age=2592000",
      name: json.name,
      author: json.author
    });
    this.getVkey(json.songmid);
    this.getLrc(json.songmid);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady () {
    // 使用 wx.createAudioContext 获取 audio 上下文 context
    this.audioCtx = wx.createAudioContext('myAudio');
  },
  // 获取vkey
  getVkey (mid) {
    const that = this;
    const t = new Date().getUTCMilliseconds()
    const guid = Math.round(2147483647 * Math.random()) * t % 1e10;
    const params = {
      cid: '205361747',
      songmid: mid,
      guid,
      uin: '1461476694'
    };
    qcloud.request({
      login: false,
      data: { ...params },
      url: config.service.vkeyMusicUrl,
      success(result) {
        console.log('play', result);
        const data = result.data.data.data;
        const url = 'http://dl.stream.qqmusic.qq.com/' + data.items[0].filename + '?vkey=' + data.items[0].vkey + '&guid=' + params.guid + '&uin=' + params.uin +'&fromtag=46';
        that.setData({
          src: url
        });
      },

      fail(error) {
        util.showModel('请求失败', error);
        console.log('request fail', error);
      }
    })
  },
  // 获取lrc
  getLrc(mid) {
    const that = this;
    qcloud.request({
      login: false,
      data: { songmid: mid },
      url: config.service.lrcMusicUrl,
      success(result) {
        console.log('lrc', result);
        const data = result.data.data.lyric;
        if(data == ''){
          that.setData({
            lrcList:[{time:-1,txt:'暂无歌词'}]
          });
        }
        console.log(ParseLrc(data));
        let lrc = ParseLrc(data);
        let lrcList = [];
        Object.keys(lrc).map(item => {
          lrcList.push({
            time: item,
            txt: lrc[item].txt
          })
        });
        that.setData({
          lrcList,
          lrcObj: lrc
        });
      },

      fail(error) {
        util.showModel('请求失败', error);
        console.log('request fail', error);
        that.setData({
          lrcList: [{ time: -1, txt: '暂无歌词' }]
        });
      }
    })
  },
  handleError(detail) {
    util.showModel('请求失败', detail);
  },
  // 后退
  handleRewind(){
    this.audioCtx.seek(this.data.currentTime - 5);
  },
  // 播放/暂停
  handlePlay() {
    if(this.data.status == "play"){
      this.audioCtx.pause();
      this.setData({
        status: 'pause'
      });
    }else{
      this.audioCtx.play();
      this.setData({
        status: 'play'
      });
    }
  },
  // 前进
  handleForward() {
    this.audioCtx.seek(this.data.currentTime + 5);
  },
  // 重置
  handleReset() {
    this.audioCtx.seek(0);
  },
  // 进度
  handleProgress(e) {
    let time = this.handleTime(e.detail.currentTime);
    let totalTime = this.handleTime(e.detail.duration);
    let progress = (e.detail.currentTime / e.detail.duration) * 100 + '%';
    let cur = parseInt(e.detail.currentTime);
    this.setData({
      time,
      currentTime: e.detail.currentTime,
      top: this.handleTop(cur),
      sec: this.handleActive(cur),
      totalTime,
      progress
    });
  },
  //滚动歌词
  handleTop(cur){
    let top = this.data.top,
        lrc = this.data.lrcObj;
    if(lrc[cur] !== undefined){
      return 59 - lrc[cur].index * 30;
    }else{
      return top;
    }
  },
  //歌词高亮
  handleActive(cur) {
    let sec = this.data.sec,
        lrc = this.data.lrcObj;
    if (lrc[cur] !== undefined) {
      return cur;
    } else {
      return sec;
    }
  },
  handleTime(time){
    let newTime = parseInt(time);
    let m = parseInt(newTime/60);
    let s = newTime%60;
    s = s > 9 ? s : '0' + s;
    return m+ ':' + s; 
  }
})