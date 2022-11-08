# Main vs Renderer Process

A **Vutron** application is divided into code into a Main process and a Renderer process.

**"Main"** is the code of `src/main` and is mainly the process code handled by Electron. **"Renderer"** is the code of `src/renderer`, mainly for front-end rendering process like Vue.

The script code of Main cannot be referenced in the Renderer or vice versa, and the two processes can communicate using `IPC`.

Please see the article below for more details: https://www.electronjs.org/docs/latest/tutorial/ipc
