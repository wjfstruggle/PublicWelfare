const app = getApp()
Page({
  data: {
     userInfo:'',
     punch: '打卡'
  },
  onLoad: function (options) {
     this.setData({
       userInfo: app.globalData.userInfo 
     })
  },
})