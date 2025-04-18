import{_ as a,c as e,a2 as s,o as i}from"./chunks/framework.BQmytedh.js";const c=JSON.parse('{"title":"自动测试","description":"","frontmatter":{"order":4},"headers":[],"relativePath":"zhHans/installation-and-build/automated-testing.md","filePath":"zhHans/installation-and-build/automated-testing.md","lastUpdated":1735005729000}'),r={name:"zhHans/installation-and-build/automated-testing.md"};function n(o,t,l,p,d,h){return i(),e("div",null,t[0]||(t[0]=[s('<h1 id="自动测试" tabindex="-1">自动测试 <a class="header-anchor" href="#自动测试" aria-label="Permalink to &quot;自动测试&quot;">​</a></h1><p><strong>Vutron</strong>包括自动测试。测试框架使用微软的**<a href="https://playwright.dev" target="_blank" rel="noreferrer">Playwright</a>。</p><p><strong>Playwright</strong>针对网络应用测试进行了优化，并完全支持<strong>Electron</strong>框架。它易于安装，无需配置即可立即开始测试，并且是跨平台的。您可以在此处了解有关<strong>Playwright</strong>的更多信息：<a href="https://github.com/microsoft/playwright" target="_blank" rel="noreferrer">https://github.com/microsoft/playwright</a></p><p>此模板仅对模板主屏幕进行了非常简单的启动和行为测试。高级测试取决于您的应用程序范围。</p><p>目前，测试规范文件位于<code>tests</code>目录中，测试结果文件位于<code>tests/results</code>中。（内置测试规范文件不会生成单独的结果文件。）</p><p>Playwright配置文件位于项目根目录下的playwright.config.ts，更多信息请参阅以下文档：<a href="https://playwright.dev/docs/test-configuration" target="_blank" rel="noreferrer">https://playwright.dev/docs/test-configuration</a></p><p>完成所有配置后，您可以使用以下命令进行测试。</p><div class="language-shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">$</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> npm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> run</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> test</span></span></code></pre></div><p>在运行测试之前，请清空构建目录（<code>dist</code>）并编译测试包。</p>',9)]))}const u=a(r,[["render",n]]);export{c as __pageData,u as default};
