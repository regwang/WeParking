// my.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    motto: 'Hello World',
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.canIUse('getSystemInfoSync.return.SDKVersion')) {
      //获得微信版本信息,检测兼容性
      var res = wx.getSystemInfoSync()
      var sdk = parseInt(res.SDKVersion.replace(/\./g, ''))
      if (sdk < 125) {
        wx.showModal({
          title: '提示',
          content: '您的微信版本偏低,建议您升级您的微信,以体验闪泊停车的完整服务',
          showCancel: false,
          confirmColor: '#f4c600',
          success: function (res) {
            if (res.confirm) {

            }
          }
        })
      }
    } else {
      wx.showModal({
        title: '提示',
        content: '您的微信版本偏低,建议您升级您的微信,以体验闪泊停车的完整服务',
        showCancel: false,
        confirmColor: '#f4c600',
        success: function (res) {
          if (res.confirm) {

          }
        }
      })
    }
  },
  bindViewTap:function(){
    wx.navigateTo({
      url: '/pages/logs/logs',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})