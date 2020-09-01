
Page({
  data: {

  },
  onLoad: function (options) {
    var userInfo = wx.getStorageSync("userInfo");
    this.setData({
      userInfo: userInfo
    });
    if (!userInfo.nickName) {
      this.setData({
        iShidden: false,
      });
    } else {
      this.setData({
        iShidden: true,
      });
    }
  },
  /**
   * 授权回调
  */
  onLoadFun:function(e){
    var userInfo = wx.getStorageSync("userInfo");
    this.setData({
      userInfo: userInfo
    });
  },
  bindtapVip: function (e) {
   wx.showToast({
     title: '正在开发中...',
   })
  },
  bindtapShang: function (e) {
    wx.showToast({
      title: '正在开发中...',
    })
   },
   bindtapSetting: function (e) {
    wx.showToast({
      title: '正在开发中...',
    })
   },
   //我的相册
   bindtapXiangce: function (e) {
    wx.navigateTo({
      url: 'my-album-lst',
    })
   },
   bindtapShouce: function (e) {
    wx.showToast({
      title: '正在开发中...',
    })
   },
   bindtapFeedback: function (e) {
    wx.showToast({
      title: '正在开发中...',
    })
   },
   bindtapLianxi: function (e) {
    var a = this;
    wx.showModal({
      title: "温馨提示",
      content: "您将复制QQ号:" + '1944978417',
      confirmColor: "#ffa500",
      showCancel: !1,
      success: function (t) {
        wx.setClipboardData({
          data: '1944978417'
        });
      }
    });
   },
  
   bindtapAbout: function (e) {
    wx.showToast({
      title: '正在开发中...',
    })
    //wx.navigateTo({
    //  url: '../my_about/about'
    //})
  },
  
  onShareAppMessage (option) {
    let config = wx.getStorageSync('config');
    console.log(config);
    return {
      title: config.sharetitle,
      path: 'pages/home/home',
      imageUrl: config.sharethumb
    }
  }
})