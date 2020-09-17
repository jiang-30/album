import { chooseImage } from '../../utils/lib/choose-image'
import { uploadAlbumImage } from '../../api/upload/upload'
import { createAlbum, updateAlbum, getAlbumDetail } from '../../api/album/album'

Page({
  data: {
    mode: 'normal', // normal operation
    id: "5f3dc7b45f630f350023ec3e4d6ecc8c",
    info: {
      title: '',
      list: [],
    },
    pageStatus: 'ok',
  },
  onLoad: function (options) {
    options.id = '5f3dc7b45f630f350023ec3e4d6ecc8c'
    if(options.id){
      this.data.id = options.id
      this.fetchData()
    } else {
      // this.fetchCreate()
    }
  },
  fetchData(){
    getAlbumDetail(this.data.id)
      .then((res) => {
        // console.log(res)
        this.setData({
          info: res.data
        })
        this.handlerStatus()
      })
      .catch(err => {
        console.warn(err)
      })
  },
  fetchCreate(){
    createAlbum()
      .then(res => {
        this.data.id = res.data._id
        this.handlerStatus()
      })
      .catch(err => {
        console.warn(err)
        wx.showToast({
          title: '创建相册失败',
          icon: 'none'
        })
        setTimeout(() => {
          wx.navigateBack({
            delta: 1,
          })
        }, 1000)
      })
  },
  fetchUpdate(params){
    if(!this.data.id) return
    params.id = this.data.id
    updateAlbum(params)
      .then(res => {
        console.log(res)
        this.setData({
          'info.title': params.title || this.data.info.title,
          'info.list': params.list || this.data.info.list
        })
        this.handlerStatus()
      })
      .catch(err => {
        console.warn(err)
      })
  },
  handlerStatus(){
    let status = 'ok'
    if(this.data.info.list == 0){
      status = 'empty'
    }
    this.setData({ pageStatus: status})
  },
  onTitleChange(e){
    const title = e.detail.value
    if(title != this.data.info.title){
      this.setData({
        'info.title': title
      })
      this.fetchUpdate({title})
    }
  },
  onUpload(){
    chooseImage()
      .then(res => {
        console.log(res)
        return uploadAlbumImage(res)
      })
      .then(res => {
        console.log(res)
        this.fetchUpdate({list: this.data.info.list.concat(res)})
      })
      .catch(err => {
        console.warn(err)
        wx.showToast({
          title: '图片上传失败',
          icon: 'none'
        })
      })
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