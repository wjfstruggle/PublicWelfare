const {
  myRequestAi
} = require('../../../utils/request')
const tokenURL = require('../../../utils/api')
Page({
  data: {
    cameraText: '拍照',
    imgUrl: '', // 图片路径
    result: [], // 识别返回
    accessToken: '', // 验证信息
    isCamera: true, // 拍照模式
    isShow: false // 显示拍照结果
  },
  onLoad: function (options) {
    let time = wx.getStorageSync("time")
    // 由于accessToken的实效时间为30天，30天过后accessToken需重新授权
    let curTime = new Date().getTime()
    let timeNum = new Date(parseInt(curTime - time) * 1000).getDay()
    let accessToken = wx.getStorageSync("access_token")
    if (timeNum > 28 || (accessToken == "" ||
        accessToken == null || accessToken == undefined)) {
      this.accessTokenFunc()
    } else {
      this.setData({
        accessToken: wx.getStorageSync('access_token')
      })
    }
  },
  takePhoto() {
    let {
      isCamera
    } = this.data
    if (isCamera == false) {
      this.setData({
        cameraText: '拍照'
      })
      return
    }
    const ctx = wx.createCameraContext();
    ctx.takePhoto({
      quality: "hight", // 图片质量
      success: res => {
        this.setData({
          imgUrl: res.tempImagePath,
          isCamera: false,
          cameraText: "重拍"
        })
        wx.showLoading({
          title: '图像识别中...'
        })
        // 将拍照的图片转化成base64格式
        wx.getFileSystemManager().readFile({
          filePath: res.tempImagePath,
          encoding: 'base64',
          success: res => {
            this.AIIdentif(res.data)
          },
          fail: err => {
            wx.hideLoading()
            wx.showToast({
              title: '拍照失败,未获取相机权限或其他原因',
              icon: "none"
            })
          }
        })
      },
    })
  },
  // 图片识别
  AIIdentif(baseURL) {
    myRequestAi({
      url: 'https://aip.baidubce.com/rest/2.0/image-classify/v2/advanced_general',
      method: "POST",
      data: {
        access_token: this.data.accessToken,
        image: baseURL,
        baike_num: 0,
      },
      success: res => {
        console.log("识别返回结果", res)
        wx.hideLoading()
        if (res.data.result !== undefined && res.data.result !== null) {
          this.setData({
            result: res.data.result,
            isShow: true
          })
        }
      }
    })
  },
  // 授权获得百度云access_token
  accessTokenFunc() {
    wx.cloud.callFunction({
      name: 'baiduAccessToken',
      success: res => {
        wx.setStorageSync('access_token', res.result.data.access_token) // access_token存到本地
        wx.setStorageSync('time', new Date().getTime()) // access_token创建时间
      },
      fail: err=> {
        wx.showToast({
          title: 'AI获取失败',
          icon: 'none'
        })
        console.error('[云函数] [baiduAccessToken] 调用失败：', err)
      }
    })
  },
  // 关闭弹窗
  hideModal() {
    this.setData({
      isShow: false
    })
  },
  // 图像识别结果的选择
  radioChange(e) {
    console.log("选择识别结果",e.detail.value)
    let value = e.detail.value
    wx.navigateTo({
      url: '../resultImg/resultImg?keyword=' + value
    })
  },
    // 重拍
    againTakePhoto() {
      if(this.data.isCamera == false) {
        this.setData({
          isCamera: true
        })
      }
    }
})