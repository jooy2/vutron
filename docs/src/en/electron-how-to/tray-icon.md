# Tray Icon

**Vutron** creates a tray icon for the main window. It is configured through `DEFAULT_WINDOW_OPTIONS.tray` in `src/main/utils/Constants.ts`, and any value left out there falls back to `DEFAULT_TRAY_OPTIONS` in the same file.

```typescript
static DEFAULT_WINDOW_OPTIONS: WindowOptions = {
  width: Constants.IS_DEV_ENV ? 1500 : 1200,
  height: 650,
  tray: {
    enabled: true,
    menu: false,
    trayWindow: false
  }
}
```

## Options

| Option | Description |
| --- | --- |
| `enabled` | Whether to create a tray icon at all. Set it to `false` to remove the tray from your app. |
| `menu` | `true` shows a context menu (Show / Hide / Exit) on the tray icon. `false` toggles window visibility when the icon is clicked. |
| `trayWindow` | `true` turns the main window into a frameless floating window anchored to the tray icon. Requires `enabled: true`, and forces `menu` to `false`. |
| `tooltip` | Text shown when hovering over the tray icon. |
| `margin` | `{ x, y }` offset applied when aligning a tray window to the icon. |
| `showAtStartup` | Whether a tray window is shown when the app starts. Only applies when `trayWindow` is `true`. |

`menu` and `trayWindow` cannot be used together. When `trayWindow` is enabled, `menu` is turned off automatically.

A tray window hides itself when it loses focus, except while devtools are open. The tray icon is destroyed together with the window it belongs to.

## Removing the tray

Set `enabled` to `false` in `Constants.ts`. To drop the feature entirely, also delete `src/main/tray.ts` and its imports in `src/main/MainRunner.ts`.
