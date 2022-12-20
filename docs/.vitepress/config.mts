// @ts-ignore
import { generateSidebar } from 'vitepress-sidebar'
import { name, description } from '../../package.json'

const capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1)

export default {
  title: capitalizeFirst(name),
  description,
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
