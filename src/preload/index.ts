import { contextBridge, ipcRenderer } from 'electron'

// Whitelist of valid channels used for IPC communication (Send message from Renderer to Main)
const mainAvailChannels = ['msgRequestGetVersion', 'msgOpenExternalLink']
const rendererAvailChannels = ['msgReceivedVersion']

contextBridge.exposeInMainWorld('mainApi', {
  send: (channel, ...data) => {
    if (mainAvailChannels.includes(channel)) {
      ipcRenderer.send.apply(null, [channel, ...data])
    } else {
      throw new Error(`Send failed: Unknown ipc channel name: ${channel}`)
    }
  },
  receive: (channel, cbFunc) => {
    if (rendererAvailChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => cbFunc(event, ...args))
    } else {
      throw new Error(`Receive failed: Unknown ipc channel name: ${channel}`)
    }
  },
  invoke: async (channel, ...data) => {
    if (mainAvailChannels.includes(channel)) {
      const result = await ipcRenderer.invoke.apply(null, [channel, ...data])
      return result
    }
    throw new Error(`Invoke failed: Unknown ipc channel name: ${channel}`)
  }
})
