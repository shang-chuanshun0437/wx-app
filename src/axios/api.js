/*
 * Author: 阿甘
 * Email:519983770@qq.com
 */

import { instance } from "../axios/instance";

export const POST = (url, params) => {
    return instance.post(url, params).then(res => res.data)
}

export const GET = (url, params) => {
    return instance.get(url, { params: params }).then(res => res.data)
}