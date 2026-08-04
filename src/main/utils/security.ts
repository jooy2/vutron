/*
 * Guards for anything the renderer can ask the main process to open.
 * The renderer is untrusted by design, so URLs coming from it are validated
 * here instead of being handed straight to the OS.
 * */
const ALLOWED_EXTERNAL_PROTOCOLS = ['http:', 'https:']

export const isAllowedExternalUrl = (url: string): boolean => {
  try {
    return ALLOWED_EXTERNAL_PROTOCOLS.includes(new URL(url).protocol)
  } catch {
    // Not a parsable URL at all
    return false
  }
}
