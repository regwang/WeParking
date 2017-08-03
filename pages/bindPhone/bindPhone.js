// bindPhone.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    codeDisable:true,
    signupDisable:true,
    phoneValue:"",
    codeValue:"",
    sendCodeText:"验证码"
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
          wx.showToast({
            title: '手机号不正确',
          })
        }
      }
    }
  },
  sendCode:function(){
    var times=60;
    var that=this
    that.setData({
      codeDisable: true
    })
    setInterval(function(){
      if(times>1){
        that.setData({
          sendCodeText:--times,
          codeDisable:true
        })
      }else{
        that.setData({
          sendCodeText:"验证码",
          codeDisable: false
        })
        return
      }
    },1000)
  }
})