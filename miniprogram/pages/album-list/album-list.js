import { Album } from '../../utils/model/album-model.js';
import { getAlbumListPage } from '../../api/album/album'
var album = new Album();

Page({
  data: {
    list: []
  },
  onLoad: function (options) {
    getAlbumListPage({
      size: 10,
      page: 1,
    }).then(res => {
      console.log('res', res)
      this.setData({
        list: res.data
      })
    }).catch(error => {
      console.warn('error', error)
    })
    let that = this;
    // album.getAlbumInfoByUser((data)=>{
    //   console.log("getAlbumInfoByUser");
    //   console.log(data);
    //   wx.setStorageSync('albumlstuser', data)
    //   that.setData({
    //     albumArr: data.data
    //   })
    // })
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
