// bookInfo.js

var app=getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderInfo: {
      sharingName: '',
      sharingPhone: '',
      carNumber: '',
      carColor: '',
      money: 0,
      latitude: 0,
      longitude: 0,
      addressName: '',
      address: '',
      addressRemark: '',
      appointmentTime: '',
      orderStatus: '',
      orderStatusText: '',
      orderId: 0
    }
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    console.log(options.orderId)
    //获取订单信息
    wx.request({
      url: app.globalData.serverUrl +'getOrderInfoById.als',
      data:{id:options.orderId},
      success:function(res){
        console.log(res.data)
          if(res.data.status==0){
            console.log('订单信息')
            console.log(res.data.order)
            that.setData({
              orderInfo:order
            })
          }else{
            wx.showToast({
              title: '出错了',
              icon: 'loading',
              duration: 1000
            })
          }
      },
      fail:function(){
        wx.showToast({
          title: '请求失败',
          icon:'loading',
          duration:1000
        })
      }
    })
    
  },

  
})