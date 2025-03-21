export function debounce(func, timeout = 200) {
  let timer
  return (function (...args) {
    if (!timer) {
      func.apply(this, args)
    }
    clearTimeout(timer)
    timer = setTimeout(() => {
      timer = undefined
    }, timeout)
  })()
}
