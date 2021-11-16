import Vue from "vue";
import VueRouter from "vue-router";
import Login from '@/views/login'
import Layout from '@/components/Layout'
import Home from '@/views/home'
import Member from '@/views/member'
import Supplier from '@/views/supplier'
import Goods from '@/views/goods'
import Staff from '@/views/staff'


Vue.use(VueRouter);

const routes = [
  {
    path: '/login',
    component: Login
  },
  {
    path: '/',//首页路由
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: '/home',
        component: Home,
        meta: { title: '首页' }
      },
    ],
  },
  {
    path: '/member',
    component: Layout,
    children: [
      {
        path: '/',
        component: Member,
        meta: { title: '会员管理' }
      },
    ]
  },
  {
    path: '/supplier',
    component: Layout,
    children: [
      {
        path: '/',
        component: Supplier,
        meta: { title: '供应商管理' }
      },
    ]
  },
  {
    path: '/goods',
    component: Layout,
    children: [
      {
        path: '/',
        component: Goods,
        meta: { title: '商品管理' }
      },
    ]
  },
  {
    path: '/staff',
    component: Layout,
    children: [
      {
        path: '/',
        component: Staff,
        meta: { title: '员工管理' }
      },
    ]
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

// 解决重复点击路由报错的BUG
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}


export default router;
