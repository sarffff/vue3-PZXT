import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '@/views/LayOut.vue'
import Home from '@/views/home/index.vue'
import Login from '@/views/login/index.vue'
import Order from '@/views/order/index.vue'
import Detail from '@/views/detail/index.vue'
import createOrder from '@/views/createOrder/index.vue'
import User from '@/views/user/index.vue'


const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { 
      path: '/',
      component: Layout,
      children: [
        {
          path: 'home',
          meta: { 
            icon: 'home-o',
            name: '首页'
          },
          component: Home
        },
        {
          path: 'order',
          meta: { 
            icon: 'orders-o',
            name: '订单'
          },
          component: Order
        },
        {
          path: 'user',
          meta: {
            icon: 'user-circle-o',
            name: '我的'
          },
          component: User
        }
      ]
    },
    {
      path: '/login',
      name:"login",
      component: Login
      
    },
    {
      path: '/createOrder',
      name:"createOrder",
      component: createOrder
    },
    {
      path: '/detail',
      name:"detail",
      component: Detail
    },
  ]
})

export default router
