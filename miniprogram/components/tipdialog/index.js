Component({
  properties: {
    iShidden: {
      type: Boolean,
      value: true,
    },
    tips: {
      type: String,
      value: '',
    },
  },
  methods: {
    bindtapQuery: function(e) {
      var that = this;
      //关闭弹出窗口
      that.setData({ 
        iShidden: true
      });
      //执行回调
      that.triggerEvent('onLoadFun', userInfo);      
    },
  },
})