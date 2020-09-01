Page({

    /**
     * 页面的初始数据
     */
    data: {
        swiperList: [
            {
                index: 0,
                swpClass: "swp-left",
                active: false,
                imgsrc: "../../images/banner.png",
            },
            {
                index: 1,
                swpClass: "swp-right",
                active: false,
                imgsrc: "../../images/banner.png"
            },
            {
                index: 3,
                swpClass: "swp-right",
                active: false,
                imgsrc: "../../images/banner.png"
            },
            {
                index: 4,
                swpClass: "swp-right",
                active: false,
                imgsrc: "../../images/banner.png"
            },
        ],
        startPoint: 0,
        intervelHander: null,
        timeoutHande: null
    },
    onLoad(option) {
        this.automove()
    },
    pausemove() {
        this.intervelHander && clearInterval(this.intervelHander)
        this.timeoutHander && clearTimeout(this.timeoutHander)
        this.timeoutHande = setTimeout(() => {
            this.automove()
        }, 1000)
    },
    automove() {
        this.intervelHander && clearInterval(this.intervelHander)
        this.intervelHander = setInterval(() => {
            this.moveLeftorRight(1)
        }, 3000)
    },
    start: function (e) {
        this.data.startPoint = e.changedTouches[0].pageX;
    },
    end: function (e) {
        let isLeft = 0;
        let endPoint = e.changedTouches[0].pageX;
        isLeft = (endPoint - this.data.startPoint);
        this.pausemove()
        if (isLeft < 0) {
            this.moveLeftorRight(1);
        }
        if (isLeft > 0) {
            this.moveLeftorRight(0);
        }
    },
    moveLeftorRight: function (idx) {
        let swp = this.data.swiperList;
        let max = swp.length;
        let self = this;
        for (let j = 0; j < max; j++) {
            swp[j].active = true;
        }
        if (idx === 1) {
            if (swp[0] && swp[1]) {
                swp[0].swpClass = 'imgleft1';
                swp[1].swpClass = 'imgleft2';
                if (swp[2]) {
                    swp[2].swpClass = 'imgleft3';
                }
                this.setData({
                    swiperList: swp
                }, () => {
                    swp.push(swp.shift());
                    self.setData({
                        swiperList: swp
                    })
                })
            }
        } else {
            if (swp[1]) {
                swp[max - 1].swpClass = 'imgright1'
                swp[0].swpClass = 'imgright2'
                if (swp[2]) {
                    swp[1].swpClass = 'imgright3'
                }
                self.setData({
                    swiperList: swp
                }, () => {
                    swp.unshift(swp.pop());
                    self.setData({
                        swiperList: swp
                    })
                })
            }
        }
    }
})