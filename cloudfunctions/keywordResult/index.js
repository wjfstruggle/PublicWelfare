// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext()
  let dataCount = db.collection('product').count(); // 获取数据库内容，统计集合记录数或统计查询语句对应的结果记录数，
  let page = event.page
  let LIMT_MAX = event.LIMT_MAX
  let keyword = event.keyword
  let dataBack = ''
  try {
    if (dataCount < page * LIMT_MAX) {
      dataBack =  {errCode: 0,title:"数据加载完成"}
    }
    return await db.collection('product').skip(page * LIMT_MAX).limit(LIMT_MAX).where({
      name: db.RegExp({
        regexp: keyword
      })
    }).get()
  } catch (error) {
    console.log(error)
  }



  return {
    event,
    dataBack,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}