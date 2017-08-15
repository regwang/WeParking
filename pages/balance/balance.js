// balance.js

var app=getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageIndex:1,
    orders:[],
    balance:''
  },

  onLoad:function(options){
    wx.showLoading({
      title: '加载中..',
    })
    this.getBalanceInfo()
  },
  
  //获得余额数据
  getBalanceInfo:function(){
    var that=this
    wx.request({
      url: app.globalData.serverUrl + 'getMoneyInfo.als',
      data:{token:wx.getStorageSync('token'),pageIndex:that.data.pageIndex},
      success:function(res){
        wx.hideLoading()
        if(res.data.status==0){
          that.setData({
            balance:res.data.money,
            orders:res.data.moneyDetail
          })
        }else{
          wx.showToast({
            title: '出错了',
            icon:'loading',
            duration:1000
          })
        }
      },
      fail:function(){
        wx.hideLoading()
        wx.showToast({
          title: '出错了',
          icon:'loading',
          duration:1000
        })
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },
})