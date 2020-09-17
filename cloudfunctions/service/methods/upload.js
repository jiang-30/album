const cloud = require('wx-server-sdk')
const { env } = require('../const')
cloud.init({ env })
const { v4: uuidv4 } = require('uuid')
const md5 = require('md5')
const { Album, handlerResponse } = require('./handler')

/**
 * 上传图片
 * @param { object } params 客户端参数
 * @param { string } params.file 图片base64
 * @param { string } params.type 图片类型
 */
exports.upload = async function(params, user, context){
  try {
    let fileMd5 = md5(params.file)
    let file = await Album.where({
      'list.md5': fileMd5
    }).limit(1).get()
    if(file.data.length > 0){
      let fileItem = file.data[0].list.find(item => item.md5 == fileMd5)
      return handlerResponse(200, {
        fileId: fileItem.fileId,
        md5: fileItem.md5
      })
    }

    let path = 'images/' +uuidv4() + '.' + params.type
    let  res = await cloud.uploadFile({
      cloudPath: path,
      fileContent: new Buffer(params.file, 'base64')
    })
    return handlerResponse(200, {
      fileId: res.fileID,
      md5: fileMd5
    })
  } catch (error) {
    return handlerResponse(500, error)
  }
}