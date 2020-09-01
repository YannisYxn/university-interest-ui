
const host = 'http://116.62.239.164:8080/xiaoqu'
// const host = 'http://2559jc4123.wicp.vip:41613'
const hostForFile = 'http://116.62.239.164:5001'
 
function request (url, method, data, header = {}) {
  wx.showLoading({
    title: '加载中' // 数据请求前loading
  })
  return new Promise((resolve, reject) => {
    wx.request({
      url: host + url, // 仅为示例
      method: method,
      data: data,
      headers: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        wx.hideLoading()
        resolve(res.data)
      },
      fail: function (res) {
        wx.hideLoading()
        // reject(false)
      },
      complete: function () {
        wx.hideLoading()
      }
    })
  })
}
 
function get (obj) {
  return request(obj.url, 'GET', obj.data)
}
 
function post (obj) {
  return request(obj.url, 'POST', obj.data)
}

function deleteRequest (obj) {
  return request(obj.url, 'DELETE', obj.data)
}
 
export default {
  request,
  get,
  post,
  deleteRequest,
  host,
  hostForFile
}