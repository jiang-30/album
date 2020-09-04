const cloud = require('wx-server-sdk')
const { Album, handlerReturn } = require('./handler')

exports.getAlbumListPage = async function(params = {}, context){
  try {
    params.current = params.current || 1
    params.size = params.size || 10
    const wxContext = cloud.getWXContext()
    const filter = { '_openid': wxContext.OPENID }
    let data = []
    let total = 0

    const countRes = await Album.where(filter).count()
    total = countRes.total
   
    if(total > 0){
      const res = await Album
      .where(filter)
      .skip((params.current - 1) * params.size)
      .limit(params.size)
      .get()
      data = res.data
    }
    return handlerReturn(200, data, {size: params.size, current: params.current, total})
  } catch (error) {
    return handlerReturn(500, error)
  }
}
exports.getAlbum = async function(params){
  const wxContext = cloud.getWXContext()
  const filter = {
    id: params,
    _openid: wxContext.OPENID
  }

  let res = await Album.doc(params).get()
  // let res = await Album.where(filter).get()
  return handlerReturn(200, res.data)
}

exports.postAlbum = function(){
  
}

exports.putAlbum = async function(params, context){
  console.log('put', params)
  const wxContext = cloud.getWXContext()
  if(params.id){

  } else {
    let res = await Album.add({
      data: {
        _openid: wxContext.OPENID,
        title: '我的相册',
        list: params.list
      }
    })
    handlerReturn(200, res)
  }
}

exports.deleteAlbum = function(){
  
}

