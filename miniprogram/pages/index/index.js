import { getAlbumListPage } from '../../api/album/album'
import { chooseImage } from '../../utils/lib/choose-image'
const app = getApp()

Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    page: {
      status: 'placeholder',
      size: 10,
      current: 1,
      total: 0,
      loading: false,
      more: true
    },
    heightArr: [0, 0],
    list1: [],
    list2: []
  },
  onLoad: function() {
    this.fetchData()
  },
  onPullDownRefresh(){
    this.data.page.current = 1
    this.data.page.more = true
    this.data.heightArr = [0, 0]
    this.fetchData()
  },
  onReachBottom(){
    this.fetchData()
  },
  fetchData(){
    if(!this.data.page.more || this.data.page.loading) return
    this.data.page.loading = true
    if(this.data.page.current > 1){
      this.setData({ 'page.status': 'more-loading'})
    }
    getAlbumListPage({
      current: this.data.page.current,
      size: this.data.page.size,
    }).then(res => {
      console.log('res', res)
      let status = 'ok'
      let current = res.page.current
      let list = res.data
      let list1 = []
      let list2 = []
      list.forEach(item => {
        let height = item.cover.height * 360 / item.cover.width
        item.cover.h = height
        if(this.data.heightArr[0] > this.data.heightArr[1]){
          list2.push(item)
          this.data.heightArr[1] += height
        } else {
          list1.push(item)
          this.data.heightArr[0] += height
        }
      })
      if(res.page.more){
        current++
        status = 'more'
      } else if(res.page.total == 0) {
        status = 'empty'
      } else {
        status = 'more-no'
      }
      if(current > 1){
        list1 = this.data.list1.concat(list1)
        list2 = this.data.list2.concat(list2)
      }
      this.setData({
        'page.current': current,
        'page.size': res.page.size,
        'page.more': res.page.more,
        'page.total': res.page.total,
        'page.status': status,
        'list1': list1,
        'list2': list2,
      })
    }).catch(error => {
      console.warn('error', error)
      let status = this.data.page.current == 1 ?  'error' : 'more-error'
      this.setData({
        'page.status': status
      })
    }).then(() => {
      wx.stopPullDownRefresh()
      this.data.page.loading = false
    })
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
        
        break
      default:
        console.warn('error path:' + path)
    }
    
  },
  onAdd(){
    chooseImage().then(res => {
      wx.setStorageSync('newImages', res)
      wx.navigateTo({
        url: '/pages/album-create/album-create',
      })
    }).catch(err => {
      console.log(err)
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
