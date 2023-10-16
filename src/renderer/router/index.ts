import { MainScreen, ErrorScreen, SecondScreen } from '@/renderer/screens'
import { createRouter, createWebHashHistory } from 'vue-router'

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: MainScreen,
      meta: {
        titleKey: 'title.main'
      }
    },
    {
      path: '/second',
      component: SecondScreen,
      meta: {
        titleKey: 'title.second'
      }
    },
    {
      path: '/error',
      component: ErrorScreen,
      meta: {
        titleKey: 'title.error'
      }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})
