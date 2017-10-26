const productUtil = require('../../utils/product.js')
var app = getApp()

Page({
  data: {
    items: [],
    slides: [],
    movies: [{url:'http://img04.tooopen.com/images/20130712/tooopen_17270713.jpg'},
             {url:'http://img04.tooopen.com/images/20130617/tooopen_21241404.jpg'},
             {url:'http://img04.tooopen.com/images/20130701/tooopen_20083555.jpg'},
             {url:'http://img02.tooopen.com/images/20141231/sy_78327074576.jpg'}],
    navs: [{icon: "../../images/icon-new-list1.png", name: "饮料", typeId: 0},
           {icon: "../../images/icon-new-list2.png", name: "水果", typeId: 1},
           {icon: "../../images/icon-new-list3.png", name: "蔬菜", typeId: 2},
           {icon: "../../images/icon-new-list4.png", name: "酒水", typeId: 3}],
  },

  onShareAppMessage: function () {
    return {
      title: "电商平台",
      desc: "商城首页",
      path: "pages/index/index"
    }
  },

  onLoad: function () {
    console.log('onLoad 生命周期函数--监听页面加载')
    var that = this;

    wx.request({
      url: app.globalData.shop_url +'/mini_programs/get_category_list',
      data: {},
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        console.log(res.data);

        //把获取到的结果放到数据层
        that.setData({
          articles:res.data.articles
        })
      }
    })
  },

  catchTapCategory: function (e) {
    var data = e.currentTarget.dataset
    app.globalData.currentCateType = {typeName: data.type, typeId: data.typeid}
    wx.switchTab({
      url: "../category/category"
    })
  }

})
