# 多窗口

**Vutron** 可以在运行时于主窗口之上打开额外的窗口。这些窗口全部由 `src/main/WindowManager.ts` 中的 `WindowManager` 管理，渲染进程不会自行创建窗口，而是通过 IPC 发起请求。

该功能由 `src/main/utils/Constants.ts` 中的 `FEAT_MULTI_WINDOW` 控制。当它为 `false` 时，所有打开请求都会被拒绝并记录日志，因此只需修改一个常量即可从应用中移除多窗口支持。

```typescript
static FEAT_MULTI_WINDOW = true
```

## 选项

以此方式打开的窗口，其尺寸与位置由同一文件中的 `DEFAULT_CHILD_WINDOW_OPTIONS` 决定。

```typescript
static DEFAULT_CHILD_WINDOW_OPTIONS: ChildWindowOptions = {
  width: 800,
  height: 600,
  maxWindows: 5,
  cascadeOffset: { x: 32, y: 32 },
  allowDuplicatePath: true
}
```

| 选项 | 说明 |
| --- | --- |
| `width` / `height` | 新窗口的内容尺寸。 |
| `maxWindows` | 除主窗口外，可同时打开的窗口数量上限。超出上限的请求会被拒绝并返回 `null`。 |
| `cascadeOffset` | 相对于打开它的窗口所应用的 `{ x, y }` 偏移量，使窗口不会完全重叠堆放。结果位置会被限制在父窗口所在显示器的工作区域内。 |
| `allowDuplicatePath` | 为 `true` 时每次请求都打开新窗口。为 `false` 时，若已有窗口显示该路由，则将其置于前台而不再打开第二个。 |

## 从渲染进程打开窗口

`src/renderer/utils` 已封装这些 IPC 调用，因此界面代码无需直接接触 `window.mainApi`。

```typescript
import {
  closeCurrentWindow,
  getWindowInfo,
  onWindowsUpdated,
  openWindow
} from '@/renderer/utils'

// 在独立窗口中打开一个路由路径。返回新窗口的 id，
// 若主进程拒绝了该请求则返回 `null`。
const windowId = await openWindow('/second')

// 关闭发起调用的窗口。主窗口不会通过这种方式关闭，
// 在主窗口中调用会返回 `false`。
await closeCurrentWindow()

// 当前窗口的状态，适合在窗口加载完成后立即使用
const { isChildWindow, childWindowIds } = await getWindowInfo()

// 每当有窗口打开或关闭时推送给所有窗口。
// 返回取消订阅的函数。
const unsubscribe = onWindowsUpdated((childWindowIds) => {
  console.log(childWindowIds.length)
})
```

模板自带的示例位于 `MainScreen.vue` 与 `SecondScreen.vue`。主界面上有一个窗口按钮，并带有显示已打开窗口数量的徽标；第二个界面在独立窗口中运行时会显示关闭按钮。

窗口以路由路径来标识，所有窗口加载的都是同一个 Vue 应用的不同路由。因此只要界面已在 `src/renderer/router` 中注册，就可以在独立窗口中打开；而与主窗口共用的界面应通过 `getWindowInfo` 询问自己运行在何处，而不是想当然地假设。

## IPC 通道

| 通道 | 类型 | 说明 |
| --- | --- | --- |
| `msgOpenWindow` | invoke | 在新窗口中打开指定路由。返回窗口 id，被拒绝时返回 `null`。 |
| `msgCloseWindow` | invoke | 关闭发起请求的窗口。返回是否已关闭。 |
| `msgRequestWindowInfo` | invoke | 返回调用窗口的 `{ isChildWindow, childWindowIds }`。 |
| `msgWindowsUpdated` | on | 每当窗口打开或关闭时，将当前的窗口 id 列表广播给所有窗口。 |

## 注意事项

窗口所要打开的路由来自渲染进程，因此在使用前会由 `src/main/utils/security.ts` 校验，仅接受形如 `/second` 的普通哈希路由。新窗口沿用与主窗口相同的 `webPreferences` 和导航防护，因此上下文隔离与外部链接处理对所有窗口同样生效。

`msgCloseWindow` 只会关闭由 `WindowManager` 管理的窗口。主窗口会忽略该请求，因此两处共用的组件不会误将应用关闭。反之，关闭主窗口时其余窗口也会一并关闭，避免应用只剩下用户无法返回的窗口却仍在运行。
