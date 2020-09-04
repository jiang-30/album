import { Home } from '../../utils/model/home-model.js';
var home = new Home();
const app = getApp()
Page({
  data: {
    bannerList: [
      //{ thumb: 'https://static.airbob.org//QjE2MDEyMzI3LWJhY2tncm91bmQgKDMpLmpwZw=='},
      { thumb: '../../images/bg.png' },
      { thumb: '../../images/bg.png'},
    ],
    tipdialog:{
      iShidden:true,
      content:''
    },
    currentMenuIndex:0,
    // 头部导航栏的高度
    statusBarHeight: app.globalData.statusBarHeight,
  },
  onLoad:function(options){
    let that = this;
    that.setNavHeight();
    that.setData({
      height: wx.getSystemInfoSync().windowHeight,
      width: wx.getSystemInfoSync().windowWidth
    })
    let config = wx.getStorageSync('config');
    if(config){
      that.setData({
        tipdialog: {
          iShidden:true,
          content: config.content
        }
      })
    }else{
      home.getHome((data)=>{
        console.log(data);
        wx.setStorageSync('config', data.data.config);
        that.setData({
          tipdialog: {
            iShidden:true,
            content:data.data.config.content
          }
        })
      })
    }
    
  },
  bindtapMy:function(){
    wx.navigateTo({
      url: '../my/my',
    })
  },
  bindtapHome:function(){
    //let that = this;
    //that.setData({
    //  currentMenuIndex:0
    //})
  },
  bindtapRanking:function(){
    //let that = this;
    //that.setData({
    //  currentMenuIndex:1
    //})
    wx.navigateTo({
      url: '../ranking/ranking',
    })
  },
  bindtapCreate:function(e){
    wx.navigateTo({
      url: '../create/create',
    })
  },
  bindtapXieyi: function(e){
    var that = this;
    let config = wx.getStorageSync('config');
    that.setData({
      tipdialog: {
        iShidden:false,
        content: config.content
      }
    })
  },
  bindtapClose: function(e) {
    var that = this;
    //关闭弹出窗口
    that.setData({ 
      tipdialog:{
        iShidden:true,
        
      }
    });
  },
  // 截获竖向滑动
  catchTouchMove:function(res){
    return false
  },
  //通过获取系统信息计算导航栏高度
  setNavHeight(){
    const sysInfo = wx.getSystemInfoSync()
    const statusHeight = sysInfo.statusBarHeight
    const isIOS = sysInfo.system.indexOf('iOS') > -1    //判断是否为ios系统
    let navHeight;
    if( !isIOS ){
      navHeight = 48
    }else{
      navHeight = 44
    }
    this.setData({
      statusHeight,
      navHeight,
      isIOS
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