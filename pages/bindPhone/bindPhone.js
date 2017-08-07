// bindPhone.js

var app=getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    codeDisable:true,
    signupDisable:true,
    phoneValue:"",
    codeValue:"",
    sendCodeText:"验证码",
    isSend:false,
    isChecked:true
  },
  onLoad: function () {
    new app.WeToast.WeToast()
  },
  getPhone:function(e){
    this.setData({
      codeDisable: true,
      phoneValue:""
    })
    var s=e.detail.value
    if(s!=null) {
      var length = s.length;
      if(length==11){
        if (/^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(14[0-9]{1})|)+\d{8})$/.test(s)){
          this.setData({
            codeDisable:false,
            phoneValue:s
          })
        }else{
          this.wetoast.toast({
            title:'手机号不正确!'
          })

        }
      }
    }
  },
  getCode:function(e){
    var s=e.detail.value
    if(s.length>=4&&this.data.isSend){
      this.setData({
        codeValue:s
      })
    }else{
      this.setData({
        codeValue:""
      })
    }
    this.signupStatus()
  },
  checkboxChange:function(e){
    var result=false
    if(e.detail.value.length==1){
      result=true
    }
    this.setData({
      isChecked:result
    })
    this.signupStatus()
  },
  signupStatus:function(){
    var result=true;
    if(this.data.phoneValue.length>0&&this.data.codeValue.length>0&&this.data.isChecked){
      result=false
    }
    this.setData({
      signupDisable:result
    })
  },
  signup:function(){
    var that=this
    wx.showLoading({
      title: '绑定手机..',
    })
    wx.request({
      url: app.globalData.serverUrl + 'bindPhone.als',
      data: { token: wx.getStorageSync('token'), code: that.data.codeValue },
      success: function (res) {
        wx.hideLoading()
        console.log(res.data)
        if (res.data.status ==0){
          wx.switchTab({
            url: '/pages/index/index',
          })
        }else if(res.data.status==-1){
          that.wetoast.toast({
            title:'验证码错误!'
          })
        }else{
          that.wetoast.toast({
            title:'系统错误!'
          })
        }
      }
    })
  },
  sendCode:function(){
    var that=this
    wx.request({
      url: app.globalData.serverUrl+'sendSMS.als',
      data:{token:wx.getStorageSync('token'),phone:that.data.phoneValue},
      success:function(res){
        if(res.data.status==-1
        ){
          this.wetoast.toast({
            title:'短信发送失败!'
          })
        }
      }
    })
    this.setData({
      isSend:true
    })
    this.countDown()
  },
  countDown:function(){
    var times = 60;
    var that = this
    that.setData({
      codeDisable: true
    })
    var flag = setInterval(function () {
      if (times > 1) {
        that.setData({
          sendCodeText: --times,
          codeDisable: true
        })
      } else {
        clearInterval(flag)
        that.setData({
          sendCodeText: "验证码",
          codeDisable: false
        })
      }
    }, 1000)
  }
 
})