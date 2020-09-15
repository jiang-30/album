import { getAlbumListPage } from '../../api/album/album'
const app = getApp()

Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    page: {
      size: 10,
      current: 1,
      total: 0,
      list: []
    },
    list: []
  },
  onLoad: function() {
    this.fetchData()

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
  },
  onPullDownRefresh(){
    console.log('refresh')
  },
  onReachBottom(){
    console.log('bottom')
  },
  onNav(e){
    const path = e.currentTarget.dataset.path
    switch(path){
      case 'user':
        wx.navigateTo({
          url: '/pages/user/user',
        })
        break
      case 'albumDetail':
        wx.navigateTo({
          url: '/pages/album/album',
        })
        break
      case 'create':
        wx.navigateTo({
          url: '/pages/album-create/album-create',
        })
        break
      default:
        console.warn('error path:' + path)
    }
    
  },
  fetchData(){
    getAlbumListPage({
      page: this.data.page.current,
      size: this.data.page.size,
    }).then(res => {
      console.log('res', res)
      this.setData({
        'list': res.data
      })
    }).catch(error => {
      console.warn('error', error)
    })
  },
  onGetUserInfo: function(e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]
        
        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath
            
            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },

})
