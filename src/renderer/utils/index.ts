export function getCurrentLocale(): string {
  return navigator?.language?.split('-')[0] || 'en'
}

export async function openExternal(url: string): Promise<void> {
  await window.mainApi.send('msgOpenExternalLink', url)
}

export async function openFile(type: string): Promise<any> {
  return window.mainApi.invoke('msgOpenFile', type)
}
