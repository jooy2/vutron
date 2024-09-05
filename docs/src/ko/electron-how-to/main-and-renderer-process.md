# 메인과 렌더러 프로세스

**Vutron** 애플리케이션은 메인(Main) 프로세스와 렌더러(Renderer) 프로세스로 코드가 나뉩니다.

**Main**은 `src/main`의 코드로 주로 Electron이 처리하는 프로세스 코드입니다. **렌더러**는 `src/renderer`의 코드로 주로 Vue와 같은 프론트엔드 렌더링 프로세스를 위한 코드입니다.

일반적으로 **Node.js** 스크립트는 렌더러 프로세스에서 실행할 수 없습니다. 예를 들어 Node.js에서 사용하는 API를 포함하는 모듈이나 `path` 또는 `net`, `os` 또는 `crypto`와 같은 **Node.js**의 네이티브 모듈이 있습니다.

사전 로드 스크립트는 렌더러가 로드되기 전에 실행됩니다. 이는 보안상의 이유로 렌더러 영역에서 Node.js 스크립트의 실행을 분리하고 격리하기 위해 메인 프로세스에 대한 브릿지를 생성합니다.

안전한 스크립트 실행을 위해 메인 프로세스에서 노드 스크립트를 실행하고 렌더러는 메시징을 통해 실행 결과를 수신하는 것이 좋습니다. 이는 **IPC 통신**을 통해 구현할 수 있습니다.

이에 대한 자세한 내용은 다음 문서를 참조하세요: https://www.electronjs.org/docs/latest/tutorial/ipc

### 렌더러에서 Node.js를 실행하는 방법은 무엇인가요?

보안 문제를 건너뛰고 렌더러에서 Node.js 스크립트를 사용하려면 `vite.config.ts` 파일에서 `nodeIntegration`을 `true`로 설정해야 합니다.

```javascript
rendererPlugin({
  nodeIntegration: true
})
```

이에 대한 자세한 내용은 다음 문서를 참조하세요: https://github.com/electron-vite/vite-plugin-electron-renderer
