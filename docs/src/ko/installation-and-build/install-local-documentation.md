---
order: 5
---

# 로컬 문서 관리

`Vutron`의 문서는 `VitePress` 뷰어를 통해 로컬 환경에서 볼 수 있습니다.

이 함수는 전체 프로젝트가 복제된 경우에만 작동합니다. `npm init vutron`으로 프로젝트를 생성한 경우 `docs` 폴더는 포함되지 않습니다.

## Installation

아래 지침의 모든 작업은 `docs` 폴더에서 수행해야 합니다.

```shell
$ cd docs
```

다음 명령을 사용하여 관련 패키지를 설치합니다:

```shell
# via npm
$ npm i

# via yarn (https://yarnpkg.com)
$ yarn install

# via pnpm (https://pnpm.io)
$ pnpm i
```

아래 명령을 통해 문서가 호스팅되는 로컬 서버를 실행할 수 있습니다.

```shell
$ npm run dev
```
