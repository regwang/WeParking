//app.js
var WeToast=require('/pages/wetoast/wetoast.js')  
App({
  WeToast,
  onLaunch: function() {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    var that=this
    var hasToken=true
    try{
      var value = wx.getStorageSync('token')
      if (!value) {
        hasToken=false
      }
    }catch(e){}
    if(hasToken){
      wx.checkSession({
        success: function () {
          console.log('islogin')
        },
        fail: function () {
            console.log('notlogin')
            that.doLogin()
        }
      })
    }else{
      that.doLogin()
    }
    
  },
  doLogin:function(){
    var that=this
    wx.login({
      success: function (res) {
        console.log('js_code:'+res.code)
        if (res.code) {
          wx.request({
            url: that.globalData.serverUrl + 'onLogin.als',
            data: { code: res.code },
            success: function (res2) {
              if (res2.data.status == 0) {
                try{
                  wx.setStorageSync('token',res2.data.token)
                  that.getUserInfo(function(userInfo){
                      that.updateUserInfo(userInfo)
                  })
                }catch (e) {}
              }
            }
          })
        }
      }
    })
  },
  updateUserInfo:function(userInfo){
    var that=this
    wx.request({
      url: that.globalData.serverUrl+'updateNick.als',
      data:{token:wx.getStorageSync('token'),nickName:userInfo.nickName},
      success:function(res){
        if(res.data.status==-1){
          wx.showToast({
            title: '获取用户信息失败',
          })
        }
      }
    })
  },
  getUserInfo: function(cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: false,
        success: function(res) {
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
        }
      })
    }
  },

  globalData: {
    userInfo: null,
    serverUrl:"https://www.rankyoo.com/srimplApp/",
  }
})
