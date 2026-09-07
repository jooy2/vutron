# 主流程与渲染器流程

一个**Vutron**应用程序被分为代码，分为主进程和渲染器进程。

**“主”**是`src/main`的代码，主要是由Electron处理的进程代码。**“渲染器”**是`src/renderer`的代码，主要用于前端渲染过程，如Vue。

一般来说，**Node.js**脚本无法在渲染器进程中运行。例如，包含Node.js使用的API的模块，或**Node.js**的本机模块，如`path`或`net`、`os`或`crypto`。

预加载脚本在渲染器加载之前运行。它为主进程创建了一个桥梁，出于安全考虑，将Node.js脚本的执行与渲染器区域分开并隔离。

为了安全执行脚本，建议主进程执行Node脚本，渲染器通过消息传递接收执行结果。这可以通过**IPC通信**来实现。

欲了解更多信息，请参阅以下文章: https://www.electronjs.org/docs/latest/tutorial/ipc

## 进程之间的公共代码

有些代码并不专属于某一侧：IPC 通道名称、传输数据的类型、校验规则、纯函数等。这类代码放在 `src/common` 中，主进程、预加载和渲染器三个构建都通过 `@` 别名以相同方式引入。

```typescript
// src/common/ipc.ts
export const MAIN_INVOKE_CHANNELS = {
  requestGetVersion: 'msgRequestGetVersion'
} as const
```

```typescript
// 在 src/main、src/preload、src/renderer 中写法完全相同
import { MAIN_INVOKE_CHANNELS } from '@/common/ipc'
```

模板中自带两个文件：`common/ipc.ts` 保存三个进程共同约定的通道名称以及通道上传输数据的类型，`common/locales.ts` 保存语言列表和语言标签的匹配函数。

自行添加文件时需要注意两点：

- **只放所有进程都能运行的代码。** 渲染器没有 Node.js 和 Electron，主进程没有 DOM 和 Vue。因此 `src/common` 不能引入 Node.js 内置模块、`electron` 或渲染器框架，也不能使用 `window`、`navigator`、`process`。仅引入类型（`import type { OpenDialogReturnValue } from 'electron'`）会在构建时被擦除，因此是允许的。其余情况由 ESLint 报错，问题在编写代码时即可发现，而不是等到运行时。
- **每个进程各有一份副本。** 三个产物分别构建，所以从 `src/common` 导出的变量并不是共享的同一个值：在渲染器中修改它，主进程的副本不会随之改变。请让 `src/common` 只保留常量、类型和纯函数，状态通过 IPC 传递。

### 如何在渲染器上运行Node.js？

不建议这样做。渲染器以 `nodeIntegration: false`、`contextIsolation: true` 和 `sandbox: true` 运行，这三项在 `src/main/utils/Constants.ts` 的 `DEFAULT_WEB_PREFERENCES` 中设置，也是 Electron 推荐的默认值。请把需要 Node.js 的工作放在主进程，通过 IPC 传回结果。`src/main/IPCs.ts` 中的 `msgOpenFile` 就是这样一个例子：文件对话框在主进程中打开，只有结果会跨过桥接。

如果确实需要在渲染器中使用 Node.js，请安装 `vite-plugin-electron-renderer` 让 Vite 能够打包 Node.js 内置模块，然后在 `DEFAULT_WEB_PREFERENCES` 中关闭 `sandbox` 和 `contextIsolation` 并开启 `nodeIntegration`。这样一来，渲染器加载的所有代码都能访问用户的文件系统，因此只要应用会显示任何非自己编写的内容，就不要选择这条路。

更多信息请参阅以下文档: https://www.electronjs.org/docs/latest/tutorial/security
