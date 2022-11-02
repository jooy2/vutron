import { generateSidebar } from 'vitepress-sidebar'

export default {
	title: 'Vutron',
	description: 'Quick Start Templates for Vite + Vue 3 + Electron',
	themeConfig: {
		sidebar: generateSidebar({
			root: 'docs',
			collapsible: false,
			collapsed: false,
			useTitleFromFileHeading: true,
			sortByFileName: ['getting-started.md', 'build-configuration.md', 'npm-scripts.md']
		}),
		socialLinks: [{ icon: 'github', link: 'https://github.com/jooy2/vutron' }]
	}
}
