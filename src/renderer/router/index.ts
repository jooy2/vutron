import { createRouter, createWebHashHistory } from 'vue-router/dist/vue-router.esm-bundler'
import { MainScreen, ErrorScreen, SecondScreen } from '@/renderer/screens'

import i18n from '../plugins/i18n'

const { t } = i18n.global

export default createRouter({
	history: createWebHashHistory(),
	routes: [
		{
			path: '/',
			component: MainScreen,
			meta: {
				title: t('title.main')
			}
		},
		{
			path: '/second',
			component: SecondScreen,
			meta: {
				title: t('title.second')
			}
		},
		{
			path: '/error',
			component: ErrorScreen,
			meta: {
				title: t('title.error')
			}
		},
		{
			path: '/:pathMatch(.*)*',
			redirect: '/'
		}
	]
})
