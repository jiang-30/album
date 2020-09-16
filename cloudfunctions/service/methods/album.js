const cloud = require('wx-server-sdk')
const { env } = require('../const')
cloud.init({ env })
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
exports.getAlbum = async function(id, user){
  const wxContext = cloud.getWXContext()
  const filter = {
    id: params,
    _openid: user.openId
  }

  let res = await Album.doc(params).get()
  // let res = await Album.where(filter).get()
  return handlerResponse(200, res.data)
}

/**
 * 更新及新增相册
 * @param {*} params 
 */
exports.putAlbum = async function(params, user){
  console.log('put', params)
  if(params.id){
    let data = {}
    params.title ? (data.title = params.title) : ''
    params.list ? (data.list = params.list) : ''
    let res = await Album.doc(params._id).update({
      data
    })
    return handlerResponse(200, res)
  } else {
    let res = await Album.add({
      data: {
        _openid: user.openId,
        title: '我的相册',
        list: params.list
      }
    })
    return handlerResponse(200, res)
  }
}

/**
 * 删除相册
 * @param { string } id 相册ID
 */
exports.deleteAlbum = function(id, user){
  
}

