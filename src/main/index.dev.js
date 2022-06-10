import { app } from 'electron'
import './index'
import * as electronDevtoolsInstaller from 'electron-devtools-installer'

app.on('ready', async () => {
  await electronDevtoolsInstaller.default(electronDevtoolsInstaller.VUEJS_DEVTOOLS)
    .catch(e => {
      console.log(`Failed to install Vue Devtools \n(${e})`)
    })
})
