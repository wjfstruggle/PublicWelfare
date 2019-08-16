// pages/map/map.js
var amapFile =require('../../../libs/amap-wx.js')
var config = require('../../../libs/config.js');
const api = require('../../../utils/api')
const {
  myRequest
} = require('../../../utils/request')
let appdatas = getApp()

var markersData = [];
var toiletList=[];//发布的厕所信息
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyword:'厕所',
    markers: [],
    latitude: '',
    longitude: '',
    textData: {},
    markerId: 0,
    city: '',
    controls: [
      {
        id: 0,
        position: {
          left: 10,
          top: 200,
          width: 40,
          height: 40
        },
        iconPath: "../../../img/circle1.png",
        clickable: true
      }
    ],
    count:0      //poi的地点数
    
  },
  makertap: function (e) {
    console.log(e)
    var id = e.markerId;
    var that = this;
    that.setData({
      markerId:id
    })
    that.showMarkerInfo(markersData, id);
    that.changeMarkerColor(markersData, id);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    var that = this;
    var key = config.Config.key;
    //实例化 AMapWX 对象
    var myAmapFun = new amapFile.AMapWX({ key: key });
    myAmapFun.getRegeo({
      success: function (data) {
        that.setData({
          currentlatitude: data[0].latitude
        });
        that.setData({
          currentlongitude: data[0].longitude
        });
      },
      fail: function (info) {
        // wx.showModal({title:info.errMsg})
      }
    })
    //获取发布的厕所信息
    myRequest({
      url: api.toiletTist,
      data: {},
      success: res => {
        console.log("厕所信息列表", res)
        toiletList=res.data.list
      }
    })
    var params = {
      iconPathSelected: '../../../img/marker_checked.png',
      iconPath: '../../../img/marker.png',
      success: function (data) {
        markersData = data.markers;
        that.setData({
          count:markersData.length
        })
        console.log(data)
        console.log("markersData的类型" + typeof (data.markers))
        console.log("markersData的数据" + markersData)
        // markersData.push({
        //   address:"中数通",
        //   height:28,
        //   iconPath: "../../../img/wc_marker.png",
        //   latitude: 23.128941,
        //   longitude: 113.361634,
        //   name:"中数通",
        //   width:22,
        //   id:markersData.length
        // })
        toiletList.forEach(function(item,i){
          markersData.push({
            address:item.label,
            height:62,
            iconPath: "../../../img/mark_yellow.png",
            latitude: item.latitude,
            longitude: item.longitude,
            name: item.address,
            width:52,
            id:markersData.length
        })
        })
        console.log("markersData的数据2" + markersData[20].latitude)
        var poisData = data.poisData;
        var markers_new = [];
        markersData.forEach(function (item, index) {
          markers_new.push({
            id: item.id,
            latitude: item.latitude,
            longitude: item.longitude,
            iconPath: item.iconPath,
            width: item.width,
            height: item.height,

          })

        })
        if (markersData.length > 0) {
          that.setData({
            markers: markers_new
          });
          that.setData({
            city: poisData[0].cityname || ''
          });
          that.setData({
            latitude: markersData[0].latitude
          });
          that.setData({
            longitude: markersData[0].longitude
          });
          that.showMarkerInfo(markersData, 0);
        } else {
          //获取当前位置
          wx.getLocation({
            type: 'gcj02',
            success: function (res) {
              that.setData({
                latitude: res.latitude
              });
              that.setData({
                longitude: res.longitude
              });
              that.setData({
                city: '北京市'
              });
            },
            fail: function () {
              that.setData({
                latitude: 39.909729
              });
              that.setData({
                longitude: 116.398419
              });
              that.setData({
                city: '北京市'
              });
            }
          })

          that.setData({
            textData: {
              name: '抱歉，未找到结果',
              desc: ''
            }
          });
        }

      },
      fail: function (info) {
        // wx.showModal({title:info.errMsg})
      }
    }
    if (e && e.keywords) {
      console.log(e)
      params.querykeywords = e.keywords;
    } else {
      params.querykeywords = that.data.keyword;
    }
    // var searchKeywords = wx.getStorageSync("searchKeywords")
    // console.log(searchKeywords);
    // if (searchKeywords) {
    //   console.log("搜索")
    //   //关键字搜索
    //   params.querykeywords = searchKeywords;
    // } else {
    //   params.querykeywords = that.data.keyword;
    // }
    myAmapFun.getPoiAround(params);
   // wx.removeStorageSync("searchKeywords");
  },
  //搜索自动关联词显示
  bindInput: function (e) {
    var that = this;
    var url = '../../Map/inputtips/inputtips';
    if (e.target.dataset.latitude && e.target.dataset.longitude && e.target.dataset.city) {
      var dataset = e.target.dataset;
      url = url + '?lonlat=' + dataset.longitude + ',' + dataset.latitude + '&city=' + dataset.city;
    }
    wx.navigateTo({
      url: url
    })
    // wx.redirectTo({
    //   url: url
    // })
  },
  //显示标记点的信息
  showMarkerInfo: function (data, i) {
    var that = this;
    that.setData({
      textData: {
        name: data[i].name,
        desc: data[i].address
      }
    });
  },
  //改变标记点变色
  changeMarkerColor: function (data, i) {
    var that = this;
    var count=that.data.count;
    var markers = [];
    for (var j = 0; j < data.length; j++) {
      if (j == i) {
        //判断是否是新发布的厕所位置
        if(j<count){
          data[j].iconPath = "../../../img/marker_checked.png";
        }else{
          data[j].iconPath = "../../../img/mark _red.png";
        }     
      } else {
        if(j<count){
          data[j].iconPath = "../../../img/marker.png";
        }else{
          data[j].iconPath = "../../../img/mark_yellow.png";
        }
       
      }
      markers.push({
        id: data[j].id,
        latitude: data[j].latitude,
        longitude: data[j].longitude,
        iconPath: data[j].iconPath,
        width: data[j].width,
        height: data[j].height
      })
      
    }
    that.setData({
      markers: markers
    });
  },
  //回到当前定位点
  markOrign(e) {
    console.log("回到用户当前定位点");
    let { controlId } = e;
    //创建 map 上下文 MapContext 对象
    let mpCtx = wx.createMapContext("map");
    mpCtx.moveToLocation();
  },
  //路线
  getRoute() {
    // 起点
    let { markers, markerId, city, textData } = this.data;
    var latitude=this.data.currentlatitude;
    var longitude=this.data.currentlongitude;
    console.log(latitude + "----------" + longitude);
    let { name, desc } = textData;
    console.log(textData)
    if (!markers.length) return;
    // 终点
    let { latitude: latitude2, longitude: longitude2 } = markers[markerId];
    console.log(markers[markerId])
    let url = `../../Map/walk/walk?longitude=${longitude}&latitude=${latitude}&longitude2=${longitude2}&latitude2=${latitude2}&city=${city}&name=${name}&desc=${desc}`;
    console.log(url)
    wx.navigateTo({ url });
  }
})