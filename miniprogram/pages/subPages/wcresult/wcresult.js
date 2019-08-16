/*
 * @Descripttion: 厕所信息的分类
 * @version: 
 * @Author: sueRimn
 * @Date: 2019-07-26 10:03:31
 * @LastEditors: sueRimn
 * @LastEditTime: 2019-08-08 11:24:01
 */
const api = require('../../../utils/api')
var amapFile = require('../../../libs/amap-wx.js');
var config = require('../../../libs/config.js');
const {
  myRequest
} = require('../../../utils/request')
Page({

  data: {
    imgUrls: [
      '../../../img/wc.png',
      '../../../img/wc2.jpg',
      '../../../img/wc3.jpg'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    easingFunction: 'easeInOutCubic',
    circular: true,
    latitude: '',
    longitude: '',
    toiletTist:[]
  },
  toResultTow(e) {
    console.log(e)
    var toilet=e.currentTarget.dataset.toilet;
    toilet = JSON.stringify(toilet)
    wx.navigateTo({
      url: '../../subPages/wcresultTow/wcresultTow?toilet='+toilet
    })
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    var that=this
    var key = config.Config.key;
    var myAmapFun = new amapFile.AMapWX({ key: key });
    myAmapFun.getRegeo({
      success: r=> {
       // console.log(r)
        myRequest({
          url: api.toiletTist,
          data: {},
          success: res => {
            //console.log("厕所信息列表", res)
           var toiletTist=[];
           var locationList = [];
           for (var i = 0; i < res.data.list.length; i++) {    
              let item =res.data.list[i]
              var longitude = r[0].longitude;
              var latitude = r[0].latitude;
              var longitude2 = res.data.list[i].longitude;
              var latitude2 = res.data.list[i].latitude;
              //计算距离
              myAmapFun.getWalkingRoute({
                origin: `${longitude},${latitude}`,
                destination: `${longitude2},${latitude2}`,
                success: function (result) {
                  if (result.paths[0] && result.paths[0].distance){
                    if (parseInt(result.paths[0].distance)>0){
                       item.distance = result.paths[0].distance
                       toiletTist.push(item)
                       that.setData({
                         toiletTist: toiletTist.sort(that.compare)
                       })
                    }
                   }
                },
                fail: function (info) {
                  console.log(info)
                }
              })
            }
            wx.hideLoading()

          }
        })
      }
    }) 
    // console.log("222"+toiletTist)
    // console.log("类型" + typeof (that.data.toiletTist))
    //console.log("排序后的列表" + toiletTist.sort(compare))
  },
  //数组对象排序
 compare:function (obj1, obj2) {
   var val1 = parseInt(obj1.distance)
   var val2 = parseInt(obj2.distance)
    if (val1 < val2) {
      return -1;
    } else if (val1 > val2) {
      return 1;
    } else {
      return 0;
    }
  } ,
  //计算距离
  // getDistance(myAmapFun,data, longitude, latitude){
  //   var toiletTist=[];
  //   for (var i = 0; i < data.length; i++) {
  //     let item = data[i]
  //     var longitude = longitude;
  //     var latitude = latitude;
  //     var longitude2 = data[i].longitude;
  //     var latitude2 = data[i].latitude;
  //     //计算距离
  //     myAmapFun.getWalkingRoute({
  //       origin: `${longitude},${latitude}`,
  //       destination: `${longitude2},${latitude2}`,
  //       success: function (result) {
  //         if (result.paths[0] && result.paths[0].distance) {
  //           if (parseInt(result.paths[0].distance) > 0) {
  //             item.distance = result.paths[0].distance
  //             toiletTist.push(item)
  //             //console.log(toiletTist)
  //           }
  //         }
  //       },
  //       fail: function (info) {
  //         console.log(info)
  //       }
  //     })
  //   }
  //   console.log("返回数据"+toiletTist)
  //   return toiletTist;

  // },
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
})