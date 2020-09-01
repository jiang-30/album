import { Config } from 'config.js';

class Token {
  constructor(){
    this.verifyUrl = Config.restUrl + 'token/verify';
    this.tokenUrl = Config.restUrl + 'token/user';
  }

  verify() {
    var token = wx.getStorageSync('token');
    console.log('tolkene');
    console.log(token);
    //if (!token) {
      this.getTokenFromServer();
    //}
    //else {
    //  this._veirfyFromServer(token);
   // } 
  }

 // 携带令牌去服务器校验令牌
  _veirfyFromServer(token) {
    var that = this;
    wx.request({
      url: that.verifyUrl,
      method: 'POST',
      data: {
        token: token
      },
      success: function (res) {
        var valid = res.data.isValid;
        if (!valid) {
          that.getTokenFromServer();
        }
      }
    })
  }

  //从服务器获取token
  getTokenFromServer(callBack) {
    var that = this;console.log('getTokenFromServer');
    wx.login({
      success: function (res) {
        console.log('login'); console.log(res);
        wx.request({
          url: that.tokenUrl,
          method: 'POST',
          data: {
            code: res.code
          },
          success: function (data) {
            console.log('token'); console.log(data);
            wx.setStorageSync('token', data.data.token);
            callBack && callBack(data.data.token);
          }
        })
      }
    })
  }
}

export {Token};