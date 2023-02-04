import { contextBridge, ipcRenderer } from 'electron'

// Whitelist of valid channels used for IPC communication (Send message from Renderer to Main)
const mainAvailChannels = ['msgRequestGetVersion', 'msgOpenExternalLink']
const rendererAvailChannels = ['msgReceivedVersion']

contextBridge.exposeInMainWorld('mainApi', {
  send: (channel, data) => {
    if (mainAvailChannels.includes(channel)) {
      ipcRenderer.send(channel, data)
    }
  },
  receive: (channel, cbFunc) => {
    if (rendererAvailChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => cbFunc(...args))
    }
  }
})
