import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '@/views/login'
import Home from '@/views/home'

Vue.use(VueRouter)

const routes = [
// import 使用:import xxx from xx; 模块化导入(完整导入)
// import (xx)函数调用 按需导入    @符号代表src目录的绝对路径地址
// name属性作用:编程时导航可以利用
// path: '/login',name: 'login',component: function({return import('@/views/login')})
//   { path: '/login', name: 'login', component: () => import('@/views/login/index.vue') },
  // index.vue是默认索引文件,不用写也行
  { path: '/login', name: 'login', component: Login },
  { path: '/home', name: 'home', component: Home }
]

const router = new VueRouter({
  routes
})

// 配置全局前置路由守卫
router.beforeEach((to, from, next) => {
  // 获得用户登录状态信息
  let userinfo = window.sessionStorage.getItem('userinfo')
  // 登录状态：userinfo是大字符串， 非登录状态，userinfo是null
  if (!userinfo && to.path !== '/login') {
    // 强制登录
    return next('/login')
  }

  // 放行
  next()
})

export default router
