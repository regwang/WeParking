// location.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderInfo:[]
  },

 
  onLoad: function (options) {
    if(options.orderInfo){
      this.setData({
        orderInfo:options.orderInfo
      })
    }
  },

  onShow: function () {
  
  },
})