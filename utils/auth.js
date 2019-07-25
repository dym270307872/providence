/**
 * 功能描述：鉴权 JS文件。
 * Copyright (c) 2019 FanYunzhe 
 * Date: 2019-04-03
 * version: 1.0.0
 */

//引入工具类JS
var Request = require('request.js');
var AES = require('public.js'); //引用封装好的加密解密js
var Base64 = require('base64.js');
var MD5 = require('md5.js');
var Getunionid=require('getunionid.js');

// 本地
// var url = "http://192.168.1.11:8080/UIAP/ws/authenticateWs";
// var appId = "689735238795";
// var appKey = "yTdKOrps94MmSUyo";
// var identifier = "com.zhkj.rsapp_android";
// var clientInfo = "";

// 洛阳
// var url = "http://xbapp.ly12333.com:7060/UIAP2/ws/authenticateWs";
// var appId = "689735238795";
// var appKey = "yTdKOrps94MmSUyo";
// var identifier = "com.zhkj.rsapp_android";
// var clientInfo = "";

// 鹤壁
var url = "http://222.141.69.163:9000/UIAP2/ws/authenticateWs";
var appId = "689735238795";
var appKey = "yTdKOrps94MmSUyo";
var identifier = "com.zhkj.rsapp_android";
var clientInfo = "";


//鉴权方法
function auth() {
  var that=this;
  //param=base64(aes(identifier=identifier&clientinfo=clientinfo))； 在JS中使用AES默认进行base64处理！！！ 
  //sign=md5(sort(app_key=app_key&app_id=app_id&identifier=identifier&clientinfo=clientinfo))
  //在JS中使用AES默认进行base64处理！！！
  var param = AES.AuthEncrypt("identifier=" + identifier + "&clientinfo=" + clientInfo);
  var sign = MD5.hexMD5(AES.Sort("app_key=" + appKey + "&app_id=" + appId + "&identifier=" + identifier + "&clientinfo=" + clientInfo));
  //app_id=&param=&sign=
  var data = { app_id: appId, param: param, sign: sign };
  //Request.doPost(url, data, "", "")
  wx.request({
    //项目的真正接口，通过字符串拼接方式实现
    url: url,
    header: {
      // "content-type": "application/json;charset=UTF-8"
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: data,
    method: 'POST',
    success: function (res) {
      //参数值为res.data,直接将返回的数据传入
      console.log(res.data);
      if ('0000' == res.data.serviceInfo.serviceCode) {
        // 存入本地全局变量
        var app = getApp();
        app.globalData.access_key = res.data.data[0].access_key;
        app.globalData.access_token = res.data.data[0].access_token;
        Getunionid.getopenidAndUionid();
      } else {
        wx.showToast({
          title: res.data.serviceInfo.serviceCode,
          icon: 'none',
          duration: 2000
        })
      }
    },
    fail: function (res) {
      wx.navigateTo({
        url: '../pages/error/404Page/404Page'
      })
    },
  })
}

// 暴露接口方法
module.exports = {
  auth: auth
}