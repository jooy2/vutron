import { contextBridge, ipcRenderer, shell } from 'electron'

// Whitelist of valid channels used for IPC communication (Send message from Renderer to Main)
const mainAvailChannels = ['msgRequestGetVersion']
const rendererAvailChannels = ['msgReceivedVersion']

contextBridge.exposeInMainWorld('mainApi', {
  openExternal: async (url) => await shell.openExternal(url),
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
