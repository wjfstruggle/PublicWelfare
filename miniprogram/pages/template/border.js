// miniprogram/pages/template/border.js
// pages/inputtips/inputtips.js
var amapFile = require('../../libs/amap-wx.js');
var config = require('../../libs/config.js');
let appdatas = getApp() //全局变量
Page({
  data: {
    tips: {}
  },
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
   // var url = '../map/map?keywords=' + keywords;
    var url ='../map/map';
    //appdatas.globalData.searchKeywords=keywords;
    //console.log(appdatas.globalData);
    wx.setStorageSync("searchKeywords", keywords);
    // wx.redirectTo({
    //   url: url
    // })
    wx.switchTab({
      url: url,
    })
  }
})