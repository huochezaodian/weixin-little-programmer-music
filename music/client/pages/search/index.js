//index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
    timer:null,
    data: {
        songlist:[],
        num:10,
        word: '',
    },
    search (e) {
      const val = e.detail.value;
      const curTime = new Date().getTime();
      // 节流
      clearTimeout(this.timer);
      this.timer = setTimeout(()=>{
        this.setData({
          word: val
        });
        this.update();
      },500);
    },
    update () {
      const that = this;
      let { num, word } = this.data;
      qcloud.request({
        login: false,
        data: { "name": word, num },
        url: config.service.searchMusicUrl,
        success(result) {
          const data = result.data.data.data.song.list;
          data.map(item => {
            item.imageurl = "http://y.gtimg.cn/music/photo_new/T002R150x150M000" + item.albummid + ".jpg?max_age=2592000";
            let singers = [];
            item.singer.map(sin => {
              singers.push(sin.name);
            });
            item.singers = singers.join(',');
            return item;
          });
          console.log('search', data);
          that.setData({
            songlist: data
          });
        },

        fail(error) {
          util.showModel('请求失败', error);
          console.log('request fail', error);
        }
      })
    },
    play(e) {
      const data = e.currentTarget.dataset.item;
      const newData = {
        albummid: data.albummid,
        name: data.albumname,
        author: data.singers,
        songmid: data.songmid
      };
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
