//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    windowHeight:0,
    controls:[],
    latitude:12,
    longitude:32,
  },
  onLoad: function () {
   console.log('index onload')
  },
  onShow:function () {
    console.log('index onshow')
    var that = this
    wx.showLoading({
      title: '加载中..'
    })
    wx.request({
      url: app.globalData.serverUrl + 'getUserBookingStatus.als',
      data: { token: wx.getStorageSync('token') },
      success: function (res) {
        //未绑定手机
        if (res.data.status == 1) {
          wx.redirectTo({
            url: '/pages/bindPhone/bindPhone',
          })
        } else if (res.data.status == 2) { //该用户当前有预约的订单
          that.showOrder()
        } else if (res.data.status == 3) { //该用户当前没有预约的订单
          //显示待预约的地图按钮
          that.showPending()
          //获得用户位置
          that.getUserLocation()
        } else {
          wx.showToast({
            title: '出错了',
            icon: "loading",
            duration: 1000
          })
        }
      }
    })
  },
  
  //获得用户地理位置
  getUserLocation:function(){
    var that=this
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success(res) { //用户同意授权
              wx.getLocation({
                type:'gcj02',
                success: function(res) {
                  console.log(res)
                  that.setData({
                    latitude: res.latitude,
                    longitude: res.longitude
                  })
                },
                fail:function(){
                  console.log('地图调用失败')
                }
              })
            },
            fail(){ //用户拒绝授权,opensetting
              console.log('用户拒绝')
            }
          })
        }else{ //有地图授权
          console.log('有地图授权')
        }
      }
    })
  },

  //显示待预约状态时,地图界面显示的按钮
  showPending:function(){
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          controls: [
            {
              id: "currentLocation",
              iconPath: "/icon/location.png",
              position: { left: 10, top: res.windowHeight - 80, width: 50, height: 50 },
              clickable: true
            },
            {
              id: "chooseTime",
              iconPath: "/icon/filtrate.png",
              position: { left: (res.windowWidth - 50 - 10), top: res.windowHeight - 80, width: 50, height: 50 },
              clickable: true
            }
          ]
        })
      },
    })
  },
  //显示已预约状态时,地图界面显示的按钮
  showOrder:function(){
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          controls: [
            {
              id: "currentLocation",
              iconPath: "/icon/location.png",
              position: { left: 10, top: res.windowHeight - 80, width: 50, height: 50 },
              clickable: true
            },
            {
              id: "orderDetail",
              iconPath: "/icon/location.png",
              position: { left: (res.windowWidth - 50) / 2, top: res.windowHeight - 80, width: 50, height: 50 },
              clickable: true
            }
          ]
        })
      },
    })
  }
})
