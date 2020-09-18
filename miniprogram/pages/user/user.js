
Page({
  data: {

  },
  onLoad: function (options) {

  },
  onReward: function (e) {
    wx.showToast({
      title: '正在开发中...',
    })
  },
   onNavAlbum: function (e) {
    wx.navigateTo({
      url: '/pages/album-list/album-list',
    })
   },
   onNavAbout: function (e) {
    wx.navigateTo({
      url: '/pages/about/about',
    })
  },
})