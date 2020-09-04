const cloud = require('wx-server-sdk')
const { env } = require('../const')
cloud.init({ env })
const { v4: uuidv4 } = require('uuid')
const md5 = require('md5')
const { handlerResponse } = require('./handler')

/**
 * 
 * @param { object } params 客户端参数
 * @param { string } params.file 图片base64
 * @param { string } params.type 图片类型
 * @param { object } user 用户信息
 * @param { object } context 
 */
exports.upload = async function(params, user, context){
  try {
    let path = 'images/' +uuidv4() + '.' + params.type
    let  res = await cloud.uploadFile({
      cloudPath: path,
      fileContent: new Buffer(params.file, 'base64')
    })
    let data = {
      fileId: res.fileID,
      md5: md5(params.file)
    }
    return handlerResponse(200, data)
  } catch (error) {
    
  }
}