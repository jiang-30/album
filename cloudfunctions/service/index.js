// 云函数入口文件
const cloud = require('wx-server-sdk')
const { env } = require('./const')
cloud.init({ env })
const { getAlbumListPage, getAlbum, createAlbum, putAlbum, deleteAlbum } = require('./methods/album')
const { upload } = require('./methods/upload')

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const wxContext = cloud.getWXContext()
    console.log(wxContext)
    const user = {
      openId: wxContext.OPENID
    }
    let params = event.params || {}
    let resData
    switch (event.path) {
      case '/get/album/page':
        resData = await getAlbumListPage(params, user, context)
        break
      case '/get/album':
        resData = await getAlbum(params, user, context)
        break
      case '/post/album':
        resData = await createAlbum(params, user, context)
        break
      case '/put/album':
        resData = await putAlbum(params, user, context)
        break
      case '/delete/album':
        resData = await deleteAlbum(params, user, context)
        break
      case '/upload':
        resData = await upload(params, user, context)
        break
      default:
        resData = {
          status: { code: 404, msg: '错误的请求路径' + params }
        }
    }

    return resData
  } catch (error) {
    console.warn('error', error)
    return {
      status: { code: 500, msg: error }
    }
  }
}