import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/home' },
    { path: '/login', name: 'login', component: () => import('../pages/Login.vue') },
    { path: '/home', name: 'home', component: () => import('../pages/Home.vue') },
    { path: '/upload', name: 'upload', component: () => import('../pages/Upload.vue'), meta: { requiresAuth: true } },
    { path: '/summary', name: 'summary', component: () => import('../pages/Summary.vue'), meta: { requiresAuth: true } },
    { path: '/chat', name: 'chat', component: () => import('../pages/Chat.vue'), meta: { requiresAuth: true } },
    {
      path: '/interview',
      name: 'interview',
      component: () => import('../pages/Interview.vue'),
      meta: { requiresAuth: true },
    },
    { path: '/history', name: 'history', component: () => import('../pages/History.vue'), meta: { requiresAuth: true } },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../pages/Settings.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach((to) => {
  const userStore = useUserStore()

  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    return {
      path: '/login',
      query: { redirect: to.fullPath },
    }
  }

  if (to.path === '/login' && userStore.isLoggedIn) {
    return '/home'
  }

  return true
})

export default router
