const db = wx.cloud.database({})

// 数据集合
export const User = db.collection('user')
export const Album = db.collection('album')

/**
 * 存储
 * @param { string } filePath 本地临时路径
 * @param { string } cloudPath 服务区存放路径
 */
export function upload(filePath, cloudPath){
  return wx.cloud.uploadFile({
    cloudPath: cloudPath,
    filePath: filePath,
  })
}

/**
 * 下载
 * @param { string } id 文件id
 */
export  function download(id){
  return wx.cloud.downloadFile({
    fileID: id,
  })
}

/**
 * 调用云函数
 * @param { string } path 路径
 * @param { object } params 参数
 * @param { string } name 云函数名称
 */
export function callFuncion(path, params, name = 'service'){
  return wx.cloud.callFunction({
    name: name,
    data: {
      path: path,
      params: params
    }
  }).then(res => {
    if(res.result.status.code == 200){
      return res.result
    } else {
      return Promise.reject(res.result)
    }
  }).catch(error => {
    console.warn(error)
  })
}