/*
 * @Descripttion: 获取当前地址描述详细信息数据
 * @version: 
 * @Author: sueRimn
 * @Date: 2019-07-24 16:15:22
 * @LastEditors: sueRimn
 * @LastEditTime: 2019-08-02 15:19:15
 */
var amapFile = require('../../../libs/amap-wx.js');
var config = require('../../../libs/config.js');

Page({
  data: {
    markers: [],
    latitude: '',
    longitude: '',
    pois: [] //当前定位地址
  },
  onLoad: function() {
    var that = this;
    var key = config.Config.key;
    var myAmapFun = new amapFile.AMapWX({key: key});
    myAmapFun.getRegeo({
      iconPath: "../../../img/marker.png",
      iconWidth: 22,
      iconHeight: 32,
      success: function(data){
        console.log("当前定位信息",data)
        var marker = [{
          id: data[0].id,
          latitude: data[0].latitude,
          longitude: data[0].longitude,
          iconPath: data[0].iconPath,
          width: data[0].width,
          height: data[0].height
        }]
        let pois = that.dataProcess(data[0].regeocodeData.pois)
        that.setData({
          pois: pois
        })
        that.setData({
          markers: marker
        });
        that.setData({
          latitude: data[0].latitude
        });
        that.setData({
          longitude: data[0].longitude
        });
      },
      fail: function(info){
        wx.showModal({title:info.errMsg})
      }
    })
  },
  // 数据处理
  dataProcess(data) {
    let obj = data;
    obj.forEach(item => {
      item.address = item.address.slice(0,22)
    });
    return obj
  },
  toPublishMsg(e) {
    let {pois} = this.data
    let index = e.currentTarget.dataset.index
    let PublishMsg = {
      latitude: pois[index].location.split(',')[1],
      longitude: pois[index].location.split(',')[0],
      name: pois[index].name
    } 
    console.log("用户选择的定位信息",PublishMsg)
    PublishMsg = JSON.stringify(PublishMsg)
    wx.navigateTo({
      url: '../../subPages/publishMsg/publishMsg?PublishMsg=' + PublishMsg
    })
  }
})