import Vue from 'vue'
import App from './App'
import router from './router/fullPath'
import store from './store/index'

//引入axios
import Axios from 'axios'
//给vue挂载一个属性
Vue.prototype.$axios = Axios;

//去掉告警信息
Vue.config.productionTip = false

new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    data: {
      eventHub: new Vue()
    },
    render: h => h(App),
    template: '<App/>'
})
