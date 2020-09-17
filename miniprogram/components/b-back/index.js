// components/b-back/index.js
Component({

  properties: {

  },

  data: {
    statusBarHeight: 20
  },
  created(){
    let systemInfo =  wx.getSystemInfoSync()
    this.setData({
      statusBarHeight: systemInfo.statusBarHeight
    })
  }

})
