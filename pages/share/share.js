//share.js
//获取应用实例
var app = getApp()
Page({
  data: {
    shareStatus:3,
    windowHeight: 0,
    controls: [],
    latitude: 39.91543309328607,
    longitude: 116.45597668647765,
    carNumber: "",
    carColor: "",
    minButton1: { plain: false, color: "#ffffff", bgColor:"#f4c600"},
    minButton2: { plain: true, color: "#000000", bgColor: "#ffffff" },
    minButton3: { plain: true, color: "#000000", bgColor: "#ffffff" },
    minButton4: { plain: true, color: "#000000", bgColor: "#ffffff" },
    selectedMin:15,
    inputMin:"",
    chooseMapText:"点击此处标记您车位的位置",
    shareName:"",
    shareAddress:"",
    shareLatitude:0,
    shareLongitude:0,
    addressRemark:''
  },
  onLoad: function () {
    
  },
  onReady: function () {
    
  },
  onShow: function () {
    var that = this
    wx.showLoading({
      title: '加载中..'
    })
    wx.request({
      url: app.globalData.serverUrl + 'getUserShareStatus.als',
      data: { token: wx.getStorageSync('token') },
      success: function (res) {
        wx.hideLoading()
        //未绑定手机
        if (res.data.status == 1) {
          wx.redirectTo({
            url: '/pages/bindPhone/bindPhone'
          })
        } else if (res.data.status == 2) { //该用户尚未设置车辆信息
          wx.setNavigationBarTitle({
            title: '基本信息',
          })
          that.setData({
            shareStatus:2
          })
        } else if (res.data.status == 3) { //该用户当前有共享的订单
          wx.setNavigationBarTitle({
            title: '共享'
          })
          that.setData({
            shareStatus:3
          })
          that.mapContext = wx.createMapContext('shareMap')
          that.showOrderBtn()
          that.getUserLocation()
        } else if(res.data.status==4){    //该用户当前没有共享的订单
          wx.setNavigationBarTitle({
            title: '共享停车位'
          })
           that.setData({
             shareStatus:4
           })
        }else {
          wx.showToast({
            title: '出错了',
            icon: "loading",
            duration: 1000
          })
        }
      }
    })
  },

  //定位按钮点击事件
  bindcontroltap: function (e) {
    if (e.controlId == 'currentLocation') {
      this.getUserLocation()
    } else if (e.controlId == 'orderDetail') {

    }
  },

  //获得用户地理位置
  getUserLocation: function () {
    var that = this
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success(res) { //用户同意授权
              that.getLocation()
            },
            fail() { //用户拒绝授权,opensetting
              console.log('用户拒绝')
            }
          })
        } else { //有地图授权
          console.log('有地图授权')
          that.getLocation()
        }
      }
    })
  },
  getLocation: function () {
    var that = this
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        console.log(res)
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
        that.mapContext.moveToLocation()
      },
      fail: function () {
        console.log('获取定位失败')
      }
    })
  },
  //已共享状态时,地图界面显示的按钮
  showOrderBtn: function () {
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
              iconPath: "/icon/sharedBtn.png",
              position: { left: (res.windowWidth - 150) / 2, top: res.windowHeight - 80, width: 150, height: 50 },
              clickable: true
            }
          ]
        })
      }
    })
  },
  //未共享状态,车位发布时，地图界面显示的按钮
  showShareBtn:function(){
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          controls: [
            {
              id: "currentLocation",
              iconPath: "/icon/location.png",
              position: { left: 10, top: res.windowHeight-480, width: 50, height: 50 },
              clickable: true
            }
          ]
        })
      }
    })
  },
  getCarNumber: function (e) {
    this.setData({
      carNumber: e.detail.value
    })
  },
  getCarColor: function (e) {
    this.setData({
      carColor: e.detail.value
    })
  },
  bindCar: function () {
    var carNumber = this.data.carNumber
    var carColor = this.data.carColor
    if (carNumber.length == 0) {
      wx.showToast({
        title: '请输入车牌号',
        icon: 'loading',
        duration: 1000
      })
    } else if (carColor.length == 0) {
      wx.showToast({
        title: '请输入车辆颜色',
        icon: 'loading',
        duration: 1000
      })
    } else {
      var that = this
      wx.request({
        url: app.globalData.serverUrl + 'bindCar.als',
        data: { token: wx.getStorageSync('token'), carNumber: carNumber, color: carColor },
        success: function (res) {
          console.log(res.data)
          if (res.data.status == 0) {
            that.onShow()
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
            title: '连接错误',
            icon: 'loading',
            duration: 1000
          })
        }
      })
    }
  },
  chooseMin:function(e){
    var min=e.currentTarget.dataset.min
    var selectedStatus = { plain: false, color: "#ffffff", bgColor: "#f4c600" }
    var unSelecctedStatus = { plain: true, color: "#000000", bgColor: "#ffffff" }
    if(min==15){
      this.setData({
        selectedMin:15,
        minButton1:selectedStatus,
        minButton2:unSelecctedStatus,
        minButton3:unSelecctedStatus,
        minButton4:unSelecctedStatus
      })
    }else if(min==30){
      this.setData({
        selectedMin:30,
        minButton1: unSelecctedStatus,
        minButton2: selectedStatus,
        minButton3: unSelecctedStatus,
        minButton4: unSelecctedStatus
      })
    }else if(min==45){
      this.setData({
        selectedMin:45,
        minButton1: unSelecctedStatus,
        minButton2: unSelecctedStatus,
        minButton3: selectedStatus,
        minButton4: unSelecctedStatus
      })
    }else if(min==60){
      this.setData({
        selectedMin:60,
        minButton1: unSelecctedStatus,
        minButton2: unSelecctedStatus,
        minButton3: unSelecctedStatus,
        minButton4: selectedStatus
      })
    }
  },
  inputMin:function(e){
    var min=e.detail.value
    if(min.length>0){ 
        this.setData({
          inputMin:min
        }) 
    }else{
      this.setData({
        inputMin:""
      })
    }
  },
  chooseCarLocation:function(){
    var that=this
    wx.chooseLocation({
      success: function(res) {
        that.setData({
          chooseMapText:res.name+";"+res.address,
          shareName: res.name,
          shareAddress: res.address,
          shareLatitude: res.latitude,
          shareLongitude: res.longitude
        })
      },
      cancel:function(){
        that.setData({
          chooseMapText:"点击此处标记您车位的位置"
        })
      }
    })
  },

  bindAddressRemark:function(e){
    var remark=e.detail.value
    if(addressRemark.length>0){
      this.setData({
        addressRemark:remark
      })
    }else{
      this.setData({
        addressRemark:''
      })
    }
  },

  //共享停车位
  sharingParking:function(){
    var inputMin=this.data.inputMin
    var lastMin=0
    if (inputMin.length == 0) {
      lastMin = this.data.selectedMin
    }else{
      if (inputMin < 5 || inputMin > 60) {
        wx.showToast({
          title: '自定义分钟数不正确',
          icon: 'loading',
          duration: 1000
        })
        return;
      }else{
        lastMin = inputMin
      }
    }

    //检查车位位置选取情况
    var mapText = this.data.chooseMapText
    if (mapText == '点击此处标记您车位的位置') {
      wx.showToast({
        title: '请标记车位的位置',
        icon: 'loading',
        duration: 1000
      })
      return
    } else {
      //发布车位
      var that=this
      wx.showLoading({
        title: '请稍等..',
      })
      wx.request({
        url: app.globalData.serverUrl +'startSharingOrder.als',
        data:{
          token:wx.getStorageSync('token'),
          minute:lastMin,
          longitude: that.data.shareLongitude,
          latitude: that.data.shareLatitude,
          name:that.data.shareName,
          address:that.data.shareAddress,
          addressRemark:that.data.addressRemark
        },
        success:function(res){
          wx.hideLoading()
          if(res.data.status==0){
            that.onShow()
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
            icon: 'loading',
            duration: 1000
          })
        }
      })
    }
  }
})