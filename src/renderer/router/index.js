import { createRouter, createWebHashHistory } from 'vue-router/dist/vue-router.esm-bundler'
import { MainScreen, ErrorScreen } from '../components/screen'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: MainScreen
    },
    {
      path: '/crash',
      component: ErrorScreen
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

export default router
