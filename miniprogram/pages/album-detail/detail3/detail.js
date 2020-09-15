
/**
 * 
 * 460 660
 * 8月初写的了。。代码都没啥印象了，刚刚打开，发现位置是写死了的7个，不过可以动态去设置。。
 * 整体来说也不复杂，7个位置，相当于是7个状态，各个状态之间轮换，以下的列表都是从左往右的，最中间的也是界面当前正中间的。
 * 用currentIndex这个变量来控制当前翻页情况，也就是本来的7个位置处于什么状态。
 */
// 位置列表
const posOrgArray = [-360, -240, -120, 0, 120, 240, 360]
let posArray = [-360, -240, -120, 0, 120, 240, 360]
// 缩放列表
let scaArray = [.8, .8, .9, 1, .9, .8, .8]
// 透明度列表
let opaArray = [0, 1, 1, 1, 1, 1, 0]
// 高度列表
let indArray = [1, 2, 3, 4, 3, 2, 1]
// 当前位置列表
let curPosArray = [-360, -240, -120, 0, 120, 240, 360]
// 当前缩放列表
let curScaArray = []
// 当前透明度列表
let curOpaArray = []
// 当前高度列表
let curIndArray = []
let left = 0
 
 
// 是否可点击，控制点击频率
let canClick = true
 
// px和rpx转换比例，用于横向滑动的时候计算滑动距离（rpx）
let screenRate = 1
 
Page({
 
  data: {
    // 背景图列表
    imgArray: ["../../images/banner.png","../../images/banner.png","../../images/banner.png", "../../images/banner.png", "../../images/banner.png", "../../images/banner.png", "../../images/banner.png", "../../images/banner.png", "../../images/banner.png"],
    // 文字列表，和前面的图位置对应
    textArray: ["页面1", "页面2", "页面3", "页面4", "页面5", "页面6", "页面7", "页面8", "页面9"],
    animation: [],
    // 当前位置，这个。。和默认位置有关，不要随便改哦。
    currentIndex: 7,
    // index高度数组，中间的最高嘛~ 因为wxml里用style控制，所以写到了 data 里
    indexArray: [1, 2, 3, 4, 3, 2, 1],
    // 指示点数组（哈哈哈，写在了这里，没加上去）
    indicatorArray: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.getSystemInfo({
      success: (res) => {
        // 750除以屏幕宽度，得到转换比。因为API用的和得到的大部分的单位都是px，所以还是要转一下
        screenRate = 750 / res.screenWidth
      }
    })
    // 初始化动画，注意这个数组和 this.data.animation不是同一个，而是一一对应的关系
    this.animation = [];
    let leng = this.data.imgArray.length;
    for (let i = 0; i < leng; i++) {
      let animation = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease-out',
      })
      this.animation.push(animation)
    }
    console.log('this.animation')
    console.log(this.animation)
  },
 
  tapItemFn(e) {
    console.log(e.currentTarget.dataset.text)
  },
  touchstart(e) {
 
    left = e.touches[0].pageX
  },
 
  touchmove(e) {
    // console.log(e)
    // 频率控制，一次移动完成后，才能进行下一次
    if (this.isMove) {
      return
    }
    let moveLength = (e.touches[0].pageX - left) * screenRate
    moveLength = moveLength > 60 ? 60 : moveLength
    moveLength = moveLength < -60 ? -60 : moveLength
    let rate = moveLength / 60
    if (rate == 1) { //从右往左滑
      this.isMove = true
      this.tapRight()
    } else if (rate == -1) { //从左往右滑
      this.isMove = true
      this.tapLeft()
    }
  },
 
  touchend(e) {
    setTimeout(() => {
      this.isMove = false
    }, 500)
  },
 
  // 往左移
  tapLeft() {
    if (!canClick) {
      return
    }
    canClick = false
    setTimeout(() => {
      canClick = true
    }, 500)
    // 界面往左移，效果相当于数组向右移一位。比如，本来在位置2，向左移，就是2的位置去了1，也就是位置1的参数给到了位置2。。以此类推
    console.log('posArray')
    console.log(posArray)
    curPosArray = this.rollRight(posArray, 1)
    console.log(curPosArray)
    console.log('scaArray')
    console.log(scaArray)
    curScaArray = this.rollRight(scaArray, 1)
    console.log(scaArray)
    console.log('opaArray')
    console.log(opaArray)
    curOpaArray = this.rollRight(opaArray, 1)
    console.log(opaArray)
    console.log('indArray')
    console.log(indArray)
    curIndArray = this.rollRight(indArray, 1)
    console.log(indArray)
    let animation = this.data.animation
    console.log('this.data.animation')
    console.log(this.data.animation)
    for (let j = 0; j < 7; j++) {
      this.animation[j].scale(curScaArray[j], curScaArray[j]).left(curPosArray[j] + 'rpx').opacity(curOpaArray[j]).step()
      animation[j] = this.animation[j].export()
    }
    console.log(this.data.currentIndex)
    let currentIndex = ++this.data.currentIndex == 70 ? 0 : this.data.currentIndex
    console.log(currentIndex)
    this.setData({
      animation: animation,
      currentIndex: currentIndex,
      indexArray: curIndArray
    })
  },
 
  tapRight() {
    if (!canClick) {
      return
    }
    canClick = false
    setTimeout(() => {
      canClick = true
    }, 500)
    curPosArray = this.rollLeft(posArray, 1)
    curScaArray = this.rollLeft(scaArray, 1)
    curOpaArray = this.rollLeft(opaArray, 1)
    curIndArray = this.rollLeft(indArray, 1)
    let animation = this.data.animation
    for (let j = 0; j < 7; j++) {
      this.animation[j].scale(curScaArray[j], curScaArray[j]).left(curPosArray[j] + 'rpx').opacity(curOpaArray[j]).step()
      animation[j] = this.animation[j].export()
    }
    let currentIndex = --this.data.currentIndex == 0 ? 70 : this.data.currentIndex
    this.setData({
      animation: animation,
      currentIndex: currentIndex,
      indexArray: curIndArray
    })
  },
 
  /**
   * 把数组参数往左移，第一个参数是要改变的数组，第二个参数是移动的次数
   * 保存位置0的，然后将数组整体左移，再把之前保存的位置0的值，赋值给数组末尾，下面的rollRight刚好反过来
   */
  rollLeft: function(array, times) {
    for (let time = 0; time < times; time++) {
      let length = array.length - 1
      let temp = array[0]
      for (let i = 0; i < length; i++) {
        array[i] = array[i + 1]
      }
      array[length] = temp
    }
    return array.concat()
  },
 
  rollRight: function(array, times) {
    for (let time = 0; time < times; time++) {
      let length = array.length - 1
      let temp = array[length]
      for (let i = length; i > 0; i--) {
        array[i] = array[i - 1]
      }
      array[0] = temp
    }
    return array.concat()
  }
})