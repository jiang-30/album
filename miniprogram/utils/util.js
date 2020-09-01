const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function showLoading(message) {
  if (wx.showLoading) {
    // 基础库 1.1.0 微信6.5.6版本开始支持，低版本需做兼容处理
    wx.showLoading({
      title: message,
      mask: true
    });
  } else {
    // 低版本采用Toast兼容处理并将时间设为20秒以免自动消失
    wx.showToast({
      title: message,
      icon: 'loading',
      mask: true,
      duration: 20000
    });
  }
}

function hideLoading() {
  if (wx.hideLoading) {
    // 基础库 1.1.0 微信6.5.6版本开始支持，低版本需做兼容处理
    wx.hideLoading();
  } else {
    wx.hideToast();
  }
}
function publish(fn, gapTime) {
  if (gapTime == null || gapTime == undefined) {
    gapTime = 1000
  }

  let _lastTime = null

  // 返回新的函数
  return function (e) {
    console.log(this)
    let _nowTime = + new Date()
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn(this, e)    //上方法不可行的解决办法 改变this和e
      _lastTime = _nowTime
    }
  }
}

/**
  * 生成海报获取文字
  * @param string text 为传入的文本
  * @param int num 为单行显示的字节长度
  * @return array 
 */
const textByteLength = (text, num) => {
  let strLength = 0;
  let rows = 1;
  let str = 0;
  let arr = [];
  for (let j = 0; j < text.length; j++) {
    if (text.charCodeAt(j) > 255) {
      strLength += 2;
      if (strLength > rows * num) {
        strLength++;
        arr.push(text.slice(str, j));
        str = j;
        rows++;
      }
    } else {
      strLength++;
      if (strLength > rows * num) {
        arr.push(text.slice(str, j));
        str = j;
        rows++;
      }
    }
  }
  arr.push(text.slice(str, text.length));
  return [strLength, arr, rows]   //  [处理文字的总字节长度，每行显示内容的数组，行数]
}
/**
 * 获取分享海报
 * @param array arr2 海报素材
 * @param string snap_name 素材文字
 * @param string price 价格
 * @param function successFn 回调函数
 * 
 * 
*/
const PosterCanvas = (arr2,successFn) => {
  wx.showLoading({ title: '海报生成中', mask: true });
  const ctx = wx.createCanvasContext('myCanvas');
  ctx.clearRect(0, 0, 0, 0);
  /**
   * 只能获取合法域名下的图片信息,本地调试无法获取
   * 
  */
  wx.getImageInfo({
    src: arr2[0],
    success: function (res) {
      
      console.log('width:'+res.width);
      console.log('height:'+res.height);
      const WIDTH = res.width;
      const HEIGHT = res.height;
      ctx.drawImage(arr2[0], 0, 0, WIDTH, HEIGHT);//图片设置为手机屏幕大小
      ctx.save();

      //二维码
      let r = 60;
      let d = r * 2;
      let dx = 315;
      let dy = 860;
      ctx.drawImage(arr2[1], dx, dy, d, d);
      ctx.restore();

      ctx.setFontSize(32);
      ctx.setFillStyle('black');
      ctx.setTextAlign('center')
      ctx.fillText('安心云相册', 375, 70);

      ctx.setFontSize(32);
      ctx.setFillStyle('black');
      ctx.setTextAlign('center')
      ctx.fillText(arr2[2]+'的私密相册', 375, 620);

      //头像
      let r2 = 60;
      let d2 = r * 2;
      let dx2 = 315;
      let dy2 = 360;
      //先画个圆
      ctx.arc(375, dy2+r2, r2, 0, Math.PI * 2, false);
      ctx.clip();//画了圆 再剪切  原始画布中剪切任意形状和尺寸。一旦剪切了某个区域，则所有之后的绘图都会被限制在被剪切的区域内
      ctx.drawImage(arr2[3], dx2, dy2, d2, d2);
      ctx.restore();
      //contex.drawImage(that.data.image.src, 0, 0, that.data.image.width, that.data.image.heigth); // 推进去图片
      //contex.restore(); //恢复之前保存的绘图上下文 恢复之前保存的绘图上下午即状态 可以继续绘制
      //contex.draw();


      ctx.draw(true, function () {
        wx.canvasToTempFilePath({
          canvasId: 'myCanvas',
          fileType: 'png',
          destWidth: WIDTH,
          destHeight: HEIGHT,
          success: function (res) {
            wx.hideLoading();
            successFn && successFn(res.tempFilePath);
          }
        })
      });
    },
    fail: function () {
      wx.hideLoading();
      //Tips({ title: '无法获取图片信息' });
    }
  })

}
module.exports = {
  formatTime: formatTime,
  showLoading: showLoading,
  hideLoading: hideLoading,
  publish : publish,
  PosterCanvas: PosterCanvas,
}
