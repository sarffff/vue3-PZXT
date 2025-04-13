import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '@/views/login/loginIndex.vue'
import Layout from '@/views/layout/layoutIndex.vue'
// import Admin from '@/views/auth/admin/index.vue'
// import Group from '@/views/auth/group/index.vue'
// import Dashboard from '@/views/dashboard/index.vue'
// import Order from '@/views/vppz/order/index.vue'
// import Staff from '@/views/vppz/staff/index.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Layout,
      name: 'main',
      children: []
    },
    {
      path: '/login',
      component: Login
    }
  ]
})

router.beforeEach((to) => {
  const token = localStorage.getItem('pzxt_user_token')
  if (to.path === '/login' && token) {
    return { path: '/' }
  }
  if (to.path !== '/login' && !token) {
    return { path: '/login' }
  }
})

export default router
