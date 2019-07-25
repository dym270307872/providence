/**
 * 功能描述：通用鉴权access JS文件。
 * Copyright (c) 2019 dyaoming 
 * Date: 2019-07-25
 * version: 1.0.0
 */

//引入工具类JS
var Request = require('request.js');
var Encrypt = require('encrypt.js'); //引用封装好的加密工具js

//鉴权方法
function access() {
  const accountInfo = wx.getAccountInfoSync();
  var appId = accountInfo.miniProgram.appId;
  var that = this; 
  var data = { "appId": appId};
  Request.doPost("/api/access", data, function (res) {
    //参数值为res.data,直接将返回的数据传入
  

    if ('0000' == res.code) {
      // 存入本地全局变量
      var app = getApp();
      app.globalData.accessKey = res.data.accessKey;
      app.globalData.accessToken = res.data.accessToken;
    //   Getunionid.getopenidAndUionid();
    } 
    // else {
      // wx.showToast({
        // title: res.data.serviceInfo.serviceCode,
    //     icon: 'none',
    //     duration: 2000
    //   })
    // }
  },function (e) {
      // wx.navigateTo({
      //   url: '../pages/error/404Page/404Page'
      // })
    });
}

// 暴露接口方法
module.exports = {
  access: access
}