import { Album } from '../../utils/model/album-model.js';
var album = new Album();

Page({
  data: {
    swiperCurrent:1,
    indicatorDots: true,
    autoplay: true,
    interval: 2000,
    duration: 1000,
    circular: true,
    beforeColor: "white",//指示点颜色 
    afterColor: "coral",//当前选中的指示点颜色 
    previousmargin:'150rpx',//前边距
    nextmargin:'150rpx',//后边距
  },
  onLoad: function (options) {
    let that = this;
    console.log("options");
    console.log(options);
    //从小程序码分享过来
    // scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
    //scene 字段的值会作为 query 参数传递给小程序/小游戏。用户扫描该码进入小程序/小游戏后，开发者可以获取到二维码中的 scene 值，再做处理逻辑。
    //调试阶段可以使用开发工具的条件编译自定义参数 scene = xxxx 进行模拟，开发工具模拟时的 scene 的参数值需要进行 encodeURIComponent
    if (options.scene) {
      let scene = decodeURIComponent(options.scene);
      console.log('scene:' + scene);
      let id = scene;//相册id
      album.getAlumInfoById(id, (data)=>{
        console.log("getAlumInfoById");
        console.log(data);
        that.setData({
          one: data
        })
      })
      let config = wx.getStorageSync('config');
      if(!config){
        home.getHome((data)=>{
          console.log(data);
          wx.setStorageSync('config', data.data.config);
        })
      }
    }else{
      let from = options.from;
      if(from == 1){//从本页分享
        let id = options.id;//相册id
        album.getAlumInfoById(id, (data)=>{
          console.log("getAlumInfoById");
          console.log(data);
          that.setData({
            one: data
          })
        })
        let config = wx.getStorageSync('config');
        if(!config){
          home.getHome((data)=>{
            console.log(data);
            wx.setStorageSync('config', data.data.config);
          })
        }
      }else if(from == 2){//从排行榜
        let index = options.index;
        let albumlst = wx.getStorageSync('albumlst');
        console.log(albumlst.data[index] );
        that.setData({
          one: albumlst.data[index]
        })
        wx.setNavigationBarTitle({
          title: that.data.one.user.nickName+'的相册'
        })
      }
    }
  },
  
  //轮播图的切换事件 
  swiperChange: function (e) {
    console.log(e.detail.current);
    this.setData({
      swiperCurrent: e.detail.current //获取当前轮播图片的下标
    })
  },
  //滑动图片切换 
  chuangEvent: function (e) { 
    this.setData({
      swiperCurrent: e.currentTarget.id
    })
  },

  onShareAppMessage (option) {
    let that = this;
    let config = wx.getStorageSync('config');
    console.log(config);
    return {
      title: config.sharetitle,
      path: 'pages/detail/detail?from=1&id='+that.data.one.id,
      imageUrl: config.sharethumb
    }
  }
})
