// visualizer.js — Blueprint 3-D (MVP)
// Uses window.state from app.js (tank dims, equipment selection/counts).

(function(){
  // ---- Helpers -------------------------------------------------------------
  const inchesToUnits = (x)=> Number(x||0); // 1 unit = 1 inch
  const clamp = (n,a,b)=> Math.max(a, Math.min(b, n));

  function getState(){
    return (window && window.state) ? window.state : null;
  }

  // ---- Scene globals -------------------------------------------------------
  let renderer, scene, camera, controls, animId;
  let tankGroup, lightGroup, flowGroup, envGroup;
  let root, w=0, h=0;

  // ---- Builders ------------------------------------------------------------
  function buildTankBox(s){
    const L = inchesToUnits(s.tank.lengthIn || 24);
    const W = inchesToUnits(s.tank.widthIn  || 18);
    const H = inchesToUnits(s.tank.heightIn || 18);

    const group = new THREE.Group();

    // Tank wireframe
    const boxGeom = new THREE.BoxGeometry(L, H, W);
    const boxMat  = new THREE.MeshBasicMaterial({ color: 0x6ea8ff, wireframe: true, transparent: true, opacity: 0.6 });
    const box = new THREE.Mesh(boxGeom, boxMat);
    box.position.set(0, H/2, 0);
    group.add(box);

    // Sandbed
    const sandH = Math.min(2, H * 0.1);
    const sandGeom = new THREE.BoxGeometry(L-0.5, sandH, W-0.5);
    const sandMat  = new THREE.MeshLambertMaterial({ color: 0xd8c7a1 });
    const sand = new THREE.Mesh(sandGeom, sandMat);
    sand.position.set(0, sandH/2, 0);
    group.add(sand);

    // Water surface
    const waterY = H - 1;
    const waterGeom = new THREE.PlaneGeometry(L-0.5, W-0.5);
    const waterMat  = new THREE.MeshBasicMaterial({ color: 0x90c8ff, transparent: true, opacity: 0.15, side: THREE.DoubleSide });
    const water = new THREE.Mesh(waterGeom, waterMat);
    water.rotation.x = -Math.PI/2;
    water.position.set(0, waterY, 0);
    group.add(water);

    // Helpers
    const grid = new THREE.GridHelper(Math.max(L,W)+24, 16, 0x333333, 0x222222);
    grid.position.y = 0;
    group.add(grid);

// const axes = new THREE.AxesHelper(6);
// axes.position.set(-L/2 + 6, 0.1, -W/2 + 6);
// group.add(axes);

    return group;
  }

  function buildLightCones(s){
    const g = new THREE.Group();
    const lightId = s.equipment.lighting;
    const count   = s.equipment.lightCount || 0;
    if (!lightId || !count) return g;

    const L = inchesToUnits(s.tank.lengthIn || 24);
    const W = inchesToUnits(s.tank.widthIn  || 18);
    const H = inchesToUnits(s.tank.heightIn || 18);

    const spacing = L / (count + 1);
    const y = H + 4; // 4" above rim (placeholder)
    const coneColor = 0x4da3ff;

    for (let i=0;i<count;i++){
      const x = -L/2 + spacing*(i+1);
      const z = 0;
      const coneH = H + 6;
      const coneR = (W/2) * 0.9;

      // Wide at the bottom, narrow at the puck, hollow “light cone”
const geom = new THREE.CylinderGeometry(
  0.6,             // top radius (near puck, small)
  coneR,           // bottom radius (near sand, wide)
  coneH,           // height
  32,              // radial segments
  1,               // height segments
  true             // openEnded (no caps)
);
const mat  = new THREE.MeshBasicMaterial({
  color: coneColor,
  transparent: true,
  opacity: 0.12,
  side: THREE.DoubleSide
});
const cone = new THREE.Mesh(geom, mat);

// Place the cone so its TOP is at the puck and it extends downward
// CylinderGeometry is centered on Y, so move it down by half its height.
cone.position.set(x, y - (coneH / 2), z);

g.add(cone);

      const puckGeom = new THREE.CylinderGeometry(1.6, 1.6, 0.6, 24);
      const puckMat  = new THREE.MeshLambertMaterial({ color: 0x1f66ff });
      const puck = new THREE.Mesh(puckGeom, puckMat);
      puck.position.set(x, y, z);
      g.add(puck);
    }
    return g;
  }

  function buildFlowArrows(s){
    const g = new THREE.Group();

    const L = inchesToUnits(s.tank.lengthIn || 24);
    const W = inchesToUnits(s.tank.widthIn  || 18);
    const H = inchesToUnits(s.tank.heightIn || 18);

    // Powerheads
    const phCount = s.equipment.powerheadCount || 0;
    if (s.equipment.powerhead && phCount > 0){
      const y = H * 0.6;
      const margin = 1.0;
      for (let i=0;i<phCount;i++){
        const leftSide = (i % 2) === 0;
        const x = leftSide ? (-L/2 + margin) : (L/2 - margin);
        const z = 0;

        const dir = new THREE.Vector3(leftSide ? 1 : -1, 0, 0).normalize();
        const origin = new THREE.Vector3(x, y, z);
        const length = L * 0.35;
        const color = 0x00c2a8;
        const arrow = new THREE.ArrowHelper(dir, origin, length, color, 2.5, 1.5);
        g.add(arrow);

        const cubeGeom = new THREE.BoxGeometry(2, 2, 2);
        const cubeMat  = new THREE.MeshLambertMaterial({ color: 0x008f7a });
        const cube = new THREE.Mesh(cubeGeom, cubeMat);
        cube.position.set(x, y, z);
        g.add(cube);
      }
    }

    // Return nozzle (placeholder: back-center aiming forward)
    if (s.equipment.returnPump){
      const y = H * 0.9;
      const x = 0, z = -W/2 + 0.8;
      const dir = new THREE.Vector3(0, 0, 1).normalize();
      const origin = new THREE.Vector3(x, y, z);
      const length = W * 0.6;
      const color = 0x69db7c;

      const arrow = new THREE.ArrowHelper(dir, origin, length, color, 2.5, 1.5);
      g.add(arrow);

      const nozGeom = new THREE.CylinderGeometry(0.6, 0.6, 1.5, 18);
      const nozMat  = new THREE.MeshLambertMaterial({ color: 0x2f9e44 });
      const nozzle = new THREE.Mesh(nozGeom, nozMat);
      nozzle.rotation.x = Math.PI/2;
      nozzle.position.set(x, y, z);
      g.add(nozzle);
    }

    return g;
  }

  // ---- Lifecycle -----------------------------------------------------------
  function dispose(){
    if (animId) cancelAnimationFrame(animId);
    animId = null;

    if (renderer){
      renderer.dispose?.();
      if (root && renderer.domElement && root.contains(renderer.domElement)){
        root.removeChild(renderer.domElement);
      }
    }
    renderer = scene = camera = controls = null;
    tankGroup = lightGroup = flowGroup = envGroup = null;
    window.removeEventListener('resize', onResize);
  }

  function onResize(){
    if (!root || !camera || !renderer) return;
    const rect = root.getBoundingClientRect();
    w = Math.max(300, (rect.width | 0) || root.clientWidth || 600);
    h = Math.max(300, (rect.height | 0) || root.clientHeight || 520);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }

  function animate(){
    animId = requestAnimationFrame(animate);
    controls && controls.update();
    renderer && renderer.render(scene, camera);
  }

  function buildSceneFromState(s){
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b1220);

    const L = inchesToUnits(s.tank.lengthIn || 24);
    const W = inchesToUnits(s.tank.widthIn  || 18);
    const H = inchesToUnits(s.tank.heightIn || 18);
    const maxDim = Math.max(L, W, H);

    camera = new THREE.PerspectiveCamera(45, w/h, 0.1, 5000);
    camera.position.set(maxDim * 0.9, maxDim * 0.8, maxDim * 1.2);
    camera.lookAt(0, H * 0.5, 0);  // ensure initial framing is centered on the tank

    // Compute the front-view distance needed to fit tank height + length in frame
// -- helpers used by Front view --
function gallonsApprox(L, W, H){ return (L * W * H) / 231; }

function frontDistanceToFrame(L, W, H, camera, g){
  // Fit BOTH height (H) and length (L) based on FOV + aspect,
  // with size-aware padding and distance bumps for nanos/cubes.
  const vfov   = THREE.MathUtils.degToRad(camera.fov);
  const aspect = w / h;

  // Extra edge padding in inches (small tanks get more)
  const pad = (g <= 45) ? 8 : (g <= 70) ? 6 : 4;

  const halfH = (H + pad) / 2;
  const halfL = (L + pad) / 2;

  const distForHeight = halfH / Math.tan(vfov / 2);
  const distForWidth  = halfL / (Math.tan(vfov / 2) * aspect);

  // Base distance that fits both dimensions
  let dist = Math.max(distForHeight, distForWidth);

  // Size-based standoff to avoid "too close" look on small tanks
  const bump =
    (g <= 20) ? 1.80 :
    (g <= 32) ? 1.55 :
    (g <= 45) ? 1.40 :
    (g <= 70) ? 1.20 :
                1.15;
  dist *= bump;

  // Final clamp so nanos never feel cramped
  const minDist = Math.max(L, W, H) * ((g <= 45) ? 2.00 : (g <= 70) ? 1.50 : 1.25);
  return Math.max(dist, minDist);
}

    const amb = new THREE.AmbientLight(0xffffff, 0.55);
    scene.add(amb);
    const dir = new THREE.DirectionalLight(0xffffff, 0.75);
    dir.position.set(1, 2, 1);
    scene.add(dir);

    tankGroup  = buildTankBox(s);
    lightGroup = buildLightCones(s);
    flowGroup  = buildFlowArrows(s);
    envGroup   = new THREE.Group();

    scene.add(tankGroup, lightGroup, flowGroup, envGroup);

   // Support both legacy UMD and newer globals
const OC = (THREE.OrbitControls || window.OrbitControls);
if (!OC) {
  console.warn("OrbitControls not found — check that the controls script loaded before visualizer.js");
} else {
  controls = new OC(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.target.set(0, H * 0.5, 0);
  controls.update();
}

    // Toolbar wiring
    const showLights = document.getElementById('vizShowLights');
    const showFlow   = document.getElementById('vizShowFlow');
    if (showLights) showLights.addEventListener('change', ()=> { lightGroup.visible = !!showLights.checked; });
    if (showFlow)   showFlow.addEventListener('change', ()=> { flowGroup.visible  = !!showFlow.checked;   });

document.getElementById('vizViewTop')?.addEventListener('click', ()=>{
  camera.position.set(0, H * 3.0, 0);
  camera.up.set(0, 0, -1);
  camera.lookAt(0, H * 0.5, 0);
  if (controls) { controls.target.set(0, H * 0.5, 0); controls.update(); }
});

document.getElementById('vizViewFront')?.addEventListener('click', ()=>{
  // If you have frontDistanceToFrame(...) keep using it; otherwise keep your old dist value.
  const g = (s.tank && s.tank.gallons) ? s.tank.gallons : (L * W * H) / 231;
  const dist = (typeof frontDistanceToFrame === 'function')
    ? frontDistanceToFrame(L, W, H, camera, g)
    : Math.max(L, W, H) * 1.25; // fallback

  camera.position.set(0, H * 0.52, dist);
  camera.up.set(0, 1, 0);
  camera.lookAt(0, H * 0.5, 0);
  if (controls) { controls.target.set(0, H * 0.5, 0); controls.update(); }
});

document.getElementById('vizViewIso')?.addEventListener('click', ()=>{
  const d = Math.max(L, W, H) * 1.8;
  camera.position.set(-d, H * 0.9, d);
  camera.up.set(0, 1, 0);
  camera.lookAt(0, H * 0.5, 0);
  if (controls) { controls.target.set(0, H * 0.5, 0); controls.update(); }
});


    document.getElementById('vizScreenshot')?.addEventListener('click', ()=>{
      try {
        const dataURL = renderer.domElement.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = dataURL;
        a.download = 'reef-visualizer.png';
        a.click();
      } catch(e) {
        alert('Screenshot not supported in this browser.');
      }
    });
  }

  // ---- Public init ----------------------------------------------------------
  function initVisualizer(){
    const s = getState();
    root = document.getElementById('viz3d');
    if (!root) return;

    const safe = s || {
      tank: { lengthIn: 24, widthIn: 18, heightIn: 18 },
      equipment: { lighting: null, lightCount: 0, returnPump: null, powerhead: null, powerheadCount: 0 }
    };

    dispose();

    // Defer until Stage 5 has a real size
    requestAnimationFrame(() => {
      const rect = root.getBoundingClientRect();
      w = Math.max(300, (rect.width | 0) || root.clientWidth || 600);
      h = Math.max(300, (rect.height | 0) || root.clientHeight || 520);

      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, preserveDrawingBuffer: true });
      } catch (e) {
        console.error("WebGL renderer failed", e);
        root.innerHTML = '<div style="padding:12px;color:#f66">WebGL not available in this browser.</div>';
        return;
      }

      renderer.setPixelRatio(window.devicePixelRatio || 1);
renderer.setSize(w, h, false);
root.appendChild(renderer.domElement);

buildSceneFromState(safe);

// Recompute width/height now that the canvas is in the DOM
if (typeof onResize === 'function') onResize();

document.getElementById('vizViewIso')?.click(); // start in ¾ view
window.addEventListener('resize', onResize);
animate();
    }); // << end requestAnimationFrame callback
  }     // << end function initVisualizer()

  // Expose to app.js
  window.initVisualizer = initVisualizer;
  window.destroyVisualizer = dispose;
})();  // << end IIFE wrapper

