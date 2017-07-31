//logs.js
var util = require('../../utils/util.js')
var app=getApp()
Page({
  data: {
    logs: [],
    token:app.globalData.userToken
  },
  onLoad: function () {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(function (log) {
        return util.formatTime(new Date(log))
      })
    })
  }
})
