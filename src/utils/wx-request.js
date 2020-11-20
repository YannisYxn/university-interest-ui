
const host = 'https://www.xiaoquzu.cn/xiaoqu'
// const host = 'http://2559jc4123.wicp.vip:41613'
const hostForFile = 'https://www.xiaoquzu.cn:5001'
const wshost = 'wss://www.xiaoquzu.cn/xiaoqu'
 
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

function unloadRequest (url, method, data, header = {}) {
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

function put (obj) {
  return request(obj.url, 'PUT', obj.data)
}

function unloadPost (obj) {
  return unloadRequest(obj.url, 'POST', obj.data)
}

function unloadGet (obj) {
  return unloadRequest(obj.url, 'GET', obj.data)
}
 
export default {
  request,
  get,
  post,
  deleteRequest,
  put,
  unloadPost,
  unloadGet,
  host,
  hostForFile,
  wshost
}