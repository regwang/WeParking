//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {}
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
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
  onShow:function(){
    wx.showLoading({
      title: '加载中..'
    })
    wx.request({
      url: app.globalData.serverUrl +'getUserBookingStatus.als',
      success:function(res){
        console.log(res.data)
        wx.hideLoading();
        if(res.data.status==1){
          wx.redirectTo({
            url: '/pages/bindPhone/bindPhone',
          })
        }
      }
    })
  }
})
