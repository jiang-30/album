import { Base } from '../base.js';

class Album extends Base {
  constructor() {
    super();
  }
  
  //保存相册详细数据
  saveAlbumInfo(albumInfo, callback) {

    var allParams = {
      url: 'album/albuminfo',
      type: 'post',
      data: { albuminfo: albumInfo },
      sCallback: function (data) {
        callback && callback(data);
      },
      eCallback: function () {
      }
    };
    this.request(allParams);
  }

  getAlumInfoById(id, callback){
    var allParams = {
      url: 'album/one',
      data:{id:id},
      sCallback: function (data) {
        callback && callback(data);
      }
    };
    this.request(allParams);
  }
  //根据类型查询相册集
  getAlumInfoByType(type, callback){
    var allParams = {
      url: 'album/typelst',
      data:{type:type},
      sCallback: function (data) {
        callback && callback(data);
      }
    };
    this.request(allParams);
  }

  /**
   * 获取该用户下所有的相册
   * @param {*} callback 
   */
  getAlbumInfoByUser(callback){
    var allParams = {
      url: 'album/userlst',
      sCallback: function (data) {
        callback && callback(data);
      }
    };
    this.request(allParams);
  }

  //更新查看次数,增加一次 ,相册id
  updateAlbumWatchnum(id, callback) {

    var allParams = {
      url: 'album/watchnum',
      type: 'post',
      data: { id: id },
      sCallback: function (data) {
        callback && callback(data);
      },
      eCallback: function () {
      }
    };
    this.request(allParams);
  }

  
};

export { Album };