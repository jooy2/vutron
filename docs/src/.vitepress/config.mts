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
  cleanUrls: true,
  themeConfig: {
    search: {
      provider: 'local'
    },
    sidebar: generateSidebar({
      documentRootPath: 'src',
      collapsed: false,
      useTitleFromFileHeading: true,
      manualSortFileNameByPriority: [
        'getting-started.md',
        'build-configuration.md',
        'project-structure.md',
        'npm-scripts.md'
      ]
    }),
    socialLinks: [{ icon: 'github', link: repository.url.replace('.git', '') }]
  }
}
