const cloud = require('wx-server-sdk')
const { env } = require('../const')
cloud.init({ env })
const db = cloud.database()
const { Album, handlerResponse } = require('./handler')

/**
 * 分页获取相册
 * @param {*} params 
 * @param {*} user
 */
exports.getAlbumListPage = async function(params = {}, user){
  try {
    const current = params.current || 1
    const size = params.size || 10
    const filter = {} // '_openid': user.openid
    if(params.auth){
      filter._openid = user.openId
    } else {

    }
    let data = []
    let total = 0
    let more = false

    const countRes = await Album.where(filter).count()
    total = countRes.total

    // console.log(user, cloud.getWXContext())
    
    if(current * size < total){
      more = true
    }
    
    if(total > 0){
      const res = await Album
      .where(filter)
      .skip((current - 1) * size)
      .limit(size)
      .get()
      data = res.data
    }
    return handlerResponse(200, data, {size, current, total, more})
  } catch (error) {
    return handlerResponse(500, error)
  }
}

/**
 * 查询相册详情
 * @param {*} params 
 */
exports.getAlbum = async function(params, user){
  let res = await Album.doc(params.id).get()
  // let res = await Album.where(filter).get()
  if(res.data._openid == user.openId){
    res.data.owner = true
  } else {
    res.data.owner = false
  }
  return handlerResponse(200, res.data)
}

/**
 * 新增相册
 * @param {*} params 
 */
exports.createAlbum = async function(params, user, context){
  // console.log(user)
  try {
    const time = db.serverDate()
    let title = time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate()
    let res = await Album.add({
      data: {
        _openid: user.openId,
        title: '',
        list: [],
        createdAt: db.serverDate(),
        updatedAt: db.serverDate()
      }
    })
    return handlerResponse(200, res)
  } catch (error) {
    return handlerResponse(500, error)
  }
}
/**
 * 更新相册
 * @param {*} params
 * @param {*} params.title
 * @param {*} params.list
 */
exports.putAlbum = async function(params, user){
  try {
    let data = {
      updatedAt: db.serverDate()
    }
    if(params.title){
      data.title = params.title
    }
    if(params.list){
      data.list = params.list
    }
    let doc = Album.doc(params.id)
    let item = await doc.get()
    if(item.data._openid != user.openId){
      return handlerResponse(500, {}, '没有权限')
    }
    let res = await doc.update({
      data
    })
    return handlerResponse(200, res.data)
  } catch (error) {
    return handlerResponse(500, error)
  }
}

/**
 * 删除相册
 * @param { string } id 相册ID
 */
exports.deleteAlbum = async function(params, user){
  try {
    let res = await  Album.doc(params.id).remove()
    return handlerResponse(200, res.data)
  } catch (error) {
    return handlerResponse(500, error)
  }
}

