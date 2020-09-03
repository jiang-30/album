import { upload } from '../action'

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
    // let timer = setTimeout(() => {
    //   if(index < length){
    //     reject(list.map(item => item.fileId))
    //   }
    // }, 10000)
    list.forEach( item => {
      let cloudPath = ''
      upload(item.path, cloudPath)
        .then(res => {
          item.fileId = res.fileID 
        })
        .catch(error => {})
        .finally(() => {
          index++
          if(index == length){
            resolve(list.map(item => item.fileID))
            // clearTimeout(timer)
          }
        })
    })
  })
}