/*
 * @Descripttion: 获取地址描述数据
 * @version: 
 * @Author: sueRimn
 * @Date: 2019-07-24 16:15:22
 * @LastEditors: sueRimn
 * @LastEditTime: 2019-08-08 11:57:43
 */
var amapFile = require('../../../libs/amap-wx.js');
var config = require('../../../libs/config.js');
const {
  myRequest
} = require('../../../utils/request')
const api = require('../../../utils/api')
const app = getApp();
Page({
  data: {
    markers: [],
    latitude: '',
    longitude: '',
    textData: {},
    isCommit: true,
    userInfo: '',
    likeCount: 0, // 点赞数
    isLike: false, // 是否已点赞，
    toilet: {}, // 接收数据
    id: '',
    empty_star: 5, //未选择星星
    full_star: 0, //已选择星星
    reviewList: [], // 评论列表
    reviewContent: '',
    isSubmit: false, // 信息是否提交
    userData: {}, // 用户发布信息
    reviewData: {}
  },
  onLoad: function (e) {
    let toilet = JSON.parse(e.toilet)
    var that = this;
    that.setData({
      id: toilet.pkId
    })
    this.setData({
      toilet: toilet
    })
    this.setData({
      total: 5,
      num: 4
    })
    this.setData({
      openid: app.globalData.openid
    })
    var key = config.Config.key;
    var myAmapFun = new amapFile.AMapWX({
      key: key
    });
    this.setData({
      userInfo: app.globalData.userInfo
    })
    this.setData({
      createTime: this.transformTime(toilet.createTime)
    })
    myAmapFun.getRegeo({
      iconPath: "../../../img/mark_yellow.png",
      iconWidth: 62,
      iconHeight: 72,
      success: function (data) {
        var marker = [{
          id: data[0].id,
          latitude: data[0].latitude,
          longitude: data[0].longitude,
          iconPath: data[0].iconPath,
          width: data[0].width,
          height: data[0].height
        }]
        that.setData({
          markers: marker
        });
        that.setData({
          latitude: data[0].latitude
        });
        that.setData({
          longitude: data[0].longitude
        });
        that.setData({
          textData: {
            name: data[0].name,
            desc: data[0].desc
          }
        })
      },
      fail: function (info) {
        // wx.showModal({title:info.errMsg})
      }
    })
    // 评论列表
    myRequest({
      url: api.reviewToilet + this.data.id,
      success: res => {
        console.log('所有评论 :', res);
        this.commentsUser(res.data.list)
        this.setData({
          reviewList: this.processData(res.data.list)
        })
      }
    })
    // 综合评分
    // myRequest({
    //   url: api.reviewUpdateScore,
    //   data: {},
    //   success: res => {
    //     console.log('综合评分 :', res);
    //   }
    // })
    // 用户发布信息查询
    myRequest({
      url: api.accountByOpenid + toilet.publisher,
      data: {},
      success: res => {
        console.log("用户发布信息查询", res)
        this.setData({
          userData: res.data
        })
      }
    })
  },
  towalk() {
    var that = this
    var latitude = that.data.latitude;
    var longitude = that.data.longitude;
    var id = that.data.id
    if (that.data.id) {
      myRequest({
        url: api.toiletById + id,
        data: {},
        success: res => {
          console.log("厕所信息", res)
          var key = "f01ef778108c977e9ea75d13966b01d8";
          var latitude2 = res.data.latitude;
          var longitude2 = res.data.longitude;
          var url = "https://restapi.amap.com/v3/geocode/regeo?output=json&location=" + longitude2 + "," + latitude2 + "&key=" + key + "&radius=1000&extensions=all";
          wx.request({
            url: url,
            success: d => {
              var city = d.data.regeocode.addressComponent.city;
              var name = d.data.regeocode.formatted_address;
              var desc = d.data.regeocode.addressComponent.streetNumber.street +
                d.data.regeocode.addressComponent.streetNumber.number;
              let toUrl = `../../Map/walk/walk?longitude=${longitude}&latitude=${latitude}&longitude2=${longitude2}&latitude2=${latitude2}&city=${city}&name=${name}&desc=${desc}`;
              console.log(toUrl + typeof (toUrl))
              wx.navigateTo({
                url: toUrl
              })
            }
          })
        }
      })
    }
  },
  reviewInfo(e) {
    this.setData({
      reviewContent: e.detail.value
    })
    console.log("用户输入的评论：", e.detail.value)
  },
  // 评论
  commit() {
    if (this.data.reviewContent == '') {
      wx.showModal({
        title: '提交失败',
        content: '评价内容不能为空',
        showCancel: false
      })
    } else {
      myRequest({
        url: api.reviewAdd,
        method: "POST",
        data: {
          "content": this.data.reviewContent, // 评论信息
          "likeCount": this.data.likeCount, // 点赞数
          "score": this.data.full_star, // 评分
          "frAccount": app.globalData.openid, // 用户id
          "frToilet": this.data.id // 厕所id
        },
        success: res => {
          console.log("评论信息", res)
          this.setData({
            isSubmit: true
          })
          wx.showToast({
            title: '提交成功',
            icon: 'success'
          })
        }
      })
    }
  },
  commentsUser(data) {
    // 用户评论信息查询
    for (let i = 0; i < data.length; i++) {
      myRequest({
        url: api.accountByOpenid + data[i].frAccount,
        data: {},
        success: res => {
          console.log("用户评论信息查询", res)
          this.setData({
            reviewData: res.data
          })
        }
      })
    }
  },
  // 用户点赞操作
  like() {
    this.setData({
      isLike: !this.data.isLike
    })
    if (this.data.isLike == true) {
      this.data.likeCount += 1;
    } else {
      this.data.likeCount -= 1;
    }
    myRequest({
      url: api.reviewUpdateLikeNumber,
      data: {
        "frAccount": app.globalData.openid, // 用户id
        "frToilet": this.data.id, // 厕所id
        "likeCount": this.data.likeCount,
      },
      success: res => {
        console.log('所有点赞数 :', res);
        // 点赞数
        this.setData({
          likeCount: res.data.likeNumber
        })
      }
    })
  },
  //  时间戳转换
  transformTime(timestamp = +new Date()) {
    if (timestamp) {
      var time = new Date(timestamp);
      var y = time.getFullYear();
      var M = time.getMonth() + 1;
      var d = time.getDate();
      var h = time.getHours();
      var m = time.getMinutes();
      return y + '-' + this.addZero(M) + '-' + this.addZero(d) + ' ' + this.addZero(h) + ':' + this.addZero(m)
    } else {
      return '';
    }
  },
  addZero(m) {
    return m < 10 ? '0' + m : m;
  },
  // 返回数据处理
  processData(data) {
    let obj = data;
    obj.forEach(item => {
      item.createTime = this.transformTime(obj.createTime)
    });
    return obj
  },
  // 星星打分
  star(e) {
    let in_xin = e.currentTarget.dataset.in
    let id = Number(e.currentTarget.id);
    let {
      empty_star,
      full_star
    } = this.data
    if (in_xin == 'starId_2') {
      empty_star = 5 - (id + full_star);
      full_star = full_star + id;
    } else {
      if (full_star == id) {
        empty_star = 6 - id;
        full_star = id - 1;
      } else {
        empty_star = 5 - id;
        full_star = id;
      }
    }
    this.setData({
      empty_star: empty_star,
      full_star: full_star
    })
    myRequest({
      url: api.reviewUpdateScore,
      data: {
        "frAccount": app.globalData.openid, // 用户id
        "frToilet": this.data.id, // 厕所id
        "score": this.data.full_star
      },
      success: res => {
        console.log('评分 :', res);
      }
    })
  },
  // 返回首页
  toIndex() {
    wx.switchTab({
      url: '../../tabBar/index/index'
    })
  }
})