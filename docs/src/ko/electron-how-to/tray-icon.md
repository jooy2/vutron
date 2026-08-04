# 트레이 아이콘

**Vutron**은 메인 윈도우에 대한 트레이 아이콘을 생성합니다. `src/main/utils/Constants.ts`의 `DEFAULT_WINDOW_OPTIONS.tray`에서 설정하며, 여기에 지정하지 않은 값은 같은 파일의 `DEFAULT_TRAY_OPTIONS`를 따릅니다.

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

## 옵션

| 옵션 | 설명 |
| --- | --- |
| `enabled` | 트레이 아이콘 생성 여부입니다. `false`로 설정하면 앱에서 트레이가 사라집니다. |
| `menu` | `true`이면 트레이 아이콘에 컨텍스트 메뉴(Show / Hide / Exit)를 표시합니다. `false`이면 아이콘 클릭 시 창 표시 여부를 토글합니다. |
| `trayWindow` | `true`이면 메인 윈도우를 트레이 아이콘에 붙는 프레임 없는 플로팅 창으로 만듭니다. `enabled: true`가 필요하며, `menu`는 자동으로 `false`가 됩니다. |
| `tooltip` | 트레이 아이콘에 마우스를 올렸을 때 표시되는 텍스트입니다. |
| `margin` | 트레이 창을 아이콘에 정렬할 때 적용되는 `{ x, y }` 오프셋입니다. |
| `showAtStartup` | 앱 시작 시 트레이 창을 표시할지 여부입니다. `trayWindow`가 `true`일 때만 적용됩니다. |

`menu`와 `trayWindow`는 함께 사용할 수 없습니다. `trayWindow`가 활성화되면 `menu`는 자동으로 꺼집니다.

트레이 창은 포커스를 잃으면 스스로 숨겨집니다. 단, 개발자 도구가 열려 있는 동안에는 숨겨지지 않습니다. 트레이 아이콘은 자신이 속한 창과 함께 제거됩니다.

## 트레이 제거하기

`Constants.ts`에서 `enabled`를 `false`로 설정하세요. 기능을 완전히 들어내려면 `src/main/tray.ts`와 `src/main/MainRunner.ts`의 관련 import도 함께 삭제하면 됩니다.
