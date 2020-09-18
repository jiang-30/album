App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    } else {
      wx.cloud.init({
        env: 'dev-53xgn',
        traceUser: true,
      })
    }
    let systemInfo = wx.getSystemInfoSync()
    this.globalData = {
      statusBarHeight: systemInfo.statusBarHeight
    }
  }
})
