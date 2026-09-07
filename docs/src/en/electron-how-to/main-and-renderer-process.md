# Main vs Renderer Process

A **Vutron** application is divided into code into a Main process and a Renderer process.

**"Main"** is the code of `src/main` and is mainly the process code handled by Electron. **"Renderer"** is the code of `src/renderer`, mainly for front-end rendering process like Vue.

In general, **Node.js** scripts cannot be run in the renderer process. Examples include modules that contain APIs used by Node.js, or native modules of **Node.js** such as `path` or `net`, `os` or `crypto`.

Preload scripts are run before the renderer is loaded. It creates a bridge to the main process to keep the execution of Node.js scripts in the renderer area separate and isolated for security reasons.

For secure script execution, it is recommended that the main process executes the Node scripts, and the renderer receives the execution results via messaging. This can be implemented via **IPC communication**.

For more information on this, see the following articles: https://www.electronjs.org/docs/latest/tutorial/ipc

## Sharing code between the processes

Some code belongs to neither side: an IPC channel name, a payload type, a validation rule, a pure helper. Anything of that kind goes in `src/common`, which the main, the preload and the renderer build all import through the `@` alias.

```typescript
// src/common/ipc.ts
export const MAIN_INVOKE_CHANNELS = {
  requestGetVersion: 'msgRequestGetVersion'
} as const
```

```typescript
// Same import in src/main, src/preload and src/renderer
import { MAIN_INVOKE_CHANNELS } from '@/common/ipc'
```

The template ships two of them: `common/ipc.ts` holds the channel names the three processes agree on, along with the types of what travels over them, and `common/locales.ts` holds the language list and the tag matching that goes with it.

Two things to keep in mind when adding your own:

- **Only what runs everywhere.** The renderer has no Node.js and no Electron, the main process has no DOM and no Vue. So `src/common` may not import a Node.js builtin, `electron` or a renderer framework, and may not touch `window`, `navigator` or `process`. Type-only imports (`import type { OpenDialogReturnValue } from 'electron'`) are erased at build time and are fine. ESLint fails the build on the rest, so a mistake shows up while you write it rather than at runtime.
- **Each process gets its own copy.** The three bundles are built separately, so a variable exported from `src/common` is not one shared value: changing it in the renderer leaves the main process copy untouched. Keep `src/common` to constants, types and pure functions, and pass state over IPC.

### How to run Node.js on a renderer?

This is not recommended. The renderer runs with `nodeIntegration: false`, `contextIsolation: true` and `sandbox: true`, set in `DEFAULT_WEB_PREFERENCES` in `src/main/utils/Constants.ts`, which are the defaults Electron recommends. Keep the work that needs Node.js in the main process and pass the result over IPC. `msgOpenFile` in `src/main/IPCs.ts` is an example: the file dialog opens in the main process and only its result crosses the bridge.

If you still need Node.js in the renderer, install `vite-plugin-electron-renderer` so that Vite can bundle Node.js builtins, then turn `sandbox` and `contextIsolation` off in `DEFAULT_WEB_PREFERENCES` and `nodeIntegration` on. Every piece of code the renderer loads then reaches the user's file system, so do not take this route if the app shows any content it did not author.

For more information, see the following document: https://www.electronjs.org/docs/latest/tutorial/security
