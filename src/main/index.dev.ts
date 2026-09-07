// Warning: This file is only used in the development environment
// and is removed at build time.
// Do not edit the file unless necessary.
import { installExtension, VUEJS_DEVTOOLS } from 'electron-extension-installer'
import { devtron } from '@electron/devtron'
import log from 'electron-log/main'

/*
 * Development extensions, loaded by `index.ts` through a dynamic import so
 * that neither they nor the packages they pull in reach the packaged bundle.
 *
 * Each install is guarded on its own. The Vue DevTools are fetched from the
 * Chrome Web Store the first time and cached afterwards, so this fails with no
 * network rather than taking the app down with it.
 * */
export const installDevTools = async (): Promise<void> => {
  try {
    await devtron.install()
  } catch (error) {
    log.warn(`Could not install Devtron: ${error}`)
  }

  try {
    // The extension id and the version it is pinned to come from
    // `electron-extension-installer`, so they cannot drift apart.
    await installExtension(VUEJS_DEVTOOLS, {
      loadExtensionOptions: {
        allowFileAccess: true
      }
    })
  } catch (error) {
    log.warn(`Could not install the Vue DevTools: ${error}`)
  }
}
