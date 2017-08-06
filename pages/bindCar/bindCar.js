// bindCar.js

var app=getApp()
Page({
  data: {
    carNumber:"",
    carColor:""
  },
  getCarNumber:function(e){  
    this.setData({
      carNumber:e.detail.value
    })
  },
  getCarColor:function(e){
    this.setData({
      carColor:e.detail.value
    })
  },
  bindCar:function(){
    var carNumber=this.data.carNumber
    var carColor=this.data.carColor
    if(carNumber.length==0){
      wx.showToast({
        title: '请输入车牌号',
        icon:'loading',
        duration:1000
      })
    }else if(carColor.length==0){
      wx.showToast({
        title: '请输入车辆颜色',
        icon:'loading',
        duration:1000
      })
    }else{
      var that=this
      wx.request({
        url: app.globalData.serverUrl +'bindCar.als',
        data:{token:wx.getStorageSync('token'),carNumber:carNumber,color:carColor},
        success:function(res){
          if(res.data.status==0){
            wx.showToast({
              title: '成功了',
              icon: 'loading',
              duration: 1000
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
            title: '连接错误',
            icon:'loading',
            duration:1000
          })
        }
      })
    }
  }
})