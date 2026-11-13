import "./style.css";
import { FEATURES, FAQ_ITEMS, HOW_IT_WORKS, SETUP_COMMANDS, TSCONFIG_CODE, USAGE_CODE } from "./data";
import { icons } from "./icons";
import { type HeroSceneController, mountHeroPixi3D } from "./pixi-hero";

type PkgManager = keyof typeof SETUP_COMMANDS;

const NAV_LINKS = [
  { href: "#features", label: "核心特性" },
  { href: "#setup", label: "快速安装" },
  { href: "#usage", label: "代码示例" },
  { href: "#typescript", label: "TypeScript" },
  { href: "#faq", label: "常见问题" },
];

const CUBE_COLORS = [
  { name: "Pixi 粉", hex: 0xe72264, css: "#e72264" },
  { name: "经典红", hex: 0xdd4444, css: "#dd4444" },
  { name: "钴蓝色", hex: 0x3b82f6, css: "#3b82f6" },
  { name: "翡翠绿", hex: 0x10b981, css: "#10b981" },
];

const TAGLINE_SEGMENTS = [
  "无需切换引擎或",
  "重写 2D 界面，",
  "一行 addChild",
  "即可开启立体世界。",
];

const appRoot = document.querySelector<HTMLDivElement>("#app");
if (!appRoot) {
  throw new Error("未找到 #app 挂载节点");
}

