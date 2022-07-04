import { backend } from '@/utils'
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    // return desired position
    if (to.hash) {
      return {
        el: to.hash,
        selector: to.hash,
        behavior: 'smooth',
      }
    }
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
  routes: [
    {
      path: '/:pathMatch(.*)*',
      name: 'error',
      component: () => import('../views/Error.vue'),
      props: { errorCode: 404, errorMessage: 'Page Not Found' },
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/error',
      name: 'error',
      component: () => import('../views/Error.vue'),
      props: { errorCode: 404, errorMessage: 'Page Not Found' },
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/new',
      name: 'create-post',
      component: () => import('../views/CreatePost.vue'),
      meta: {
        requiresAuth: true,
        hideNavigation: true,
      },
    },
    {
      path: '/posts/:postID',
      name: 'post-detail',
      component: () => import('../views/Post/Detail.vue'),
      meta: {
        requiresAuth: true,
        hideNavigation: true,
      },
      props: true,
    },
    {
      path: '/user/:username*',
      name: 'user',
      component: () => import('../views/User/Index.vue'),
      meta: {
        requiresAuth: true,
        hideNavigation: false,
      },
      props: true,
    },
    {
      path: '/playground',
      name: 'playground',
      component: () => import('../views/Playground.vue'),
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/auth/register',
      name: 'register',
      component: () => import('../views/Auth/Register.vue'),
      meta: {
        requiresAuth: false,
        hideNavigation: true,
        fullSize: true,
      },
    },
    {
      path: '/auth/login',
      name: 'login',
      component: () => import('../views/Auth/Login.vue'),
      meta: {
        requiresAuth: false,
        hideNavigation: true,
        fullSize: true,
      },
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: () => import('../views/Privacy.vue'),
      meta: {
        requiresAuth: false,
        hideNavigation: true,
        fullSize: false,
      },
    },
    {
      path: '/license',
      name: 'license',
      component: () => import('../views/License.vue'),
      meta: {
        requiresAuth: false,
        hideNavigation: true,
        fullSize: false,
      },
    },
  ],
})

export default router
