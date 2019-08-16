// miniprogram/pages/template/border.js
// pages/inputtips/inputtips.js
var amapFile = require('../../../libs/amap-wx.js');
var config = require('../../../libs/config.js');
let appdatas = getApp() //全局变量
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tips: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    console.log(e)
    var that=this
    var lonlat = e.lonlat;
    var city = e.city;
    that.setData({
      lonlat: lonlat,
      city:city
    })
    
  },
  bindInput: function (e) {
    var that = this;
    var keywords = e.detail.value;
    var key = config.Config.key;
    var myAmapFun = new amapFile.AMapWX({ key: key });
    myAmapFun.getInputtips({
      keywords: keywords,
      location: that.data.lonlat,
      city: that.setData.city,
      success: function (data) {
        if (data && data.tips) {
          that.setData({
            tips: data.tips
          });
        }
      }
    })
  },
  bindSearch: function (e) {
    var keywords = e.target.dataset.keywords;
    var url = '../../tabBar/map/map?keywords=' + keywords;
    //var url ='../../tabBar/map/map';
    //appdatas.globalData.searchKeywords=keywords;
    console.log(keywords);
    //wx.setStorageSync("searchKeywords", keywords);
    // wx.redirectTo({
    //   url: url
    // })
    // wx.switchTab({
    //   url: url,
    // })
    wx.reLaunch({
      url: url
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})