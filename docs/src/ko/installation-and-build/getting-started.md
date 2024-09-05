---
order: 1
---

# 시작하기

## 프로젝트 복제하기

### 방법 1: `npm init` (권장)

npm 명령만으로 리포지토리를 쉽게 복제할 수 있습니다.

```shell
$ npm init vutron
```

위의 방법은 프로젝트에 불필요한 문서와 '.github' 관련 파일을 만들지 않습니다.

### 방법 2: 템플릿 사용

**[이 템플릿 사용](https://github.com/jooy2/vutron/generate)** 버튼을 클릭하면 나만의 프로젝트를 즉시 만들 수 있습니다.

이 방법을 사용하면 GitHub에 리포지토리가 즉시 생성되지만 프로젝트를 로컬에 복제해야 사용할 수 있습니다.

### 방법 3: 리포지토리 복제

아래 명령어를 사용하여 이 리포지토리를 복제합니다. 이 방법은 Vutron 리포지토리에 직접 기여하는 경우에 적합합니다.

```shell
$ git clone https://github.com/jooy2/vutron <PROJECT_NAME>
```

## 설치하기

프로젝트를 복제한 후 터미널에서 다음 명령을 실행합니다:

```shell
# via npm
$ npm i

# via yarn (https://yarnpkg.com)
$ yarn install

# via pnpm (https://pnpm.io)
$ pnpm i
```

## 개발 환경에서 실행

개발 환경의 애플리케이션은 **[Vite](https://vitejs.dev)** 환경에서 실행됩니다.

```shell
$ npm run dev
```

명령줄 명령을 실행한 후에도 애플리케이션이 나타나지 않는다면 다른 앱에서 기본 포트를 사용하고 있는지 확인해야 할 수 있습니다.

Vite는 기본적으로 포트 `5173`을 사용합니다.
