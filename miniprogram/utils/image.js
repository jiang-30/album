import { Base } from 'base.js';

class Image extends Base {
  constructor() {
    super();
  }

  //上传图片
  saveImage(image, callback, ccallback) {
 
    var allParams = {
      url: 'image/check',
      path: image,
      name: 'image',
      sCallback: function (data) {
        callback && callback(data);
      },
      cCallback: function (data) {
        ccallback && ccallback(data);
      }
    };
    this.upload(allParams);
  }
  

};

export { Image };