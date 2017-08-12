// bookInfoDetail.js

var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderInfo: {},
    moneyClass: "line",
    orderStatusText: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.showLoading({
      title: '加载中..',
    })
    //根据id获取订单信息
    if (options.orderId) {
      //获取订单信息
      wx.request({
        url: app.globalData.serverUrl + 'getOrderInfoById.als',
        data: { id: options.orderId },
        success: function (res) {
          wx.hideLoading()
          console.log(res.data)
          if (res.data.status == 0) {
            console.log('订单信息')
            console.log(res.data.order)
            that.updateDataAndText(res.data.order)

          } else {
            wx.showToast({
              title: '出错了',
              icon: 'loading',
              duration: 1000
            })
          }
        },
        fail: function () {
          wx.hideLoading()
          wx.showToast({
            title: '请求失败',
            icon: 'loading',
            duration: 1000
          })
        }
      })
    }
    //根据token获取订单信息
    else if (options.type) {
      //获取订单信息
      wx.request({
        url: app.globalData.serverUrl + 'getOrderInfoByToken.als',
        data: { token: wx.getStorageSync('token'), type: 2 },
        success: function (res) {
          wx.hideLoading()
          console.log(res.data)
          if (res.data.status == 0) {
            console.log('订单信息')
            console.log(res.data.order)
            that.updateDataAndText(res.data.order)

          } else {
            wx.showToast({
              title: '出错了',
              icon: 'loading',
              duration: 1000
            })
          }
        },
        fail: function () {
          wx.hideLoading()
          wx.showToast({
            title: '请求失败',
            icon: 'loading',
            duration: 1000
          })
        }
      })
    }

  },

  //打电话给共享人
  callUser: function () {
    var that = this
    wx.makePhoneCall({
      phoneNumber: that.data.orderInfo.sharingPhone
    })
  },
  //订单有异议
  submitComment:function(){
    var that=this
    wx.navigateTo({
      url: '/pages/reportOrder/reportOrder?status=7&reportUser=2&id='+that.data.orderInfo.id,
    })
  },
  //举报
  submitReport:function(){
    var that = this
    wx.navigateTo({
      url: '/pages/reportOrder/reportOrder?status=6&reportUser=2&id=' + that.data.orderInfo.id,
    })
  },

  //更新状态和显示数据
  updateDataAndText: function (order) {
    //待预约
    if (order.status == 0) {
      this.setData({
        orderInfo: order,
        orderStatusText: '待预约'
      })
    } else if (order.status == 3) {
      this.setData({
        orderInfo: order,
        orderStatusText: '待交付'
      })
    } else if (order.status == 4) {
      this.setData({
        orderInfo: order,
        orderStatusText: '待支付'
      })
    } else if (order.status == 5) {
      this.setData({
        orderInfo: order,
        orderStatusText: '已完成'
      })
    } else if (order.status == 1 || order.status == 6 || order.status == 7) {
      this.setData({
        orderInfo: order,
        orderStatusText: '已取消'
      })
    } else if (order.status == 2) {
      this.setData({
        orderInfo: order,
        orderStatusText: '已失效'
      })
    }
  }


})