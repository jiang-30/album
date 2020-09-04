var util = require('../../utils/util.js');

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

    actionSheetHidden: true,
    canvasStatus: false,//海报绘图标签
    posterbackgd: '/images/posterbackgd.png',
    snapImage: '',//海报产品图
    PromotionCode: '/images/xiaochengxuma.jpg',//二维码图片
    posterImageStatus: false,
    posterImage: '',//海报路径
    avatarUrl:'',//头像
  },
  onLoad: function (options) {
    let that = this;
    let index = options.index;
    let albumlstuser = wx.getStorageSync('albumlstuser');
    console.log(albumlstuser);
    console.log(albumlstuser.data[index] );
    that.setData({
      one: albumlstuser.data[index]
    })
    wx.setNavigationBarTitle({
      title: that.data.one.user.nickName+'的相册'
    })
    that.downloadFileImage(that.data.one.xchxm);
    that.downloadFileImage2(that.data.one.user.avatarUrl);
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

  /**
   * 分享打开和关闭
   * 
  */
  bindchangeActionSheet: function () {
    this.setData({ actionSheetHidden: !this.data.actionSheetHidden })
  },

  //隐藏海报
  posterImageClose: function () {
    this.setData({ posterImageStatus: false, })
  },
  /**
  * 生成海报
  */
  bindtapCreatePoster: function() {
    var that = this;
    //获取该相册带有参数的小程序码
    console.log(that.data.one.xchxm);
    //根据获取到的小程序码来
    
    that.setData({ canvasStatus: true });
    //var arr2 = [that.data.posterbackgd, that.data.PromotionCode, that.data.one.user.nickName, that.data.one.user.avatarUrl];
    var arr2 = [that.data.posterbackgd, that.data.PromotionCode, that.data.one.user.nickName, that.data.avatarUrl];
    wx.getImageInfo({
      src: arr2[1],
      fail: function (res) {
        console.log('fail'); console.log(res);
        //return app.Tips({ 'title': '小程序二维码需要发布正式版后才能获取到' });
      },
      success() {
        //if (arr2[1] == '') {
          //海报二维码不存在则从新下载
        //  that.downloadFilePromotionCode(function (msgPromotionCode) {
        //    arr2[1] = msgPromotionCode;
        //    if (arr2[1] == '') return app.Tips({ title: '海报二维码生成失败！' });
        //    util.PosterCanvas(arr2, that.data.storeInfo.store_name, that.data.storeInfo.price, function (tempFilePath) {
        //      that.setData({
        //        posterImage: tempFilePath,
        //        posterImageStatus: true,
        //        canvasStatus: false,
        //        actionSheetHidden: !that.data.actionSheetHidden
        //      })
        //    });
        //  });
        //} else {
        //生成推广海报
        util.PosterCanvas(arr2,function (tempFilePath) {
            that.setData({
              posterImage: tempFilePath,
              posterImageStatus: true,
              canvasStatus: false,
              actionSheetHidden: !that.data.actionSheetHidden
            })
          });
        //}
      },
    });
  },
  //替换安全域名
  setDomain: function (url) {
    url = url ? url.toString() : '';
    //本地调试打开,生产请注销
    return url;
    if (url.indexOf("https://") > -1) return url;
    else return url.replace('http://', 'https://');
  },
  //获取图片
  downloadFileImage: function (imageurl) {
    console.log(imageurl);
    var that = this;
    wx.downloadFile({
      //url: that.setDomain(imageurl),
      url: imageurl,
      success: function (res) {
        that.setData({
          PromotionCode: res.tempFilePath
        })
      },
      fail: function () {
        //return app.Tips({ title: '' });
        that.setData({
          PromotionCode: '',
        })
      },
    });
  },
   //获取头像图片
   downloadFileImage2: function (imageurl) {
    console.log(imageurl);
    var that = this;
    wx.downloadFile({
      //url: that.setDomain(imageurl),
      url: imageurl,
      success: function (res) {
        that.setData({
          avatarUrl: res.tempFilePath
        })
      },
      fail: function () {
        //return app.Tips({ title: '' });
        that.setData({
          avatarUrl: '',
        })
      },
    });
  },
  /*
  * 保存到手机相册
  */
  bindtapSavePosterPath: function () {
  var that = this; console.log(that.data.posterImage);
  wx.getSetting({
    success(res) {
      if (!res.authSetting['scope.writePhotosAlbum']) {
        wx.authorize({
          scope: 'scope.writePhotosAlbum',
          success() {
            wx.saveImageToPhotosAlbum({
              filePath: that.data.posterImage,
              success: function (res) {
                that.posterImageClose();
                wx.showToast({
                  title: '保存成功',
                  icon: 'success',
                  duration: 2000
                })
                //app.Tips({ title: '保存成功', icon: 'success' });
              },
              fail: function (res) {
                wx.showToast({
                  title: '保存失败',
                  duration: 2000
                })
                //app.Tips({ title: '保存失败' });
              }
            })
          }
        })
      } else {
        wx.saveImageToPhotosAlbum({
          filePath: that.data.posterImage,
          success: function (res) {
            that.posterImageClose();
            //app.Tips({ title: '保存成功', icon: 'success' });
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000
            })
          },
          fail: function (res) {
            //app.Tips({ title: '保存失败' });
            wx.showToast({
              title: '保存失败',
              duration: 2000
            })
          },
        })
      }
    }
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
