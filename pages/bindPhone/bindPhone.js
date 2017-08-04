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
    sendCodeText:"验证码",
    isSend:false,
    isChecked:true
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
  sendCode:function(){
    //发送验证码
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