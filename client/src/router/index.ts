import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: {
        requiresAuth: false, // TODO set to true later
      },
    },
    {
      path: '/new',
      name: 'create-post',
      component: () => import('../views/CreatePost.vue'),
      meta: {
        requiresAuth: false, // TODO set to true later
        hideNavigation: true,
      },
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
      },
    },
    {
      path: '/auth/login',
      name: 'login',
      component: () => import('../views/Auth/Login.vue'),
      meta: {
        requiresAuth: false,
        hideNavigation: true,
      },
    },
  ],
})

export default router
