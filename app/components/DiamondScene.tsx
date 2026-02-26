"use client";

import { useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

export interface DiamondHandle {
  getGroup: () => THREE.Group;
}

/* ── Sparkle texture ── */
function createSparkleTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 64;
  c.height = 64;
  const ctx = c.getContext("2d")!;
  const cx = 32;
  const cy = 32;

  // Center soft glow
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 32);
  g.addColorStop(0, "rgba(255, 255, 255, 0.8)");
  g.addColorStop(0.2, "rgba(255, 245, 220, 0.3)");
  g.addColorStop(0.5, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);

  // Sharp glint lines (cross)
  ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
  ctx.lineWidth = 1;

  // Horizontal
  ctx.beginPath();
  ctx.moveTo(cx - 24, cy);
  ctx.lineTo(cx + 24, cy);
  ctx.stroke();

  // Vertical
  ctx.beginPath();
  ctx.moveTo(cx, cy - 24);
  ctx.lineTo(cx, cy + 24);
  ctx.stroke();

  // Diagonal (shorter)
  ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
  ctx.beginPath();
  ctx.moveTo(cx - 12, cy - 12);
  ctx.lineTo(cx + 12, cy + 12);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + 12, cy - 12);
  ctx.lineTo(cx - 12, cy + 12);
  ctx.stroke();

  return new THREE.CanvasTexture(c);
}

/* ── Procedural Diamond-Studio HDRI ──
   Float32 equirectangular map that simulates a jewelry-photography
   lighting rig: overhead softbox, side accents, back rim, and dark
   surround for contrast — all at HDR intensities (> 1.0).
   PMREMGenerator converts this into a cubemap env-map that drives
   both reflections and transmitted refraction inside the diamond. ── */
