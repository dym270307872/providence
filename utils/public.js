/**
 * 功能描述：AES加密工具和排序 JS文件。
 * Copyright (c) 2019 FanYunzhe 
 * Date: 2019-04-03
 * version: 1.0.0
 */

var CryptoJS = require('aes.js');  //引用AES源码js
var key = CryptoJS.enc.Utf8.parse("yTdKOrps94MmSUyo"); //十六位十六进制数作为秘钥 即APP_KEY
var iv = CryptoJS.enc.Utf8.parse('yTdKOrps94MmSUyo'); //十六位十六进制数作为秘钥偏移量 即APP_KEY

/**
 * 鉴权接口AES加密方法
 * word 加密内容
 */
function AuthEncrypt(word) {
  var srcs = CryptoJS.enc.Utf8.parse(word);
  var encrypted = CryptoJS.AES.encrypt(srcs, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.toString();
}
/**
 * 公共、业务接口AES加密方法
 * word 加密内容
 * key 加密密钥（公共接口=access_key, 业务接口=session_key）
 */
function Encrypt(word, key) {
  var app = getApp();
  var key_utf8 = CryptoJS.enc.Utf8.parse(key);
  var iv_utf8 = CryptoJS.enc.Utf8.parse(key);
  var srcs = CryptoJS.enc.Utf8.parse(word);
  var encrypted = CryptoJS.AES.encrypt(srcs, key_utf8, {
    iv: iv_utf8,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.toString();
}
/**
 * 解密方法
 * word 解密内容
 * key 加密密钥（公共接口=access_key, 业务接口=session_key）
 */
function Decrypt(word) {
  var encryptedHexStr = CryptoJS.enc.Hex.parse(word);
  var srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  var decrypt = CryptoJS.AES.decrypt(srcs, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  var decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  return decryptedStr.toString();
}
/**
 * 接口参数排序方法
 * strTemp 排序内容
 */
function Sort(strTemp) {
  var list = strTemp.split(""); //分割字符串a为数组b
  list.sort(); //数组b升序排序（系统自带的方法）
  strTemp = list.join(""); //把数组b每个元素连接成字符串c
  return strTemp;
}

//暴露接口
module.exports.Decrypt = Decrypt;
module.exports.AuthEncrypt = AuthEncrypt;
module.exports.Encrypt = Encrypt;
module.exports.Sort = Sort;