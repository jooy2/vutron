---
order: 2
---

# 빌드 구성

모듈 설치가 완료되면 아래 명령어를 사용하여 플랫폼 패키지를 간단하게 빌드할 수 있습니다.

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

빌드된 패키지는 `release/{version}` 위치에서 찾을 수 있습니다.

자세한 내용은 다음 문서를 참조하세요: https://webpack.electron.build/dependency-management#installing-native-node-modules

## 멀티플랫폼 빌드를 하려면 어떻게 해야 하나요?

각 OS에 대한 패키지를 만들려면 동일한 OS에서 빌드해야 합니다. 예를 들어 macOS용 패키지는 macOS 컴퓨터에서 빌드해야 합니다.

하지만 하나의 OS에서 Windows, macOS, Linux용 패키지를 한 번에 빌드할 수 있습니다. 하지만 이를 위해서는 약간의 준비가 필요할 수 있습니다.

하나의 플랫폼에서 여러 플랫폼을 동시에 구축하려는 경우 **macOS**를 권장합니다. 몇 가지 간단한 설정만으로 구성할 수 있기 때문입니다.

다음 명령어를 사용하여 한 번에 여러 플랫폼 빌드를 수행할 수 있습니다. 또는 위의 개별 빌드 명령어를 통해 원하는 OS에 대해서만 빌드를 수행할 수도 있습니다.

```shell
$ npm run build:all
```

Linux 빌드에는 `multipass` 구성이 필요할 수 있습니다. 다음 링크를 통해 `multipass`에 대해 자세히 알아보세요: https://multipass.run

멀티플랫폼 빌드에 대해 자세히 알아보려면 다음 문서를 참조하세요: https://electron.build/multi-platform-build

## 번들 크기 줄이기

### 번들에 포함되는 라이브러리는 `devDependencies`에 둡니다

`electron-builder`는 `config.js`의 `files` 패턴과 별개로 `dependencies`에 적힌 패키지를 통째로 `app.asar`에 넣습니다. 그런데 Vite가 이미 `vue`, `pinia`, `vue-router` 같은 라이브러리를 `dist`로 번들하기 때문에, 이들을 `dependencies`에 두면 실행에 쓰이지 않는 사본이 패키지에 한 번 더 들어갑니다.

Vutron은 그래서 번들되는 라이브러리를 모두 `devDependencies`에 둡니다. 이 템플릿 기준으로 `app.asar`이 22.8MB에서 0.93MB로 줄어듭니다.

`dependencies`에 넣어야 하는 것은 Vite가 번들할 수 없는 패키지뿐입니다. 네이티브 노드 모듈(`.node` 바이너리를 쓰는 모듈)과, 자기 파일 경로를 런타임에 직접 읽는 패키지가 여기에 해당합니다.

### 필요 없는 파일 제외하기

빌드 시점에 필요하지 않은 파일은 `buildAssets/builder/config.js`의 `files` 속성에 파일 패턴을 추가하여 제외할 수 있습니다.

아래는 `dependencies`를 쓸 수밖에 없을 때 `node_modules`에서 추가로 걷어낼 수 있는 패턴의 예시입니다. 프로젝트에 따라 아래 규칙을 사용하면 문제가 발생할 수 있으므로 사용 전에 검토하시기 바랍니다.

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

## 네이티브 노드 모듈을 사용하는 프로젝트의 빌드 설정

**네이티브 노드 모듈**을 사용하는 프로젝트의 경우, `package.json`에 다음 스크립트를 추가하세요: 종속성을 설치할 때 `electron-builder`가 리빌드가 필요한 모듈을 처리합니다.

```json
{
  "scripts": {
    "postinstall": "electron-builder install-app-deps"
  }
}
```
