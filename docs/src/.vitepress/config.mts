import { generateSidebar } from 'vitepress-sidebar'
import { name, repository, homepage } from '../../../package.json'
import { defineConfig } from 'vitepress'
import { generateI18nLocale, generateI18nSearch } from 'vitepress-i18n'

const capitalizeFirst = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1)
const defaultLocale: string = 'en'
const editLinkPattern = 'https://github.com/jooy2/vutron/edit/master/docs/src/:path'

const defineSupportLocales = [
  { label: defaultLocale, translateLocale: defaultLocale },
  { label: 'ko', translateLocale: 'ko' }
]

export default defineConfig({
  title: capitalizeFirst(name),
  lastUpdated: true,
  outDir: '../dist',
  head: [
    ['link', { rel: 'icon', href: '/logo.png' }],
    ['link', { rel: 'shortcut icon', href: '/favicon.ico' }]
  ],
  cleanUrls: true,
  metaChunk: true,
  rewrites: {
    'en/:rest*': ':rest*'
  },
  sitemap: {
    hostname: homepage
  },
  themeConfig: {
    logo: { src: '/icon.png', width: 24, height: 24 },
    search: generateI18nSearch({
      defineLocales: defineSupportLocales,
      rootLocale: defaultLocale,
      provider: 'local'
    }),
    sidebar: generateSidebar([
      ...[defaultLocale, 'ko'].map((lang) => {
        return {
          collapsed: false,
          useTitleFromFileHeading: true,
          useTitleFromFrontmatter: true,
          useFolderTitleFromIndexFile: true,
          sortMenusByFrontmatterOrder: true,
          hyphenToSpace: true,
          capitalizeEachWords: true,
          manualSortFileNameByPriority: [
            'installation-and-build',
            'project-structures',
            'electron-how-to'
          ],
          documentRootPath: `/src/${lang}`,
          resolvePath: defaultLocale === lang ? '/' : `/${lang}/`,
          ...(defaultLocale === lang ? {} : { basePath: `/${lang}/` })
        }
      })
    ]),
    socialLinks: [{ icon: 'github', link: repository.url.replace('.git', '') }]
  },
  locales: generateI18nLocale({
    defineLocales: defineSupportLocales,
    rootLocale: defaultLocale,
    editLinkPattern: editLinkPattern,
    description: {
      en: 'Vutron is a preconfigured template for developing Electron cross-platform desktop apps. It uses Vue 3 and allows you to build a fast development environment with little effort.',
      ko: 'Vutron은 Electron 크로스 플랫폼 데스크톱 앱 개발을 위해 미리 구성된 템플릿입니다. Vue 3을 사용하며 적은 노력으로 빠른 개발 환경을 구축할 수 있습니다.'
    },
    themeConfig: {
      en: {
        nav: [
          {
            text: 'Getting Started',
            link: '/installation-and-build/getting-started'
          }
        ]
      },
      ko: {
        nav: [
          {
            text: '시작하기',
            link: '/ko/installation-and-build/getting-started'
          }
        ]
      }
    }
  })
})
