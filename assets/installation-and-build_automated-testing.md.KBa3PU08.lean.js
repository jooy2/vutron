import{_ as e,c as a,a2 as i,o as s}from"./chunks/framework.BQmytedh.js";const g=JSON.parse('{"title":"Automated Testing","description":"","frontmatter":{"order":4},"headers":[],"relativePath":"installation-and-build/automated-testing.md","filePath":"en/installation-and-build/automated-testing.md","lastUpdated":1725496835000}'),n={name:"installation-and-build/automated-testing.md"};function o(r,t,l,d,p,h){return s(),a("div",null,t[0]||(t[0]=[i('<h1 id="automated-testing" tabindex="-1">Automated Testing <a class="header-anchor" href="#automated-testing" aria-label="Permalink to &quot;Automated Testing&quot;">​</a></h1><p><strong>Vutron</strong> includes automated testing. The testing framework uses Microsoft&#39;s <strong><a href="https://playwright.dev" target="_blank" rel="noreferrer">Playwright</a></strong>.</p><p><strong>Playwright</strong> is optimized for web application testing and has full support for the <strong>Electron</strong> framework. It is simple to install, requires no configuration to start testing immediately, and is cross-platform. You can learn more about <strong>Playwright</strong> here: <a href="https://github.com/microsoft/playwright" target="_blank" rel="noreferrer">https://github.com/microsoft/playwright</a></p><p>Only very simple launch and behavioral tests for the template main screen have been implemented in this template. Advanced testing will depend on the scope of your application.</p><p>Currently, the test specification file is located in the <code>tests</code> directory and the test results file is located in <code>tests/results</code>. (The built-in test specification file does not generate a separate results file.)</p><p>The Playwright configuration is <code>playwright.config.ts</code> in the project root, see the following documentation for more information on this: <a href="https://playwright.dev/docs/test-configuration" target="_blank" rel="noreferrer">https://playwright.dev/docs/test-configuration</a></p><p>Once everything is configured, you can run a test with the following command.</p><div class="language-shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">$</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> npm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> run</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> test</span></span></code></pre></div><p>Before running the test, empty the build directory (<code>dist</code>) and compile the package for the test.</p>',9)]))}const u=e(n,[["render",o]]);export{g as __pageData,u as default};
