// @ts-ignore
import { generateSidebar } from 'vitepress-sidebar'
import { name, description, repository } from '../../../package.json'

const capitalizeFirst = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1)

export default {
  title: capitalizeFirst(name),
  description,
  outDir: '../dist',
  head: [
    ['link', { rel: 'icon', href: '/logo.png' }],
    ['link', { rel: 'shortcut icon', href: '/favicon.ico' }]
  ],
  themeConfig: {
    search: {
      provider: 'local'
    },
    sidebar: generateSidebar({
      root: 'src',
      collapsed: false,
      useTitleFromFileHeading: true,
      sortByFileName: [
        'getting-started.md',
        'build-configuration.md',
        'project-structure.md',
        'npm-scripts.md'
      ]
    }),
    socialLinks: [{ icon: 'github', link: repository.url.replace('.git', '') }]
  }
}
