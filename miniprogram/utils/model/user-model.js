
import { Base } from '../base.js';

class User extends Base {
  constructor() {
    super();
  }

  //保存用户详细数据
  saveUserInfo(userInfo, callback) {

    var allParams = {
      url: 'user/userinfo',
      type: 'post',
      data: { userInfo: userInfo },
      sCallback: function (data) {
        callback && callback(data);
      },
      eCallback: function () {
      }
    };
    this.request(allParams);
  }

  //查询用户详细数据
  queryUserInfo(callback) {

    var allParams = {
      url: 'user/userinfo',
      type: 'get',
      sCallback: function (data) {
        callback && callback(data);
      },
      eCallback: function () {
      }
    };
    this.request(allParams);
  }

  //根据id查询用户详细数据
  queryUserInfoByID(id, callback) {

    var allParams = {
      url: 'user/userinfoid?id='+id,
      type: 'get',
      sCallback: function (data) {
        callback && callback(data);
      },
      eCallback: function () {
      }
    };
    this.request(allParams);
  }

}

export { User };