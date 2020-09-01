
const app = getApp();

Page({
  data: {
    //获取全局变量 导航栏的高度statusBarHeight
    statusBarHeight: getApp().globalData.statusBarHeight,
    subjectInfo:[
      {
        id:0,
        thumb:'../../images/xiangce.png',
        title:'从相册中选择',
        subtitle:'视频不超过1分钟，图片最多9张'
      },
      {
        id: 1,
        thumb: '../../images/xiangji.png',
        title: '拍摄',
        subtitle:'长按拍30秒视频，轻触拍照'
      },
      {
        id:2,
        thumb:'../../images/tengxunshipin.png',
        title:'腾讯视频',
        subtitle:'长按拍30秒视频，轻触拍照'
      },
      {
        id: 3,
        thumb: '../../images/haowu.png',
        title:'发现好物',
        subtitle:'快速分享好的商品'
      },
    ]
  },
  onLoad: function () {
    
  },
  bindtapBack:function(e){
    wx.navigateBack({ changed: true });
  },
  bindtapXiangce:function(e){
    let that = this;
    // 相册授权
    wx.getSetting({
      success(res) {
        console.log(res);
        // 进行授权检测，未授权则进行弹层授权
        if (!res.authSetting["scope.writePhotosAlbum"]) {
          wx.authorize({
            scope: "scope.writePhotosAlbum",
            success() {
              console.log('aaaaaaaaaaa');
              //成功授权，则进入到发布页
              wx.navigateTo({
                url: '../publish/publish',
              })
            },
            // 拒绝授权时，则进入手机设置页面，可进行授权设置
            fail() {
              console.log('bbbbbbbbbbbb');
              //that.saveAlbumImgTow = true;
              //that.saveAlbumImgOne = false;
              wx.showToast({
                title:'您没有授权，无法保存到相册',
                icon:'none'
              })
              //wx.openSetting({
              //  success: function(data) {
              //    console.log("openSetting success");
              //    that.getCanvasImg();
              //    that.saveAlbumImgTow = false;
              //    that.saveAlbumImgOne = true;
              //  },
              //  fail: function(data) {
              //    console.log("openSetting fail", data);
              //  }
              //});
            }
          });
        } else {
          // 已授权则直接入到发布页
          wx.navigateTo({
            url: '../publish/publish',
          })
        }
      },
      fail(res) {
        console.log(res);
      }
    });
  },
  bindtapXiangji:function(e){
    let that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        //console.log("uploadPhoto");
        //console.log(res.tempFilePaths[0]);
        //console.log("uploadPhoto");
      }
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
