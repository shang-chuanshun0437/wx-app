import Vue from 'vue'
import Router from 'vue-router'

import Good from '../views/good/Good'
// 懒加载方式，当路由被访问的时候才加载对应组件
//const Login = resolve => require(['@/components/Login'], resolve)

Vue.use(Router)

let router = new Router({
    routes: [
      {path: '/good', component: Good, name: 'good'},
    ]

})

router.beforeEach((to, from, next) => {
  next()
})

export default router
