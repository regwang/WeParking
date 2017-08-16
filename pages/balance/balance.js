// balance.js

var app=getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageIndex:1,
    orders:[],
    balance:'',
    hasMore:true,
    load_more_text:'加载中..',
    show_more_hidden:true,
    no_data_hidden:true
  },

  onLoad:function(options){
    wx.showLoading({
      title: '加载中..',
    })
    this.getBalanceInfo()
  },
  
  //获得余额数据
  getBalanceInfo:function(){
    console.log(this.data.pageIndex)
    var that=this
    wx.request({
      url: app.globalData.serverUrl + 'getMoneyInfo.als',
      data:{token:wx.getStorageSync('token'),pageIndex:that.data.pageIndex},
      success:function(res){
        wx.hideLoading()
        if(res.data.status==0){
          //有数据
          if(res.data.moneyDetail.length>0){
            if(orders.length==0){
              that.setData({
                orders:res.data.moneyDetail,
                show_more_hidden:true
              })
            }else{
              var orderList=[]
              orderList=that.data.orders.concat(res.data.moneyDetail)
              that.setData({
                orders:orderList,
                show_more_hidden:true
              })
            }
          }
          //第一次就没数据
          else if(that.data.pageIndex==1 && res.data.moneyDetail.length==0){
            that.setData({
              hasMore:false,
              no_data_hidden:false
            })
          }
          //后续没数据
          else if(res.data.moneyDetail.length==0){
              that.setData({
                hasMore:false,
                show_more_hidden:false,
                load_more_text:'没有数据了..'
              })
          }
          that.setData({
            balance:res.data.money,
            orders:res.data.moneyDetail,
            hasMore:res.data.moneyDetail.length==0 ? false :true
          })
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
          icon:'loading',
          duration:1000
        })
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.hasMore){
      this.setData({
        load_more_text:'加载中..',
        show_more_hidden:false,
        pageIndex:++this.data.pageIndex
      })
      this.getBalanceInfo()
    }
  },
})