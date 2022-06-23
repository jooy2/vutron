import { createRouter, createWebHashHistory } from 'vue-router/dist/vue-router.esm-bundler'
import { MainScreen, ErrorScreen } from '../components/screen'

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: MainScreen,
      meta: {
        title: 'Main'
      }
    },
    {
      path: '/error',
      component: ErrorScreen,
      meta: {
        title: 'Unknown error occurred'
      }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})
