const rq = require('request-promise')
/**
 * 获取百度ai AccessToken
 */
exports.main = async(event, context) => {
  let apiKey = 'brS727MSWRKL86nnPTGH1SPS',
    grantType = 'client_credentials',
    secretKey = 'CpiXcVVQ4rdaq06uxgMhwgI1GfeWGEyA',
    url = `https://aip.baidubce.com/oauth/2.0/token`
    return new Promise(async(resolve, reject) => {
      try {
        let data = await rq({
          method: 'POST',
          url,
          form: {
            "grant_type": grantType,
            "client_secret": secretKey,
            "client_id": apiKey
          },
          json: true
        })
        resolve({
          code: 0,
          data,
          info: '操作成功！'
        })
      } catch (error) {
        console.log(error)
        if (!error.code) reject(error)
        resolve(error)
      }
    })
  }