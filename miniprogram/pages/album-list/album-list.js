import { getAlbumListPage } from '../../api/album/album'

Page({
  data: {
    list: []
  },
  onLoad: function (options) {
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
    // album.getAlbumInfoByUser((data)=>{
    //   console.log("getAlbumInfoByUser");
    //   console.log(data);
    //   wx.setStorageSync('albumlstuser', data)
    //   that.setData({
    //     albumArr: data.data
    //   })
    // })
  },
  onDetail(e){
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
