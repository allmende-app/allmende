import { nextTick } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

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
        title: 'Page Not Found',
        requiresAuth: false,
      },
    },
    {
      path: '/error',
      name: 'error',
      component: () => import('../views/Error.vue'),
      props: { errorCode: 404, errorMessage: 'Page Not Found' },
      meta: {
        title: 'Page Not Found',
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
        title: 'Create Post',
        requiresAuth: true,
        hideNavigation: true,
      },
    },
    {
      path: '/posts/:postID',
      name: 'post-detail',
      component: () => import('../views/Post/Detail.vue'),
      meta: {
        title: 'Post',
        requiresAuth: true,
      },
      props: true,
    },
    {
      path: '/user/:username*',
      name: 'user',
      component: () => import('../views/User/Profil.vue'),
      meta: {
        title: 'User',
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
        title: 'Playground',
        requiresAuth: false,
      },
    },
    {
      path: '/auth/register',
      name: 'register',
      component: () => import('../views/Auth/Register.vue'),
      meta: {
        title: 'Sign up',
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
        title: 'Sign in',
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
        title: 'Privacy',
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
        title: 'License',
        requiresAuth: false,
        hideNavigation: true,
        fullSize: false,
      },
    },
  ],
})

router.afterEach((to) => {
  nextTick(() => {
    document.title = to.meta.title ? `${to.meta.title} | Allmende` : 'Allmende'
  })
})

export default router
