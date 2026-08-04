# 托盘图标

**Vutron** 会为主窗口创建一个托盘图标。它通过 `src/main/utils/Constants.ts` 中的 `DEFAULT_WINDOW_OPTIONS.tray` 进行配置，未在此处指定的值将回退到同一文件中的 `DEFAULT_TRAY_OPTIONS`。

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

## 选项

| 选项 | 说明 |
| --- | --- |
| `enabled` | 是否创建托盘图标。设置为 `false` 可从应用中移除托盘。 |
| `menu` | 为 `true` 时在托盘图标上显示上下文菜单（Show / Hide / Exit）。为 `false` 时点击图标可切换窗口的显示状态。 |
| `trayWindow` | 为 `true` 时将主窗口变为附着在托盘图标上的无边框浮动窗口。需要 `enabled: true`，并会自动将 `menu` 置为 `false`。 |
| `tooltip` | 鼠标悬停在托盘图标上时显示的文本。 |
| `margin` | 将托盘窗口对齐到图标时应用的 `{ x, y }` 偏移量。 |
| `showAtStartup` | 应用启动时是否显示托盘窗口。仅在 `trayWindow` 为 `true` 时生效。 |

`menu` 和 `trayWindow` 不能同时使用。启用 `trayWindow` 时，`menu` 会被自动关闭。

托盘窗口在失去焦点时会自动隐藏，但在开发者工具打开期间不会隐藏。托盘图标会随其所属窗口一同被销毁。

## 移除托盘

在 `Constants.ts` 中将 `enabled` 设为 `false`。若要彻底移除该功能，还可删除 `src/main/tray.ts` 以及 `src/main/MainRunner.ts` 中的相关导入。
