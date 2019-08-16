// miniprogram/pages/subPages/prize/prize.js
Page({
  data: {
    isPrizeFirst: false,
    isPrizeTow: false,
    isPrizeThree: false
  },
  onLoad: function (options) {
    let score = options.score;
    console.log("颜值分数",score)
    if (score <= 30) {
      this.setData({
        isPrizeThree: true
      })
    } else if(score > 30 && score <= 70) {
      this.setData({
        isPrizeTow: true
      })
    } else {
      this.setData({
        isPrizeFirst: true
      })
    }
  },
  // 返回首页
  toIndex() {
    wx.switchTab({
      url: '../../tabBar/index/index'
    })
  }
})