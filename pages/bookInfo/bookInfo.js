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