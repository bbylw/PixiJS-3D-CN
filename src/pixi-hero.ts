import {
  CubeGeometry,
  DirectionalLight,
  type Geometry3D,
  IcosahedronGeometry,
  Material3D,
  Mesh3D,
  PhongMaterial,
  PlaneGeometry,
  SphereGeometry,
  TorusKnotGeometry,
  Vector3,
  View3D,
} from "@pixi/3d";
import { OrbitCamera, ToonMaterial } from "@pixi/3d/extras";
import { Application, Container, Graphics, Point, Text } from "pixi.js";

export type HeroGeometryKind = "cube" | "knot" | "icosahedron" | "sphere";
export type HeroMaterialKind = "pbr" | "phong" | "toon";

export interface HeroSceneController {
  setPlaying: (playing: boolean) => void;
  setColor: (hex: number) => void;
  setGeometry: (kind: HeroGeometryKind) => void;
  setMaterial: (kind: HeroMaterialKind) => void;
  setHudVisible: (visible: boolean) => void;
  resetCamera: () => void;
  destroy: () => void;
}

export interface HeroSceneCallbacks {
  onReady: (rendererLabel: string) => void;
  onError: (message: string) => void;
  onMeshTap: (count: number) => void;
}

function createGeometry(kind: HeroGeometryKind): Geometry3D {
  switch (kind) {
    case "knot":
      return new TorusKnotGeometry({
        radius: 0.72,
        tube: 0.24,
        tubularSegments: 120,
        radialSegments: 18,
      });
    case "icosahedron":
      return new IcosahedronGeometry({ radius: 0.96, detail: 1 });
    case "sphere":
      return new SphereGeometry({ radius: 0.92, widthSegments: 36, heightSegments: 24 });
    case "cube":
    default:
      return new CubeGeometry({ width: 1.35, height: 1.35, depth: 1.35 });
  }
}

function createMaterial(kind: HeroMaterialKind, color: number) {
  switch (kind) {
    case "phong":
      return new PhongMaterial({
        baseColor: color,
        shininess: 96,
        specularColor: 0xffffff,
      });
    case "toon":
      return new ToonMaterial({
        baseColor: color,
        bands: 3,
        specularSize: 0.2,
        rimIntensity: 0.5,
        rimPower: 3,
      });
    case "pbr":
    default:
      return new Material3D({
        baseColor: color,
        roughness: 0.3,
        metallic: 0.22,
      });
  }
}

