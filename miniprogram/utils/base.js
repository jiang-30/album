var util = require('util.js');
import { Token } from 'token.js';
import { Config } from 'config.js';

class Base {
  constructor() {
    "use strict";
    this.baseRestUrl = Config.restUrl;
  }

  //http 请求类, 当noRefech为true时，不做未授权重试机制
  request(params, noRefetch) {
    util.showLoading('加载中...');
    var that = this,
      url = this.baseRestUrl + params.url;
    if (!params.type) {
      params.type = 'get';
    }
    /*不需要再次组装地址*/
    if (params.setUpUrl == false) {
      url = params.url;
    }
    wx.request({
      url: url,
      data: params.data,
      method: params.type,
      header: {
        'content-type': 'application/json',
        'token': wx.getStorageSync('token')
      },
      success: function (res) {
util.hideLoading()
        // 判断以2（2xx)开头的状态码为正确
        // 异常不要返回到回调中，就在request中处理，记录日志并showToast一个统一的错误即可
        var code = res.statusCode.toString();
        var startChar = code.charAt(0);
        if (startChar == '2') {
          params.sCallback && params.sCallback(res.data);
        } else {
          if (code == '401') {
            if (!noRefetch) {
              that._refetch(params);
            }
          }
          that._processError(res);
          params.eCallback && params.eCallback(res.data);
        }
      },
      fail: function (err) {
        util.hideLoading()
        //wx.hideNavigationBarLoading();
        that._processError(err);
        // params.eCallback && params.eCallback(err);
      }
    });
  }

  upload(params) {
    var that = this,
      url = this.baseRestUrl + params.url;
    wx.uploadFile({
      url: url,
      filePath: params.path,
      name: params.name,
      header: {
        'content-type': 'multipart/form-data',
        'token': wx.getStorageSync('token')
      },
      success: function (res) {
        var code = res.statusCode.toString();
        var startChar = code.charAt(0);
        if (startChar == '2') {
          params.sCallback && params.sCallback(res.data);
        } else {
          if (code == '401') {
            if (!noRefetch) {
              that._refetch(params);
            }
          }
          that._processError(res);
          params.eCallback && params.eCallback(res.data);
        }
      },
      fail: function (err) {
        that._processError(err);
      },
      complete: function (res) {
        params.cCallback && params.cCallback(res);
        //wx.hideToast();//隐藏Toast
      }
    })

  }
  _processError(err) {
    console.log("err");
    console.log(err);
    console.log("err");
  }

  _refetch(param) {
    var token = new Token();
    token.getTokenFromServer((token) => {
      this.request(param, true);
    });
  }

  /*获得元素上的绑定的值*/
  getDataSet(event, key) {
    return event.currentTarget.dataset[key];
  };

};

export { Base };
