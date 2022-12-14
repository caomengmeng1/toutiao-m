import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './styles/index.less' //引入全局样式

// 加载dayjs初始化配置
import './utils/dayjs'

// 引入动态设置rem基准值
import 'amfe-flexible'

// 引入vant核心组件库
import Vant from 'vant'
// 引入全局样式
import 'vant/lib/index.css'
// 注册使用vant组件库
Vue.use(Vant);

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')