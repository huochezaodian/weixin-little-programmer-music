const Crawler = require('../tools/crawler.js');
const Crawl = new Crawler();

module.exports = {
  "hot" : async (ctx, next) => {
    const params = ctx.query;
    await Crawl.initTotalList(params);
    ctx.body = {
      data: Crawl.musicList
    }
  },
  "new": async (ctx, next) => {
    const params = ctx.query;
    await Crawl.initNewList(params);
    ctx.body = {
      data: Crawl.musicList
    }
  },
  "search": async (ctx, next) => {
    const params = ctx.query;
    await Crawl.searchMusic(params);
    ctx.body = {
      data: Crawl.musicList
    }
  },
  "vkey": async (ctx, next) => {
    const params = ctx.query;
    await Crawl.vkeyMusic(params);
    ctx.body = {
      data: Crawl.vkeyInfo
    }
  },
  "lrc": async (ctx, next) => {
    const params = ctx.query;
    await Crawl.lrcMusic(params);
    ctx.body = {
      data: Crawl.lrc
    }
  }
}
