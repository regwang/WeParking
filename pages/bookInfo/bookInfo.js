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
    wx.showLoading({
      title: '加载中..',
    })
    //根据id获取订单信息
    if(options.orderId){
      //获取订单信息
      wx.request({
        url: app.globalData.serverUrl +'getOrderInfoById.als',
        data:{id:options.orderId},
        success:function(res){
          wx.hideLoading()
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
          wx.hideLoading()
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
              console.log('预约车位:'+res.data.status)
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
            success:function(res1){
              if(res1.data==0){
                console.log('创建微信订单的数据:')
                console.log(res1.data)
                wx.requestPayment({
                  timeStamp: res1.data.timeStamp,
                  nonceStr: res1.data.nonceStr,
                  package: res1.data.package,
                  signType: 'MD5',
                  paySign: res1.data.paySign,
                  success:function(res2){
                    console.log('支付成功')
                    console.log(res2)
                    if(res2.errMsg=='requestPayment:ok'){
                      //更新订单为已完成
                      wx.request({
                        url: app.globalData.serverUrl +'updateParkingComplete.als',
                        data:{id:that.data.orderInfo.id},
                        success:function(res3){
                          if(res3.data.status==0){
                            wx.showModal({
                              title: '提示',
                              content: '支付成功,本次订单已完结',
                              confirmColor:'#f4c600',
                              showCancel:false,
                              success:function(res4){
                                if(res4.confirm){
                                  wx.navigateBack({
                                    delta: 1
                                  })
                                }
                              }
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
                    }
                   
                    
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
      wx.setNavigationBarTitle({
        title: '车位信息',
      })
    }else if(order.status==3){
      this.setData({
        orderInfo: order,
        orderStatusText: '待交付'
      })
    }else if(order.status==4){
      this.setData({
        orderInfo:order,
        orderStatusText:'待支付'
      })
    }else if(order.status==5){
      this.setData({
        orderInfo:order,
        orderStatusText:'已完成'
      })
    }else if(order.status==1 || order.status==6 || order.status==7){
      this.setData({
        orderInfo:order,
        orderStatusText:'已取消'
      })
    }else if(order.status==2){
      this.setData({
        orderInfo:order,
        orderStatusText:'已失效'
      })
    }
  }

  
})