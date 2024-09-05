---
order: 4
---

# 자동화 테스트

**Vutron**에는 자동화된 테스트가 포함되어 있습니다. 테스트 프레임워크는 Microsoft의 **[Playwright](https://playwright.dev)** 모듈을 사용합니다.

**Playwright**는 웹 애플리케이션 테스트에 최적화되어 있으며 **Electron** 프레임워크를 완벽하게 지원합니다. 설치가 간단하고, 별도의 설정 없이 바로 테스트를 시작할 수 있으며, 크로스 플랫폼을 지원합니다. 여기에서 **Playwright**에 대해 자세히 알아보세요: https://github.com/microsoft/playwright

이 템플릿에는 템플릿 메인 화면에 대한 매우 간단한 실행 및 동작 테스트만 구현되어 있습니다. 고급 테스트는 애플리케이션의 범위에 따라 달라집니다.

현재 테스트 사양 파일은 `tests` 디렉터리에, 테스트 결과 파일은 `tests/results`에 있습니다. (기본 제공 테스트 사양 파일은 별도의 결과 파일을 생성하지 않습니다.)

Playwright 설정은 프로젝트 루트에 있는 `playwright.config.ts`이며, 이에 대한 자세한 내용은 다음 문서를 참조하세요: https://playwright.dev/docs/test-configuration

모든 구성이 완료되면 다음 명령어로 테스트를 실행할 수 있습니다.

```shell
$ npm run test
```

테스트를 실행하기 전에 빌드 디렉터리(`dist`)를 비우고 테스트용 패키지를 컴파일합니다.
