/* eslint-disable no-template-curly-in-string */
const dotenv = require('dotenv')
const packageJson = require('../../package.json')

const baseConfig = {
  productName: packageJson.name,
  appId: packageJson.appId,
  asar: true,
  extends: null,
  compression: 'maximum',
  artifactName: '${productName} ${version}_${arch}.${ext}',
  directories: {
    output: './release/${version}'
  },
  mac: {
    bundleVersion: '1.0',
    hardenedRuntime: true,
    gatekeeperAssess: false,
    notarize: false,
    icon: 'buildAssets/icons/icon.icns',
    type: 'distribution',
    target: [
      {
        // `universal` bundles both of these into one much larger artifact.
        // Add it here if a single download matters more than size.
        target: 'dmg',
        arch: ['x64', 'arm64']
      }
    ]
  },
  dmg: {
    contents: [
      {
        x: 410,
        y: 150,
        type: 'link',
        path: '/Applications'
      },
      {
        x: 130,
        y: 150,
        type: 'file'
      }
    ],
    sign: false
  },
  win: {
    icon: 'buildAssets/icons/icon.ico',
    // `appx` is omitted on purpose: it needs Store publisher details and a
    // signing certificate, so it fails out of the box. Add it once those exist.
    target: [
      {
        target: 'zip',
        arch: 'x64'
      },
      {
        target: 'portable',
        arch: 'x64'
      },
      {
        target: 'nsis',
        arch: 'x64'
      }
    ]
  },
  portable: {
    artifactName: '${productName} ${version}_${arch} Portable.${ext}'
  },
  nsis: {
    oneClick: true
  },
  linux: {
    executableName: packageJson.name.toLowerCase(),
    icon: 'buildAssets/icons',
    category: 'Utility',
    target: [
      {
        target: 'snap',
        arch: 'x64'
      },
      {
        target: 'deb',
        arch: 'x64'
      },
      {
        target: 'rpm',
        arch: 'x64'
      }
    ]
  }
}

dotenv.config()

baseConfig.copyright = `ⓒ ${new Date().getFullYear()} $\{author}`
/*
  Files to include in the build. Entries prefixed with `!` are excluded again.
  Note that Vite emits the dev-only entry with a content hash
  (`index.dev-<hash>.js`), so the exclusion has to be a glob.
*/
baseConfig.files = [
  'dist/**/*',
  '!dist/main/index.dev*.js',
  '!docs/**/*',
  '!tests/**/*',
  '!release/**/*'
]

// TODO: Notarize for macOS
baseConfig.mac.identity = null
/* if (process.env.MAC_NOTARIZE === 'true') {
  baseConfig.afterSign = './buildAssets/builder/notarize.ts'
} else {
  baseConfig.mac.identity = null
} */

module.exports = {
  ...baseConfig
}
