import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '@/views/login'
import Home from '@/views/home'

// 导入加载进度条nprogress相关模块
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

Vue.use(VueRouter)

const routes = [
  // import 使用:import xxx from xx; 模块化导入(完整导入)
  // import (xx)函数调用 按需导入    @符号代表src目录的绝对路径地址
  // name属性作用:编程时导航可以利用
  // path: '/login',name: 'login',component: function({return import('@/views/login')})
  //   { path: '/login', name: 'login', component: () => import('@/views/login/index.vue') },
  // index.vue是默认索引文件,不用写也行
  { path: '/login', name: 'login', component: Login },
  // { path: '/home', name: 'home', component: Home }
  {
    path: '/home',
    name: 'home',
    component: Home,
    redirect: 'welcome', // redirect路由重定向
    children: [
      // 子路由配置  要给welcome创建为home的子级路由(路由嵌套)
      // import函数需要相关路由依赖包
      { path: '/welcome', name: 'welcome', component: () => import('@/views/welcome') },
      { path: '/article', nema: 'article', component: () => import('@/views/article') },
      // 添加文章
      { path: '/articleadd', nema: 'articleadd', component: () => import('@/views/articleadd') },
      // 修改文章，路由地址要传递参数，体现出被修改文章id，名称为aid
      { path: '/articleedit/:aid', name: 'articleedit', component: () => import('@/views/articleedit') },
      // 修改文章
      { path: '/account', name: 'account', component: () => import('@/views/account') },
      // 素材管理
      { path: '/material', name: 'material', component: () => import('@/views/material') },
      { path: '/fans', name: 'fans', component: () => import('@/views/fans/index.vue') }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 配置全局前置路由守卫
router.beforeEach((to, from, next) => {
  // 开启进度条  inc() set(0.5)显示进度条
  NProgress.start()
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

// 配置全局后置路由守卫
// 路由执行完毕组件显示好了,该路由会执行收尾工作
router.afterEach((to, from) => {
  // 进度条完成(关闭)
  NProgress.done()
})

export default router
