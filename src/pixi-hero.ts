import { CubeGeometry, DirectionalLight, Material3D, Mesh3D, View3D } from "@pixi/3d";
import { OrbitCamera } from "@pixi/3d/extras";
import { Application } from "pixi.js";

export interface HeroSceneController {
  setPlaying: (playing: boolean) => void;
  setColor: (hex: number) => void;
  resetCamera: () => void;
  destroy: () => void;
}

export async function mountHeroPixi3D(
  container: HTMLElement,
  onReady: (rendererLabel: string) => void,
  onError: (message: string) => void,
): Promise<HeroSceneController | null> {
  const app = new Application();

  try {
    await app.init({
      preference: "webgpu",
      background: "#131209",
      resizeTo: container,
      antialias: true,
      autoDensity: true,
      resolution: Math.min(window.devicePixelRatio || 1, 2),
    });
  } catch (err) {
    const reason = err instanceof Error ? err.message : "当前浏览器环境无法初始化 WebGPU 或 WebGL2 上下文";
    onError(reason);
    return null;
  }

  app.canvas.style.display = "block";
  app.canvas.style.width = "100%";
  app.canvas.style.height = "100%";
  app.canvas.setAttribute("aria-label", "PixiJS 3D 实时交互立方体演示画布，支持鼠标拖拽旋转视角");
  container.replaceChildren(app.canvas);

  const view3d = new View3D({
    autoResize: true,
    environment: {
      skyColor: 0xc9d6ff,
      groundColor: 0x3a2f45,
    },
  });

  app.stage.addChild(view3d);

  const material = new Material3D({ baseColor: 0xe72264, roughness: 0.35, metallic: 0.15 });
  const cube = new Mesh3D({
    geometry: new CubeGeometry(),
    material,
  });

  const sun = new DirectionalLight({ intensity: 3.2 });
  sun.position.set(-3, 5, 2);

  view3d.root.addChild(cube, sun);
  sun.lookAt(cube.position);

  view3d.camera.position.set(0, 1.5, 4);
  new OrbitCamera({ view: view3d });

  let isPlaying = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const tick = (time: { deltaTime: number }) => {
    if (!isPlaying) return;
    cube.rotation.y += 0.01 * time.deltaTime;
    cube.rotation.x += 0.003 * time.deltaTime;
  };

  app.ticker.add(tick);

  // Detect active renderer name safely
  const rendererName = app.renderer.name?.toLowerCase().includes("webgpu") ? "WebGPU 渲染器" : "WebGL2 渲染器";
  onReady(rendererName);

  return {
    setPlaying(playing: boolean) {
      isPlaying = playing;
    },
    setColor(hex: number) {
      material.baseColor = hex;
    },
    resetCamera() {
      view3d.camera.position.set(0, 1.5, 4);
      view3d.camera.lookAt(cube.position);
      cube.rotation.set(0, 0, 0);
    },
    destroy() {
      app.ticker.remove(tick);
      app.destroy(true);
    },
  };
}