appRoot.innerHTML = `
  <a
    href="#main-content"
    class="visually-hidden fixed top-4 left-4 z-50 rounded-lg bg-[#E72264] px-3 py-2 text-sm font-semibold text-white"
  >
    跳到正文内容
  </a>

  <!-- Unknown hash 404 banner (hidden by default) -->
  <div
    id="not-found-banner"
    hidden
    role="status"
    class="mx-auto mt-20 max-w-2xl rounded-2xl border border-[#272727] bg-[#181818] p-6 text-center"
  >
    <p class="text-lg font-semibold text-white">404 页面片段未找到</p>
    <p class="mt-2 text-sm text-[#A3A3A3]">你访问的锚点路径不存在，已为你保留完整首页内容。</p>
    <a href="#hero" id="not-found-back" class="btn btn-sm mt-4 border-[#313131] bg-[#272727] text-white hover:bg-[#313131]">
      返回首页顶部
    </a>
  </div>

  <!-- Floating compact header & navigation -->
  <header class="fixed inset-x-0 top-4 z-40 flex justify-center px-4">
    <nav
      aria-label="主导航"
      class="flex w-full max-w-4xl items-center justify-between gap-4 rounded-2xl border border-[#272727] bg-[#181818]/85 px-4 py-2 backdrop-blur-md"
    >
      <a href="#hero" class="flex items-center gap-2 rounded-lg text-sm font-semibold text-white transition-opacity duration-300 hover:opacity-85">
        <span class="flex size-8 items-center justify-center rounded-lg border border-[#313131] bg-[#1F1F1F] text-[#E72264]">
          ${icons.cube}
        </span>
        <span>PixiJS 3D</span>
        <span class="badge badge-sm border-[#313131] bg-[#1F1F1F] font-mono text-xs text-[#A3A3A3]">v0.1.0</span>
      </a>

      <ul class="hidden items-center gap-1 md:flex">
        ${NAV_LINKS.map(
          (link, idx) => `
          <li>
            <a
              href="${link.href}"
              data-nav-link="${link.href}"
              ${idx === 0 ? 'aria-current="location"' : ""}
              class="rounded-lg px-3 py-2 text-sm font-medium text-[#A3A3A3] transition-colors duration-300 hover:bg-[#272727] hover:text-white aria-[current=location]:bg-[#272727] aria-[current=location]:text-white"
            >
              ${link.label}
            </a>
          </li>
        `,
        ).join("")}
      </ul>

      <div class="flex items-center gap-2">
        <a
          href="#setup"
          class="hidden rounded-lg bg-[#E72264] px-3 py-2 text-sm font-semibold text-white transition-transform duration-300 hover:opacity-90 active:scale-[0.98] sm:inline-flex sm:items-center sm:gap-2"
        >
          <span>立即安装</span>
        </a>
        <button
          id="mobile-menu-toggle"
          type="button"
          aria-expanded="false"
          aria-controls="mobile-menu-panel"
          aria-label="打开导航菜单"
          class="inline-flex size-10 items-center justify-center rounded-lg border border-[#272727] bg-[#1F1F1F] text-white transition-colors duration-300 hover:bg-[#272727] md:hidden"
        >
          <span class="flex flex-col gap-1.5" aria-hidden="true">
            <span id="burger-line-1" class="block h-0.5 w-5 bg-current transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"></span>
            <span id="burger-line-2" class="block h-0.5 w-5 bg-current transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"></span>
          </span>
        </button>
      </div>
    </nav>
  </header>

  <!-- Full-height mobile menu panel -->
  <div
    id="mobile-menu-panel"
    hidden
    class="fixed inset-0 z-30 flex flex-col justify-center bg-[#000000]/95 px-6 pt-20 pb-8 backdrop-blur-xl md:hidden"
  >
    <ul class="flex flex-col gap-4">
      ${NAV_LINKS.map(
        (link, index) => `
        <li>
          <a
            href="${link.href}"
            class="mobile-nav-link block rounded-xl border border-[#272727] bg-[#181818] px-6 py-4 text-xl font-semibold text-white transition-colors duration-300 hover:border-[#313131] hover:bg-[#1F1F1F]"
            style="transition-delay: ${Math.min(index * 60, 360)}ms"
          >
            ${link.label}
          </a>
        </li>
      `,
      ).join("")}
      <li class="pt-2">
        <a
          href="#setup"
          class="mobile-nav-link flex items-center justify-center gap-2 rounded-xl bg-[#E72264] px-6 py-4 text-base font-semibold text-white"
          style="transition-delay: 360ms"
        >
          <span>立即安装 @pixi/3d</span>
          ${icons.arrowRight}
        </a>
      </li>
    </ul>
  </div>

  <main id="main-content" tabindex="-1" class="pt-24">
    <!-- Hero Section -->
    <section id="hero" class="mx-auto max-w-6xl px-4 pt-8 pb-16 md:px-8 md:pt-12 md:pb-24">
      <div class="grid items-center gap-12 lg:grid-cols-12">
        <div class="lg:col-span-6">
          <div class="inline-flex flex-wrap items-center gap-2 rounded-full border border-[#272727] bg-[#181818] px-3 py-1 text-xs font-medium text-[#D4D4D4]">
            <span class="inline-block size-2 rounded-full bg-[#E72264]" aria-hidden="true"></span>
            <span class="font-mono">@pixi/3d 0.1.0</span>
            <span aria-hidden="true">·</span>
            <span>需 pixi.js 8.23.0+</span>
            <span aria-hidden="true">·</span>
            <span>MIT 开源</span>
          </div>

          <h1 class="hero-gradient-text mt-6 max-w-[680px] text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            以 PixiJS 的方式<br />在同一舞台融合 2D 与 3D
          </h1>

          <p class="mt-6 max-w-[680px] text-base leading-relaxed text-[#A3A3A3] sm:text-lg">
            将 <code class="rounded bg-[#1F1F1F] px-1.5 py-0.5 text-sm text-[#F5F5F5]">View3D</code> 像精灵一样直接添加到舞台，原生支持 WebGL2 与 WebGPU 双渲染器，为你的交互作品与游戏引入 PBR 材质、光照阴影、glTF 压缩模型与 3D 指针事件。
          </p>

          <div class="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#setup"
              class="inline-flex items-center gap-2 rounded-lg bg-[#E72264] px-3 py-2 text-base font-semibold text-white transition-transform duration-300 hover:opacity-90 active:scale-[0.98]"
            >
              <span>立即开始安装</span>
              ${icons.arrowRight}
            </a>
            <a
              href="https://github.com/pixijs/3d"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-[#D4D4D4] transition-colors duration-300 hover:text-white"
            >
              <span>GitHub 仓库</span>
              ${icons.arrowUpRight}
            </a>
          </div>
        </div>

        <!-- Live @pixi/3d Interactive Canvas Card -->
        <div class="lg:col-span-6">
          <div class="rounded-2xl border border-[#272727] bg-[#181818] p-2">
            <div class="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-[#272727] bg-[#131209]">
              <!-- Skeleton loader shown until PixiJS 3D mounts -->
              <div id="hero-canvas-skeleton" class="flex h-full w-full flex-col items-center justify-center gap-3 p-6">
                <div class="skeleton h-20 w-20 rounded-2xl bg-[#272727]"></div>
                <div class="skeleton h-3 w-36 rounded bg-[#272727]"></div>
                <span class="text-xs text-[#A3A3A3]">正在初始化 PixiJS 3D 渲染管线…</span>
              </div>
              <div id="hero-canvas-host" class="absolute inset-0 h-full w-full"></div>

              <!-- Renderer badge -->
              <div class="pointer-events-none absolute top-3 left-3 flex items-center gap-2 rounded-lg border border-[#272727] bg-[#181818]/90 px-2.5 py-1 text-xs font-medium text-[#F5F5F5] backdrop-blur-sm">
                <span id="renderer-dot" class="size-2 rounded-full bg-[#4ade80]" aria-hidden="true"></span>
                <span id="renderer-label">检测渲染器中…</span>
              </div>

              <!-- Orbit hint -->
              <div class="pointer-events-none absolute bottom-3 left-3 rounded-lg border border-[#272727] bg-[#181818]/85 px-2.5 py-1 text-xs text-[#A3A3A3] backdrop-blur-sm">
                拖拽画布可环绕观察 · 滚轮缩放
              </div>
            </div>

            <!-- Interactive Controls Bar -->
            <div class="mt-2 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-[#1F1F1F] px-3 py-2">
              <div class="flex items-center gap-2">
                <button
                  id="toggle-spin-btn"
                  type="button"
                  class="btn btn-sm border-[#313131] bg-[#272727] text-xs font-semibold text-white hover:bg-[#313131]"
                >
                  ${icons.pause}
                  <span>暂停旋转</span>
                </button>
                <button
                  id="reset-camera-btn"
                  type="button"
                  class="btn btn-sm border-[#313131] bg-[#181818] text-xs font-medium text-[#D4D4D4] hover:bg-[#272727] hover:text-white"
                >
                  重置视角
                </button>
              </div>

              <div class="flex items-center gap-2" role="group" aria-label="切换立方体材质颜色">
                ${CUBE_COLORS.map(
                  (c, idx) => `
                  <button
                    type="button"
                    data-cube-color="${c.hex}"
                    aria-label="切换材质颜色为${c.name}"
                    class="size-6 rounded-full border-2 transition-transform duration-300 hover:scale-110 active:scale-95 ${
                      idx === 0 ? "border-white" : "border-[#313131]"
                    }"
                    style="background-color: ${c.css}"
                  ></button>
                `,
                ).join("")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="reveal-section mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-24">
      <div class="max-w-2xl">
        <p class="font-mono text-xs font-semibold tracking-wider text-[#E72264] uppercase">Core Capabilities</p>
        <h2 class="mt-2 text-3xl font-bold text-white sm:text-4xl">完整现代 3D 渲染能力，沿用 PixiJS 研发直觉</h2>
        <p class="mt-4 text-base text-[#A3A3A3]">
          从底层双渲染器到高层材质、动画与指针交互，@pixi/3d 将专业三维管线收敛为轻量、可组合的模块化 API。
        </p>
      </div>

      <div class="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        ${FEATURES.map(
          (item) => `
          <article class="card rounded-2xl border border-[#272727] bg-[#181818] p-6 transition-colors duration-300 hover:border-[#313131] hover:bg-[#1F1F1F]">
            <div class="flex items-center justify-between gap-3">
              <span class="flex size-10 items-center justify-center rounded-lg border border-[#313131] bg-[#272727] text-[#E72264]">
                ${icons[item.icon]}
              </span>
              <span class="badge border-[#313131] bg-[#1F1F1F] font-mono text-xs text-[#A3A3A3]">${item.tag}</span>
            </div>
            <h3 class="mt-4 text-lg font-semibold text-white">${item.title}</h3>
            <p class="mt-2 text-sm leading-relaxed text-[#A3A3A3]">${item.description}</p>
          </article>
        `,
        ).join("")}
      </div>
    </section>

    <!-- Mandatory Tagline Reveal Section (B11) -->
    <section id="tagline-reveal" class="mx-auto max-w-6xl px-4 py-20 md:px-8 md:py-24">
      <div class="rounded-2xl border border-[#272727] bg-[#181818] px-6 py-16 md:px-12 md:py-20">
        <p class="max-w-[680px] text-3xl leading-snug font-semibold text-white sm:text-4xl lg:text-5xl">
          ${TAGLINE_SEGMENTS.map(
            (seg, idx) => `<span class="tagline-word" data-tagline-index="${idx}">${seg}</span>`,
          ).join(" ")}
        </p>
      </div>
    </section>

    <!-- Setup Section -->
    <section id="setup" class="reveal-section mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-24">
      <div class="grid gap-12 lg:grid-cols-12 lg:items-start">
        <div class="lg:col-span-5">
          <p class="font-mono text-xs font-semibold tracking-wider text-[#E72264] uppercase">Setup</p>
          <h2 class="mt-2 text-3xl font-bold text-white sm:text-4xl">一条命令即可快速上手</h2>
          <p class="mt-4 text-base leading-relaxed text-[#A3A3A3]">
            使用官方 <a href="https://pixijs.io/create-pixi/" target="_blank" rel="noopener noreferrer" class="text-white underline decoration-[#313131] underline-offset-4 hover:decoration-[#E72264]">PixiJS Create</a> 脚手架创建新项目，或直接将 <code class="rounded bg-[#1F1F1F] px-1.5 py-0.5 text-sm text-white">@pixi/3d</code> 安装至现有工程。
          </p>
          <div class="mt-6 rounded-xl border border-[#272727] bg-[#181818] p-4">
            <p class="text-sm font-semibold text-white">版本与 CDN 说明</p>
            <p class="mt-1 text-sm text-[#A3A3A3]">
              <code class="text-white">@pixi/3d</code> 要求 <code class="text-white">pixi.js</code> 版本为 <span class="font-mono text-white">8.23.0</span> 或更高版本；如需免构建直接引入，也可查阅仓库中的
              <a
                href="https://github.com/pixijs/3d/blob/main/src/__docs__/getting-started/installation.md"
                target="_blank"
                rel="noopener noreferrer"
                class="text-[#E72264] underline underline-offset-4 hover:opacity-85"
              >
                CDN 安装文档
              </a>。
            </p>
          </div>
        </div>

        <div class="lg:col-span-7">
          <div class="rounded-2xl border border-[#272727] bg-[#181818] p-6">
            <div class="flex flex-wrap items-center justify-between gap-4 border-b border-[#272727] pb-4">
              <div role="tablist" aria-label="选择包管理器" class="tabs tabs-box bg-[#1F1F1F] p-1">
                <button type="button" role="tab" aria-selected="true" data-pm="bun" class="tab tab-active font-mono text-xs font-semibold">bun</button>
                <button type="button" role="tab" aria-selected="false" data-pm="npm" class="tab font-mono text-xs font-semibold">npm</button>
                <button type="button" role="tab" aria-selected="false" data-pm="pnpm" class="tab font-mono text-xs font-semibold">pnpm</button>
              </div>
              <span class="font-mono text-xs text-[#A3A3A3]">推荐 PixiJS 8.23.0+</span>
            </div>

            <div class="mt-6 space-y-4">
              <div>
                <div class="mb-2 flex items-center justify-between">
                  <span class="text-sm font-medium text-[#D4D4D4]">创建全新 PixiJS 项目</span>
                  <button
                    type="button"
                    data-copy-target="cmd-create"
                    class="btn btn-xs border-[#313131] bg-[#272727] text-[#F5F5F5] hover:bg-[#313131]"
                  >
                    ${icons.copy}
                    <span>复制</span>
                  </button>
                </div>
                <div class="mockup-code border border-[#272727] bg-[#000000] text-sm">
                  <pre data-prefix="$"><code id="cmd-create" class="text-[#F5F5F5]">${SETUP_COMMANDS.bun.create}</code></pre>
                </div>
              </div>

              <div>
                <div class="mb-2 flex items-center justify-between">
                  <span class="text-sm font-medium text-[#D4D4D4]">添加到现有项目</span>
                  <button
                    type="button"
                    data-copy-target="cmd-install"
                    class="btn btn-xs border-[#313131] bg-[#272727] text-[#F5F5F5] hover:bg-[#313131]"
                  >
                    ${icons.copy}
                    <span>复制</span>
                  </button>
                </div>
                <div class="mockup-code border border-[#272727] bg-[#000000] text-sm">
                  <pre data-prefix="$"><code id="cmd-install" class="text-[#F5F5F5]">${SETUP_COMMANDS.bun.install}</code></pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How it works + Usage Code Section -->
    <section id="usage" class="reveal-section mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-24">
      <div class="max-w-2xl">
        <p class="font-mono text-xs font-semibold tracking-wider text-[#E72264] uppercase">Usage</p>
        <h2 class="mt-2 text-3xl font-bold text-white sm:text-4xl">三步构建你的第一个 3D 场景</h2>
        <p class="mt-4 text-base text-[#A3A3A3]">
          下方代码即首页顶部实时演示的完整源码，也可对照仓库中的
          <a
            href="https://github.com/pixijs/3d/blob/main/src/__docs__/getting-started/quick-start.md"
            target="_blank"
            rel="noopener noreferrer"
            class="text-white underline decoration-[#313131] underline-offset-4 hover:decoration-[#E72264]"
          >Quick start</a>
          与
          <a
            href="https://github.com/pixijs/3d/blob/main/src/__docs__/getting-started/introduction.md"
            target="_blank"
            rel="noopener noreferrer"
            class="text-white underline decoration-[#313131] underline-offset-4 hover:decoration-[#E72264]"
          >Introduction</a>
          逐步深入。
        </p>
      </div>

      <div class="mt-10 grid gap-4 md:grid-cols-3">
        ${HOW_IT_WORKS.map(
          (item) => `
          <div class="rounded-2xl border border-[#272727] bg-[#181818] p-6">
            <div class="flex items-center justify-between">
              <span class="font-mono text-sm font-semibold text-[#E72264]">STEP ${item.step}</span>
              <code class="rounded bg-[#272727] px-2 py-0.5 text-xs text-[#D4D4D4]">${item.api}</code>
            </div>
            <h3 class="mt-4 text-lg font-semibold text-white">${item.title}</h3>
            <p class="mt-2 text-sm leading-relaxed text-[#A3A3A3]">${item.description}</p>
          </div>
        `,
        ).join("")}
      </div>

      <div class="mt-8 rounded-2xl border border-[#272727] bg-[#181818] p-4 sm:p-6">
        <div class="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div class="flex items-center gap-2 text-sm font-medium text-[#D4D4D4]">
            ${icons.code}
            <span class="font-mono">src/main.ts</span>
          </div>
          <button
            type="button"
            data-copy-target="usage-code-block"
            class="btn btn-sm border-[#313131] bg-[#272727] text-xs font-semibold text-white hover:bg-[#313131]"
          >
            ${icons.copy}
            <span>复制完整示例</span>
          </button>
        </div>
        <pre class="overflow-x-auto rounded-lg border border-[#272727] bg-[#000000] p-4 text-xs leading-relaxed text-[#E5E5E5] sm:text-sm"><code id="usage-code-block"></code></pre>
      </div>
    </section>

    <!-- TypeScript Section -->
    <section id="typescript" class="reveal-section mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-24">
      <div class="max-w-2xl">
        <p class="font-mono text-xs font-semibold tracking-wider text-[#E72264] uppercase">TypeScript</p>
        <h2 class="mt-2 text-3xl font-bold text-white sm:text-4xl">开箱即用的类型声明与版本适配</h2>
        <p class="mt-4 text-base text-[#A3A3A3]">
          PixiJS 3D 自带完整的 TypeScript 类型声明。由于底层依赖 WebGPU 类型，不同版本的 TypeScript 需要对应的类型配置。
        </p>
      </div>

      <div class="mt-10 grid gap-6 lg:grid-cols-2">
        <div class="rounded-2xl border border-[#272727] bg-[#181818] p-6">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-semibold text-white">TypeScript 5</h3>
            <span class="badge border-[#313131] bg-[#272727] font-mono text-xs text-[#4ade80]">零额外配置</span>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-[#A3A3A3]">
            TypeScript 5 默认不包含内置 WebGPU 类型，因此 <code class="text-white">pixi.js</code> 已自动为你引入了
            <a href="https://github.com/gpuweb/types" target="_blank" rel="noopener noreferrer" class="text-white underline decoration-[#313131] underline-offset-4 hover:decoration-[#E72264]">@webgpu/types</a>，开箱即可获得完整智能提示。
          </p>
          <div class="mt-6 rounded-xl border border-[#272727] bg-[#1F1F1F] p-4 text-sm text-[#D4D4D4]">
            提示：<code class="text-white">@pixi/3d/extras</code> 的子路径类型通过包内 <code class="text-white">exports</code> 导出，请确保 <code class="text-white">moduleResolution</code> 设置为 <code class="text-white">"bundler"</code>。
          </div>
        </div>

        <div class="rounded-2xl border border-[#272727] bg-[#181818] p-6">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-semibold text-white">TypeScript 6 与 7</h3>
            <span class="badge border-[#313131] bg-[#272727] font-mono text-xs text-[#E72264]">需 @types/web</span>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-[#A3A3A3]">
            TypeScript 6 与 7 已在 <code class="text-white">"dom"</code> 库中内置 WebGPU 类型，但部分版本会遗漏 <code class="text-white">GPUTextureUsage</code> 等定义。请安装完整包 <code class="text-white">@types/web</code> 替代 <code class="text-white">"dom"</code>，并移除冲突的 <code class="text-white">@webgpu/types</code>。
          </p>

          <div class="mt-4 space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-medium text-[#A3A3A3]">安装完整 Web 类型定义</span>
              <button
                type="button"
                data-copy-target="cmd-types"
                class="btn btn-xs border-[#313131] bg-[#272727] text-white hover:bg-[#313131]"
              >
                ${icons.copy}
                <span>复制</span>
              </button>
            </div>
            <div class="mockup-code border border-[#272727] bg-[#000000] text-xs">
              <pre data-prefix="$"><code id="cmd-types" class="text-[#F5F5F5]">${SETUP_COMMANDS.bun.types}</code></pre>
            </div>
            <pre class="overflow-x-auto rounded-lg border border-[#272727] bg-[#000000] p-3 text-xs text-[#E5E5E5]"><code id="tsconfig-block"></code></pre>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section id="faq" class="reveal-section mx-auto max-w-4xl px-4 py-16 md:px-8 md:py-24">
      <div class="text-center">
        <p class="font-mono text-xs font-semibold tracking-wider text-[#E72264] uppercase">FAQ</p>
        <h2 id="faq-heading" class="mt-2 text-3xl font-bold text-white sm:text-4xl">常见问题解答</h2>
        <p class="mt-3 text-base text-[#A3A3A3]">关于版本兼容、WebGPU 回退与 TypeScript 配置的高频疑问。</p>
      </div>

      <div class="faq-accordion mt-10 space-y-3" aria-labelledby="faq-heading">
        ${FAQ_ITEMS.map(
          (item, index) => `
          <details ${index === 0 ? "open" : ""}>
            <summary>${item.question}</summary>
            <div class="px-6 pb-5 text-sm leading-relaxed text-[#A3A3A3]">
              ${item.answer}
            </div>
          </details>
        `,
        ).join("")}
      </div>
    </section>

    <!-- Community & Sponsors Section -->
    <section id="community" class="reveal-section mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-24">
      <div class="rounded-2xl border border-[#272727] bg-[#181818] p-6 sm:p-10">
        <div class="grid gap-8 lg:grid-cols-12 lg:items-center">
          <div class="lg:col-span-7">
            <div class="inline-flex items-center gap-2 text-sm font-semibold text-[#E72264]">
              ${icons.heart}
              <span>开源社区与赞助</span>
            </div>
            <h2 class="mt-3 text-2xl font-bold text-white sm:text-3xl">加入 PixiJS 开发者社区，或参与贡献</h2>
            <p class="mt-3 text-sm leading-relaxed text-[#A3A3A3]">
              PixiJS 3D 基于 MIT 开源协议发布。欢迎阅读贡献指南提交代码，或在 Discord、Bluesky 与 X 与全球图形开发者交流；如果你的团队在生产中使用 PixiJS，欢迎赞助支持核心维护。
            </p>
            <div class="mt-6 flex flex-wrap gap-3">
              <a href="https://discord.gg/QrnxmQUPGV" target="_blank" rel="noopener noreferrer" class="btn btn-sm border-[#313131] bg-[#272727] text-white hover:bg-[#313131]">
                Discord 社区
              </a>
              <a href="https://bsky.app/profile/pixijs.com" target="_blank" rel="noopener noreferrer" class="btn btn-sm border-[#313131] bg-[#272727] text-white hover:bg-[#313131]">
                Bluesky
              </a>
              <a href="https://x.com/pixijs" target="_blank" rel="noopener noreferrer" class="btn btn-sm border-[#313131] bg-[#272727] text-white hover:bg-[#313131]">
                X (@pixijs)
              </a>
              <a href="https://github.com/pixijs/3d/blob/main/.github/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer" class="btn btn-sm border-[#313131] bg-[#1F1F1F] text-[#D4D4D4] hover:bg-[#272727] hover:text-white">
                贡献指南
              </a>
            </div>
          </div>

          <div class="lg:col-span-5">
            <div class="rounded-xl border border-[#272727] bg-[#1F1F1F] p-6">
              <p class="text-sm font-semibold text-white">PixiJS Sponsors</p>
              <p class="mt-2 text-xs leading-relaxed text-[#A3A3A3]">
                我们致力于打造最优秀的 Web 图形库，持续维护离不开社区与赞助商的支持，CI 构建由 Namespace 提供动力。
              </p>
              <div class="mt-4 flex flex-wrap items-center gap-3">
                <a
                  href="https://pixijs.com/sponsor"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 rounded-lg bg-[#E72264] px-3 py-2 text-sm font-semibold text-white transition-opacity duration-300 hover:opacity-90"
                >
                  <span>成为赞助商</span>
                  ${icons.arrowUpRight}
                </a>
                <a
                  href="https://opencollective.com/pixijs"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1 text-sm font-medium text-[#D4D4D4] hover:text-white"
                >
                  <span>Open Collective</span>
                  ${icons.arrowUpRight}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Final CTA -->
    <section class="reveal-section mx-auto max-w-4xl px-4 py-16 text-center md:px-8 md:py-24">
      <h2 class="text-3xl font-bold text-white sm:text-4xl">准备好在 PixiJS 中引入 3D 了吗？</h2>
      <p class="mx-auto mt-4 max-w-xl text-base text-[#A3A3A3]">
        只需安装 <code class="text-white">@pixi/3d</code> 与 <code class="text-white">pixi.js 8.23.0+</code>，即可在现有舞台上叠加流畅的三维渲染。
      </p>
      <div class="mt-8 flex justify-center">
        <a
          href="#setup"
          class="inline-flex items-center gap-2 rounded-lg bg-[#E72264] px-3 py-2 text-base font-semibold text-white transition-transform duration-300 hover:opacity-90 active:scale-[0.98]"
        >
          <span>立即开始安装</span>
          ${icons.arrowRight}
        </a>
      </div>
    </section>
  </main>

  <!-- Footer -->
  <footer class="border-t border-[#272727] bg-[#000000]">
    <div class="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-10 sm:flex-row sm:items-center md:px-8">
      <div class="flex items-center gap-2 text-sm font-semibold text-white">
        <span class="text-[#E72264]">${icons.cube}</span>
        <span>PixiJS 3D</span>
      </div>

      <div class="flex flex-wrap items-center gap-4 text-xs text-[#A3A3A3]">
        <a href="https://www.npmjs.com/package/@pixi/3d" target="_blank" rel="noopener noreferrer" class="hover:text-white">npm @pixi/3d</a>
        <a href="https://github.com/pixijs/3d/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" class="hover:text-white">MIT 协议</a>
        <button type="button" data-open-dialog="privacy-dialog" class="cursor-pointer hover:text-white">隐私说明</button>
        <button type="button" data-open-dialog="terms-dialog" class="cursor-pointer hover:text-white">使用条款</button>
      </div>
    </div>
  </footer>

  <!-- Native <dialog> modals for Legal Links -->
  <dialog id="privacy-dialog" class="legal-dialog m-auto max-w-lg rounded-2xl border border-[#272727] bg-[#181818] p-6 text-[#F5F5F5]">
    <div class="flex items-center justify-between border-b border-[#272727] pb-3">
      <h2 class="text-lg font-semibold text-white">隐私说明</h2>
      <button type="button" data-close-dialog="privacy-dialog" aria-label="关闭隐私说明" class="btn btn-ghost btn-sm text-[#A3A3A3] hover:text-white">
        ${icons.xClose}
      </button>
    </div>
    <p class="mt-4 text-sm leading-relaxed text-[#A3A3A3]">
      本站为 PixiJS 3D (@pixi/3d) 的开源技术文档与实时演示站点，完全在浏览器本地运行，不收集任何个人身份信息、表单数据或追踪 Cookie。
    </p>
    <div class="mt-6 flex justify-end">
      <button type="button" data-close-dialog="privacy-dialog" class="btn btn-sm border-[#313131] bg-[#272727] text-white hover:bg-[#313131]">
        我知道了
      </button>
    </div>
  </dialog>

  <dialog id="terms-dialog" class="legal-dialog m-auto max-w-lg rounded-2xl border border-[#272727] bg-[#181818] p-6 text-[#F5F5F5]">
    <div class="flex items-center justify-between border-b border-[#272727] pb-3">
      <h2 class="text-lg font-semibold text-white">使用条款</h2>
      <button type="button" data-close-dialog="terms-dialog" aria-label="关闭使用条款" class="btn btn-ghost btn-sm text-[#A3A3A3] hover:text-white">
        ${icons.xClose}
      </button>
    </div>
    <p class="mt-4 text-sm leading-relaxed text-[#A3A3A3]">
      页面内所有 API 示例与核心特性说明均整理自 PixiJS 3D 官方仓库，示例代码与 @pixi/3d 库本身遵循 MIT 开源协议，可自由用于学习与商业项目。
    </p>
    <div class="mt-6 flex justify-end">
      <button type="button" data-close-dialog="terms-dialog" class="btn btn-sm border-[#313131] bg-[#272727] text-white hover:bg-[#313131]">
        我知道了
      </button>
    </div>
  </dialog>

  <!-- Live region for copy status announcements -->
  <div id="copy-live-region" class="visually-hidden" aria-live="polite"></div>
`;

