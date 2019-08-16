/*
 * @Descripttion: 封装了请求接口函数，携带验证信息token
 * @version: 
 * @Author: sueRimn
 * @Date: 2019-07-24 09:50:45
 * @LastEditors: sueRimn
 * @LastEditTime: 2019-08-04 13:29:26
 */
function myRequest(options) {
    let token = wx.getStorageSync('token')
    // 判断是否存在URL
    if (!options.url) {
        return false
    }
    wx.request({
        url: options.url,
        data: options.data || {},
        method: options.method || "GET",
        header: {
            "content-type": "application/json;charset=UTF-8"
        },
        success: options.success, // 成功回调
        fail: options.fail // 失败回调
    })
}

function myRequestAi(options) {
    // 判断是否存在URL
    if (!options.url) {
        return false
    }
    wx.request({
        url: options.url,
        data: options.data || {},
        method: options.method || "GET",
        header: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: options.success, // 成功回调
        fail: options.fail // 失败回调
    })
}
module.exports = {
    myRequest: myRequest,
    myRequestAi: myRequestAi
}

/**
 * 使用方式： 
文件引入： const {myRequest} = require('../../../utils/myRequest') // 请求函数
myRequest({
    url: '',
    data: {},
    success: fn
})
 */