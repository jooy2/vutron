# Npm Scripts

> npm run {SCRIPT_NAME}

| Script Name    | Description                                                                                             |
|----------------|---------------------------------------------------------------------------------------------------------|
| `dev`          | Start Electron as a development environment                                                             |
| `build`        | Build a specified package for the entire operating system (Requires cross-platform build configuration) |
| `build:pre`    | Commands commonly run at build time. This script does not need to be run separately.                    |
| `build:dir`    | `electron-builder` directory build                                                                      |
| `build:mac`    | Build preconfigured packages for macOS                                                                  |
| `build:linux`  | Build preconfigured packages for Linux                                                                  |
| `build:win`    | Build preconfigured packages for Windows                                                                |
| `lint`         | ESLint code inspection. It does not modify the code.                                                    |
| `lint:fix`     | ESLint code inspection. Use auto-fix to fix your code.                                                  |
| `format`       | Prettier code inspection. It does not modify the code.                                                  |
| `format:fix`   | Prettier code inspection. Use auto-fix to fix your code.                                                |
| `docs:install` | Install VitePress and related plugins for your local documentation environment.                         |
| `docs:dev`     | Start the local document server. (For development)                                                      |
| `docs:build`   | Build a local document server. Used only for GitHub page builders.                                      |
| `docs:serve`   | Start the local document server.                                                                        |
