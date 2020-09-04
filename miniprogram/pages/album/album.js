import { createAlbum, updateAlbum, getAlbumDetail } from '../../api/album/album'
let defaultTitle = '新建相册'

Page({
  data: {
    id: '',
    info: {
      title: '',
      list: [],
    },
    mode: 'normal', // normal operation
  },
  onLoad: function (options) {
    if(options.id){
      this.data.id = options.id
      this.fetchData()
    } else {
      wx.setNavigationBarTitle({
        title: defaultTitle,
      })
    }
  },
  fetchData(){
    getAlbumDetail(this.data.id)
      .then((res) => {
        console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
  },
  onInfoChange(e){

  },
  onUpload(){
    wx.showActionSheet({
      itemList: ['拍照', '相册', '俩天记录'],
    })
      .then(res => {
        // console.log(res.tapIndex)
        if(res.tapIndex == 0){
          return  wx.chooseImage({
            sourceType: ['camera']
          })
        } else if(res.tapIndex == 1){
          return  wx.chooseImage({
            sourceType: ['album']
          })
        } else if(res.tapIndex == 2){
          return  wx.chooseImage({
            sourceType: ['camera']
          })
        }
      })
      .then(res => {
        // console.log(res)
        return updateAlbum({list: res.tempFilePaths})
      })
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
    
    // wx.chooseImage({
    //   count: 9,
    // })
    //   .then(res => {
    //     console.log(res)
    //   })
  },
  onPhotoClick(e){
    console.log(e)
  },
  onModeChange(){
    let mode = this.data.mode
    mode = mode == 'normal' ? 'operation' : 'normal'
    this.setData({
      mode
    })
  }
})