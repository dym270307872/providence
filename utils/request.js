/**
 * 功能描述：request请求 JS文件。
 * Copyright (c) 2019 FanYunzhe 
 * Date: 2019-04-03
 * version: 1.0.0
 */

var app = getApp();
//项目URL相同部分，减轻代码量，同时方便项目迁移
//这里因为是本地调试，所以host不规范，实际上应该是你备案的域名信息
var host = '';

/**
 * POST请求，
 * URL：接口
 * postData：参数，json类型
 * doSuccess：成功的回调函数
 * doFail：失败的回调函数
 */
function doPost(url, postData, doSuccess, doFail) {
  wx.request({
    //项目的真正接口，通过字符串拼接方式实现
    url: host + url,
    header: {
      // "content-type": "application/json;charset=UTF-8"
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: postData,
    method: 'POST',
    success: function (res) {
      //参数值为res.data,直接将返回的数据传入
      //doSuccess(res.data);
      console.log(res);
    },
    fail: function () {
      //doFail();
    },
  })
}

//GET请求，不需传参，直接URL调用，
function doGet(url, doSuccess, doFail) {
  wx.request({
    url: host + url,
    header: {
      "content-type": "application/json;charset=UTF-8"
    },
    method: 'GET',
    success: function (res) {
      doSuccess(res.data);
    },
    fail: function () {
      doFail();
    },
  })
}

/**
 * module.exports用来导出代码
 * js文件中通过var call = require("../util/request.js")  加载
 */
// 暴露接口方法
module.exports = {
  doPost: doPost,
  doGet: doGet
}