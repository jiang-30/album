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
exports.getAlbum = function(){
  
}

exports.postAlbum = function(){
  
}

exports.putAlbum = function(){
  
}

exports.deleteAlbum = function(){
  
}

