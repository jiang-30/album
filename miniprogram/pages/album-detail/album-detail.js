import { chooseImage } from '../../utils/lib/choose-image'
import { uploadAlbumImage } from '../../api/upload/upload'
import { createAlbum, updateAlbum, deleteAlbum, getAlbumDetail } from '../../api/album/album'

Page({
  data: {
    mode: 'normal', // normal operation
    id: "",
    info: {
      title: '',
      list: [],
    },
    pageStatus: 'ok',
  },
  onLoad: function (options) {
    if(options.id){
      this.data.id = options.id
      this.fetchData()
    } else {
      this.fetchCreate()
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
  fetchDelete(){
    deleteAlbum(this.data.id)
      .then(res => {
        console.log(res)
        wx.showToast({
          title: '删除成功',
        })
        setTimeout(() => {
          wx.navigateBack({
            delta: 1,
          })
        }, 1000)
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
  onDeleteItem(){
    let list = this.data.info.list.filter(item => !item.selected)
    this.fetchUpdate({ list })
  },
  onDelete(){
    wx.showModal({
      content: '确定要删除相册吗'
    }).then(res => {
      console.log(res)
      if(res.confirm){
        this.fetchDelete()
      }
    }).catch(err => {
      console.log(err)
    })
  },
  onPhotoClick(e){
    console.log(e)
    let index = e.currentTarget.dataset.index
    if(this.data.mode == 'operation'){
      let key = `info.list[${index}].selected`
      this.setData({
        [key]: !this.data.info.list[index].selected
      })
    }
  },
  onModeChange(){
    let mode = this.data.mode
    let list = this.data.info.list
    if(mode == 'normal'){
      mode = 'operation'
      list.forEach(item => { item.selected = false })
    } else {
      mode = 'normal'
    }
    this.setData({
      mode,
      'info.list': list
    })
  },
  onPreview(){
    wx.navigateTo({
      url: '/pages/album-preview/album-preview?id=' + this.data.id,
    })
  }
})