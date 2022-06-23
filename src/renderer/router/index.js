import { createRouter, createWebHashHistory } from 'vue-router/dist/vue-router.esm-bundler'
import { MainScreen, ErrorScreen } from '../components/screen'

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: MainScreen
    },
    {
      path: '/error',
      component: ErrorScreen
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})
