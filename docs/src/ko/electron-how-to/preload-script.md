# 프리로드 스크립트

Electron.js의 프리로드 스크립트는 메인 프로세스와 렌더러 프로세스 간의 통신을 위해 설계된 보안 영역입니다. 일반적으로 **[IPC 통신](https://www.electronjs.org/docs/latest/tutorial/ipc)**에 사용됩니다.

자세한 내용은 다음 문서를 참고하세요: https://www.electronjs.org/docs/latest/tutorial/tutorial-preload

최신 버전의 Electron과의 호환성 및 보안을 위해 이전 버전의 `electron/remote` 모듈은 사용하지 않는 것이 좋습니다. 시스템 이벤트나 노드 스크립트를 활용하려면 렌더러가 아닌 메인 프로세스에서 사용하는 것이 좋습니다.

Vutron의 프리로드 스크립트는 `src/preload` 폴더에 있습니다. 새 IPC 통신 채널을 생성하려면 다음 변수에 채널 이름을 추가하여 통신을 허용하도록 화이트리스트에 추가합니다.

- `mainAvailChannels`: 메인에서 렌더러로 이벤트를 전송합니다. (`window.mainApi.send('channelName')`)
- `rendererAvailChannels`: 렌더러에서 메인으로 이벤트를 전송합니다. (`mainWindow.webContents.send('channelName')`)

렌더러에서 메인으로 이벤트를 전송할 때는 `ipcRenderer.send` 대신 `window.mainApi` 객체에 액세스합니다. `mainApi`는 Vutron 템플릿에서 설정한 이름이며 변경할 수 있습니다.

다음은 mainApi에서 지원되는 함수입니다:

- `send`: 메인으로 이벤트를 보냅니다.
- `on`: 메인에서 보낸 이벤트를 수신할 리스너입니다.
- `once`: 메인에서 보낸 이벤트를 수신할 리스너입니다. (하나의 호출만 처리)
- `off`: 이벤트 리스너를 제거합니다.
- `invoke`: 메인에 이벤트를 보내고 비동기적으로 데이터를 수신할 수 있는 함수입니다.

이를 변경하고 수정하려면 `src/preload/index.ts`에서 `exposeInMainWorld`를 수정해야 합니다.
