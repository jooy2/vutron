---
order: 2
---

# 构建配置

模块安装完成后，只需执行以下命令即可构建平台软件包。

```shell
# For Windows (.exe, .appx)
$ npm run build:win

# For macOS (.dmg)
$ npm run build:mac

# For Linux (.rpm, .deb, .snap)
$ npm run build:linux

# All platform (.exe, .appx, .dmg, .rpm, .deb, .snap) - see below description
$ npm run build:all
```

已构建的软件包可在 `release/{version}` 位置找到。

如需了解更多信息，请参阅以下文章： https://webpack.electron.build/dependency-management#installing-native-node-modules

## 多平台构建需要做些什么？

要为每个操作系统创建软件包，必须在相同的操作系统上构建。例如，macOS 的软件包必须在 macOS 机器上构建。

不过，你可以在一个操作系统上同时为 Windows、macOS 和 Linux 构建软件包。不过，这可能需要一些准备工作。

如果想在一个平台上同时构建多个平台，建议使用**macOS**。因为只需几个非常简单的设置就能对其进行配置。

您可以使用以下命令同时执行多平台构建。或者，你也可以通过上面的单独构建命令，只针对你想要的操作系统进行构建。

```shell
$ npm run build:all
```

Linux 构建可能需要 "Multipass" 配置。通过以下链接了解有关 `Multipass` 的更多信息： https://multipass.run

要了解有关多平台构建的更多信息，请参阅以下文章： https://electron.build/multi-platform-build

## 减小软件包大小

### 将被打包的库放在 `devDependencies` 中

`electron-builder` 会把 `dependencies` 中列出的每个包都复制到 `app.asar`，这与 `config.js` 的 `files` 模式无关。而 Vite 已经把 `vue`、`pinia`、`vue-router` 这类库打包进了 `dist`，所以把它们放在 `dependencies` 中，只会让软件包中多出一份从不加载的副本。

因此 Vutron 把所有被打包的库都放在 `devDependencies` 中。在本模板上，这使 `app.asar` 从 22.8MB 减少到 0.93MB。

只有 Vite 无法打包的包才应该放进 `dependencies`：附带 `.node` 二进制文件的原生 Node.js 模块，以及在运行时读取自身文件路径的包。

### 排除不需要的文件

您可以通过在 `buildAssets/builder/config.js` 的 `files` 属性中添加文件模式，在构建时排除不需要的文件。

下面是在无法避免使用 `dependencies` 时，可以从 `node_modules` 中进一步剔除文件的模式示例。根据项目情况，使用下面的规则可能会导致问题，因此请在使用前进行审查。

```json
[
  "!**/.*",
  "!**/node_modules/**/{CONTRIBUTORS,CNAME,AUTHOR,TODO,CONTRIBUTING,COPYING,INSTALL,NEWS,PORTING,Makefile,htdocs,CHANGELOG,ChangeLog,changelog,README,Readme,readme,test,sample,example,demo,composer.json,tsconfig.json,jsdoc.json,tslint.json,typings.json,gulpfile,bower.json,package-lock,Gruntfile,CMakeLists,karma.conf,yarn.lock}*",
  "!**/node_modules/**/{man,benchmark,node_modules,spec,cmake,browser,vagrant,doxy*,bin,obj,obj.target,example,examples,test,tests,doc,docs,msvc,Xcode,CVS,RCS,SCCS}{,/**/*}",
  "!**/node_modules/**/*.{conf,png,pc,coffee,txt,spec.js,ts,js.flow,html,def,jst,xml,ico,in,ac,sln,dsp,dsw,cmd,vcproj,vcxproj,vcxproj.filters,pdb,exp,obj,lib,map,md,sh,gypi,gyp,h,cpp,yml,log,tlog,Makefile,mk,c,cc,rc,xcodeproj,xcconfig,d.ts,yaml,hpp}",
  "!**/node_modules/**/node-v*-x64{,/**/*}",
  "!**/node_modules/bluebird/js/browser{,/**/*}",
  "!**/node_modules/bluebird/js/browser{,/**/*}",
  "!**/node_modules/source-map/dist{,/**/*}",
  "!**/node_modules/lodash/fp{,/**/*}",
  "!**/node_modules/async/!(dist|package.json)",
  "!**/node_modules/async/internal{,/**/*}",
  "!**/node_modules/ajv/dist{,/**/*}",
  "!**/node_modules/ajv/scripts{,/**/*}",
  "!**/node_modules/node-pre-gyp/!(lib|package.json)",
  "!**/node_modules/node-pre-gyp/lib/!(util|pre-binding.js|node-pre-gyp.js)",
  "!**/node_modules/node-pre-gyp/lib/util/!(versioning.js|abi_crosswalk.json)",
  "!**/node_modules/source-map-support/browser-source-map-support.js",
  "!**/node_modules/json-schema/!(package.json|lib)"
]
```

## 使用本地 Node 模块的项目的构建设置

对于使用 **Native Node Module**的项目，请将以下脚本添加到您的 `package.json`： 安装依赖项时，`electron-builder` 会处理任何需要重建的模块。

```json
{
  "scripts": {
    "postinstall": "electron-builder install-app-deps"
  }
}
```
