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
      let cloudPath = 'image/'
      wx.getImageInfo({
        src: item.path,
      })
        .then(res => {
          console.log(res)
          item.height = res.height
          item.width = res.width
          item.orientation = res.orientation
          item.type = res.type
          cloudPath = cloudPath + Date.now() + '-' + Math.random() + res.type
          return upload(item.path, cloudPath)
        })
        .then(res => {
          item.fileId = res.fileID 
        })
        .catch(error => {
          console.log(error)
        })
        .finally(() => {
          index++
          if(index == length){
            resolve(list)
            // clearTimeout(timer)
          }
        })
    })
  })
}