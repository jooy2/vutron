// @ts-ignore
import { generateSidebar } from 'vitepress-sidebar'
import { name, description, repository } from '../../package.json'

const capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1)

export default {
  title: capitalizeFirst(name),
  description,
  outDir: '../distDocs',
  head: [
    ['link', { rel: 'icon', href: '/logo.png' }],
    ['link', { rel: 'shortcut icon', href: '/favicon.ico' }]
  ],
  themeConfig: {
    sidebar: generateSidebar({
      root: 'docs',
      collapsible: false,
      collapsed: false,
      useTitleFromFileHeading: true,
      sortByFileName: ['getting-started.md', 'build-configuration.md', 'npm-scripts.md']
    }),
    socialLinks: [{ icon: 'github', link: repository.url.replace('.git', '') }]
  }
}
