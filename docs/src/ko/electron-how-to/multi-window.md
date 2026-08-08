# 멀티 윈도우

**Vutron**은 실행 중에 메인 윈도우 위로 창을 추가로 열 수 있습니다. 이렇게 열린 창은 모두 `src/main/WindowManager.ts`의 `WindowManager`가 관리하며, 렌더러는 창을 직접 만들지 않고 IPC로 요청합니다.

기능 자체는 `src/main/utils/Constants.ts`의 `FEAT_MULTI_WINDOW`로 켜고 끕니다. `false`인 동안에는 모든 열기 요청이 거부되고 로그로 남기 때문에, 상수 하나만 바꿔도 앱에서 멀티 윈도우를 들어낼 수 있습니다.

```typescript
static FEAT_MULTI_WINDOW = true
```

## 옵션

이렇게 열리는 창의 크기와 위치는 같은 파일의 `DEFAULT_CHILD_WINDOW_OPTIONS`에서 설정합니다.

```typescript
static DEFAULT_CHILD_WINDOW_OPTIONS: ChildWindowOptions = {
  width: 800,
  height: 600,
  maxWindows: 5,
  cascadeOffset: { x: 32, y: 32 },
  allowDuplicatePath: true
}
```

| 옵션 | 설명 |
| --- | --- |
| `width` / `height` | 새로 열리는 창의 콘텐츠 크기입니다. |
| `maxWindows` | 메인 윈도우를 제외하고 동시에 열어둘 수 있는 창의 개수입니다. 이 수를 넘는 요청은 거부되고 `null`을 반환합니다. |
| `cascadeOffset` | 창을 연 창을 기준으로 새 창에 적용되는 `{ x, y }` 오프셋입니다. 창이 정확히 겹쳐 쌓이지 않도록 어긋나게 배치하며, 결과 위치는 부모 창이 있는 디스플레이의 작업 영역 안으로 보정됩니다. |
| `allowDuplicatePath` | `true`이면 요청할 때마다 새 창을 엽니다. `false`이면 같은 경로를 이미 표시 중인 창이 있을 때 새로 열지 않고 그 창을 앞으로 가져옵니다. |

## 렌더러에서 창 열기

`src/renderer/utils`가 IPC 호출을 감싸고 있으므로, 화면에서 `window.mainApi`를 직접 다룰 필요가 없습니다.

```typescript
import {
  closeCurrentWindow,
  getWindowInfo,
  onWindowsUpdated,
  openWindow
} from '@/renderer/utils'

// 라우터 경로를 별도의 창으로 엽니다. 새 창의 id를 반환하며,
// 메인 프로세스가 요청을 거부한 경우에는 `null`을 반환합니다.
const windowId = await openWindow('/second')

// 호출한 창을 닫습니다. 메인 윈도우는 이 방식으로 닫히지 않으므로
// 메인 윈도우에서 호출하면 `false`를 반환합니다.
await closeCurrentWindow()

// 현재 창의 상태입니다. 창이 막 로드된 직후에 사용하기 좋습니다.
const { isChildWindow, childWindowIds } = await getWindowInfo()

// 창이 열리거나 닫힐 때마다 모든 창으로 전달됩니다.
// 구독 해제 함수를 반환합니다.
const unsubscribe = onWindowsUpdated((childWindowIds) => {
  console.log(childWindowIds.length)
})
```

템플릿에 포함된 예제는 `MainScreen.vue`와 `SecondScreen.vue`에 있습니다. 메인 화면에는 열려 있는 창의 개수를 표시하는 배지가 붙은 창 열기 버튼이 있고, 두 번째 화면은 별도의 창에서 실행 중일 때 닫기 버튼을 보여줍니다.

창은 라우터 경로로 지정하며, 모든 창은 같은 Vue 앱을 서로 다른 라우트로 로드합니다. 따라서 `src/renderer/router`에 등록된 화면이라면 그대로 별도의 창으로 열 수 있고, 메인 윈도우와 함께 쓰는 화면이라면 지금 어떤 창에서 실행 중인지 짐작하지 말고 `getWindowInfo`로 확인하는 것이 좋습니다.

## IPC 채널

| 채널 | 종류 | 설명 |
| --- | --- | --- |
| `msgOpenWindow` | invoke | 지정한 경로를 새 창으로 엽니다. 창 id를 반환하며, 거부된 경우 `null`을 반환합니다. |
| `msgCloseWindow` | invoke | 요청을 보낸 창을 닫습니다. 닫혔는지 여부를 반환합니다. |
| `msgRequestWindowInfo` | invoke | 호출한 창에 대한 `{ isChildWindow, childWindowIds }`를 반환합니다. |
| `msgWindowsUpdated` | on | 창이 열리거나 닫힐 때마다 현재 창 id 목록을 모든 창으로 전달합니다. |

## 참고

창을 열 경로는 렌더러에서 넘어오므로, 사용하기 전에 `src/main/utils/security.ts`에서 검사하며 `/second`와 같은 단순한 해시 라우트만 허용합니다. 새 창에는 메인 윈도우와 동일한 `webPreferences`와 네비게이션 가드가 적용되므로, 컨텍스트 격리와 외부 링크 처리가 모든 창에 그대로 유지됩니다.

`msgCloseWindow`는 `WindowManager`가 관리하는 창만 닫습니다. 메인 윈도우는 이 요청을 무시하므로, 두 곳에서 함께 쓰는 컴포넌트가 실수로 앱을 종료시키는 일이 없습니다. 반대로 메인 윈도우를 닫으면 나머지 창도 함께 닫히므로, 돌아갈 수 없는 창만 남은 채로 앱이 계속 살아있지 않습니다.
