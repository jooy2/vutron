# 메인과 렌더러 프로세스

**Vutron** 애플리케이션은 메인(Main) 프로세스와 렌더러(Renderer) 프로세스로 코드가 나뉩니다.

**Main**은 `src/main`의 코드로 주로 Electron이 처리하는 프로세스 코드입니다. **렌더러**는 `src/renderer`의 코드로 주로 Vue와 같은 프론트엔드 렌더링 프로세스를 위한 코드입니다.

일반적으로 **Node.js** 스크립트는 렌더러 프로세스에서 실행할 수 없습니다. 예를 들어 Node.js에서 사용하는 API를 포함하는 모듈이나 `path` 또는 `net`, `os` 또는 `crypto`와 같은 **Node.js**의 네이티브 모듈이 있습니다.

사전 로드 스크립트는 렌더러가 로드되기 전에 실행됩니다. 이는 보안상의 이유로 렌더러 영역에서 Node.js 스크립트의 실행을 분리하고 격리하기 위해 메인 프로세스에 대한 브릿지를 생성합니다.

안전한 스크립트 실행을 위해 메인 프로세스에서 노드 스크립트를 실행하고 렌더러는 메시징을 통해 실행 결과를 수신하는 것이 좋습니다. 이는 **IPC 통신**을 통해 구현할 수 있습니다.

이에 대한 자세한 내용은 다음 문서를 참조하세요: https://www.electronjs.org/docs/latest/tutorial/ipc

## 프로세스 간 공통 코드

IPC 채널 이름, 주고받는 데이터의 타입, 검증 규칙, 순수 함수처럼 어느 한쪽에만 속한다고 보기 어려운 코드가 있습니다. 이러한 코드는 `src/common`에 두며, 메인과 사전 로드, 렌더러 빌드 모두 `@` 별칭으로 동일하게 가져옵니다.

```typescript
// src/common/ipc.ts
export const MAIN_INVOKE_CHANNELS = {
  requestGetVersion: 'msgRequestGetVersion'
} as const
```

```typescript
// src/main, src/preload, src/renderer에서 모두 동일하게 사용
import { MAIN_INVOKE_CHANNELS } from '@/common/ipc'
```

템플릿에는 두 개의 파일이 포함되어 있습니다. `common/ipc.ts`에는 세 프로세스가 함께 사용하는 채널 이름과 그 채널로 오가는 데이터의 타입이 있고, `common/locales.ts`에는 언어 목록과 언어 태그를 찾는 함수가 있습니다.

직접 파일을 추가할 때는 다음 두 가지를 유의해야 합니다.

- **모든 프로세스에서 실행할 수 있는 코드만 둡니다.** 렌더러에는 Node.js와 Electron이 없고, 메인 프로세스에는 DOM과 Vue가 없습니다. 따라서 `src/common`에서는 Node.js 내장 모듈이나 `electron`, 렌더러 프레임워크를 가져올 수 없고 `window`, `navigator`, `process`도 사용할 수 없습니다. 타입만 가져오는 경우(`import type { OpenDialogReturnValue } from 'electron'`)는 빌드 시 제거되므로 사용할 수 있습니다. 나머지는 ESLint가 오류로 처리하기 때문에, 실행 중이 아니라 코드를 작성하는 시점에 바로 확인할 수 있습니다.
- **프로세스마다 사본이 따로 생깁니다.** 세 개의 번들은 각각 빌드되므로, `src/common`에서 내보낸 변수는 하나의 값을 공유하지 않습니다. 렌더러에서 값을 바꾸어도 메인 프로세스의 사본은 그대로입니다. `src/common`에는 상수와 타입, 순수 함수만 두고 상태는 IPC로 주고받으세요.

### 렌더러에서 Node.js를 실행하는 방법은 무엇인가요?

보안 문제를 건너뛰고 렌더러에서 Node.js 스크립트를 사용하려면 `vite.config.ts` 파일에서 `nodeIntegration`을 `true`로 설정해야 합니다.

```javascript
rendererPlugin({
  nodeIntegration: true
})
```

이에 대한 자세한 내용은 다음 문서를 참조하세요: https://github.com/electron-vite/vite-plugin-electron-renderer
