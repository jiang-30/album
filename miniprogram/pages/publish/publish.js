var util = require('../../utils/util.js');
import { Album } from '../../utils/model/album-model.js';
var album = new Album();
import { Image } from '../../utils/image.js';
var image = new Image();
Page({
  data: {
    imageList: [],
    uploadedImages: [],
  },
  onLoad: function () {
    
  },
  bindtapBack:function(e){
    wx.navigateBack({ changed: true });
  },
  chooseImage: function () {
    var that = this;
    let images = that.data.imageList;
    if (images.length > 8) {
      wx.showToast({
        title: '最多可以上传9张图片',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    // 选择图片
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths);
        console.log(images.concat(tempFilePaths));
        that.setData({
          imageList: images.concat(tempFilePaths)
        });
      }
    })
  },
  //删除改图片
  bindtapDelete:function(e){
    var that = this;
    var index = e.currentTarget.dataset.index;
    var images = that.data.imageList;
    images.splice(index, 1);
    that.setData({
      imageList: images
    });
  },
  formSubmit: util.publish(function (that, e) {
    var albumInfo = e.detail.value;//要发布的信息
    if (albumInfo.title == "") {
      wx.showToast({
        title: '相册名不能为空!',
        icon: 'none',
        duration: 2000,
      })
      return;
    }
    var images = that.data.imageList; 
    
    if (images == null || images.length == 0) {
      wx.showToast({
        title: '请上传图片!',
        icon: 'none',
        duration: 2000,
      })
      return;
    } else {
 //有图片
      //1.上传照片，2.添加话题记录到数据库
      //openId加生成唯一时间戳加图片索引作为图片的云路径前缀
      //let openId = app.globalData.openId;
      //let timeStamp = Date.parse(time).toString();
      //云路径前缀
      //let imageCloudPathPrefix = 'CJRXHTreeHole/' + openId + '/' + timeStamp + '/';
      //获取要上传多少张图片
      let length = images.length;
      //新建图片数组，存该次所上传的所有照片
      //let imageUrls = new Array(length);
      let imageUrls = new Array(length);
      console.log("imageUrls");
      console.log(imageUrls);
      wx.showLoading({
        title: '上传中, 请稍后',
        mask: true
      });
      //一张一张开始上传
      that.uploadImages(0, images, length, imageUrls, albumInfo);
    }
  }, 1500),
  uploadImages: function (index, images, length, imageUrls, albumInfo) {
    let that = this;
    image.saveImage(images[index], (res) => {
      console.log('111111111111111');console.log(res);
      var jsonObj = JSON.parse(res);
      console.log('2222222222222');console.log(jsonObj);
      let info = JSON.parse(jsonObj.data.info);
      console.log('33333333333333');console.log(info);
      if (info.errcode == 0) {
        //wx.showToast({
        //  title: '上传成功',
       //   icon: 'none',
        //  duration: 1000
        //})
        //将图片url存入图片数组
        imageUrls[index] = jsonObj.data.path;
        console.log(imageUrls[index]);
        //that.setData({
        //  isWeChatAvatarUrl: false,
        //  type: 2
        //})
        //that.setData({
        //  uploadImg: res.tempFilePaths[0]
        //})
      } else if (info.errcode == 87014) {
        console.log('上传图片敏感');
        //当图片文件内含有敏感内容，则返回87014
        wx.showToast({
          title: '上传图片敏感',
        })
      } else {
        console.log('上传出错');
        //其余错误见返回码说明
        wx.showToast({
          title: '上传出错',
        })
      }
      /*
      console.log("上传成功");
      console.log(res);
      //从上传结果中获取云端图片的路径url
      //let imageUrl = path;
      var jsonObj = JSON.parse(res);
      //将图片url存入图片数组
      imageUrls[index] = jsonObj.data.path;
      console.log(imageUrls[index]);
      */
    }, (res) =>{
      console.log("完成");
      console.log(res);
      if ((index + 1) == length) {
        console.log('222222222222222222222');
        //如果是最后一张，将该次上传记录添加到数据库
        that.publishXiangce(albumInfo, imageUrls);
      }else if (imageUrls[index] == null) {
        //失败，删回之前上传的照片
        //for (let i = 0; i < imageUrls.length; i++) {
        //  let fileId = util.getFileId(imageUrls[i]);
          //从存储真正删除该图片
          
        //}
        //util.showTip('上传失败，请重试！');
        wx.showLoading({
          title: '上传失败，请重试！',
          mask: true
        });
        return;
      }
      else {
        //否则，传下一张
        index++;
        that.uploadImages(index, images, length, imageUrls, albumInfo);
      }
    });
  },
  publishXiangce: function (albumInfo, imageUrls) {
    console.log('=============================');
    console.log(albumInfo);
    console.log(imageUrls);
    //albumInfo.thumbs = JSON.stringify(imageUrls);
    albumInfo.thumbs = imageUrls.toString();
    console.log(albumInfo);
    let that = this;
    //发布，同时生成该相册带有参数的小程序码
    album.saveAlbumInfo(albumInfo, (res) => {
      console.log('saveAlbumInfo');
      console.log(res);
      if (res.code == 201) {
        wx.showLoading({
          title: '发布成功！',
          mask: true
        });
        setTimeout(function () {
          wx.hideLoading()
        }, 3000)
        wx.redirectTo({
          url: '../my/my-album-lst',
        })
        //wx.hideLoading();
        //Object.assign(that.data.userInfo, userInfo);
        //成功
        //wx.setStorageSync('userInfo', that.data.userInfo);
        //wx.showToast({
        //  title: res.msg,
        //  icon: 'none',
        //  duration: 2000
        //})
      }
    });
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
