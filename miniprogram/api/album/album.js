import { callFuncion, Album } from '../action'
import { uploadAlbumImage } from '../upload/upload'

/**
 * 分页查询相册列表
 * @param { object } params 
 * @param { number } size 
 * @param { number } page 
 */
export function getAlbumListPage(params){
  return callFuncion('/get/album/page', params)
}

/**
 * 
 * @param {*} id 
 */
export function getAlbumDetail(id){
  return callFuncion('/get/album', id)
}

/**
 * 创建相册
 */
export function createAlbum(params){
  console.log(params)



  return
  return callFuncion('/post/album', params)
}

/**
 * 更新相册
 */
export function updateAlbum(params){
  if(params.list){
    return uploadAlbumImage(params.list)
      .then(res => {
        console.log('dd', res)
        return callFuncion('/put/album', {
          list: res
        })
      })
  }
}

/**
 * 删除相册
 * @param { string } id 
 */
export function deleteAlbum(id){
  return callFuncion('/delete/album', {id})
}