import { chooseImage } from '../../utils/lib/choose-image'
const app = getApp();

Page({
  data: {
    album: {
      title: '',
      id: '',
    },
    list: []
  },
  onLoad: function () {
    console.log(wx.getStorageSync('newImages'))
    this.setData({
      list: wx.getStorageSync('newImages')
    })
  },
  onChooseAlbum(){
    wx.navigateTo({
      url: '/pages/album-list/album-list?type=choose',
    })
  },
  onDelete(e){
    let index = e.currentTarget.dataset.index
    this.setData({
      list: this.data.list.splice(index, 1)
    })
  },
  onAdd(){
    chooseImage().then(res => {
      console.log(res)
      this.setData({
        list: this.data.list.concat(res)
      })
    }).catch(err => {
      console.warn(err)
    })
  },
  onUpload(){
    console.log(this.data.list)
  }

})
