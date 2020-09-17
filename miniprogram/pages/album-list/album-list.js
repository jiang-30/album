import { getAlbumListPage } from '../../api/album/album'

Page({
  data: {
    type: 'normal',
    page: {
      current: 1,
      size: 10,
      total: 0,
      more: true,
      loading: false,
      status: 'placeholder'
    },
    list: []
  },
  onLoad: function (options) {
    if(options.type == 'choose'){
      wx.setNavigationBarTitle({
        title: '选择相册',
      })
      this.setData({ type: 'choose' })
    }
    this.fetchData()
  },
  onPullDownRefresh(){
    this.data.page.current = 1
    this.data.page.more = true
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
      auth: true
    }).then(res => {
      console.log('res', res)
      let status = 'ok'
      let current = res.page.current
      let list = res.data
      if(res.page.more){
        current++
        status = 'more'
      } else if(res.page.total == 0) {
        status = 'empty'
      } else {
        status = 'more-no'
      }
      if(current > 1){
        list = this.data.list.concat(list)
      }
      this.setData({
        'page.current': current,
        'page.size': res.page.size,
        'page.more': res.page.more,
        'page.total': res.page.total,
        'page.status': status,
        'list': list
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
  onAlbumChoose(e){
    
  },
  onItemClick(e){
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      // url: '/pages/create/create',
      url: '/pages/album-detail/album-detail?id=' + id,
    })
  },
  onCreate(){
    wx.navigateTo({
      // url: '/pages/create/create',
      url: '/pages/album-detail/album-detail',
    })
  },
  
})
