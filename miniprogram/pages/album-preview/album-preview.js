import { getAlbumDetail } from '../../api/album/album'

Page({
  data: {
    id: '',
    info: {}
  },
  onLoad: function (options) {
    options.id = 'd782d4875f63719500036a277007ad1a'
    if(options.id){
      this.data.id =  options.id
      this.fetchData()
    }
  },
  fetchData(){
    getAlbumDetail(this.data.id)
      .then((res) => {
        // console.log(res)
        this.setData({
          info: res.data
        })
      })
      .catch(err => {
        console.warn(err)
      })
  },
 
})