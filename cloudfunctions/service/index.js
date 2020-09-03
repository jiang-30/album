// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const { getAlbumListPage, getAlbum, postAlbum, putAlbum, deleteAlbum } = require('./album')

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try {
    switch(event.path){
      case '/get/album/page':
        return getAlbumListPage(event.params, context)
      case '/get/album':
        return getAlbum(event.params, context)
      case '/post/album':
        return postAlbum(event.params, context)
      case '/put/album':
        return putAlbum(event.params, context)
      case '/delete/album':
        return deleteAlbum(event.params, context)
      default:
        return {
          status: { code: 404, msg: '错误的请求路径' + event.params}
        }
    }
  } catch (error) {
    console.warn('error', error)
    return {
      status: { code: 500, msg: error}
    }
  }

}