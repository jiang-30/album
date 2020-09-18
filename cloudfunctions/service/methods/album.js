const { db, Album, handlerResponse } = require('./handler')
const _ = db.command
const $ = db.command.aggregate

/**
 * 分页获取相册
 * @param {*} params 
 * @param {*} user
 */
exports.getAlbumListPage = async function(params = {}, user){
  try {
    const current = params.current || 1
    const size = params.size || 10
    let data = []
    let total = 0
    let more = false
    const filter = {
      del: false,
      list: _.elemMatch({
        fileId: _.exists(true)
      })
    }

    const countRes = await Album.where(filter).count()
    total = countRes.total
    if(current * size < total){
      more = true
    }
    
    if(total > 0){
      const res = await Album
      .aggregate()
      .match(filter)
      .sort({
        updatedAt: -1
      })
      .skip((current - 1) * size)
      .limit(size)
      .project({
        cover: $.arrayElemAt(['$list',  $.subtract([$.size('$list'), 1])])
      })
      .end()
      data = res.list
    }
    return handlerResponse(200, data, {size, current, total, more})
  } catch (error) {
    return handlerResponse(500, error)
  }
}

exports.getUserAlbumListPage = async function(params, user){
  try {
    const current = params.current || 1
    const size = params.size || 10
    let data = []
    let total = 0
    let more = false
    const filter = {
      del: false,
      _openid: user.openId
    }

    const countRes = await Album.where(filter).count()
    total = countRes.total
    if(current * size < total){
      more = true
    }

    if(total > 0){
      const res = await Album
      .aggregate()
      .match(filter)
      .sort({
        updatedAt: -1
      })
      .skip((current - 1) * size)
      .limit(size)
      .project({
        title: 1,
        num: $.size('$list'),
        cover: $.arrayElemAt(['$list',  $.subtract([$.size('$list'), 1])])
      })
      .end()
      data = res.list
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
    let title = '我的相册'
    let res = await Album.add({
      data: {
        _openid: user.openId,
        title,
        list: [],
        del: false,
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

