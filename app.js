
//app.js
App({

  onLaunch: function() {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },

  getUserInfo: function(cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: false,
        success: function(res) {
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
        }
      })
    }
  },

  globalData:{
    shop_url: "http://localhost:3000"
  },



  onLoad: function () {
    console.log('onLoad')
    var that = this
     //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
       //更新数据
    that.setData({
       userInfo:userInfo
     })
   })
  },

  onShow: function () {
  console.log("iv");
    wx.login({//login流程
      success: function (res) {//登录成功
        if (res.code) {
          var code = res.code.replace(/\+/g, '%2B');
          wx.getUserInfo({//getUserInfo流程
            success: function (res2) {//获取userinfo成功
            console.log(res2.encryptedData);
            console.log(res2);
            var encryptedData = res2.encryptedData.replace(/\+/g, '%2B');//一定要把加密串转成URI编码
            console.log(encryptedData);
            var iv = res2.iv.replace(/\+/g, '%2B');
              //请求自己的服务器
             Login(code,encryptedData,iv);
            }
          })

        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
  },
})


  var API_URL = "http://localhost:3000/wx_users/wx_login";

  function  Login(code,encryptedData,iv){
    console.log('code='+code+'&encryptedData='+encryptedData+'&iv='+iv);
    //创建一个dialog
    wx.showToast({
      title: '正在登录...',
      icon: 'loading',
      duration: 10000
    });
    //请求服务器
    wx.request({
      url: API_URL,
      data: {
        code:code,
        encryptedData:encryptedData,
        iv:iv
      },
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded'
      }, // 设置请求的 header
      success: function (res) {
        // success
        wx.hideToast();
        console.log('服务器返回');
        wx.setStorageSync('wx_user_id', res.data.wx_user.id);

      },
      fail: function () {}
      })
  }
