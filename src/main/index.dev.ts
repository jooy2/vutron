// Warning: This file is only used in the development environment
// and is removed at build time.
// Do not edit the file unless necessary.
import { installExtension } from 'electron-extension-installer'
import { app } from 'electron'

const vue3DevTools = {
  id: 'nhdogjmejiglipccpnnnanhbledajbpd',
  version: '7.7.0'
}

try {
  app.on('ready', async () => {
    await installExtension(vue3DevTools, {
      loadExtensionOptions: {
        allowFileAccess: true
      }
    })
  })
} catch {
  // Do nothing
}
