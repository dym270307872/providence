//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: '',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  sayHello: function (e) {
    console.log(e)
    var ret = this;
    var getdate = {};
    // getdate['name']=this.data.userInfo.nickName;
    // console.log(getdate);


    wx.request({
      //项目的真正接口，通过字符串拼接方式实现
      url: 'https://outman.eicp.vip/demo/main?name=' + ret.data.userInfo.nickName,
      header: {
        // "content-type": "application/json;charset=UTF-8"
        'content-type': 'application/x-www-form-urlencoded'
      },
      // data: JSON.stringify(strMapToObj(getdata)),
      method: 'GET',
      success: function (res) {
        //参数值为res.data,直接将返回的数据传入
        //doSuccess(res.data);
        console.log(res);
        
        ret.setData({
          motto: res.data
        });
      },
      fail: function () {
        //doFail();
      },
    })

    // wx.sayHello({
    //   success: res => {
    //     // app.globalData.userInfo = res.userInfo
    //     this.setData({
    //       // userInfo: res.userInfo,
    //       // hasUserInfo: true
    //       motto: res.data
    //     })
    //   }
    // });
  }
})
