/*
 * @Descripttion: 用户信息发布页面
 * @version: 
 * @Author: sueRimn
 * @Date: 2019-07-26 10:25:42
 * @LastEditors: sueRimn
 * @LastEditTime: 2019-08-08 11:54:15
 */
const api = require('../../../utils/api')
const {
  myRequest
} = require('../../../utils/request')
const app = getApp();
Page({
  data: {
    PublishMsg: {}, // 接收用户固定定位的地址
    tempFilePaths: [], // 上传图片地址预览
    inputAddrValue: '', // 详细地址信息
    inputDesValue: '', // 卫生间描述信息
    fileID: '',
    base64Data: [],
    WCtypes: [{
        name: 'PT',
        value: '公共厕所'
      },
      {
        name: 'SHOPT',
        value: '商户厕所'
      },
      {
        name: 'SHOPPINGT',
        value: '大型商场厕所',
      },
      {
        name: 'MT',
        value: '地铁厕所'
      },
    ],
    WCfacility: [{
        name: 'DFT',
        value: '残疾人设施'
      },
      {
        name: 'ISPT',
        value: '有厕纸',
        checked: 'true'
      },
      {
        name: 'SQUA',
        value: '蹲厕',
      },
      {
        name: 'TOLITE',
        value: '马桶',
      }
    ],
    userTypes1: [], // 用户选择的厕所配套设施
    userTypes2: '', // 用户选择的厕所性质
    isSubmit: false // 信息是否提交
  },
  onLoad: function (options) {
    let PublishMsg = JSON.parse(options.PublishMsg)
    this.setData({
      PublishMsg: PublishMsg
    })
  },
  // 输入详细的卫生间地址
  inputAddr(e) {
    this.setData({
      inputAddrValue: e.detail.value
    })
    console.log("详细的卫生间地址", e.detail.value)
  },
  // 标签选择
  checkboxChange(e) {
    console.log("用户选择的厕所配套设施", e.detail.value)
    this.setData({
      userTypes1: e.detail.value
    })
  },
  radioChange(e) {
    console.log("用户选择的厕所性质", e.detail.value)
    this.setData({
      userTypes2: e.detail.value
    })
  },
  // 卫生间信息描述
  inputTextDesc(e) {
    console.log("卫生间信息描述", e.detail.value)
    this.setData({
      inputDesValue: e.detail.value
    })
  },
  // 信息的提交
  submit() {
    let {
      tempFilePaths,
      inputAddrValue,
      inputDesValue,
      userTypes1,
      userTypes2,
      PublishMsg,
      base64Data
    } = this.data
    if (inputAddrValue == "") {
      wx.showToast({
        title: '地址不能为空',
        image: '../../../img/fail.png',
        icon: '',
        mask: true
      })
    } else if (inputDesValue == "") {
      wx.showToast({
        title: '描述不能为空',
        image: '../../../img/fail.png',
        icon: '',
        mask: true
      })
    } else if (userTypes1.length < 2) {
      wx.showToast({
        title: '设施两个以上',
        image: '../../../img/fail.png',
        icon: '',
        mask: true
      })
    } else if (userTypes2 == "") {
      wx.showToast({
        title: '选择厕所性质',
        image: '../../../img/fail.png',
        icon: '',
        mask: true
      })
    } else if (tempFilePaths.length == 0) {
      wx.showToast({
        title: '至少上传一张图',
        image: '../../../img/fail.png',
        icon: '',
        mask: true
      })
    } else {
      myRequest({
        url: api.toiletAdd,
        method: 'POST',
        data: {
          "address": inputAddrValue,
          "description": inputDesValue,
          "label": userTypes1.join(",") + "," + userTypes2,
          "latitude": PublishMsg.latitude,
          "longitude": PublishMsg.longitude,
          "pictureUrl": base64Data.join(";"),
          "publisher": app.globalData.openid
        }, 
        success: res => {
          console.log(res)
          wx.showLoading({
            title: '信息加载中...',
            duration: 2000
          })
          if (res.statusCode == 200) {
            wx.hideLoading();
            wx.showToast({
              title: '信息发布成功',
              icon: 'success'
            })
            this.setData({
              isSubmit: true
            })
            return true
          } else {
            wx.hideLoading();
            wx.showToast({
              title: '信息发布失败',
              icon: 'success'
            })
          }
        }
      })
    }
    return false
  },
  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 6, // 数量
      sizeType: ['original','compressed'], // 选择上传原图和压缩图
      sourceType: ['album', 'camera'], // 选择本地图片或者相机拍照
      success: res => {
        console.log("图片地址", res)
        wx.showLoading({
          title: '上传中...',
          duration: 3000
        })
        setTimeout(() => {
          this.setData({
            tempFilePaths: res.tempFilePaths
          })
        }, 2000)
        let pictureUrl = []
        for (let i = 0; i < res.tempFilePaths.length; i++) {
          let filePath = res.tempFilePaths[i]
          wx.uploadFile({
            url: api.uploadPic, //仅为示例，非真实的接口地址
            filePath: res.tempFilePaths[i], 
            name: "file",
            header: {
              "Content-Type": "multipart/form-data"
            },
            success: function (res) {
                if(res.data){
                  setTimeout(() => {
                    wx.showToast({
                      title: '上传成功',
                      icon: 'success'
                    })
                  }, 2000)          
                  console.log("上传返回的结果" + res.data)
                  pictureUrl.push(res.data);
                }
              
            }
          })
          this.setData({
            base64Data: pictureUrl
          })
          // wx.getFileSystemManager().readFile({
          //   filePath: filePath,
          //   encoding: 'base64',
          //   success: res => {
          //     setTimeout(() => {
          //       wx.showToast({
          //         title: '上传成功',
          //         icon: 'success'
          //       })
          //     }, 2000)
          //     pictureUrl.push('data:image/jpeg;base64,' + res.data)
          //     this.setData({
          //       base64Data: pictureUrl
          //     })
          //     // console.log('[上传文件] 成功：', res)
          //     console.log('[上传文件] 成功：', pictureUrl.join(",,"))
          //   },
          //   fail: e => {
          //     console.error('[上传文件] 失败：', e)
          //     wx.showToast({
          //       icon: 'none',
          //       title: '上传失败',
          //     })
          //   },
          //   complete: () => {
          //     wx.hideLoading()
          //   },
          //   fail: e => {
          //     console.error(e)
          //   }
          // })
        }
        complete: () => {
          wx.hideLoading()
        }
      },
    })
  },
  // 返回首页
  toIndex() {
    wx.switchTab({
      url: '../../tabBar/index/index'
    })
  }
})