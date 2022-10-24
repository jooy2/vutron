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

The built packages can be found in `dist/release/{version}` location.

### Build settings for projects that use Native Node modules

For projects that use the **Native Node Module**, add the following script to your package.json: When installing dependencies, electron-builder will take care of any modules that require rebuilding.

```json
{
  "scripts": {
    "postinstall": "electron-builder install-app-deps"
  }
}
```

For more information, please refer to the following article: https://webpack.electron.build/dependency-management#installing-native-node-modules

### What do I need to do for a multi-platform build?

**macOS** is recommended if you want to build multiple platforms simultaneously on one platform. Because it can be configured with just a few very simple settings.

You can perform multi-platform builds at once with the following command. Alternatively, you can just do it for the OS you want via the individual build commands above.

```shell
$ npm run build
```

`Multipass` configuration may be required for Linux builds. Learn more about `Multipass` through the following link: https://multipass.run
