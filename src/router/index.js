import { createRouter, createWebHistory } from 'vue-router'
import MoneySavingTools from '@/views/MoneySavingTools.vue'

const routes = [
  {
    path: '/',
    redirect: '/money-saving-tools'
  },
  {
    path: '/money-saving-tools',
    name: 'MoneySavingTools',
    component: MoneySavingTools
  },
  {
    path: '/money-saving-community',
    name: 'MoneySavingCommunity',
    component: () => import('@/views/MoneySavingCommunity.vue')
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/views/admin/AdminDashboard.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/money-saving-tools'
  }
]

const router = createRouter({
  history: createWebHistory(process.env.NODE_ENV === 'production' ? '/HuiGei/' : '/'),
  routes
})

export default router