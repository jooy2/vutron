# Build Configurations

Once the module installation is complete, you can simply build the platform package with the command below.

```shell
# For Windows (.exe, .appx)
$ npm run build:win

# For macOS (.dmg)
$ npm run build:mac

# For Linux (.rpm, .deb, .snap)
$ npm run build:linux
```

The built packages can be found in `release/{version}` location.

## Build settings for projects that use Native Node modules

For projects that use the **Native Node Module**, add the following script to your `package.json`: When installing dependencies, `electron-builder` will take care of any modules that require rebuilding.

```json
{
  "scripts": {
    "postinstall": "electron-builder install-app-deps"
  }
}
```

For more information, please refer to the following article: https://webpack.electron.build/dependency-management#installing-native-node-modules

## What do I need to do for a multi-platform build?

**macOS** is recommended if you want to build multiple platforms simultaneously on one platform. Because it can be configured with just a few very simple settings.

You can perform multi-platform builds at once with the following command. Alternatively, you can just do it for the OS you want via the individual build commands above.

```shell
$ npm run build
```

`Multipass` configuration may be required for Linux builds. Learn more about `Multipass` through the following link: https://multipass.run

## Reduce bundle size by excluding development files

You can exclude files you don't need at build time by adding a file pattern to the files property of `electron-builder.json5`. This will save bundle capacity.

Below is an unnecessary `node_modules` file pattern that can further save bundles. Depending on the project, using the rules below may cause problems, so please review it before using.

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
