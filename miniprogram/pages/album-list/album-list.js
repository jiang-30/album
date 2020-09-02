import { Album } from '../../utils/model/album-model.js';
var album = new Album();

Page({
  data: {},
  onLoad: function (options) {
    let that = this;
    album.getAlbumInfoByUser((data)=>{
      console.log("getAlbumInfoByUser");
      console.log(data);
      wx.setStorageSync('albumlstuser', data)
      that.setData({
        albumArr: data.data
      })
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
