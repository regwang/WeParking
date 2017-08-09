// bookInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sharingName:'',
    sharingPhone:'',
    carNumber:'',
    carColor:'',
    money:0,
    latitude:0,
    longitude:0,
    addressName:'',
    address:'',
    addressRemark:'',
    appointmentTime:'',
    orderStatus:'',
    orderStatusText:'',
    orderId:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('单据id'+options.orderId)
    wx.showToast({
      title: '单据id'+options.orderId,
    })
    this.setData({
      orderId:options.orderId
    })
  },

  
})