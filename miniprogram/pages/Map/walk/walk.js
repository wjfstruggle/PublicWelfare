// pages/walk/walk.js
var amapFile = require('../../../libs/amap-wx.js')
var config = require('../../../libs/config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    markers: [],
    polyline: [],
    distance: '',
    cost: '',
    transits: [],
    city: "",
    name: "",
    desc: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    let { latitude, longitude, latitude2, longitude2, city, name, desc } = e;
    let markers = [
      {
        iconPath: "../../../img/mapicon_navi_s.png",
        id: 0,
        latitude,
        longitude,
        width: 23,
        height: 33
      }, {
        iconPath: "../../../img/mapicon_navi_e.png",
        id: 1,
        latitude: latitude2,
        longitude: longitude2,
        width: 24,
        height: 34
      }
    ];
    this.setData({
      latitude, longitude, latitude2, longitude2, markers, city, name, desc
    });
    this.getRoute();
  },
  getRoute(){
    var that=this
    let { latitude, longitude, latitude2, longitude2, types, cindex, city } = that.data;
    let origin = `${longitude},${latitude}`;
    let destination = `${longitude2},${latitude2}`;
    var key = config.Config.key;
    //实例化 AMapWX 对象
    var myAmapFun = new amapFile.AMapWX({ key: key });
    //步行路线规划
    myAmapFun.getWalkingRoute({
      origin: origin,
      destination: destination,
      success:function(data){
        that.setRouteData(data);
      },
      fail: function (info) {
      }

    })
  },
  //设置路线
  setRouteData(data) {
    let points = [];
    if (data.paths && data.paths[0] && data.paths[0].steps) {
      let steps = data.paths[0].steps;
        wx.setStorageSync("steps", steps);
        steps.forEach(item1 => {
          let poLen = item1.polyline.split(';');
          poLen.forEach(item2 => {
            let obj = {
              longitude: parseFloat(item2.split(',')[0]),
              latitude: parseFloat(item2.split(',')[1])
            }
            points.push(obj);
          })
        })
        //路线
      this.setData({
        polyline: [{
          points: points,
          color: "#0091ff",
          width: 6
        }]
      });
    }
    if (data.paths[0] && data.paths[0].distance) {
        this.setData({
          distance: data.paths[0].distance + '米'
        });
      }
    if (data.paths[0] && data.paths[0].duration) {
        this.setData({
          cost: parseInt(data.paths[0].duration / 60) + '分钟'
        });
      }
  },
  //路线详情
  goDetail() {
    let url ='../../Map/walkDetail/walk_detail';
    wx.navigateTo({ url });
  },
  //打开地图导航
  nav() {
    let { latitude2, longitude2, name, desc } = this.data;
    console.log(typeof(latitude2))//字符串
    wx.openLocation({
      //latitude: +latitude2,//要求Number
      latitude: parseFloat(latitude2),//要求Number
      longitude: +longitude2,
      name,
      address: desc
    });
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