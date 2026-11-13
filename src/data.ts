export interface FeatureItem {
  id: string;
  icon:
    | "rocket"
    | "puzzle"
    | "package"
    | "palette"
    | "sun"
    | "personRun"
    | "sparkle"
    | "magicWand"
    | "cursorClick";
  title: string;
  description: string;
  tag: string;
}

export interface StepItem {
  step: string;
  title: string;
  description: string;
  api: string;
  lines: readonly [number, number];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export const FEATURES: FeatureItem[] = [
  {
    id: "renderers",
    icon: "rocket",
    title: "WebGL2 与 WebGPU 双渲染器",
    description:
      "优先启用现代 WebGPU 管线，并在不支持的环境中平滑回退至 WebGL2，兼顾前沿性能与广泛兼容。",
    tag: "双引擎",
  },
  {
    id: "view3d",
    icon: "puzzle",
    title: "像精灵一样添加 3D 视图",
    description:
      "通过 View3D 实例直接挂载到 PixiJS 舞台（app.stage），与现有 2D 精灵、文本及 UI 层级自然融合。",
    tag: "View3D",
  },
  {
    id: "gltf",
    icon: "package",
    title: "glTF 模型与几何压缩",
    description:
      "原生支持加载 glTF 资产，内置 Draco 几何压缩与 meshopt 网格优化解码，大幅缩减模型加载体积。",
    tag: "Draco / meshopt",
  },
  {
    id: "materials",
    icon: "palette",
    title: "PBR、Phong 与卡通材质",
    description:
      "提供基于物理的 PBR 材质、经典 Phong 光照模型与风格化 Toon 卡通材质，满足写实与二次元渲染需求。",
    tag: "材质系统",
  },
  {
    id: "lights",
    icon: "sun",
    title: "光照系统与实时阴影",
    description:
      "内置方向光等光源与阴影投射管线，搭配天空色与地面色环境光照，快速构建层次分明的立体空间。",
    tag: "光影",
  },
  {
    id: "animation",
    icon: "personRun",
    title: "骨骼蒙皮与变形目标动画",
    description:
      "完整支持 Skinned 骨骼动画与 Morph Target 变形目标动画，轻松驱动角色动作与精细面部表情。",
    tag: "动画",
  },
  {
    id: "particles",
    icon: "sparkle",
    title: "3D 粒子系统",
    description:
      "在三维场景中高效生成并渲染火焰、烟雾、星尘等粒子效果，为游戏与交互作品增添立体动感。",
    tag: "粒子",
  },
  {
    id: "postprocess",
    icon: "magicWand",
    title: "泛光与环境光遮蔽后处理",
    description:
      "内置 Bloom 泛光与 Ambient Occlusion 环境光遮蔽等屏幕后处理特效，进一步提升画面质感。",
    tag: "后处理",
  },
  {
    id: "pointer",
    icon: "cursorClick",
    title: "3D 对象指针交互事件",
    description: "直接在 3D 网格上监听点击、悬停与拖拽事件，沿用你熟悉的 PixiJS 交互事件心智模型。",
    tag: "交互",
  },
];

export const HOW_IT_WORKS: StepItem[] = [
  {
    step: "01",
    title: "初始化 PixiJS 应用",
    description: "创建 Application 实例并设置 preference 为 webgpu，将画布挂载至页面容器。",
    api: "new Application()",
    lines: [6, 10],
  },
  {
    step: "02",
    title: "创建并挂载 View3D",
    description:
      "实例化 View3D 并配置天空与地面环境光，像添加普通 2D 精灵一样调用 app.stage.addChild(view3d)。",
    api: "app.stage.addChild(view3d)",
    lines: [12, 15],
  },
  {
    step: "03",
    title: "组装网格、光源与相机",
    description:
      "将 Mesh3D 与 DirectionalLight 加入 view3d.root，绑定 OrbitCamera 并在 ticker 中更新旋转。",
    api: "view3d.root.addChild(cube, sun)",
    lines: [17, 32],
  },
];

export const USAGE_CODE = `import { CubeGeometry, DirectionalLight, Material3D, Mesh3D, View3D } from '@pixi/3d';
import { OrbitCamera } from '@pixi/3d/extras';
import { Application } from 'pixi.js';

(async () => {
  // 创建 PixiJS 应用实例
  const app = new Application();

  await app.init({ preference: 'webgpu', background: '#1a1a2e', resizeTo: window, antialias: true });
  document.body.appendChild(app.canvas);

  // View3D 用于绘制 3D 场景，其环境光从上方天空与下方地面照亮物体
  const view3d = new View3D({ autoResize: true, environment: { skyColor: 0xc9d6ff, groundColor: 0x3a2f45 } });

  app.stage.addChild(view3d);

  // 创建一个红色立方体与照射它的太阳方向光
  const cube = new Mesh3D({ geometry: new CubeGeometry(), material: new Material3D({ baseColor: 0xdd4444 }) });
  const sun = new DirectionalLight({ intensity: 3 });

  sun.position.set(-3, 5, 2);
  view3d.root.addChild(cube, sun);
  sun.lookAt(cube.position);

  // 拉远相机，并通过 OrbitCamera 支持鼠标拖拽环绕观察
  view3d.camera.position.set(0, 1.5, 4);
  new OrbitCamera({ view: view3d });

  // 在主循环中持续旋转立方体
  app.ticker.add((time) => {
    cube.rotation.y += 0.01 * time.deltaTime;
  });
})();`;

export const USAGE_HYBRID_CODE = `import { DirectionalLight, Mesh3D, PlaneGeometry, TorusKnotGeometry, Vector3, View3D } from '@pixi/3d';
import { OrbitCamera, ToonMaterial } from '@pixi/3d/extras';
import { Application, Point, Text } from 'pixi.js';

(async () => {
  const app = new Application();
  await app.init({ preference: 'webgpu', background: '#131209', resizeTo: window, antialias: true });
  document.body.appendChild(app.canvas);

  // 开启中档阴影质量与 ACES 电影级色调映射
  const view3d = new View3D({
    autoResize: true,
    shadowQuality: 'medium',
    toneMapping: 'aces',
    environment: { skyColor: 0xc9d6ff, groundColor: 0x3a2f45, intensity: 0.7 },
  });
  app.stage.addChild(view3d);

  // 投射阴影的方向光与承接阴影的地面
  const sun = new DirectionalLight({ intensity: 3, castShadow: true });
  sun.position.set(-3, 5, 3);
  sun.lookAt({ x: 0, y: 0, z: 0 });

  const floor = new Mesh3D({
    geometry: new PlaneGeometry({ width: 14, height: 14 }),
    rotation: { x: -Math.PI / 2, y: 0, z: 0 },
    position: { x: 0, y: -1.4, z: 0 },
    castShadow: false,
    receiveShadow: true,
  });

  // 使用 ToonMaterial 并开启 3D 指针点击事件
  const knot = new Mesh3D({
    geometry: new TorusKnotGeometry({ radius: 0.85, tube: 0.28, tubularSegments: 120, radialSegments: 16 }),
    material: new ToonMaterial({ baseColor: 0xe72264, bands: 3, rimIntensity: 0.45 }),
    castShadow: true,
    eventMode: 'static',
    cursor: 'pointer',
  });
  view3d.root.addChild(sun, floor, knot);

  // 在 2D 舞台叠加标签，并实时投影跟随 3D 物体坐标
  const hudLabel = new Text({ text: 'View3D · 2D 锚点', style: { fill: 0xffffff, fontSize: 13 } });
  hudLabel.anchor.set(0.5, 1);
  app.stage.addChild(hudLabel);

  new OrbitCamera({ view: view3d, enableDamping: true });
  const anchor3D = new Vector3(0, 1.35, 0);
  const screenPt = new Point();

  app.ticker.add((time) => {
    knot.rotation.y += 0.01 * time.deltaTime;
    const p = view3d.worldToScreen(anchor3D, screenPt);
    hudLabel.visible = p !== null;
    if (p) hudLabel.position.copyFrom(p);
  });
})();`;

export const TSCONFIG_CODE = `{
  "compilerOptions": {
    "lib": ["esnext"],
    "types": ["@types/web"],
    "moduleResolution": "bundler"
  }
}`;

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "@pixi/3d 对 pixi.js 的版本有什么最低要求？",
    answer:
      "@pixi/3d 需要搭配 pixi.js 8.23.0 及以上版本使用。如果你是新建项目，推荐直接使用 PixiJS Create CLI 工具一键初始化完整依赖。",
  },
  {
    question: "它只支持 WebGPU 吗？旧版浏览器或设备能否运行？",
    answer:
      "不是只支持 WebGPU。PixiJS 3D 同时支持 WebGL2 与 WebGPU 双渲染器。当你在 app.init 中设置 preference 为 webgpu 时，若当前环境暂不支持 WebGPU，PixiJS 会自动回退到 WebGL2 渲染。",
  },
  {
    question: "为什么在 TypeScript 6 或 TypeScript 7 中会遇到 WebGPU 类型缺失？",
    answer:
      "TypeScript 5 会由 pixi.js 自动引入 @webgpu/types；而 TypeScript 6 与 7 将 WebGPU 类型并入了内置 dom 库，但部分版本会缺失 GPUTextureUsage 等定义。此时请安装 @types/web 替代 dom，并移除冲突的 @webgpu/types，同时确保 moduleResolution 为 bundler 以正确解析 @pixi/3d/extras。",
  },
  {
    question: "View3D 可以和普通的 2D Sprite、Text 或粒子层混合排版吗？",
    answer:
      "可以。View3D 本身就是一个可加入 PixiJS 舞台（app.stage）的显示对象，你可以像管理普通 2D 精灵一样调整它的层级顺序，并配合 view3d.worldToScreen 在 3D 物体上方叠加 2D 血条、标签或 HUD 界面。",
  },
  {
    question: "支持哪些 3D 模型格式与材质类型？",
    answer:
      "支持标准 glTF 模型加载（含 Draco 几何压缩与 meshopt 网格优化），材质方面内置 PBR 基于物理渲染材质、经典 Phong 材质以及风格化 Toon 卡通材质。",
  },
  {
    question: "PixiJS 3D 采用什么开源协议？如何参与贡献或赞助？",
    answer:
      "PixiJS 3D 基于 MIT License 开源发布。你可以阅读仓库中的贡献指南提交 PR 或反馈问题，也可以通过 Open Collective 与 PixiJS Sponsors 页面赞助核心团队。",
  },
];

export const SETUP_COMMANDS = {
  bun: {
    create: "bun create pixi.js@latest",
    install: "bun add pixi.js @pixi/3d",
    types: "bun add -d @types/web",
  },
  npm: {
    create: "npm create pixi.js@latest",
    install: "npm install pixi.js @pixi/3d",
    types: "npm install --save-dev @types/web",
  },
  pnpm: {
    create: "pnpm create pixi.js@latest",
    install: "pnpm add pixi.js @pixi/3d",
    types: "pnpm add -D @types/web",
  },
} as const;
