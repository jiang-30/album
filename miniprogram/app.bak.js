import { Token } from 'utils/token.js';
import { Home } from 'utils/model/home-model.js';
var home = new Home();

App({
  onLaunch: function () {
    var token = new Token();
    token.verify();
    home.getHome((data)=>{
      console.log(data);
      wx.setStorageSync('config', data.data.config);
    })
  },
  globalData: {
    //头部自定义的高度
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'],
    userInfo: null
  }
})