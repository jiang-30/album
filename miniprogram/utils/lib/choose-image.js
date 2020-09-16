export function chooseImage(max = 9){
  return wx.showActionSheet({
    itemList: ['拍照', '相册', '聊天记录'],
  })
    .then(res => {
      if(res.tapIndex == 0){
        // tempFiles
        return  wx.chooseImage({
          count: max,
          sourceType: ['camera']
        })
      } else if(res.tapIndex == 1){
        // tempFiles
        return  wx.chooseImage({
          count: max,
          sourceType: ['album']
        })
      } else if(res.tapIndex == 2){
        // tempFiles 
        return  wx.chooseMessageFile({
          count: max,
          type: 'image',
        })
      }
    })
    .then(res => {
      return res.tempFiles.map(item => item.path)
    })
}