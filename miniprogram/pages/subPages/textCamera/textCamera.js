const {
  myRequestAi
} = require('../../../utils/request')
Page({
  data: {
    cameraText: '拍照',
    imgUrl: '', // 图片路径
    words_result: [], // 文字识别返回
    face_result: [], // 人脸识别返回
    accessToken: '', // 验证信息
    isCamera: true, // 拍照模式
    isShow: false, // 显示拍照结果
    text_isShow: false, // 文字识别模式
    face_isShow: true, // 人脸识别模式
  },
  // onLoad: function (options) {
  //   let time = wx.getStorageSync("text_time")
  //   // 由于accessToken的实效时间为30天，30天过后accessToken需重新授权
  //   let curTime = new Date().getTime()
  //   let timeNum = new Date(parseInt(curTime - time) * 1000).getDay()
  //   let accessToken = wx.getStorageSync("text_access_token")
  //   if (timeNum > 28 || (accessToken == "" ||
  //       accessToken == null || accessToken == undefined)) {
  //     this.accessTokenFunc()
  //   } else {
  //     this.setData({
  //       accessToken: wx.getStorageSync('text_access_token')
  //     })
  //   }
  // },
  // takePhoto() {
  //   let {
  //     isCamera
  //   } = this.data
  //   if (isCamera == false) {
  //     this.setData({
  //       cameraText: '拍照'
  //     })
  //     return
  //   }
  //   const ctx = wx.createCameraContext();
  //   ctx.takePhoto({
  //     quality: "hight", // 图片质量
  //     success: res => {
  //       this.setData({
  //         imgUrl: res.tempImagePath,
  //         isCamera: false,
  //         cameraText: "重拍"
  //       })
  //       wx.showLoading({
  //         title: '文字识别中...',
  //       })
  //       // 将拍照的图片转化成base64格式
  //       wx.getFileSystemManager().readFile({
  //         filePath: res.tempImagePath,
  //         encoding: 'base64',
  //         success: res => {
  //           this.AIIdentif(res.data)
  //         },
  //         fail: err => {
  //           wx.hideLoading()
  //           wx.showToast({
  //             title: '拍照失败,未获取相机权限或其他原因',
  //             icon: "none"
  //           })
  //         }
  //       })
  //     },
  //   })
  // },
  // // 图片识别
  // AIIdentif(baseURL) {
  //   myRequestAi({
  //     url: 'https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic',
  //     method: "POST",
  //     data: {
  //       access_token: this.data.accessToken,
  //       image: baseURL,
  //       baike_num: 0,
  //     },
  //     success: res => {
  //       console.log("文字识别返回结果", res)
  //       if (res.data.words_result.length && res.data.words_result !== null) {
  //         res.data.words_result.forEach(item => {
  //           if (item.words.indexOf("CDC") != -1 || item.words.indexOf("中数通") != -1) {
  //             wx.hideLoading()
  //             wx.showToast({
  //               title: '识别成功',
  //               icon: 'success'
  //             })
  //             this.setData({
  //               words_result: res.data.words_result,
  //               isShow: true
  //             })
  //           } else {
  //             wx.showToast({
  //               title: '识别失败，请重试',
  //               image: '../../../img/fail.png'
  //             })
  //           }
  //         })
  //       } else {
  //         wx.hideLoading()
  //         wx.showToast({
  //           title: '识别失败，请重试',
  //           image: '../../../img/fail.png'
  //         })
  //       }
  //     },
  //     fail: err => {

  //     }
  //   })
  // },
  // // 授权获得百度云access_token
  // accessTokenFunc() {
  //   wx.cloud.callFunction({
  //     name: 'baiduAccessToken',
  //     success: res => {
  //       wx.setStorageSync('text_access_token', res.result.data.access_token) // access_token存到本地
  //       wx.setStorageSync('text_time', new Date().getTime()) // access_token创建时间
  //     },
  //     fail: err => {
  //       wx.showToast({
  //         title: 'AI获取失败',
  //         icon: 'none'
  //       })
  //       console.error('[云函数] [baiduAccessToken] 调用失败：', err)
  //     }
  //   })
  // },
  // // 识别CDC字体函数
  // getScanResult(res) {
  //   res.data.words_result.forEach(item => {
  //     if (item.words.indexOf("CDC") != -1 || item.words.indexOf("中数通") != -1) {
  //       return true
  //     }
  //   })
  //   return false
  // },

  // // 关闭弹窗
  cancel() {
    this.setData({
      isShow: false
    })
  },
  defineInfo() {
    wx.navigateTo({
      url: '../prize/prize?score=' + this.data.face_result.beauty
    })
  },
  // 重拍
  againTakePhoto() {
    if (this.data.isCamera == false) {
      this.setData({
        isCamera: true
      })
    }
  },
  // 人脸识别
  onLoad: function (options) {
    let time = wx.getStorageSync("face_time")
    // 由于accessToken的实效时间为30天，30天过后accessToken需重新授权
    let curTime = new Date().getTime()
    let timeNum = new Date(parseInt(curTime - time) * 1000).getDay()
    let accessToken = wx.getStorageSync("face_access_token")
    if (timeNum > 28 || (accessToken == "" ||
        accessToken == null || accessToken == undefined)) {
      this.accessTokenFunc()
    } else {
      this.setData({
        accessToken: wx.getStorageSync('face_access_token')
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
          title: '人脸识别中...',
          duration: 2000
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
      url: 'https://aip.baidubce.com/rest/2.0/face/v3/detect',
      method: "POST",
      data: {
        access_token: this.data.accessToken,
        image: baseURL,
        image_type: 'BASE64',
        max_face_num: 2,
        face_field: "age,beauty,expression,face_shape,gender,glasses,landmark,landmark150,race,quality,eye_status,emotion,face_type"
      },
      success: res => {
        console.log("人脸识别返回结果", res.data.result.face_list[0])
        if (res.data.result.face_list.length && res.data.result.face_list !== null) {
          wx.hideLoading()
          wx.showToast({
            title: '识别成功',
            icon: 'success'
          })
          this.setData({
            face_result: res.data.result.face_list[0],
            isShow: true
          })
        } else {
          wx.showToast({
            title: '识别失败，请重试',
            image: '../../../img/fail.png'
          })
        }
      },
      fail: err => {

      }
    })
  },
  // 授权获得百度云access_token
  accessTokenFunc() {
    wx.cloud.callFunction({
      name: 'faceRecogned',
      success: res => {
        wx.setStorageSync('face_access_token', res.result.data.access_token) // access_token存到本地
        wx.setStorageSync('face_time', new Date().getTime()) // access_token创建时间
      },
      fail: err => {
        wx.showToast({
          title: 'AI获取失败',
          icon: 'none'
        })
        console.error('[云函数] [faceRecogned] 调用失败：', err)
      }
    })
  }
})