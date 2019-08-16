/*
 * @Descripttion: 小程序云数据库操作
 * @version: 
 * @Author: sueRimn
 * @Date: 2019-07-31 17:35:51
 * @LastEditors: sueRimn
 * @LastEditTime: 2019-08-01 15:38:36
 */
const db = wx.cloud.database()
const app = getApp()
Page({
  data: {
    keyword: '', // 用户识别返回的结果
    dataCount: 0, // 统计查询结果记录数
    page: 0, // 用于分页
    LIMT_MAX: 20, // 每页显示20条数据
    dataResult: [],
    isHasData: true,
    openid: ''
  },
  onLoad: function (options) {
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      })
    }
    let keyword = options.keyword
    this.setData({
      keyword: keyword
    })
    this.GetDataClassify()
  },
  // 垃圾分类函数
  GetDataClassify() {
    let {
      keyword,
      page,
      LIMT_MAX,
      dataCount
    } = this.data
    wx.showLoading({
      title: '数据加载中...',
    })
    wx.cloud.callFunction({
      name: 'keywordResult',
      data: {
        page: page,
        LIMT_MAX: LIMT_MAX,
        keyword: keyword,
        dataCount: dataCount
      },
      success: res => {
        console.log("数据集合查询", res);
        wx.hideLoading()
        if(res.result.data.length == 0) {
          wx.showToast({
            title: '暂未查询到数据',
            icon: 'none'
          })
          this.setData({
            dataResult: [],
            isHasData: false
          })
        } else {
          this.setData({
            dataResult: res.result.data,
            isHasData: true
          })
        }
      }
    })
  },
  // 返回首页
  onGoHome() {
    wx.switchTab({
      url: '../../tabBar/index/index'
    })
  },
  // 垃圾分类详情页 
  toClassify(e){
    let index = e.currentTarget.dataset.index // 获取当前点击的索引
    let {dataResult} = this.data
    console.log("选择当前点击的信息：",dataResult[index].sortId +"："+dataResult[index].name)
    let sortIdName = {
      name: dataResult[index].name,
      sortId: dataResult[index].sortId
    }
    sortIdName = JSON.stringify(sortIdName)
    wx.navigateTo({
      url: '../classify/classify?sortIdName=' + sortIdName
    })
  }
})