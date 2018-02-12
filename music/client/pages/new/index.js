//index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
  data: {
    num:10,
    topinfo: {},
    songlist: []
  },
  onLoad() {
    this.update();
  },
  onPullDownRefresh() {
    this.update(() => {
      wx.stopPullDownRefresh();
    });
  },
  update(cb) {
    const that = this;
    const num = this.data.num;
    qcloud.request({
      login: false,
      data:{ num },
      url: config.service.newMusicUrl,
      success(result) {
        const data = result.data.data;
        data.topinfo.info = data.topinfo.info.split(/(?:\<br\>)+/);
        data.songlist.map(item => {
          item.data.imageurl = "http://y.gtimg.cn/music/photo_new/T002R150x150M000" + item.data.albummid + ".jpg?max_age=2592000";
          let singers = [];
          item.data.singer.map(sin => {
            singers.push(sin.name);
          });
          item.data.singers = singers.join(',');
          return item;
        });
        console.log('new',data);
        that.setData({
          topinfo: data.topinfo,
          songlist: data.songlist
        });
        cb && cb();
      },

      fail(error) {
        util.showModel('请求失败', error);
        console.log('request fail', error);
        cb && cb();
      }
    })
  },
  play(e) {
    const data = e.currentTarget.dataset.item;
    const newData = {
      albummid: data.data.albummid,
      name: data.data.songname,
      author: data.data.singers,
      songmid: data.data.songmid
    };
    console.log(data);
    wx.navigateTo({
      url: '/pages/play/index?info=' + JSON.stringify(newData)
    });
  },
  onReachBottom() {
    let num = this.data.num;
    if (num == 100) return;
    num += 10;
    this.setData({
      num
    });
    this.update();
  }
})
