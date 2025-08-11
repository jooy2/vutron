---
order: 1
---

# 프로젝트 구조

```
/
├─ .github - GitHub 파일들 (Vutron 프로젝트 기여에만 사용)
│  └─ ISSUE_TEMPLATE/
│  └─ resources/ - README.md 등에 사용되는 GitHub 리소스
│  └─ workflows/ - GitHub 워크플로우 정의
│  └─ dependabot.yml
│  └─ FUNDING.yml
├─ .vscode - Visual Studio Code IDE에서 사용하는 일반적인 프로젝트 구성 파일
├─ buildAssets/ - Electron 빌드에 사용되는 패키지 리소스(아이콘, 로고 등) 파일
│  └─ builder/
│  │  │  └─ config.ts - `electron-builder` 동적 구성 파일
│  └─ icons/
├─ dist/ - 패키지 빌드에 사용되는 출력 디렉토리
├─ docs/ - 프로젝트 문서(선택적으로 활성화)
│  └─ .vitepress/
│  │  │  └─ config.mts - 문서 호스팅에 사용되는 VitePress 구성 파일
│  └─ public/ - VitePress 문서 페이지의 루트 리소스 디렉토리
├─ node_modules/
├─ src/
│  ├─ main/ - 메인(Electron) 프로세스 소스 코드
│  │  ├─ utils/ - 메인 프로세스 유틸리티
│  │  │  └─ Constants.ts - 메인 글로벌 정의
│  │  │  └─ Menus.ts - 메인 글로벌 메뉴 정의
│  │  └─ index.ts - 메인 프로세스 진입점
│  │  └─ IPCs.ts - 메인 프로세스 IPC 핸들러 정의
│  │  └─ MainRunner.ts - 메인 프로세스 메인 윈도우 프로세스
│  ├─ preload/ - 프리로드 (Electron-Vue 커뮤니케이션 브릿지) 프로세스
│  │  └─ index.ts
│  ├─ public/ - Main + Renderer 정적 리소스
│  │  └─ images/
│  ├─ renderer/ - 렌더러 (Vue) 프로세스 소스 코드
│  │  ├─ components/ - Vue 컴포넌트 콜렉션
│  │  │  └─ layout/ - 레이아웃 컴포넌트
│  │  ├─ locales/ - Vue i18n 언어 리소스 파일
│  │  ├─ plugins/ - Vue 플러그인 정의
│  │  ├─ router/ - Vue 라우팅 정의
│  │  ├─ screens/ - Vue 화면 컴포넌트
│  │  │  └─ ErrorScreen.vue - 렌더링 프로세스 및 라우팅 오류 발생 시 표시되는 화면
│  │  │  └─ MainScreen.vue
│  │  │  └─ SecondScreen.vue - 샘플 화면
│  │  ├─ store/ - Pinia 스토어 (글로벌 상태 관리) 정의
│  │  ├─ utils/ - 렌더러 프로세스 유틸리티
│  │  ├─ App.vue - Vue 앱 루트 컴포넌트
│  │  ├─ index.html - Electron 렌더러 프로세스에 의해 로드된 루트 정적 인덱스
│  └─ └─ main.ts - 렌더러 프로세스 엔트리 포인트
├─ tests/ - 애플리케이션 테스트 구성
│  ├─ results/ - PlayWright 테스트 결과 파일 및 스크린샷 저장 위치
│  ├─ specs/ - PlayWright 테스트 사양 파일
│  ├─ fixtures.ts - 공통 실행 API 테스트
│  └─ testUtil.ts - 테스트 유틸리티
├─ .editorconfig - IDE용 에디터 권장 구성 파일
├─ .eslintignore - ESLint에서 무시할 파일 목록
├─ .gitignore - Git에 업로드하지 않을 파일 목록
├─ .prettierignore - Prettier 파일 서식을 비활성화할 파일 목록
├─ .prettierrc - Prettier 규칙 설정
├─ CODE_OF_CONDUCT.md - GitHub에서만 사용되는 파일
├─ eslint.config.ts - ESLint 규칙 구성
├─ LICENSE - 프로젝트 라이선스 파일
├─ package.json - Node.js 패키지 구성
├─ package-lock.json
├─ playwright.config.ts - Playwright 테스트 규칙 구성
├─ pnpm-lock.yaml - PNPM 관련 파일
├─ pnpm-workspace.yaml - PNPM 관련 파일
├─ tsconfig.json - TypeScript 설정
├─ tsconfig.node.json - TypeScript 설정
├─ vite.config.mts - Vite 컴파일러 빌드 설정
└─ README.md - GitHub에서만 사용되는 파일
```
