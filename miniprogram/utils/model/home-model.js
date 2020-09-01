import { Base } from '../base.js';

class Home extends Base {
  constructor() {
    super();
  }

  /**
   * 获取隐私协议
   */
  getHome(callback) {

    var allParams = {
      url: 'home',
      type: 'get',
      sCallback: function (data) {
        callback && callback(data);
      }
    };
    this.request(allParams);
  }

}

export { Home };