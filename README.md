<p align="center">
  <a href="https://pixijs.com" target="_blank" rel="noopener noreferrer">
    <img height="150" src="https://files.pixijs.download/branding/pixijs-logo-transparent-dark.svg?v=1" alt="PixiJS 徽标">
  </a>
</p>
<br/>
<p align="center">
  <a href="https://npmjs.com/package/@pixi/3d"><img src="https://img.shields.io/npm/v/@pixi/3d.svg" alt="npm 包版本"></a>
  <a href="https://npmjs.com/package/@pixi/3d"><img src="https://img.shields.io/npm/dm/@pixi/3d" alt="npm 下载量"></a>
  <a href="https://opencollective.com/pixijs"><img src="https://opencollective.com/pixijs/tiers/badge.svg" alt="Open Collective 赞助"></a>
</p>
<p align="center">
 <a href="https://discord.gg/QrnxmQUPGV">Discord</a> | <a href="https://bsky.app/profile/pixijs.com">Bluesky</a> | <a href="https://x.com/pixijs">𝕏</a>
</p>

# PixiJS 3D

> 以 PixiJS 的方式，在同一处融合 2D 与 3D。

- 🚀 [WebGL2](https://en.wikipedia.org/wiki/WebGL) 与 [WebGPU](https://en.wikipedia.org/wiki/WebGPU) 双渲染器
- 🧩 像精灵（Sprite）一样直接添加到舞台的 3D 视图
- 📦 glTF 模型加载，支持 Draco 与 meshopt 压缩
- 🎨 PBR、Phong 与 Toon（卡通）材质
- 💡 光照与阴影
- 🏃 骨骼蒙皮（Skinned）与变形目标（Morph-Target）动画
- ✨ 3D 粒子系统
- 🪄 泛光（Bloom）与环境光遮蔽（Ambient Occlusion）等后处理特效
- ✋ 3D 对象上的指针事件（Pointer Events）

### 安装与初始化

使用我们的 [PixiJS Create](https://pixijs.io/create-pixi/) CLI 脚手架，只需一条命令即可轻松上手 PixiJS 3D：

<p align="center">
  <img width="500" style="border-radius: 10px; filter: drop-shadow(0px 2px 5px #000);;" alt="终端运行演示截图" src="https://pixijs.io/create-pixi/img/demo.gif">
</p>

```bash
npm create pixi.js@latest
```

或者将其添加到现有项目中：

```bash
npm install pixi.js @pixi/3d
```

`@pixi/3d` 需要 `pixi.js` 8.23.0 或更高版本。[安装指南](https://github.com/pixijs/3d/blob/main/src/__docs__/getting-started/installation.md) 提供了 CDN 构建的引入方式。

### 使用示例

```ts
import { CubeGeometry, DirectionalLight, Material3D, Mesh3D, View3D } from '@pixi/3d';
import { OrbitCamera } from '@pixi/3d/extras';
import { Application } from 'pixi.js';

(async () => {
  // 创建一个新的 PixiJS 应用
  const app = new Application();

  await app.init({ preference: 'webgpu', background: '#1a1a2e', resizeTo: window, antialias: true });
  document.body.appendChild(app.canvas);

  // View3D 用于绘制 3D 场景；其环境光会从上方与下方照亮物体
  const view3d = new View3D({ autoResize: true, environment: { skyColor: 0xc9d6ff, groundColor: 0x3a2f45 } });

  app.stage.addChild(view3d);

  // 创建一个红色立方体，以及照射它的太阳方向光
  const cube = new Mesh3D({ geometry: new CubeGeometry(), material: new Material3D({ baseColor: 0xdd4444 }) });
  const sun = new DirectionalLight({ intensity: 3 });

  sun.position.set(-3, 5, 2);
  view3d.root.addChild(cube, sun);
  sun.lookAt(cube.position);

  // 将相机向后移动；支持通过拖拽围绕立方体旋转观察
  view3d.camera.position.set(0, 1.5, 4);
  new OrbitCamera({ view: view3d });

  // 持续旋转立方体
  app.ticker.add((time) => {
    cube.rotation.y += 0.01 * time.deltaTime;
  });
})();
```

[快速开始](https://github.com/pixijs/3d/blob/main/src/__docs__/getting-started/quick-start.md) 会带你一步步构建场景，[介绍文档](https://github.com/pixijs/3d/blob/main/src/__docs__/getting-started/introduction.md) 则指向各个功能模块的详细指南。

### TypeScript 配置

PixiJS 3D 自带类型声明。与 PixiJS 一样，这些声明依赖 WebGPU 类型，而类型的来源取决于你所使用的 TypeScript 版本。

**TypeScript 5：** 默认未内置 WebGPU 类型，因此 `pixi.js` 会为你自动引入 [`@webgpu/types`](https://github.com/gpuweb/types)，无需额外配置。

**TypeScript 6 与 7：** WebGPU 类型已内置在 `"dom"` 库中，但部分发行版遗漏了一些类型（例如 `GPUTextureUsage`）。请使用包含完整类型定义的 [`@types/web`](https://www.npmjs.com/package/@types/web) 来替代 `"dom"`。如果 `types` 中存在 `@webgpu/types`，请将其移除，因为它会与内置类型产生冲突。

```bash
npm install --save-dev @types/web
```

```json
{
  "compilerOptions": {
    "lib": ["esnext"],
    "types": ["@types/web"]
  }
}
```

`@pixi/3d/extras` 的类型通过包的 `exports` 字段导出，因此请使用支持解析它的 `moduleResolution` 模式，例如 `"bundler"`。

### 参与贡献

在提交更改之前，请先阅读 [贡献指南](https://github.com/pixijs/3d/blob/main/.github/CONTRIBUTING.md)。

### 开源协议

本项目内容基于 [MIT 协议](https://github.com/pixijs/3d/blob/main/LICENSE) 发布。

<br/>

<h2 align="center">PixiJS 赞助商</h2>

<p align="center">
  我们热衷于将 PixiJS 打造为尽可能优秀的图形库。我们的专注与投入源于对这个项目和社区的热爱。
</p>
<br/>
<p align="center">
  <a href="https://pixijs.com/sponsor"><img src="https://pixijs.com/sponsors-readme.svg" alt="PixiJS 赞助商"></a>
</p>
<p align="center">
  <a href="https://namespace.so/github-actions/?utm_source=oss&utm_campaign=pixijs"><img alt="CI 由 Namespace 提供支持" src="https://namespace.so/oss/badge.svg" height="32" /></a>
</p>
<br/>
<p align="center">
  如果你愿意支持我们的工作，欢迎考虑 <a href="https://pixijs.com/sponsor"><b>成为赞助商</b></a>。
</p>