// Populate code blocks safely via textContent
const usageCodeEl = document.getElementById("usage-code-block");
if (usageCodeEl) usageCodeEl.textContent = USAGE_CODE;

const tsconfigEl = document.getElementById("tsconfig-block");
if (tsconfigEl) tsconfigEl.textContent = TSCONFIG_CODE;

// Mount live @pixi/3d Hero Scene
const canvasHost = document.getElementById("hero-canvas-host");
const canvasSkeleton = document.getElementById("hero-canvas-skeleton");
const rendererLabel = document.getElementById("renderer-label");
const rendererDot = document.getElementById("renderer-dot");
const toggleSpinBtn = document.getElementById("toggle-spin-btn");
const resetCameraBtn = document.getElementById("reset-camera-btn");

let heroController: HeroSceneController | null = null;
let isSpinning = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function syncSpinButtonUI() {
  if (!toggleSpinBtn) return;
  toggleSpinBtn.innerHTML = isSpinning
    ? `${icons.pause}<span>暂停旋转</span>`
    : `${icons.play}<span>继续旋转</span>`;
}
syncSpinButtonUI();

if (canvasHost) {
  void mountHeroPixi3D(
    canvasHost,
    (label) => {
      canvasSkeleton?.remove();
      if (rendererLabel) rendererLabel.textContent = `${label} 运行中`;
    },
    (errorMsg) => {
      if (rendererLabel) rendererLabel.textContent = "渲染不可用";
      if (rendererDot) {
        rendererDot.classList.remove("bg-[#4ade80]");
        rendererDot.classList.add("bg-[#fbbf24]");
      }
      if (canvasSkeleton) {
        canvasSkeleton.innerHTML = `
          <div class="text-center">
            <p class="text-sm font-semibold text-white">当前环境暂未启用 3D 硬件加速</p>
            <p class="mt-1 max-w-xs text-xs text-[#A3A3A3]">${errorMsg}</p>
          </div>
        `;
      }
    },
  ).then((ctrl) => {
    heroController = ctrl;
  });
}

