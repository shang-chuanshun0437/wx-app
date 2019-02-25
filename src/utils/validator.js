/*
 * Project: f:\2017Project\game-cms
 * Created Date: Monday June 11th 2018
 * Author: 17030360
 * Email:wdnybbz@163.com
 * Description:-----
 * EditLog:-----
 * Copyright (c) 2018 SN
 */


import {trim} from './stringUtils';

function isLimit2(str, o,callback) {
    var realLength = 0,
        len = str.length,
        charCode = -1,
        o = o || {
            min: 0,
            max: 0
        },
        min = o.min || 0,
        max = o.max || 0;
    for (var i = 0; i < len; i++) {
        charCode = str.charCodeAt(i);
        realLength += (charCode >= 0 && charCode <= 128) ? 1 : 2;
    }

    if(realLength>max){
        callback(new Error('最多'+o.max+'个数字、字母或'+(o.max/2)+'个汉字'));
    }else if(realLength<min){
        callback(new Error('最少'+o.min+'个数字、字母或'+(o.max/2)+'个汉字'));
    }else{
        callback();
    }
}


function isBetween1To20(rule,value,callback){
    isLimit2(value,{min:2,max:20},callback);
}

function isBetween1To40(rule,value,callback){
    isLimit2(value,{min:2,max:40},callback);
}

function isBetween1To120(rule,value,callback){
    isLimit2(value,{min:2,max:120},callback);
}

function isBetween1To400(rule,value,callback){
    isLimit2(value,{min:1,max:400},callback);
}

const urlPattern=/(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
function isUrl(rule,value,callback) {
    if(!urlPattern.test(trim(value))){
        callback(new Error('必须是合法的链接地址'));
    }else{
        callback();
    }
}

export {
  isBetween1To20,
  isBetween1To40,
  isBetween1To120,
  isBetween1To400,
  isUrl
}