export async function mountHeroPixi3D(
  container: HTMLElement,
  callbacks: HeroSceneCallbacks,
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
    const reason =
      err instanceof Error ? err.message : "当前浏览器环境无法初始化 WebGPU 或 WebGL2 上下文";
    callbacks.onError(reason);
    return null;
  }

  app.canvas.style.display = "block";
  app.canvas.style.width = "100%";
  app.canvas.style.height = "100%";
  app.canvas.setAttribute(
    "aria-label",
    "PixiJS 3D 实时交互演示画布，支持鼠标拖拽环绕观察和点击 3D 网格触发指针事件",
  );
  container.replaceChildren(app.canvas);

  const view3d = new View3D({
    autoResize: true,
    shadowQuality: "medium",
    toneMapping: "aces",
    environment: {
      skyColor: 0xc9d6ff,
      groundColor: 0x3a2f45,
      intensity: 0.72,
    },
  });

  app.stage.addChild(view3d);

  // Receiving ground plane for real-time directional shadows
  const floor = new Mesh3D({
    geometry: new PlaneGeometry({ width: 16, height: 16 }),
    material: new Material3D({
      baseColor: 0x1b1a14,
      roughness: 0.92,
      metallic: 0.04,
    }),
    position: { x: 0, y: -1.35, z: 0 },
    rotation: { x: -Math.PI / 2, y: 0, z: 0 },
    castShadow: false,
    receiveShadow: true,
  });

  let currentColor = 0xe72264;
  let currentGeomKind: HeroGeometryKind = "cube";
  let currentMatKind: HeroMaterialKind = "pbr";

  let activeGeometry = createGeometry(currentGeomKind);
  let activeMaterial = createMaterial(currentMatKind, currentColor);

  const heroMesh = new Mesh3D({
    geometry: activeGeometry,
    material: activeMaterial,
    position: { x: 0, y: 0.15, z: 0 },
    castShadow: true,
    receiveShadow: true,
    eventMode: "static",
    cursor: "pointer",
  });

  const sun = new DirectionalLight({
    color: 0xfff5e6,
    intensity: 3.4,
    castShadow: true,
  });
  sun.position.set(-3.2, 5.2, 3.0);
  sun.lookAt({ x: 0, y: 0, z: 0 });

  view3d.root.addChild(floor, heroMesh, sun);

  // OrbitCamera synced to app.ticker for crisp damping
  view3d.camera.position.set(0, 1.55, 4.4);
  const orbit = new OrbitCamera({
    view: view3d,
    target: { x: 0, y: 0.1, z: 0 },
    enableDamping: true,
    dampingFactor: 0.08,
    autoUpdate: false,
    minDistance: 2.3,
    maxDistance: 8.5,
    maxPolarAngle: Math.PI / 2 - 0.04,
  });
  orbit.saveState();

  // Real 2D PixiJS HUD tag pinned to 3D object via view3d.worldToScreen()
  const hudTag = new Container();
  const hudBg = new Graphics();
  const hudDot = new Graphics();
  const hudText = new Text({
    text: "2D 舞台锚点 · 点击网格试试",
    style: {
      fontFamily: "Manrope, Noto Sans SC, sans-serif",
      fontSize: 11,
      fontWeight: "600",
      fill: 0xf5f5f5,
    },
  });

  const padX = 10;
  const padY = 5;
  const pillW = hudText.width + padX * 2 + 12;
  const pillH = hudText.height + padY * 2;
  hudBg
    .roundRect(-pillW / 2, -pillH - 8, pillW, pillH, 8)
    .fill({ color: 0x181818, alpha: 0.88 })
    .stroke({ color: 0x313131, width: 1 });
  hudDot.circle(-pillW / 2 + 11, -pillH / 2 - 8, 3.5).fill(0xe72264);
  hudText.position.set(-pillW / 2 + 20, -pillH - 8 + padY);

  hudTag.addChild(hudBg, hudDot, hudText);
  app.stage.addChild(hudTag);

  let isPlaying = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let hudEnabled = true;
  let tapCount = 0;
  let bounceVelocity = 0;
  let bounceScale = 1;
  let elapsed = 0;

  // 3D pointer interaction on the mesh itself
  heroMesh.on("pointertap", () => {
    tapCount += 1;
    bounceVelocity = 0.07;
    bounceScale = 1.16;
    hudText.text = `3D 指针已触发 (${tapCount} 次)`;
    callbacks.onMeshTap(tapCount);
  });

  const anchorWorld = new Vector3(0, 1.32, 0);
  const screenPoint = new Point();

  const tick = (ticker: { deltaTime: number }) => {
    const dt = Math.min(ticker.deltaTime, 3);
    orbit.update(ticker as never);

    if (isPlaying) {
      elapsed += 0.025 * dt;
      heroMesh.rotation.y += 0.01 * dt;
      heroMesh.rotation.x += 0.0025 * dt;
      heroMesh.position.y = 0.15 + Math.sin(elapsed) * 0.07;
    }

    // Spring settle after 3D pointer tap
    if (Math.abs(bounceScale - 1) > 0.001 || Math.abs(bounceVelocity) > 0.0005) {
      const springForce = (1 - bounceScale) * 0.18;
      bounceVelocity = (bounceVelocity + springForce) * 0.78;
      bounceScale += bounceVelocity;
      heroMesh.scale.set(bounceScale);
    }

    if (hudEnabled) {
      anchorWorld.set(heroMesh.position.x, heroMesh.position.y + 1.18, heroMesh.position.z);
      const projected = view3d.worldToScreen(anchorWorld, screenPoint);
      hudTag.visible = projected !== null;
      if (projected) {
        hudTag.position.set(projected.x, projected.y);
      }
    } else {
      hudTag.visible = false;
    }
  };

  app.ticker.add(tick);

  const rendererName = app.renderer.name?.toLowerCase().includes("webgpu")
    ? "WebGPU 渲染器"
    : "WebGL2 渲染器";
  callbacks.onReady(rendererName);

  return {
    setPlaying(playing: boolean) {
      isPlaying = playing;
    },
    setColor(hex: number) {
      currentColor = hex;
      activeMaterial.baseColor = hex;
    },
    setGeometry(kind: HeroGeometryKind) {
      if (kind === currentGeomKind) return;
      currentGeomKind = kind;
      const oldGeom = activeGeometry;
      activeGeometry = createGeometry(kind);
      heroMesh.geometry = activeGeometry;
      oldGeom.destroy();
      bounceScale = 1.08;
    },
    setMaterial(kind: HeroMaterialKind) {
      if (kind === currentMatKind) return;
      currentMatKind = kind;
      const oldMat = activeMaterial;
      activeMaterial = createMaterial(kind, currentColor);
      heroMesh.material = activeMaterial;
      oldMat.destroy();
    },
    setHudVisible(visible: boolean) {
      hudEnabled = visible;
    },
    resetCamera() {
      orbit.reset();
      heroMesh.rotation.set(0, 0, 0);
      heroMesh.position.set(0, 0.15, 0);
      bounceScale = 1;
      bounceVelocity = 0;
      heroMesh.scale.set(1);
    },
    destroy() {
      app.ticker.remove(tick);
      orbit.destroy();
      app.destroy(true);
    },
  };
}
