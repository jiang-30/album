Component({
  properties: {

  },
  data: {
    bottomStatusBarHeight: 0
  },
  created(){
    let systemInfo = wx.getSystemInfoSync()
    this.setData({
      bottomStatusBarHeight: systemInfo.screenHeight - systemInfo.safeArea.bottom
    })
  },
  methods: {

  }
})
