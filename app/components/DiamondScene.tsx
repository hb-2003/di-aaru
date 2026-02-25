"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

/* ── Spectral Fire Shader ──
   Luminance-masked chromatic dispersion that simulates wavelength-
   dependent refraction (fire). 8 spectral samples from red → violet
   are radially offset in screen-space; the effect is gated behind a
   brightness threshold so only refracted highlights get the rainbow
   treatment — dark areas stay clean. ── */
const SpectralFireShader = {
  uniforms: {
    tDiffuse: { value: null as THREE.Texture | null },
    uStrength: { value: 0.006 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uStrength;
    varying vec2 vUv;

    // Attempt to create a smooth visible spectrum: t=0 red → t=1 violet
    vec3 spectralWeight(float t) {
      float r = smoothstep(0.45, 0.0, t) + smoothstep(0.85, 1.0, t) * 0.4;
      float g = smoothstep(0.0, 0.35, t) * smoothstep(0.7, 0.35, t);
      float b = smoothstep(0.5, 0.85, t);
      return vec3(r, g, b);
    }

    void main() {
      vec2 center = vec2(0.5);
      vec2 dir = vUv - center;
      float dist = length(dir);

      vec4 base = texture2D(tDiffuse, vUv);
      float luma = dot(base.rgb, vec3(0.2126, 0.7152, 0.0722));

      // Fire mask — disperse bright refracted highlights
      float mask = smoothstep(0.25, 0.75, luma);

      if (mask < 0.01) {
        gl_FragColor = base;
        return;
      }

      // 8-sample spectral walk from red to violet
      const int N = 8;
      vec3 result = vec3(0.0);
      vec3 wSum   = vec3(0.0);

      for (int i = 0; i < N; i++) {
        float t = float(i) / float(N - 1);       // 0 → 1
        float offs = (t - 0.5) * 2.0;             // -1 → +1
        vec2 uv = vUv + dir * offs * uStrength;
        vec3 w  = spectralWeight(t);
        result += texture2D(tDiffuse, uv).rgb * w;
        wSum   += w;
      }

      result /= wSum;

      gl_FragColor = vec4(mix(base.rgb, result, mask), 1.0);
    }
  `,
};

/* ── Sparkle texture ── */
function createSparkleTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 32;
  c.height = 32;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(16, 16, 16 * 0.18, 16, 16, 16);
  g.addColorStop(0.0, "rgba(255,255,255,0.18)");
  g.addColorStop(0.15, "rgba(220,235,255,0.14)");
  g.addColorStop(0.3, "rgba(200,220,255,0.09)");
  g.addColorStop(0.5, "rgba(180,210,255,0.05)");
  g.addColorStop(0.75, "rgba(255,255,255,0.02)");
  g.addColorStop(1.0, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 32, 32);
  return new THREE.CanvasTexture(c);
}

/* ── Procedural Diamond-Studio HDRI ──
   Float32 equirectangular map that simulates a jewelry-photography
   lighting rig: overhead softbox, side accents, back rim, and dark
   surround for contrast — all at HDR intensities (> 1.0).
   PMREMGenerator converts this into a cubemap env-map that drives
   both reflections and transmitted refraction inside the diamond. ── */
function createDiamondStudioHDRI(
  width = 512,
  height = 256,
): THREE.DataTexture {
  const data = new Float32Array(width * height * 4);

  const smoothstep = (e0: number, e1: number, x: number) => {
    const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)));
    return t * t * (3 - 2 * t);
  };

  const softRect = (
    u: number,
    v: number,
    uMin: number,
    uMax: number,
    vMin: number,
    vMax: number,
    soft: number,
  ) =>
    smoothstep(uMin - soft, uMin + soft, u) *
    smoothstep(uMax + soft, uMax - soft, u) *
    smoothstep(vMin - soft, vMin + soft, v) *
    smoothstep(vMax + soft, vMax - soft, v);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const u = x / width;
      const v = y / height;

      // Dark base (jewelry dark-field)
      let r = 0.004,
        g = 0.004,
        b = 0.006;

      // 1 — Overhead softbox (moderate width, bright)
      const overhead = softRect(u, v, 0.35, 0.65, 0.02, 0.1, 0.025);
      r += overhead * 5.5;
      g += overhead * 5.3;
      b += overhead * 5.8;

      // 2 — Left accent strip (cool blue-white)
      const leftAccent = softRect(u, v, 0.68, 0.78, 0.2, 0.38, 0.015);
      r += leftAccent * 1.5;
      g += leftAccent * 1.8;
      b += leftAccent * 3.0;

      // 3 — Right accent strip (warm amber)
      const rightAccent = softRect(u, v, 0.22, 0.32, 0.2, 0.38, 0.015);
      r += rightAccent * 3.0;
      g += rightAccent * 2.0;
      b += rightAccent * 1.0;

      // 4 — Back rim highlight (creates edge sparkle)
      const rim = softRect(u, v, 0.44, 0.56, 0.12, 0.18, 0.01);
      r += rim * 4.0;
      g += rim * 4.0;
      b += rim * 4.5;

      // 5 — Fire spots (small, concentrated, colored)
      const fireL = softRect(u, v, 0.14, 0.19, 0.3, 0.36, 0.008);
      r += fireL * 3.5;
      g += fireL * 1.2;
      b += fireL * 0.5;

      const fireR = softRect(u, v, 0.81, 0.86, 0.3, 0.36, 0.008);
      r += fireR * 0.5;
      g += fireR * 1.5;
      b += fireR * 4.0;

      // 6 — Bottom fill (prevents pure-black underside)
      const bottomFill = softRect(u, v, 0.15, 0.85, 0.85, 0.95, 0.04);
      r += bottomFill * 0.15;
      g += bottomFill * 0.15;
      b += bottomFill * 0.18;

      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
      data[i + 3] = 1.0;
    }
  }

  const tex = new THREE.DataTexture(
    data,
    width,
    height,
    THREE.RGBAFormat,
    THREE.FloatType,
  );
  tex.mapping = THREE.EquirectangularReflectionMapping;
  tex.needsUpdate = true;
  return tex;
}

/* ══════════════════════════════════════════════════════════
   Round Brilliant Cut Diamond — 57-facet geometry
   GIA Excellent proportions:
     Table 55% · Crown 34.5° · Pavilion 40.75° · Depth ~61%
   ══════════════════════════════════════════════════════════ */
function createBrilliantCut58(scale: number = 1.5): THREE.BufferGeometry {
  const gR = 1.0;
  const tR = 0.55 * gR;
  const crownA = (34.5 * Math.PI) / 180;
  const pavA = (40.75 * Math.PI) / 180;
  const crownH = Math.tan(crownA) * (gR - tR);
  const gThick = 0.04;
  const pavD = Math.tan(pavA) * gR;

  const tY = crownH + gThick / 2;
  const gtY = gThick / 2;
  const gbY = -gThick / 2;
  const cY = -(pavD + gThick / 2);

  // Star tips — 50% star-facet length
  const sR = tR + 0.5 * (gR - tR);
  const sY = tY - 0.5 * (tY - gtY);

  // Lower-pavilion junction — 77% lower-half length
  const lpFrac = 0.23;
  const lpR = gR * (1 - lpFrac);
  const lpY = gbY - lpFrac * pavD;

  const N = 8;
  type V3 = [number, number, number];
  const vtx = (a: number, r: number, y: number): V3 => [
    r * Math.cos(a),
    y,
    r * Math.sin(a),
  ];

  const mainA = Array.from({ length: N }, (_, i) => (i * 2 * Math.PI) / N);
  const intA = Array.from(
    { length: N },
    (_, i) => ((i + 0.5) * 2 * Math.PI) / N,
  );

  const T = mainA.map((a) => vtx(a, tR, tY));
  const S = intA.map((a) => vtx(a, sR, sY));
  const GTm = mainA.map((a) => vtx(a, gR, gtY));
  const GTi = intA.map((a) => vtx(a, gR, gtY));
  const GBm = mainA.map((a) => vtx(a, gR, gbY));
  const GBi = intA.map((a) => vtx(a, gR, gbY));
  const LP = mainA.map((a) => vtx(a, lpR, lpY));
  const C: V3 = [0, cY, 0];

  const centY = (tY + cY) / 2;
  const pos: number[] = [];
  const nrm: number[] = [];

  function addFacet(verts: V3[]) {
    const a = new THREE.Vector3(...verts[0]);
    const b = new THREE.Vector3(...verts[1]);
    const c = new THREE.Vector3(...verts[2]);
    const n = new THREE.Vector3()
      .crossVectors(
        new THREE.Vector3().subVectors(b, a),
        new THREE.Vector3().subVectors(c, a),
      )
      .normalize();
    if (n.lengthSq() < 1e-10) return;

    const ct = new THREE.Vector3(0, 0, 0);
    for (const v of verts) ct.add(new THREE.Vector3(...v));
    ct.divideScalar(verts.length);
    if (new THREE.Vector3(ct.x, ct.y - centY, ct.z).dot(n) < 0) n.negate();

    for (let i = 1; i < verts.length - 1; i++) {
      pos.push(...verts[0], ...verts[i], ...verts[i + 1]);
      nrm.push(n.x, n.y, n.z, n.x, n.y, n.z, n.x, n.y, n.z);
    }
  }

  /* ── Crown (33 facets) ── */
  addFacet([T[0], T[1], T[2], T[3], T[4], T[5], T[6], T[7]]);

  for (let i = 0; i < N; i++) {
    const ni = (i + 1) % N;
    const pi = (i - 1 + N) % N;
    addFacet([T[i], T[ni], S[i]]);
    addFacet([T[i], S[i], GTm[i], S[pi]]);
    addFacet([S[i], GTm[i], GTi[i]]);
    addFacet([S[i], GTi[i], GTm[ni]]);
  }

  /* ── Girdle band (16 quads) ── */
  const gTopAll: V3[] = [];
  const gBotAll: V3[] = [];
  for (let i = 0; i < N; i++) {
    gTopAll.push(GTm[i], GTi[i]);
    gBotAll.push(GBm[i], GBi[i]);
  }
  for (let j = 0; j < 2 * N; j++) {
    const nj = (j + 1) % (2 * N);
    addFacet([gTopAll[j], gTopAll[nj], gBotAll[nj], gBotAll[j]]);
  }

  /* ── Pavilion (24 facets) ── */
  for (let i = 0; i < N; i++) {
    const ni = (i + 1) % N;
    const pi = (i - 1 + N) % N;
    addFacet([GBi[i], LP[i], C, LP[ni]]);
    addFacet([LP[i], GBi[pi], GBm[i]]);
    addFacet([LP[i], GBm[i], GBi[i]]);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute("normal", new THREE.Float32BufferAttribute(nrm, 3));
  geo.scale(scale, scale, scale);
  return geo;
}

/* ══════════════════════════════════════════
   Main Scene Component
   ══════════════════════════════════════════ */
export default function DiamondScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let w = container.clientWidth;
    let h = container.clientHeight;

    /* ── Scene ── */
    const scene = new THREE.Scene();

    const bgCanvas = document.createElement("canvas");
    bgCanvas.width = 2;
    bgCanvas.height = 512;
    const bgCtx = bgCanvas.getContext("2d")!;
    const bgGrad = bgCtx.createLinearGradient(0, 0, 0, 512);
    bgGrad.addColorStop(0, "#0c0c12");
    bgGrad.addColorStop(0.35, "#0a0a0e");
    bgGrad.addColorStop(0.7, "#08080c");
    bgGrad.addColorStop(1, "#050508");
    bgCtx.fillStyle = bgGrad;
    bgCtx.fillRect(0, 0, 2, 512);
    scene.background = new THREE.CanvasTexture(bgCanvas);

    /* ── Camera ── */
    const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100);
    camera.position.set(0, 0.8, 6);

    /* ── Renderer ── */
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.8;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    /* ── HDRI Studio Environment (sole light source) ── */
    const studioHDRI = createDiamondStudioHDRI();
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const envTexture =
      pmremGenerator.fromEquirectangular(studioHDRI).texture;
    studioHDRI.dispose();
    scene.environment = envTexture;

    /* ── Single accent sparkle light (very subtle) ── */
    const accentLight = new THREE.PointLight(0xffeedd, 3, 20);
    accentLight.position.set(2, 4, 4);
    scene.add(accentLight);

    /* ── Brilliant-Cut Diamond ── */
    const diamondGroup = new THREE.Group();
    scene.add(diamondGroup);

    const diamondGeometry = createBrilliantCut58(1.5);

    const diamondMaterial = new THREE.MeshPhysicalMaterial({
      transmission: 0.92,
      roughness: 0,
      metalness: 0,
      thickness: 1.8,
      ior: 2.417,
      reflectivity: 0.8,
      clearcoat: 0.5,
      clearcoatRoughness: 0,
      envMapIntensity: 1.0,
      transparent: true,
      opacity: 1,
      color: new THREE.Color(0xffffff),
      side: THREE.DoubleSide,
      specularIntensity: 0.8,
      specularColor: new THREE.Color(0xffffff),
      attenuationDistance: 0.4,
      attenuationColor: new THREE.Color(0xe8eeff),
      dispersion: 0.3,
    });

    const diamondMesh = new THREE.Mesh(diamondGeometry, diamondMaterial);
    diamondMesh.castShadow = true;
    diamondMesh.receiveShadow = true;
    diamondGroup.add(diamondMesh);

    /* ── Sparkle Particles ── */
    const SPARK_COUNT = 80;
    const sparkPos = new Float32Array(SPARK_COUNT * 3);
    const sparkVel: THREE.Vector3[] = [];
    const sparkLife: number[] = [];

    for (let i = 0; i < SPARK_COUNT; i++) {
      sparkPos[i * 3 + 1] = -50;
      sparkVel.push(new THREE.Vector3());
      sparkLife.push(0);
    }

    const sparkGeom = new THREE.BufferGeometry();
    sparkGeom.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(sparkPos, 3),
    );

    const sparkTex = createSparkleTexture();
    const sparkMat = new THREE.PointsMaterial({
      size: 0.06,
      map: sparkTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.8,
      color: 0xffeedd,
    });

    const sparkPoints = new THREE.Points(sparkGeom, sparkMat);
    scene.add(sparkPoints);

    let nextSpark = 0;
    function emitSparks(pos: THREE.Vector3, count = 3) {
      for (let i = 0; i < count; i++) {
        const idx = nextSpark;
        nextSpark = (nextSpark + 1) % SPARK_COUNT;
        sparkPos[idx * 3] = pos.x + (Math.random() - 0.5) * 0.12;
        sparkPos[idx * 3 + 1] = pos.y + (Math.random() - 0.5) * 0.12;
        sparkPos[idx * 3 + 2] = pos.z + (Math.random() - 0.5) * 0.12;
        sparkVel[idx].set(
          (Math.random() - 0.5) * 0.025,
          (Math.random() - 0.5) * 0.025 + 0.006,
          (Math.random() - 0.5) * 0.025,
        );
        sparkLife[idx] = 1.0;
      }
    }

    /* ── Raycaster ── */
    const raycaster = new THREE.Raycaster();
    const mouseNDC = new THREE.Vector2(0, 0);

    function onPointerMove(e: PointerEvent) {
      const rect = container!.getBoundingClientRect();
      mouseNDC.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseNDC.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    }
    container.addEventListener("pointermove", onPointerMove);

    /* ── OrbitControls ── */
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableRotate = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.4;
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.rotateSpeed = 0.5;
    controls.minPolarAngle = Math.PI * 0.15;
    controls.maxPolarAngle = Math.PI * 0.85;
    controls.target.set(0, -0.2, 0);

    /* ── Post Processing ── */
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(w, h),
      0.2,
      0.3,
      0.88,
    );
    composer.addPass(bloomPass);

    const firePass = new ShaderPass(SpectralFireShader);
    composer.addPass(firePass);

    composer.addPass(new OutputPass());

    /* ── Animation ── */
    let prevTime = 0;
    let frameId = 0;

    diamondGroup.scale.setScalar(0.4);
    diamondMaterial.opacity = 0;

    function animate() {
      frameId = requestAnimationFrame(animate);

      const now = performance.now() * 0.001;
      const delta = Math.min(now - prevTime, 0.05);
      prevTime = now;

      const entranceT = Math.min(now / 2.5, 1);
      const ease = 1 - Math.pow(1 - entranceT, 4);

      if (entranceT < 1) {
        diamondGroup.scale.setScalar(0.4 + ease * 0.6);
        diamondMaterial.opacity = ease;
      }

      diamondGroup.position.y = Math.sin(now * 0.6) * 0.1;

      if (entranceT >= 1) {
        const pulse = 1 + Math.sin(now * 1.0) * 0.01;
        diamondGroup.scale.setScalar(pulse);
      }

      raycaster.setFromCamera(mouseNDC, camera);
      const hits = raycaster.intersectObject(diamondMesh);
      if (hits.length > 0 && Math.random() > 0.65) {
        emitSparks(hits[0].point, 2);
      }

      const posAttr = sparkGeom.getAttribute(
        "position",
      ) as THREE.BufferAttribute;
      for (let i = 0; i < SPARK_COUNT; i++) {
        if (sparkLife[i] > 0) {
          sparkLife[i] -= delta * 0.7;
          sparkPos[i * 3] += sparkVel[i].x;
          sparkPos[i * 3 + 1] += sparkVel[i].y;
          sparkPos[i * 3 + 2] += sparkVel[i].z;
          sparkVel[i].multiplyScalar(0.98);
        } else {
          sparkPos[i * 3 + 1] = -50;
        }
      }
      posAttr.needsUpdate = true;

      /* Subtle HDRI accent pulse */
      accentLight.intensity = 3 + Math.sin(now * 0.4) * 0.8;

      controls.update();
      composer.render();
    }

    prevTime = performance.now() * 0.001;
    animate();

    /* ── Resize ── */
    function onResize() {
      w = container!.clientWidth;
      h = container!.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composer.setSize(w, h);
      bloomPass.resolution.set(w, h);
    }
    window.addEventListener("resize", onResize);

    /* ── Cleanup ── */
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", onResize);
      container.removeEventListener("pointermove", onPointerMove);
      controls.dispose();
      renderer.dispose();
      composer.dispose();
      pmremGenerator.dispose();
      envTexture.dispose();
      sparkTex.dispose();
      diamondGeometry.dispose();
      diamondMaterial.dispose();
      sparkGeom.dispose();
      sparkMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
    />
  );
}
