import { upload, callFuncion } from '../action'

/**
 * 
 * @param { string[] } paths 
 */
export function uploadAlbumImage(paths){
  let length = paths.length
  let index = 0
  let list = paths.map(path => {
    return {
      path: path,
      fileId: ''
    }
  })
  return new Promise((resolve, reject) => {
    list.forEach( item => {
      wx.getImageInfo({
        src: item.path,
      })
        .then(res => {
          item.height = res.height
          item.width = res.width
          item.orientation = res.orientation
          item.type = res.type
          return  new Promise((resolve, reject) => {
            wx.getFileSystemManager().readFile({
              filePath: item.path,
              encoding: "base64",
              success(res){
                resolve(res)
              },
              fail(error){
                reject(error)
              }
            })
          })
        }).then(res => {
          // console.log('data', res)
          return callFuncion('/upload', {
            file: res.data,
            type: item.type
          })
        })
        .then(res => {
          // console.log(res)
          item.fileId = res.data.fileId
          item.md5 = res.data.md5
          delete item.path
          index++
          if(index == length){
            resolve(list)
          }
        })
        .catch(error => {
          console.log(error)
          reject(error)
        })
    })
  })
}