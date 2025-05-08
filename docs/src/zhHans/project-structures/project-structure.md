---
order: 1
---

# 项目结构

```
/
├─ .github - GitHub文件（仅用于Vutron GitHub项目贡献）
│  └─ ISSUE_TEMPLATE/
│  └─ resources/ - 用于自述文件（README.md）等的GitHub资源。
│  └─ workflows/ - GitHub工作流程定义
│  └─ dependabot.yml
│  └─ FUNDING.yml
├─ .vscode - Visual Studio Code IDE使用的通用项目配置文件
├─ buildAssets/ - 用于Electron构建的资源包（图标、徽标等）文件
│  └─ builder/
│  │  │  └─ config.ts - `electron-builder`动态配置文件
│  └─ icons/
├─ dist/ - 用于生成软件包的输出目录
├─ docs/ - 项目文件（可选）
│  └─ .vitepress/
│  │  │  └─ config.mts - 用于文档托管的VitePress配置文件
│  └─ public/ - VitePress文档页面的根目录
├─ node_modules/
├─ src/
│  ├─ main/ - 主（电子）处理源代码
│  │  ├─ utils/ - 主要工艺设备
│  │  │  └─ Constants.ts - 全球主要定义
│  │  │  └─ Menus.ts - 全球主菜单定义
│  │  └─ index.ts - 主要流程入口
│  │  └─ IPCs.ts - 主要流程 ipc 处理程序定义
│  │  └─ MainRunner.ts - 主流程主窗口处理
│  ├─ preload/ - 预加载（Electron-Vue通信桥）过程源代码
│  │  └─ index.ts
│  ├─ public/ - Main + Renderer静态资源
│  │  └─ images/
│  ├─ renderer/ - 渲染器（Vue）处理源代码
│  │  ├─ components/ - Vue组件集合
│  │  │  └─ layout/ - 布局组件
│  │  ├─ locales/ - Vue i18n 语言资源文件
│  │  ├─ plugins/ - Vue插件定义
│  │  ├─ router/ - 视图路由定义
│  │  ├─ screens/ - 屏幕组件
│  │  │  └─ ErrorScreen.vue - 当渲染程序出现错误时，屏幕上会显示错误信息
│  │  │  └─ MainScreen.vue
│  │  │  └─ SecondScreen.vue - 屏幕截图
│  │  ├─ store/ - Pinia商店（全球状态管理）定义
│  │  ├─ utils/ - 渲染器进程实用程序
│  │  ├─ App.vue - Vue应用程序的根组件
│  │  ├─ index.html - 由电子渲染器进程加载的根静态索引
│  └─ └─ main.ts - 渲染器进程入口点
├─ tests/ - 应用程序测试配置
│  ├─ results/ - PlayWright测试结果文件和屏幕截图的保存位置
│  ├─ specs/ - PlayWright测试规格文件
│  ├─ fixtures.ts - 测试公共执行API
│  └─ testUtil.ts - 测试实用程序
├─ .editorconfig - 编辑器推荐的IDE配置文件
├─ .eslintignore - ESLint忽略的文件列表
├─ .gitignore - 不上传到Git的文件列表
├─ .prettierignore - 要禁用的文件列表 更美观的文件格式
├─ .prettierrc - 更漂亮的规则配置
├─ CODE_OF_CONDUCT.md - 仅在GitHub上使用的文件
├─ eslint.config.ts - ESLint规则配置
├─ LICENSE - 项目许可证文件
├─ package.json - Node.js 包配置
├─ package-lock.json
├─ playwright.config.ts - 编剧测试规则配置
├─ pnpm-lock.yaml - PNPM 相关文件
├─ pnpm-workspace.yaml - PNPM 相关文件
├─ tsconfig.json - TypeScript配置
├─ tsconfig.node.json - TypeScript配置
├─ vite.config.mts - Vite编译器构建配置
└─ README.md - 仅在GitHub上使用的文件
```
