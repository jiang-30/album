Component({
  options: {
    multipleSlots: true,
  },
  properties: {
    type: String, // page more
    image: String,
    title: String,
    desc: String,
    /**
     * loading ok/hide
     * error empty placeholder
     *  more-loading more-no more-error
     */
    status: { type: String },
    error: { type: Boolean },
    empty: { type: Boolean },
    more: { type: Number, value: -1 },
    total: { type: Number, value: -1 },
    slotPlaceholder: { type: Boolean, value: false },
    slotImage: { type: Boolean, value: false },
    slotTitle: { type: Boolean, value: false },
  },
  data: {
    config: { status: '', type: '', image: '', title: '', desc: '' },
    _pageEmptyConfig: { image: '/assets/images/empty.png', title: '暂无数据', desc: '' },
    _pageErrorConfig: { image: '/assets/images/error.png', title: '出错了', desc: '' },
    _pagePlaceholderConfig: { image: '/assets/images/loading.png', title: '加载中...', desc: '' },
    _moreNoConfig: { title: '已加载全部' },
    _moreLoadingConfig: { image: '/assets/images/loading.png', title: '加载中..' },
    _isTotalInit: false,
  },
  observers: {
    'config.status'(val) {
      if (val === 'loading') {
        wx.showLoading({ title: '加载中...' })
      } else {
        wx.hideLoading()
      }
    },
    'status'(val) {
      this.setConfig(val, 'status')
    },
    'empty'(val) {
      if (val) {
        this.setConfig('empty', 'empty')
      }
    },
    'more'(val) {
      if (val == 0 && this.data.total != 0) {
        this.setConfig('more-no', 'more')
      } else if (val > 0) {
        this.setConfig('more-yes', 'more')
      }
    },
    'total'(val) {
      if (val == 0) {
        this.setConfig('empty', 'total')
      }
    },
  },
  methods: {
    setConfig(status, e) {
      // console.log(e, status)
      let flag = false
      let cStatus = ''
      let cType = this.data.type
      let cImage = ''
      let cTitle = ''
      let cDesc = ''

      if (status == 'loading') {
        flag = true
        cStatus = 'loading'
      } else if (status == 'placeholder') {
        flag = true
        cStatus = 'placeholder'
        cType = this.data.type || 'page'
        cImage = this.data.image || this.data._pagePlaceholderConfig.image
        cTitle = this.data.title || this.data._pagePlaceholderConfig.title
        cDesc = this.data.desc || this.data._pagePlaceholderConfig.desc
      } else if (status == 'error') {
        flag = true
        cStatus = 'error'
        cType = this.data.type || 'page'
        cImage = this.data.image || this.data._pageErrorConfig.image
        cTitle = this.data.title || this.data._pageErrorConfig.title
        cDesc = this.data.desc || this.data._pageErrorConfig.desc
      } else if (status == 'empty') {
        flag = true
        cStatus = 'empty'
        cType = this.data.type || 'page'
        cImage = this.data.image || this.data._pageEmptyConfig.image
        cTitle = this.data.title || this.data._pageEmptyConfig.title
        cDesc = this.data.desc || this.data._pageEmptyConfig.desc
      } else if (status == 'more-loading') {
        flag = true
        cStatus = 'more-loading'
        cType = this.data.type || 'more'
        cImage = this.data.image || this.data._moreLoadingConfig.image
        cTitle = this.data.title || this.data._moreLoadingConfig.title
      } else if (status == 'more-no') {
        flag = true
        cStatus = 'more-no'
        cType = this.data.type || 'more'
        cTitle = this.data.title || this.data._moreNoConfig.title
      } else if (status == 'more-error') {
        flag = true
        cStatus = 'more-error'
        cType = this.data.type || 'more'
        cTitle = this.data.title || '出错了'
      } else {
        status = 'ok'
      }

      // console.log(cStatus, cType, cImage, cTitle, cDesc)
      this.setData({
        'config.status': cStatus,
        'config.type': cType,
        'config.image': cImage,
        'config.title': cTitle,
        'config.desc': cDesc,
      })
    },
  },
})
