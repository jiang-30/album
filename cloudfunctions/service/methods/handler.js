const cloud = require('wx-server-sdk')
const db = cloud.database({
  throwOnNotFound: false
})

exports.db = db
exports.Album = db.collection('album')
exports.handlerResponse = function(code, data, page){
  let status = {
    '200': '请求成功',
    '404': '未找到当前路径',
    '500': '处理异常'
  }
  let res = {
    status: {code: 200, msg: status[code]},
    data
  }
  if(code == 200 && page){
    res.page = page
  } 
  if(code !== 200 && page){
    res.status.msg = page
  }
  return res
}
