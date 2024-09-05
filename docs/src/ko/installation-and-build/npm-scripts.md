---
title: NPM Scripts
order: 3
---

# Npm 스크립트

> $ npm run %SCRIPT_NAME%

## 일반

| Script Name | Description |
| --- | --- |
| `dev` | Start Electron as a development environment |
| `dev:debug` | Start Electron as a development environment (with vite debug) |
| `dev:debug:force` | Start Electron as a development environment (with vite debug + clean vite cache) |
| `build:pre` | Commands commonly run at build time. This script does not need to be run separately. |
| `build` | Build the package for the current operating system. |
| `build:all` | Build a specified package for the entire operating system (Requires cross-platform build configuration) |
| `build:dir` | `electron-builder` directory build |
| `build:mac` | Build preconfigured packages for macOS |
| `build:linux` | Build preconfigured packages for Linux |
| `build:win` | Build preconfigured packages for Windows |
| `lint` | ESLint code inspection. It does not modify the code. |
| `lint:fix` | ESLint code inspection. Use auto-fix to fix your code. |
| `format` | Prettier code inspection. It does not modify the code. |
| `format:fix` | Prettier code inspection. Use auto-fix to fix your code. |
| `test` | Build a package for testing and run tests against the test specification file. |
| `test:linux` | Build a package for testing and run tests against the test specification file. (for linux ci only) |

## 문서용

프로젝트 문서에 기여하는 경우에만 사용됩니다. `docs` 디렉토리 위치에서 실행해야 합니다.

| Script Name | Description                                                        |
| ----------- | ------------------------------------------------------------------ |
| `dev`       | Start the local document server. (For development)                 |
| `build`     | Build a local document server. Used only for GitHub page builders. |
| `serve`     | Start the local document server.                                   |
