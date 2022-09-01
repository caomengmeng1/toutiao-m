// 封装axios请求模块
import axios from "axios";

import store from '@/store'
import JSONBig from 'json-bigint'

const request = axios.create({
    baseURL: "http://toutiao.itheima.net", //基础路径
    // 自定义后端返回的原始数据
    // data:后端返回的原始数据，简单说就是JSON格式的字符串
    transformResponse: [function(data) {
        try {
            // 如果转换成功则返回转换的数据结果
            return JSONBig.parse(data)
        } catch (err) {
            // 如果转换失败，则包装为统一数据格式并返回
            return {
                data
            }
        }
    }]
})


// 请求拦截器

request.interceptors.request.use(function(config) {
    // 请求发起会经过这里
    // config ：本次请求的配置对象
    // config 里面有一个属性：headers
    // console.log(config);
    const { user } = store.state
    if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`
    }
    // console.log(config);
    // 注意：这里务必要返回，config配置对象，否则请求就停在这里出不去了
    return config
}, function(error) {
    // 如果请求出错了，（还没有发出去）就会进入这里
    return Promise.reject(error)
})

// 响应拦截器

export default request