function createDiamondStudioHDRI(
  width = 1024,
  height = 512,
): THREE.DataTexture {
  const data = new Float32Array(width * height * 4);

  const smoothstep = (e0: number, e1: number, x: number) => {
    const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)));
    return t * t * (3 - 2 * t);
  };

  const softRect = (
    u: number, v: number,
    uMin: number, uMax: number,
    vMin: number, vMax: number,
    soft: number,
  ) =>
    smoothstep(uMin - soft, uMin + soft, u) *
    smoothstep(uMax + soft, uMax - soft, u) *
    smoothstep(vMin - soft, vMin + soft, v) *
    smoothstep(vMax + soft, vMax - soft, v);

  // Sharp circular hotspot
  const hotspot = (u: number, v: number, cu: number, cv: number, radius: number, soft: number) => {
    const du = Math.min(Math.abs(u - cu), 1 - Math.abs(u - cu)); // wrap in U
    const dv = v - cv;
    const dist = Math.sqrt(du * du + dv * dv);
    return smoothstep(radius + soft, radius - soft, dist);
  };

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const u = x / width;
      const v = y / height;

      // ── Very dark base — jewelry dark-field look ──
      let r = 0.001, g = 0.001, b = 0.002;

      // ── 1. Dominant overhead softbox (v=0 is top) ──
      // Large, very bright, slightly cool white
      const top = softRect(u, v, 0.1, 0.9, 0.0, 0.15, 0.08);
      r += top * 12.0;
      g += top * 12.0;
      b += top * 14.0;

      // ── 2. Tight overhead hotspot — primary specular source ──
      const topHot = hotspot(u, v, 0.5, 0.05, 0.06, 0.02);
      r += topHot * 18.0;
      g += topHot * 18.0;
      b += topHot * 20.0;

      // ── 3. Back rim lights — strong, narrow, blue-white ──
      // These wrap around the back creating the "halo" inside the diamond
      const rimL = softRect(u, v, 0.0, 0.05, 0.1, 0.9, 0.03);
      const rimR = softRect(u, v, 0.95, 1.0, 0.1, 0.9, 0.03);
      r += (rimL + rimR) * 10.0;
      g += (rimL + rimR) * 10.0;
      b += (rimL + rimR) * 13.0;

      // ── 4. Side accent panels — warm vs cool for chromatic contrast ──
      // Left: warm golden
      const sideWarm = softRect(u, v, 0.68, 0.82, 0.2, 0.75, 0.06);
      r += sideWarm * 8.0;
      g += sideWarm * 6.0;
      b += sideWarm * 2.0;

      // Right: cool blue
      const sideCool = softRect(u, v, 0.18, 0.32, 0.2, 0.75, 0.06);
      r += sideCool * 2.0;
      g += sideCool * 5.0;
      b += sideCool * 10.0;

      // ── 5. Chromatic fire panels — pure R, G, B for dispersion ──
      // These are what give diamonds their "fire" (spectral colors)
      const fireR = hotspot(u, v, 0.15, 0.38, 0.025, 0.008);
      r += fireR * 10.0;

      const fireG = hotspot(u, v, 0.35, 0.55, 0.02, 0.008);
      g += fireG * 8.0;

      const fireB1 = hotspot(u, v, 0.62, 0.42, 0.02, 0.008);
      b += fireB1 * 20.0;

      const fireB2 = hotspot(u, v, 0.82, 0.35, 0.025, 0.008);
      b += fireB2 * 16.0;
      r += fireB2 * 4.0; // slight violet

      const fireO = hotspot(u, v, 0.25, 0.48, 0.018, 0.006); // orange
      r += fireO * 14.0;
      g += fireO * 6.0;

      const firePurple = hotspot(u, v, 0.72, 0.52, 0.018, 0.006);
      r += firePurple * 10.0;
      b += firePurple * 14.0;

      // ── 6. Ultra-sharp sparkle points — tiny but EXTREMELY bright ──
      // These cause the "glint" flashes as diamond rotates
      const sparkle = (cu: number, cv: number, intensity: number) => {
        const h = hotspot(u, v, cu, cv, 0.008, 0.003);
        r += h * intensity;
        g += h * intensity;
        b += h * intensity * 1.1;
      };
      sparkle(0.48, 0.28, 30.0);
      sparkle(0.51, 0.35, 22.0);
      sparkle(0.38, 0.22, 18.0);
      sparkle(0.63, 0.31, 20.0);
      sparkle(0.44, 0.45, 16.0);
      sparkle(0.56, 0.19, 25.0);
      sparkle(0.29, 0.38, 15.0);
      sparkle(0.71, 0.42, 18.0);

      // ── 7. Equator fill band — keeps pavilion facets visible ──
      const equator = softRect(u, v, 0.0, 1.0, 0.42, 0.58, 0.06);
      r += equator * 0.4;
      g += equator * 0.4;
      b += equator * 0.5;

      // ── 8. Ground bounce — very subtle warm floor reflection ──
      const floor = softRect(u, v, 0.15, 0.85, 0.88, 1.0, 0.06);
      r += floor * 0.6;
      g += floor * 0.5;
      b += floor * 0.3;

      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
      data[i + 3] = 1.0;
    }
  }

  const tex = new THREE.DataTexture(
    data, width, height,
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
const DiamondScene = forwardRef<DiamondHandle, {}>((props, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationGroupRef = useRef<THREE.Group>(new THREE.Group());

  useImperativeHandle(ref, () => ({
    getGroup: () => animationGroupRef.current,
  }));

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let w = container.clientWidth;
    let h = container.clientHeight;

    /* ── Scene ── */
    const scene = new THREE.Scene();
    // Background is transparent to blend with CSS background
    scene.background = null;

    /* ── Camera ── */
    const camera = new THREE.PerspectiveCamera(30, w / h, 0.1, 100);
    camera.position.set(0, 0.8, 6);

    /* ── Responsive breakpoints ── */
    let baseScale = 1;
    let baseY = 0;

    function applyResponsive() {
      const isLandscapeMobile = w < 768 && h < 450;

      if (isLandscapeMobile) {
        camera.fov = 48;
        camera.position.z = 5.2;
        baseScale = 0.6;
        baseY = -0.05;
      } else if (w < 768) {
        // Mobile (matches (max-width: 767px))
        camera.fov = 42;
        camera.position.z = 4.8;
        baseScale = 0.7;
        baseY = -0.16;
      } else if (w < 1024) {
        // Tablet (matches (min-width: 768px) and (max-width: 1023px))
        camera.fov = 36;
        camera.position.z = 6;
        baseScale = 0.85;
        baseY = 0.1;
      } else {
        // Desktop (matches (min-width: 1024px))
        camera.fov = 30;
        camera.position.z = 6;
        baseScale = 1;
        baseY = 0;
      }
      camera.updateProjectionMatrix();
    }
    applyResponsive();

    /* ── Renderer ── */
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true, // Allow transparency
      powerPreference: "high-performance",
    });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); // Transparent base
    renderer.toneMapping = THREE.AgXToneMapping; // More cinematic tone mapping
    renderer.toneMappingExposure = 1.0;
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
    scene.environmentIntensity = 0.02; // Deeper shadows for Noir aesthetic

    /* ── Studio Lighting Rig (Focused on Facets) ── */
    // Main sharp glint source
    const topLight = new THREE.DirectionalLight(0xffffff, 5.0);
    topLight.position.set(5, 15, 10);
    scene.add(topLight);

    // Rim light to define the sharp edges (cuts)
    const backLight = new THREE.DirectionalLight(0xffffff, 8);
    backLight.position.set(-10, 5, -15);
    scene.add(backLight);

    // Sharp pinpoint light that follows the mouse to catch facet edges
    const mouseLight = new THREE.PointLight(0xffffff, 0, 20);
    scene.add(mouseLight);

    /* ── Brilliant-Cut Diamond ── */
    const diamondGroup = animationGroupRef.current;
    scene.add(diamondGroup);

    const innerDiamondGroup = new THREE.Group();
    diamondGroup.add(innerDiamondGroup);

    const diamondGeometry = createBrilliantCut58(1.5);

    const diamondMaterial = new THREE.MeshPhysicalMaterial({
      transmission: 1.0,
      thickness: 1.5,
      roughness: 0.0,
      metalness: 0,
      ior: 2.417,
      dispersion: 25.0, // Dramatically increased fire for the luxury feel
      reflectivity: 1.0,
      transparent: true,
      opacity: 0,
      color: new THREE.Color(0xffffff),
      side: THREE.DoubleSide,
      clearcoat: 1.0,
      clearcoatRoughness: 0.0,
      envMapIntensity: 2.0, // High environment pop
      specularIntensity: 5.0, // Sharpest highlights
      specularColor: new THREE.Color(0xffffff),
    });

    const diamondMesh = new THREE.Mesh(diamondGeometry, diamondMaterial);
    diamondMesh.castShadow = true;
    diamondMesh.receiveShadow = true;
    innerDiamondGroup.add(diamondMesh);

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
    const mouseNDC = new THREE.Vector2(-10, -10); // Start off-screen

    function onPointerMove(e: PointerEvent) {
      // Use window coordinates since the container might have pointer-events-none
      const rect = container!.getBoundingClientRect();
      mouseNDC.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseNDC.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    }
    window.addEventListener("pointermove", onPointerMove);

    /* ── OrbitControls ── */
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    // Disable rotate if it interferes with scrollytelling, or keep for subtle interaction
    controls.enableRotate = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 0, 0);

    /* ── Post Processing ── */
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(w, h),
      0.8,  // Higher strength for luxury glints
      0.96, // Extremely tight threshold for only the sharpest glints
      0.4   // Smaller radius for crisp rays
    );
    composer.addPass(bloomPass);

    composer.addPass(new OutputPass());

    /* ── Animation ── */
    let startTime = performance.now() * 0.001;
    let prevTime = startTime;
    let frameId = 0;

    innerDiamondGroup.scale.setScalar(0);
    diamondMaterial.opacity = 0;

    function animate() {
      frameId = requestAnimationFrame(animate);

      const now = performance.now() * 0.001;
      const delta = Math.min(now - prevTime, 0.05);
      const elapsed = now - startTime;
      prevTime = now;

      // Entrance animation (start after a short delay to sync with loader exit)
      const entranceDelay = 0.8;
      const entranceDuration = 2.5;
      const entranceT = Math.max(0, Math.min((elapsed - entranceDelay) / entranceDuration, 1));
      const ease = 1 - Math.pow(1 - entranceT, 5); // Quintic ease out for even smoother entry

      if (entranceT > 0 && entranceT <= 1) {
        innerDiamondGroup.scale.setScalar(baseScale * (0.1 + ease * 0.9));
        diamondMaterial.opacity = ease;
      } else if (entranceT > 1) {
        // More subtle idle float/pulse
        const pulse = baseScale * (1 + Math.sin(now * 0.6) * 0.01);
        innerDiamondGroup.scale.setScalar(pulse);
        diamondMaterial.opacity = 1;
      }

      // Deeper idle floating
      innerDiamondGroup.position.y = baseY + Math.sin(now * 0.4) * 0.1;

      // Mouse light interaction
      const targetPos = new THREE.Vector3(mouseNDC.x * 5, mouseNDC.y * 5, 4);
      mouseLight.position.lerp(targetPos, 0.08);

      // Spark interaction
      raycaster.setFromCamera(mouseNDC, camera);
      const hits = raycaster.intersectObject(diamondMesh);
      if (hits.length > 0) {
        mouseLight.intensity = 50 + Math.sin(now * 12) * 20;
        if (Math.random() > 0.7) emitSparks(hits[0].point, 1);
      } else {
        mouseLight.intensity = 1 + Math.sin(now * 1.5) * 1.0;
      }

      // Update particles
      const posAttr = sparkGeom.getAttribute("position") as THREE.BufferAttribute;
      for (let i = 0; i < SPARK_COUNT; i++) {
        if (sparkLife[i] > 0) {
          sparkLife[i] -= delta * 0.8;
          sparkPos[i * 3] += sparkVel[i].x;
          sparkPos[i * 3 + 1] += sparkVel[i].y;
          sparkPos[i * 3 + 2] += sparkVel[i].z;
          sparkVel[i].multiplyScalar(0.97);
        } else {
          sparkPos[i * 3 + 1] = -100; // Far away
        }
      }
      posAttr.needsUpdate = true;

      controls.update();
      composer.render();
    }

    startTime = performance.now() * 0.001;
    prevTime = startTime;
    animate();

    /* ── Resize ── */
    function onResize() {
      w = container!.clientWidth;
      h = container!.clientHeight;
      camera.aspect = w / h;
      applyResponsive();
      renderer.setSize(w, h);
      composer.setSize(w, h);
      bloomPass.resolution.set(w, h);
    }
    window.addEventListener("resize", onResize);

    /* ── Cleanup ── */
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
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
});

export default DiamondScene;