toggleSpinBtn?.addEventListener("click", () => {
  isSpinning = !isSpinning;
  heroController?.setPlaying(isSpinning);
  syncSpinButtonUI();
});

resetCameraBtn?.addEventListener("click", () => {
  heroController?.resetCamera();
});

document.querySelectorAll<HTMLButtonElement>("[data-cube-color]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const hex = Number(btn.dataset.cubeColor);
    heroController?.setColor(hex);
    document.querySelectorAll<HTMLButtonElement>("[data-cube-color]").forEach((other) => {
      other.classList.remove("border-white");
      other.classList.add("border-[#313131]");
    });
    btn.classList.remove("border-[#313131]");
    btn.classList.add("border-white");
  });
});

// Package Manager Tabs
const pmTabs = document.querySelectorAll<HTMLButtonElement>("[data-pm]");
const cmdCreateEl = document.getElementById("cmd-create");
const cmdInstallEl = document.getElementById("cmd-install");
const cmdTypesEl = document.getElementById("cmd-types");

pmTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const pm = tab.dataset.pm as PkgManager;
    const commands = SETUP_COMMANDS[pm];
    if (!commands) return;

    pmTabs.forEach((t) => {
      const active = t === tab;
      t.classList.toggle("tab-active", active);
      t.setAttribute("aria-selected", String(active));
    });

    if (cmdCreateEl) cmdCreateEl.textContent = commands.create;
    if (cmdInstallEl) cmdInstallEl.textContent = commands.install;
    if (cmdTypesEl) cmdTypesEl.textContent = commands.types;
  });
});

