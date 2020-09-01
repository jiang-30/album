import { Authorize } from '../../utils/authorize-model.js';

var authorize = new Authorize();
Component({
  properties: {
    iShidden: {
      type: Boolean,
      value: true,
    }
  },
  data: {
    loading:false,
  },
  pageLifetimes: {
    hide: function () { },//关闭页面时销毁定时器
    show: function () { },//打开页面销毁定时器
  },
  detached() {},
  attached() {
    this.grantOr();
  },
  methods: {
    //授权
    grantUserInfo(e) {
      var that = this;
      var userInfo = e.detail.userInfo;
      console.log(userInfo);
      wx.showLoading({ title: '正在登录中...' });
      if (!userInfo) {
        return;
      }
      authorize.saveUserInfo(userInfo, (res) => {
        if (res.code == 201) {
          wx.setStorageSync('userInfo', userInfo);//成功
        }
        wx.hideLoading();
        //关闭登录弹出窗口
        that.setData({ 
          iShidden: true
        });
        //执行回调
        that.triggerEvent('onLoadFun');
      }); 
    }, 
    /**
     * 判断是否授权
     */
    grantOr: function () {
      var that = this
      var userInfo = wx.getStorageSync('userInfo');
      console.log(userInfo);
      console.log("userInfo");
      if (userInfo) {
        that.setData({
          iShidden: true,
        });
        //执行回调
        that.triggerEvent('onLoadFun');
      } else {
        authorize.queryUserInfo((res) => {
          if (!res.nickName) {
            that.setData({
              iShidden: false
            });
            return;
          }
          wx.setStorageSync('userInfo', res);
          that.setData({
            iShidden: true,
          });
          //执行回调
          that.triggerEvent('onLoadFun');
        });
      }
    }, 
  },
})