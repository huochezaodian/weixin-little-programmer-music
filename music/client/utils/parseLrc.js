module.exports = {
  parseLrc : (lrc) => {
    let lrcObj = {},
        lrcArray = lrc.split("\n"),
        timeReg = /\[\d*:\d*((\.|\:)\d*)*\]/g,
        count = 0;

    lrcArray.map((item, idx) => {
      let timeRegExpArr = item.match(timeReg);
      if(!timeRegExpArr) return;

      let clause = item.replace(timeReg, '');
      if(clause == '')return;
      timeRegExpArr.map(timeStr => {
        let min = Number(String(timeStr.match(/\[\d*/i)).slice(1)),
            sec = Number(String(timeStr.match(/\:\d*/i)).slice(1));
        let time = min * 60 + sec;
        //保存解析后的歌词信息对象
        if(lrcObj[time] !== undefined){
          return;
        }
        lrcObj[time] = {
          txt: clause,
          index: count++
        };
      })
    });
    
    return lrcObj;
  }
}