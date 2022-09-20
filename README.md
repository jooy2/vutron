<div align="center">

![vutron-logo](src/renderer/assets/img/vutron-logo.png)

Quick Start Templates for **[Vue 3](https://vuejs.org/)** + **[Electron.js](https://www.electronjs.org/)**

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/jooy2/vutron/blob/master/LICENSE)
![Programming Language Usage](https://img.shields.io/github/languages/top/jooy2/vutron)
![github repo size](https://img.shields.io/github/repo-size/jooy2/vutron)
![Stars](https://img.shields.io/github/stars/jooy2/vutron?style=social)
![Commit Count](https://img.shields.io/github/commit-activity/y/jooy2/vutron)
![Line Count](https://img.shields.io/tokei/lines/github/jooy2/vutron)
[![Followers](https://img.shields.io/github/followers/jooy2?style=social)](https://github.com/jooy2)

**Vutron** is a preconfigured template for developing `Electron` cross-platform desktop apps. It uses `Vue 3` and allows you to build a fast development environment with little effort.

</div>

## Advantages of use

- ✅ You can build immediately without any presets, so you can develop quickly.
- ✅ It is being maintained quickly to be compatible with the latest `Vue` and `Electron`, as well as many modules.
- ✅ There is no need to worry about layout and data management by using various additional templates.

## Features

- ⚡️ Rapid development through hot-reload
- ⚡️ Cross-platform development and build support
- ⚡️ Multilingual support
- ⚡️ Support for themes (dark & light)
- ⚡️ Basic layout manager
- ⚡️ Global state management through the Pinia store

## Pre-configured components

- [Electron 20.x.x](https://www.electronjs.org)
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

To configure this project, the `NodeJS` version must be at least **17.1.x** or higher. (Verified and stable version is 17.1 or higher, but there doesn't seem to be any issues with NodeJS 16.16 either.)

Click **[Use this template](https://github.com/jooy2/vutron/generate)** to instantly create your own project.

OR, Clone this repo using below command.

```shell
$ git clone https://github.com/jooy2/vutron <PROJECT_NAME>
```

After cloning the project, run the following command in the terminal:

```shell
$ npm i
```

## Run in development environment

```shell
$ npm run dev
```

## Build

Once the module installation is complete, you can simply build the platform package with the command below.

```shell
# For Windows (.exe, .appx)
$ npm run build:win

# For macOS (.dmg)
$ npm run build:mac

# For Linux (.rpm, .deb, .snap)
$ npm run build:linux
```

### What do I need to do for a multi-platform build?

**macOS** is recommended if you want to build multiple platforms simultaneously on one platform. Because it can be configured with just a few very simple settings.

You can perform multi-platform builds at once with the following command. Alternatively, you can just do it for the OS you want via the individual build commands above.

```shell
$ npm run build
```

`Multipass` configuration may be required for Linux builds. Learn more about `Multipass` through the following link: https://multipass.run/

## Looking for Electron templates made with React?

Also check out the `Retron` project, which consists of Vite + React + Material-UI + Electron.

https://github.com/jooy2/retron

## Contribute

You can report issues on [Github Issue](https://github.com/jooy2/vutron/issues). You can also request a pull to fix bugs and add frequently used features.

## License
Copyright © 2022 Jooy2 Released under the MIT license.

The structure and some code of this project was inspired by **[electron-vue](https://github.com/SimulatedGREG/electron-vue)**.
