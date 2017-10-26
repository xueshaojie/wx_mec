const jsonApi = require('utils/jsonapi-datastore/dist/jsonapi-datastore.js')
require('utils/polyfill.js')

App({
  onLaunch: function () {
    var that = this
    this.store = new(jsonApi.JsonApiDataStore)
    this.jsonModel = jsonApi.JsonApiDataStoreModel
    this.globalData.code = wx.getStorageSync('code')

    this.getUserInfo(function() {
      that.getEncryptedData(function(){
      })
    })

  },

  getUserInfo: function (cb) {
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      wx.login({
        success: function (res) {
          if (res.code) {
            var code = res.code;
            // that.globalData.code = res.code
            wx.setStorageSync('code', res.code)
            wx.getUserInfo({
              success: function (res) {
                that.globalData.encrypted = {encryptedData: res.encryptedData, iv: res.iv}
                that.globalData.userInfo = res.userInfo
                typeof cb == "function" && cb(that.globalData.userInfo)

                // var encryptedData = res2.encryptedData;//一定要把加密串转成URI编码
                // var iv = res2.iv;
                // Login(code,encryptedData,iv);
              },
              fail: function () {
                wx.showModal({
                    title: '警告',
                    content: '您点击了拒绝授权，将无法正常使用******的功能体验。请10分钟后再次点击授权，或者删除小程序重新进入。',
                    success: function (res) {
                      if (res.confirm) {
                        console.log('用户点击确定')
                      }
                    }
                })
              }

            })
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      })
    }
  },

  authRequest: function(obj) {
    var that = this
    if (!that.globalData.token) {
      var token = wx.getStorageSync('userToken')
      if (!token) {
        wx.hideToast()
        wx.showModal({
          title: '未登录',
          content: '请前往 “我的” 页面绑定手机号',
          showCancel: false,
          success: function(res) {
            // 清除没用的token
            wx.removeStorage({key: 'userToken'})
            that.globalData.token = undefined
            if (getCurrentPages().length > 1) {
              wx.navigateBack()
            }
          }
        })
        return
      }
      that.globalData.token = token
      that.request({
        url: `${that.globalData.API_URL}/sessions/login`,
        method: 'POST',
        data: {code: that.globalData.code},
        success: function(res) {
          if (!res.data.token) {
            wx.hideToast()
            wx.showModal({
              title: '未登录',
              content: '请前往 “我的” 页面绑定手机号',
              showCancel: false,
              success: function(res) {
                // 清除没用的token
                wx.removeStorage({key: 'userToken'})
                that.globalData.token = undefined
                if (getCurrentPages().length > 1) {
                  wx.navigateBack()
                }
              }
            })
          } else {
            that.globalData.currentCustomer = res.data.customer
            that.globalData.token = res.data.token
            wx.setStorage({
              key: 'userToken',
              data: res.data.token
            })
            that.request(obj)
          }
        },
        fail: function(res) {}
      })
    } else {
      that.request(obj)
    }
  },



  getEncryptedData: function() {
    wx.request({
      method: 'GET',
      url: "http://localhost:3000/wx_users/wx_login?code="+this.globalData.code+"&encrypted="+this.globalData.encrypted.encryptedData+"&iv="+this.globalData.encrypted.iv,
      data: {
        // code: this.globalData.code,
        // encrypted: this.globalData.encrypted.encryptedData,
        // iv: this.globalData.encrypted.iv
        // userInfo: this.globalData.userInfo
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        // success
        wx.hideToast();
        console.log('服务器返回');
        wx.setStorageSync('wx_user_id', res.data.wx_user.id);

      },
      fail: function(res) {}
    })
  },

  globalData:{
    wechatUserType: 'normal',
    featureManager: {},
    userInfo: null,
    currentCustomer: null,
    API_URL: 'http://localhost:3000'
  }
})
