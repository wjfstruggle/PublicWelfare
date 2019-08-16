//index.js
const app = getApp()
var config = require('../../../libs/config.js');
const api = require('../../../utils/api')
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
    isHide: true, //是否显示授权页面
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  // 跳转到寻找厕所页面
  findWC() {
    wx.navigateTo({
      url: '../../subPages/wcresult/wcresult'
    })
  },
  // 信息发布页面
  publishMsg() {
    wx.navigateTo({
      url: '../../Map/regeo/regeo'
    })
  },
  // 垃圾识别页面
  GarbageIdenty() {
    wx.navigateTo({
      url: '../../Grabage/camera/camera'
    })
  },
  // 文字识别页面
  Tolottery() {
    wx.navigateTo({
      url: '../../subPages/textCamera/textCamera'
    })
  },
  onLoad: function () {
    // 获取用户信息
    //  var appid = config.Config.appid;
    //  var appSecret=config.Config.appSecret;
    //李庆的秘钥
    //查看是否授权
    wx.getSetting({
      success: res => {
        if (res.authSetting["scope.userInfo"]) {
          this.setData({
            isHide: false
          })
          wx.getUserInfo({
            success: result => {
              app.globalData.userInfo = result.userInfo;
              // var jsonStr = JSON.stringify(goodsJsonStr2)

            }
          })
        } else {
          //用户授权
          this.setData({
            isHide: true
          })
        }
      }
    })
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        app.globalData.openid = res.result.openid
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },

  bindGetUserInfo: function (e) {
    //console.log(e)
    var that = this;
    //用户按下允许授权
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo;
      wx.login({
        success: data => {
          console.log(data.code)
          // var appid = "wxc095705554d9d1bf";
          // var appSecret = "72394ced6ecb7d9330d215158cf11f34";
          var appid = config.Config.appId;
          var appSecret = config.Config.appSecret;
          var url = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appid + '&secret=' + appSecret + '&js_code=' + data.code + '&grant_type=authorization_code';
          //获取openid
          wx.request({
            url: url,
            method: 'GET',
            success: r => {
              console.log(r)
              if (r.data.openid) {
                app.globalData.openid = r.data.openid
                //判断用户是否存在
                myRequest({
                  url: api.accountByOpenid+r.data.openid,
                  data: {},
                  success: res => {
                    console.log(res.data)
                     if(res.data==''){
                       console.log(111)
                       var jsonstr = {
                         "identity": r.data.openid,
                         "wxName": e.detail.userInfo.nickName,
                         "wxPhoto": e.detail.userInfo.avatarUrl
                       }
                        var dataStr = JSON.stringify(jsonstr);
                        myRequest({
                          url: api.accountAdd,
                          data: dataStr,
                          method:"POST",
                          success: d => {
                            console.log(d);
                            if (d.data.status == "1") {
                              console.log("用户信息保存数据库成功");
                            } else {
                              console.log("用户信息保存数据库失败");
                            }
                         },
                         fail: function () {
                          
                         }
                       })
                     }else{
                       console.log("该用户已存在")
                     }
                  },
                  fail: function (info) {
                    console.log(info)
                  }
                })
               
              }

            }
          })
        }
      })
      that.setData({
        isHide: false
      })
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序!',
        showCancel: false, //不显示取消按钮
        confirmText: '返回授权',
        success: function (res) {
          if (res.confirm) {
            that.setData({
              isHide: true
            })
          }
        }
      })
    }
  }
})