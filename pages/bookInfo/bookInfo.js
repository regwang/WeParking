// bookInfo.js

var app=getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderInfo: {},
    moneyClass:"line",
    orderStatusText:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    //根据id获取订单信息
    if(options.orderId){
      //获取订单信息
      wx.request({
        url: app.globalData.serverUrl +'getOrderInfoById.als',
        data:{id:options.orderId},
        success:function(res){
          console.log(res.data)
            if(res.data.status==0){
              console.log('订单信息')
              console.log(res.data.order)
              that.updateDataAndText(res.data.order)
              
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
    }
    //根据token获取订单信息
    else if(options.type){
      //获取订单信息
      wx.request({
        url: app.globalData.serverUrl + 'getOrderInfoByToken.als',
        data: {token:wx.getStorageSync('token'),type:2},
        success: function (res) {
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
          wx.showToast({
            title: '请求失败',
            icon: 'loading',
            duration: 1000
          })
        }
      })
    }
    
  },

  //预约车位
  bookOrder:function(){
    var that=this
    wx.showModal({
      title: '提示',
      content: '预约后将无法取消,请慎重下单',
      confirmColor:'#f4c600',
      success:function(res){
        if(res.confirm){
          wx.request({
            url: app.globalData.serverUrl + 'startAppointOrder.als',
            data: { token: wx.getStorageSync('token'), id: that.data.orderInfo.id },
            success: function (res) {
              //预约成功
              if (res.data.status == 0) {
                wx.switchTab({
                  url: '/pages/index/index',
                })
              } else if (res.data.status == -1) {
                wx.showToast({
                  title: '出错了',
                  icon: 'loading',
                  duration: 1000
                })
              }
              //车位已经被取消
              else if(res.data.status==-2){
                wx.showModal({
                  title: '提示',
                  content: '该车位已被取消',
                  showCancel: false,
                  confirmColor: '#f4c600',
                  success: function (res) {
                    if (res.confirm) {
                      wx.navigateBack({
                        delta: 1
                      })
                    }
                  }
                })
              }
              //车位已经被预约
              else if(res.data.status==-3){
                wx.showModal({
                  title: '提示',
                  content: '该车位已被预约',
                  showCancel: false,
                  confirmColor: '#f4c600',
                  success: function (res) {
                    if (res.confirm) {
                      wx.navigateBack({
                        delta: 1
                      })
                    }
                  }
                })
              }
            },
            fail: function () {
              wx.showToast({
                title: '出错了',
                icon: 'loading',
                duration: 1000
              })
            }
          })
        }
      }
    })
    
  },
  //微信支付
  wechatPay:function(){
    var that=this
    wx.showModal({
      title: '提示',
      content: '确定支付吗？',
      confirmColor: '#f4c600',
      success:function(res){
        if(res.confirm){
          wx.request({
            url: app.globalData.serverUrl +'payParking.als',
            data:{id:that.data.orderInfo.id,token:wx.getStorageSync('token')},
            success:function(res){
              if(res.data==0){
                console.log('创建微信订单的数据:')
                console.log(res.data)
                wx.requestPayment({
                  timeStamp: res.data.timeStamp,
                  nonceStr: res.data.nonceStr,
                  package: res.data.package,
                  signType: 'MD5',
                  paySign: res.data.paySign,
                  success:function(res){
                    console.log('支付成功')
                    console.log(res)
                    //更新订单为已完成
                    wx.request({
                      url: app.globalData.serverUrl +'updateParkingComplete.als',
                      data:{id:that.data.orderInfo.id},
                      success:function(res){
                        if(res.data.status==0){
                          wx.navigateBack({
                            delta: 1
                          })
                        }else{
                          wx.showToast({
                            title: '订单状态更新失败',
                            icon:'loading',
                            duration:1000
                          })
                        }
                      }
                    })
                   
                    
                  },
                  fail:function(res){
                    console.log('支付失败')
                    console.log(res)
                  },
                  complete:function(res){
                    console.log('支付完成')
                    console.log(res)
                  }
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
                title: '出错了',
                icon:'loading',
                duration:1000
              })
            }
          })
        }
      }
    })
  },
  //打电话给共享人
  callUser:function(){
    var that=this
    wx.makePhoneCall({
      phoneNumber: that.data.orderInfo.sharingPhone
    })
  },
  //查看订单详情
  orderDetail:function(){
    var that=this
    wx.redirectTo({
      url: '/pages/bookInfoDetail/bookInfoDetail?orderId='+that.data.orderInfo.id,
    })
  },

  //更新状态和显示数据
  updateDataAndText:function(order){
    //待预约
    if(order.status==0){
      this.setData({
        orderInfo:order,
        moneyClass:'',
        orderStatusText:'待预约'
      })
    }else if(order.status==3){
      this.setData({
        orderInfo: order,
        orderStatusText: '待交付'
      })
      wx.setNavigationBarTitle({
        title: '预约信息',
      })
    }
  }

  
})