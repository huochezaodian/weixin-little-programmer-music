/*
  使用http从qq音乐拉取音乐信息
 */
const https = require('https');
const iconv = require('iconv-lite');
const { URL } = require('url');

class Crawler {
  constructor() {
    this.musicList = null;
    this.vkeyInfo = null;
    this.lrc = null;
    this.urlConfig = {
      'song_list': 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg',
      'song_search': 'https://c.y.qq.com/soso/fcgi-bin/client_search_cp',
      'song_vkey': 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg',
      'song_lrc': 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
    }
  }
  // 获取热歌歌曲列表
  initTotalList(params) {
    return new Promise(resolve => {
      const start = params.start || 0;
      const num = params.num || 10;
      const url = this.urlConfig.song_list + '?topid=26&song_begin=' + start + '&song_num=' + num;
      console.log(url);
      https.get(url, res => {
        let chunks = [];
        res.on('data', chunk => { chunks.push(chunk) });
        res.on('end', () => {
          let Data = iconv.decode(Buffer.concat(chunks), 'utf8');
          Data = Data.split('\n');
          // Data.pop();
          Data = Data.join('').replace(/^\w*\((.*?)\)$/, '$1');
          // 非严格模式不能用JSON.parse
          const parsedData = eval('(' + Data + ')');
          this.musicList = parsedData;
          resolve();
        });
      })
    })
  }
  // 获取新歌歌曲列表
  initNewList(params) {
    return new Promise(resolve => {
      const start = params.start || 0;
      const num = params.num || 10;
      const url = this.urlConfig.song_list + '?topid=27&song_begin=' + start + '&song_num=' + num;
      console.log(url);
      https.get(url, res => {
        let chunks = [];
        res.on('data', chunk => { chunks.push(chunk); });
        res.on('end', () => {
          let Data = iconv.decode(Buffer.concat(chunks), 'utf8');
          Data = Data.split('\n');
          // Data.pop();
          Data = Data.join('').replace(/^\w*\((.*?)\)$/, '$1');
          // 非严格模式不能用JSON.parse
          const parsedData = eval('(' + Data + ')');
          this.musicList = parsedData;
          resolve();
        });
      })
    })
  }
  // 搜索音乐
  searchMusic(params) {
    return new Promise(resolve => {
      const p = params.page || 1;
      const num = params.num || 10;
      const name = params.name || '';
      const url = this.urlConfig.song_search + '?p=' + p + '&w=' + name + '&n=' + num;
      const options = new URL(url);
      console.log(url, options);
      https.get(options, res => {
        let chunks = [];
        res.on('data', chunk => { chunks.push(chunk); });
        res.on('end', () => {
          let Data = iconv.decode(Buffer.concat(chunks), 'utf8');
          Data = Data.split('\n');
          // Data.pop();
          Data = Data.join('').replace(/^\w*\((.*?)\)$/, '$1');
          // 非严格模式不能用JSON.parse
          const parsedData = eval('(' + Data + ')');
          this.musicList = parsedData;
          resolve();
        });
      });
    })
  }
  // 搜索音乐vkey
  vkeyMusic(params) {
    return new Promise(resolve => {
      const cid = params.cid || '205361747';
      const songmid = params.songmid || '';
      const filename = 'C400' + songmid + '.m4a';
      const guid = params.guid || '7668421424';
      const url = this.urlConfig.song_vkey + '?cid=' + cid + '&songmid=' + songmid + '&filename=' + filename + '&guid=' + guid;
      const options = new URL(url);
      console.log(url, options);
      https.get(options, res => {
        let chunks = [];
        res.on('data', chunk => { chunks.push(chunk); });
        res.on('end', () => {
          let Data = iconv.decode(Buffer.concat(chunks), 'utf8');
          Data = Data.split('\n');
          // Data.pop();
          Data = Data.join('').replace(/^\w*\((.*?)\)$/, '$1');
          // 非严格模式不能用JSON.parse
          const parsedData = eval('(' + Data + ')');
          this.vkeyInfo = parsedData;
          resolve();
        });
      });
    })
  }
  // 搜索音乐lrc
  lrcMusic(params) {
    return new Promise(resolve => {
      const songmid = params.songmid || '';
      const url = this.urlConfig.song_lrc + '?songmid=' + songmid;
      const options = new URL(url);
      const newOptions = {
        hostname: options.hostname,
        path: options.pathname + options.search,
        headers: {
          "referer": "https://y.qq.com/portal/player.html"
        }
      };
      console.log(url);
      https.get(newOptions, res => {
        let chunks = [];
        res.on('data', chunk => { chunks.push(chunk); });
        res.on('end', () => {
          console.log(chunks);
          let buf1 = Buffer.concat(chunks);
          let Data = iconv.decode(buf1, 'utf8');
          console.log('3', Data);
          Data = Data.split('\n');
          // Data.pop();
          Data = Data.join('').replace(/^\w*\((.*?)\)$/, '$1');
          // 非严格模式不能用JSON.parse
          const parsedData = eval('(' + Data + ')');
          //解析base64
          let buf2 = Buffer.from(parsedData.lyric, 'base64');
          parsedData.lyric = buf2.toString();
          this.lrc = parsedData;
          resolve();
        });
      });
    })
  }
}

module.exports = Crawler;