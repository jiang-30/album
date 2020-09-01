import { Album } from '../../utils/model/album-model.js';
var album = new Album();

Page({
  data: {
    currentTypeIndex:0,
    type:0,//0人气，1推荐，2最新
    lst:[{},{},{},{}],
  },
  onLoad: function () {
    let that = this;
    //that.setData({
    //  lst: that.data.hotList
    //})
    let type = that.data.type;
    that.getAlumInfoTemp(type);
  },
  bindtapBack:function(e){
    wx.navigateBack({ changed: true });
  },
  bindtapType:function(e){
    let that = this;
    let type = e.currentTarget.dataset.type;
    that.getAlumInfoTemp(type);
    that.setData({
      currentTypeIndex: type
    })
  },
  bindtapDetail:function(e){
    let that = this;
    let index = e.currentTarget.dataset.index;
    let id = e.currentTarget.dataset.id;
    console.log(e);
    console.log('id:'+id);
    //记录查看次数
    album.updateAlbumWatchnum(id, (data)=>{
      console.log("updateAlbumWatchnum");
      console.log(data);console.log("updateAlbumWatchnum");
    })
    
    wx.navigateTo({
      url: '../detail/detail?from=2&index='+index,
    })
  },

  getAlumInfoTemp:function(type){
    let that = this;
    album.getAlumInfoByType(type, (data)=>{
      console.log("getAlumInfo");
      console.log(data);
      wx.setStorageSync('albumlst', data)
      that.setData({
        lst: data
      })
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
