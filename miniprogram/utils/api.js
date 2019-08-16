// const tokenUrl = 'https://aip.baidubce.com/rest/2.0/image-classify/v2/advanced_general'; // 百度AI图像识别接口

// 用户操作接口
const baseURl = `http://182.92.118.79:8090`
const api = {
    toiletAdd: baseURl + '/toilet/add', // 添加厕所信息
    toiletTist: baseURl + '/toilet/list', // 厕所信息列表
    reviewAdd: baseURl + '/review/add', // 评分评论点赞
    reviewToilet: baseURl + '/review/toilet/', // 评论列表
    reviewUpdateLikeNumber: baseURl + '/review/updateLikeNumber', // 点赞厕所数
    reviewUpdateScore: baseURl + '/review/updateScore', // 厕所打分
    toiletById: baseURl + '/toilet/' ,     //id获取厕所信息
    accountByOpenid: baseURl+'/account/identity/',     //openid获取微信账户信息
    accountAdd:baseURl+'/account/add',    //添加微信账户信息 
    uploadPic: baseURl +'/portal/upload'   //上传图片
}
// module.exports = tokenUrl
module.exports = api