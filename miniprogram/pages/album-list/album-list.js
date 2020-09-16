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
  fetchData(){
    getAlbumListPage({
      page: 1,
      size: 10,
    }).then(res => {
      console.log('res', res)
      this.setData({
        list: res.data
      })
    }).catch(error => {
      console.warn('error', error)
    })
  },
  onItemClick(e){
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      // url: '/pages/create/create',
      url: '/pages/album/album?id=' + id,
    })
  },
  onCreate(){
    wx.navigateTo({
      // url: '/pages/create/create',
      url: '/pages/album/album',
    })
  },
  bindtapAlbumItemTap: function (e) {
    let index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: 'my-album?index=' + index,
    })  
  },
  onShareAppMessage (option) {
    let config = wx.getStorageSync('config');
    console.log(config);
    return {
      title: config.sharetitle,
      path: 'pages/home/home',
      imageUrl: config.sharethumb
    }
  }
  
})
