/**
 * 功能描述：工具类 JS文件。
 * Copyright (c) 2019 FanYunzhe 
 * Date: 2019-04-03
 * version: 1.0.0
 */

var Request = require('request.js');
var AES = require('public.js'); //引用封装好的加密解密js
var Base64 = require('base64.js');
var MD5 = require('md5.js');

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
} 

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 手机号码格式验证
 */
function phoneNum_verify(phoneNum) {
  //不能为空
  if (phoneNum == "" || phoneNum == undefined) {
    return "手机号码不能为空！";
  } else {
    if (phoneNum.length != 11) {
      return "手机号必须为11位！";
    }
  };

  //手机号的验证格式
  var phone_reg = /^1[3|4|5|6|7|8|9]\d{9}$/;
  if (phone_reg.test(phoneNum) === false) {
    return "手机号格式不正确！";
  };
  return 'true';
}

/**
 * 短信发送
 * ywlx（01：登录；02：注册；03：找回/修改密码；04：绑定手机；05：解绑手机）
 */
function sendSMS(phonenumber, ywlx, that) {
  var app = getApp();
  //param=base64(aes(phonenumber = 手机号 & ywlx=业务类型)) 
  //sign=md5(sort(access_key = access_key & access_token=access_token & businesscode=业务编码 & phonenumber=手机号 & ywlx=业务类型))
  var param = AES.Encrypt("phonenumber=" + phonenumber + "&ywlx=" + ywlx, app.globalData.access_key);
  var sign = MD5.hexMD5(AES.Sort("access_key=" + app.globalData.access_key + "&access_token=" + app.globalData.access_token + "&businesscode=PUB2001" + "&phonenumber=" + phonenumber + "&ywlx=" + ywlx))

  var data = {
    access_token: app.globalData.access_token,
    businesscode: 'PUB2001',
    param: param,
    sign: sign
  };
  
  // 发送请求
  wx.request({
    //项目的真正接口，通过字符串拼接方式实现
    url: app.globalData.host + "ws/publicWs",
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: data,
    method: 'POST',
    success: function(res) {
      //参数值为res.data,直接将返回的数据传入
      if ('0000' == res.data.serviceInfo.serviceCode) {
        wx.showToast({
          title: res.data.serviceInfo.serviceMsg,
          icon: 'success',
          duration: 2000,
        })
        // 锁定获取按钮，锁定手机号输入框
        that.setData({
          getSMSCode: '', // 获取按钮
          getSMS: '90秒后获取',
          disabled: true, // 手机号码框
          color: 'grey'
        })
        timer(that);
      } else {
        wx.showToast({
          title: res.data.serviceInfo.serviceMsg,
          icon: 'none',
          duration: 2000,
        })
      }
      return res.data.serviceInfo.serviceCode;
    },
    fail: function() {

    },
  })
}

function timer(that){
  var startTime = 90;
  that.setData({
    clean: setInterval(function () {//这里把setInterval赋值给变量名为timer的变量
      //每隔一秒startTime就减一，实现同步
      startTime--;
      //然后把startTime存进data，好让用户知道时间在倒计着
      that.setData({
        getSMS: startTime + "秒后获取"
      })
      //在倒计时还未到0时，这中间可以做其他的事情，按项目需求来
      if (startTime == 0) {
        //这里特别要注意，计时器是始终一直在走的，如果你的时间为0，那么就要关掉定时器！不然相当耗性能
        //因为timer是存在data里面的，所以在关掉时，也要在data里取出后再关闭
        clearInterval(that.data.clean);
        //打开获取按钮
        that.setData({
          getSMSCode: 'getSMSCode',// 打开获取按钮
          getSMS: '获取验证码',
          disabled: true, // 锁定手机号码输入框
          color: '#3cc51f'
        })
      }
    }, 1000)
  })
}

// 暴露接口方法
module.exports = {
  formatTime: formatTime,
  phoneNum_verify: phoneNum_verify,
  sendSMS: sendSMS
}