// Copy to clipboard with inline status confirmation
const liveRegion = document.getElementById("copy-live-region");

document.querySelectorAll<HTMLButtonElement>("[data-copy-target]").forEach((btn) => {
  const originalHTML = btn.innerHTML;
  let timer: number | undefined;

  btn.addEventListener("click", async () => {
    const targetId = btn.dataset.copyTarget;
    const targetEl = targetId ? document.getElementById(targetId) : null;
    const text = targetEl?.textContent ?? "";
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      btn.innerHTML = `${icons.check}<span>已复制</span>`;
      if (liveRegion) liveRegion.textContent = "代码已复制到剪贴板";
    } catch {
      btn.innerHTML = `<span>复制失败，请手动选中</span>`;
      if (liveRegion) liveRegion.textContent = "复制失败，请手动选中复制";
    }

    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      btn.innerHTML = originalHTML;
    }, 1800);
  });
});

// Mobile Menu Toggle
const mobileToggle = document.getElementById("mobile-menu-toggle");
const mobilePanel = document.getElementById("mobile-menu-panel");
const burgerLine1 = document.getElementById("burger-line-1");
const burgerLine2 = document.getElementById("burger-line-2");

function setMobileMenu(open: boolean) {
  if (!mobilePanel || !mobileToggle) return;
  mobileToggle.setAttribute("aria-expanded", String(open));
  mobileToggle.setAttribute("aria-label", open ? "关闭导航菜单" : "打开导航菜单");

  if (open) {
    mobilePanel.hidden = false;
    requestAnimationFrame(() => {
      mobilePanel.classList.add("mobile-menu-open");
    });
    burgerLine1?.style.setProperty("transform", "translateY(4px) rotate(45deg)");
    burgerLine2?.style.setProperty("transform", "translateY(-4px) rotate(-45deg)");
  } else {
    mobilePanel.classList.remove("mobile-menu-open");
    mobilePanel.hidden = true;
    burgerLine1?.style.removeProperty("transform");
    burgerLine2?.style.removeProperty("transform");
  }
}

