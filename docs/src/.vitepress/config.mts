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
    logo: { src: '/icon.png', width: 24, height: 24 },
    search: {
      provider: 'local'
    },
    sidebar: generateSidebar({
      documentRootPath: 'src',
      collapsed: false,
      useTitleFromFileHeading: true,
      manualSortFileNameByPriority: [
        'Installation and Build',
        'Project Structures',
        'Electron How To'
      ]
    }),
    socialLinks: [{ icon: 'github', link: repository.url.replace('.git', '') }]
  }
}
