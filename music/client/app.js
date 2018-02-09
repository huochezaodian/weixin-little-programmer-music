//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')

App({
    onLaunch (options) {
      console.log('launch', options);
      qcloud.setLoginUrl(config.service.loginUrl);
    },
    onShow (options) {
      console.log('show', options);
    },
    onHide () {
      console.log('hide');
    },
    onError (err) {
      console.log('err', err);
    }
})