mobileToggle?.addEventListener("click", () => {
  const isOpen = mobileToggle.getAttribute("aria-expanded") === "true";
  setMobileMenu(!isOpen);
});

mobilePanel?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMobileMenu(false));
});

// IntersectionObserver for section reveals & active nav state
const revealSections = document.querySelectorAll<HTMLElement>(".reveal-section");
const navLinks = document.querySelectorAll<HTMLAnchorElement>("[data-nav-link]");

const revealObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    }
  },
  { threshold: 0.12 },
);

revealSections.forEach((sec) => revealObserver.observe(sec));

const activeNavObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting && entry.target.id) {
        const hash = `#${entry.target.id}`;
        navLinks.forEach((link) => {
          if (link.dataset.navLink === hash) {
            link.setAttribute("aria-current", "location");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      }
    }
  },
  { rootMargin: "-35% 0px -55% 0px" },
);

document.querySelectorAll<HTMLElement>("main section[id]").forEach((sec) => activeNavObserver.observe(sec));

// Mandatory Tagline Word-by-Word Reveal (B11)
const taglineSection = document.getElementById("tagline-reveal");
const taglineWords = document.querySelectorAll<HTMLElement>("[data-tagline-index]");

if (taglineSection && taglineWords.length > 0) {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) {
    taglineWords.forEach((w) => w.classList.add("is-active"));
  } else {
    const taglineObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            taglineWords.forEach((word, idx) => {
              window.setTimeout(() => {
                word.classList.add("is-active");
              }, idx * 140);
            });
            taglineObserver.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.45 },
    );
    taglineObserver.observe(taglineSection);
  }
}

// Native <dialog> Modals
document.querySelectorAll<HTMLButtonElement>("[data-open-dialog]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const id = btn.dataset.openDialog;
    const dialog = id ? (document.getElementById(id) as HTMLDialogElement | null) : null;
    dialog?.showModal();
  });
});

document.querySelectorAll<HTMLButtonElement>("[data-close-dialog]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const id = btn.dataset.closeDialog;
    const dialog = id ? (document.getElementById(id) as HTMLDialogElement | null) : null;
    dialog?.close();
  });
});

// Unknown hash 404 fallback check
const notFoundBanner = document.getElementById("not-found-banner");
function checkHashRoute() {
  const hash = window.location.hash;
  if (!hash || hash === "#") {
    if (notFoundBanner) notFoundBanner.hidden = true;
    return;
  }
  const target = document.getElementById(hash.slice(1));
  if (notFoundBanner) {
    notFoundBanner.hidden = Boolean(target);
  }
}
window.addEventListener("hashchange", checkHashRoute);
checkHashRoute();
