import Vue from 'vue'
import Vuex from 'vuex'
import { getItem, setItem } from '@/utils/storage'


Vue.use(Vuex)

const TOKEN_KEY = 'TOTIAO_USER' //申明一个变量名，作为本地存储的名称
export default new Vuex.Store({
    state: {
        // 用户的登录状态信息
        // 一个对象，存储当前登录用户信息（token等数据）
        user: getItem(TOKEN_KEY)
            // user: JSON.parse(window.localStorage.getItem(TOKEN_KEY))
            // user: null
    },
    getters: {},
    mutations: {
        setUser(state, data) {
            state.user = data
                // 为了防止刷新丢失，我们需要把数据备份到本地存储
                // window.localStorage.setItem(TOKEN_KEY, JSON.stringify(state.user))
            setItem(TOKEN_KEY, state.user)
        }
    },
    actions: {},
    modules: {}
})