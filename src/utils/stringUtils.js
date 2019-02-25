/*
 * Author: 阿甘
 * Email:519983770@qq.com
 */

// 获取双字节长度
function getBytesLength(str) {
    var realLength = 0,
        len = str.length,
        charCode = -1;
    for (var i = 0; i < len; i++) {
        charCode = str.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128) realLength += 1;
        else realLength += 2;
    }
    return realLength;
}

// 删除左右两端的空格
function trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
}

// 删除左边的空格
function ltrim(str) {
    return str.replace(/(^\s*)/g, "");
}

// 删除右边的空格
function rtrim(str) {
    return str.replace(/(\s*$)/g, "");
}

export { trim };