var Util = require('util.js'); //引用封装好的加密解密js
var Request = require('request.js');
var AES = require('public.js'); //引用封装好的加密解密js
var Base64 = require('base64.js');
var MD5 = require('md5.js');

function getopenidAndUionid() {

  var app = getApp();

  wx.showLoading({
    title: '加载中...',
    mask: true
  })
  wx.login({
    success(res) {
      console.log(res.code);
      if (res.code) {
        var code = res.code;

        var param = AES.Encrypt(code, app.globalData.access_key);
        var sign = MD5.hexMD5(AES.Sort("access_key=" + app.globalData.access_key + "&access_token=" + app.globalData.access_token + "&businesscode=WCAH0005" + "&" + code));

        var data = {
          access_token: app.globalData.access_token,
          businesscode: 'WCAH0005',
          param: param,
          sign: sign
        };

        // 发起网络请求
        wx.request({
          url: app.globalData.host + 'ws/weChatAppletWs',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          method: 'POST',
          data: data,
          success(res) {
            console.log(res.data);
            
            app.globalData.openid = res.data.openid;
            checkbind(res.data.openid);
          },
          fail: function(res) {
            console.log('获取用户信息失败');
            console.log(res);
          }
        })
      } else {
        console.log('获取code失败');
      }
    },
    fail: function() {
      callback(false)
    }
  })
}

function checkbind(openid) {
  var app = getApp();
  var param = AES.Encrypt(openid, app.globalData.access_key);
  var sign = MD5.hexMD5(AES.Sort("access_key=" + app.globalData.access_key + "&access_token=" +
    app.globalData.access_token + "&businesscode=WCAH0003" + "&" + openid))
  var data = {
    xzqh: "",
    access_token: app.globalData.access_token,
    businesscode: 'WCAH0003',
    param: param,
    sign: sign
  };

  // 发送请求
  wx.request({
    //项目的真正接口，通过字符串拼接方式实现
    url: app.globalData.host + "ws/weChatAppletWs",
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: data,
    method: 'POST',
    success: function(res) {
      wx.hideLoading();
      // 参数值为res.data,直接将返回的数据传入
      if ('0000' == res.data.serviceInfo.serviceCode) {
        //已经绑定openid
        //var idcard=res.data.data[0].F011;
        console.log(res.data.data[0]);
        var app = getApp();
        app.globalData.loginInfo = res.data.data[0];
        app.globalData.session_key = res.data.data[0].session_key;
        app.globalData.session_token = res.data.data[0].session_token;
      } else {
        //未绑定openid
        console.log(res.data);

        wx.reLaunch({
          url: '../login/login'
        })

      }
    },
    fail: function() {

    },
  })
}




// 暴露接口方法
module.exports = {
  getopenidAndUionid: getopenidAndUionid,
  checkbind: checkbind
}