//app.js
var WeToast=require('/pages/wetoast/wetoast.js')  
App({
  WeToast,
  onLaunch: function() {
    var that=this
    wx.request({
      url: this.globalData.serverUrl +'getIsUsed.als',
      success:function(res){
        if (res.data.status!=0 && res.data.status!=-1){
          this.globalData.useStatus=1
        }
      }
    })
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
            title: '出错了',
          })
        }else if(res.data.status==0){
          that.globalData.isupdate=1
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
    isupdate:0,
    useStatus:0
  }
})
