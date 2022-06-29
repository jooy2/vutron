<div align="center">

![vutron-logo](src/renderer/assets/img/vutron-logo.png)

Quick Start Templates for **[Vue.js 3](https://vuejs.org/)** + **[Electron.js](https://www.electronjs.org/)**

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/jooy2/vutron/blob/master/LICENSE)
![Programming Language Usage](https://img.shields.io/github/languages/top/jooy2/vutron)
![github repo size](https://img.shields.io/github/repo-size/jooy2/vutron)
![Stars](https://img.shields.io/github/stars/jooy2/vutron?style=social)
![Commit Count](https://img.shields.io/github/commit-activity/y/jooy2/vutron)
![Line Count](https://img.shields.io/tokei/lines/github/jooy2/vutron)
[![Followers](https://img.shields.io/github/followers/jooy2?style=social)](https://github.com/jooy2)

`Vutron` is a preconfigured template for developing `Electron` cross-platform desktop apps. It uses `Vue 3` and allows you to build a fast development environment with little effort.

</div>

## Advantages of use
- ✅ You can build immediately without any presets, so you can develop quickly.
- ✅ It is being maintained quickly to be compatible with the latest `Vue` and `Electron`, as well as many modules.
- ✅ There is no need to worry about layout and data management by using various additional templates.


## Pre-configured components

- [Electron 19.x.x](https://www.electronjs.org)
- [Electron Builder 23.x](https://www.electron.build)
- [Vue 3.2.x](https://vuejs.org)
- [Vue-i18n 9.x](https://kazupon.github.io/vue-i18n)
- [Vue-router 4.x](https://router.vuejs.org)
- [Pinia 2.x](https://pinia.vuejs.org)
- [Vuetify 3.x (Beta)](https://next.vuetifyjs.com)
- [BabelJS 7.x](https://babeljs.io)
- [Webpack 5.x](https://webpack.js.org)
- [ESLint 8.x](https://eslint.org)

## Installation
To configure this project, the `NodeJS` version must be at least **17.1.x** or higher.

It's also experimental and relies on newer modules, with a lot of code made up of `ESM`, so it's worth checking for compatibility when using third-party modules.

After cloning the project, run the following command in the terminal:

```shell
$ npm i
```

## Run in development environment

```shell
$ npm run dev
```

## Build

```shell
# For Windows (.exe, .appx)
$ npm run build:win

# For macOS (.dmg)
$ npm run build:mac

# For Linux (.rpm, .deb, .snap)
$ npm run build:linux
```

## License
Copyright © 2022 Jooy2 Released under the MIT license.

The structure and some code of this project was inspired by **[electron-vue](https://github.com/SimulatedGREG/electron-vue)**.
