Component({
  properties: {
    /**
     * 默认使用 widht height 100%
     * width、height 的优先级比ratio高
     */
    width: {
      type: String,
      value: '100%',
    },
    height: {
      type: String,
      value: '100%',
    },
    // 相对与宽度的百分比 使用高度时为0
    ratio: {
      type: String,
      value: 0,
    },
    src: {
      type: String,
    },
    /**
     * aspectFill 使图片的短边能完全显示出来，裁剪长边
     * aspectFit 保持宽高缩放图片，使图片的长边能完全显示出来
     * none 保持图片原有尺寸
     */
    mode: {
      type: String,
      value: 'aspectFill',
    },
    radius: {
      type: String,
      value: '0',
    },
  },

  data: {},

  methods: {},
})
