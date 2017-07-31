//app.js
App({
  onLaunch: function() {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    var that=this
    // wx.checkSession({
    //   success:function(){
    //     console.log("islogin")
    //   },
    //   fail:function(){
        wx.login({
          success:function(res){
            console.log(res.code)
            if(res.code){
              wx.request({
                url: that.globalData.serverUrl+'onLogin.als',
                data:{code:"lijw"},
                success:function(res2){
                  console.log(res2.data)
                  if(res2.data.status=="0"){
                    that.globalData.userToken=res2.data.token
                  }
                }
              })
            }
          }
        })
      // }
    // })
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
    userToken:null
  }
})
