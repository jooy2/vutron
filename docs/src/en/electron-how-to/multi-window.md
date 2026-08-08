# Multi Window

**Vutron** can open extra windows on top of the main window at runtime. Every one of them is owned by `WindowManager` in `src/main/WindowManager.ts`, and the renderer asks for them over IPC instead of creating them itself.

The feature is switched by `FEAT_MULTI_WINDOW` in `src/main/utils/Constants.ts`. While it is `false`, every open request is refused and logged, so you can drop multi window support from your app with a single constant.

```typescript
static FEAT_MULTI_WINDOW = true
```

## Options

Windows opened this way are sized and placed with `DEFAULT_CHILD_WINDOW_OPTIONS` in the same file.

```typescript
static DEFAULT_CHILD_WINDOW_OPTIONS: ChildWindowOptions = {
  width: 800,
  height: 600,
  maxWindows: 5,
  cascadeOffset: { x: 32, y: 32 },
  allowDuplicatePath: true
}
```

| Option | Description |
| --- | --- |
| `width` / `height` | Content size of a new window. |
| `maxWindows` | How many windows may be open at the same time, the main window aside. Requests past the limit are refused and return `null`. |
| `cascadeOffset` | `{ x, y }` offset applied to each new window relative to the window that opened it, so windows do not stack exactly on top of each other. The result is clamped to the work area of the display the parent window is on. |
| `allowDuplicatePath` | `true` opens a new window every time. `false` focuses the window already showing that route instead of opening a second one for it. |

## Opening a window from the renderer

`src/renderer/utils` wraps the IPC calls, so a screen never touches `window.mainApi` directly.

```typescript
import {
  closeCurrentWindow,
  getWindowInfo,
  onWindowsUpdated,
  openWindow
} from '@/renderer/utils'

// Opens a router path in its own window. Resolves with the new window id,
// or `null` when the main process refused the request.
const windowId = await openWindow('/second')

// Closes the window the call is made from. Resolves with `false` in the main
// window, which is never closed this way.
await closeCurrentWindow()

// State of the current window, useful right after it loads
const { isChildWindow, childWindowIds } = await getWindowInfo()

// Pushed to every window whenever one is opened or closed.
// Returns the unsubscribe function.
const unsubscribe = onWindowsUpdated((childWindowIds) => {
  console.log(childWindowIds.length)
})
```

The example that ships with the template lives in `MainScreen.vue` and `SecondScreen.vue`. The main screen has a window button with a badge counting the open windows, and the second screen shows a close button when it is running in one of them.

Windows are addressed by router path, and every window loads the same Vue app at a different route. So a screen only needs to be reachable in `src/renderer/router` to be openable in its own window, and any screen shared with the main window should ask `getWindowInfo` what it is running in rather than assume.

## IPC channels

| Channel | Type | Description |
| --- | --- | --- |
| `msgOpenWindow` | invoke | Opens the given route in a new window. Returns the window id, or `null` when refused. |
| `msgCloseWindow` | invoke | Closes the window the request came from. Returns whether it was closed. |
| `msgRequestWindowInfo` | invoke | Returns `{ isChildWindow, childWindowIds }` for the calling window. |
| `msgWindowsUpdated` | on | Broadcast to every window with the current window ids whenever one opens or closes. |

## Notes

The route a window opens on comes from the renderer, so it is validated in `src/main/utils/security.ts` before use, and only plain hash routes such as `/second` are accepted. New windows get the same `webPreferences` and navigation guards as the main window, so context isolation and the external link handling apply to all of them.

`msgCloseWindow` only closes windows `WindowManager` owns. The main window ignores it, which means a component shared by both cannot shut the app down by mistake. Closing the main window closes the rest, so the app does not stay alive with windows the user cannot get back to.
