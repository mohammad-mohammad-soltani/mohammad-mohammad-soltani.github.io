/* Three.js background — phosphor particle field + wireframe icosahedron,
   tuned for the light theme. Falls back silently when reduced-motion is on. */
import * as THREE from 'three';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canvas = document.getElementById('particles');

if (canvas && !reduceMotion && window.WebGLRenderingContext) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 14;

  const GREEN = 0x00a838;

  /* ---- floating particle field ---- */
  const COUNT = window.innerWidth < 768 ? 260 : 520;
  const positions = new Float32Array(COUNT * 3);
  const seeds = [];
  for (let i = 0; i < COUNT; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 36;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 22;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 18 - 2;
    seeds.push({
      speed: 0.15 + Math.random() * 0.4,
      phase: Math.random() * Math.PI * 2
    });
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const points = new THREE.Points(pGeo, new THREE.PointsMaterial({
    color: GREEN,
    size: 0.14,
    transparent: true,
    opacity: 0.85,
    sizeAttenuation: true
  }));
  scene.add(points);

  /* ---- wireframe polyhedra drifting in depth ---- */
  const group = new THREE.Group();
  scene.add(group);

  const shapes = [
    { geo: new THREE.IcosahedronGeometry(3.6, 1), pos: [7.5, 1.6, -5], rot: 0.0016 },
    { geo: new THREE.TorusKnotGeometry(2.1, 0.55, 100, 12), pos: [-7.8, -2.2, -7], rot: -0.0018 },
    { geo: new THREE.OctahedronGeometry(2.8, 0), pos: [2.5, -4.6, -10], rot: 0.002 }
  ];
  for (const s of shapes) {
    const mesh = new THREE.LineSegments(
      new THREE.WireframeGeometry(s.geo),
      new THREE.LineBasicMaterial({ color: GREEN, transparent: true, opacity: 0.34 })
    );
    mesh.position.set(...s.pos);
    mesh.userData.rotSpeed = s.rot;
    group.add(mesh);
  }

  /* hero shape near camera */
  const heroShape = new THREE.LineSegments(
    new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(3, 0)),
    new THREE.LineBasicMaterial({ color: GREEN, transparent: true, opacity: 0.42 })
  );
  heroShape.position.set(-8.6, 2.4, 3);
  group.add(heroShape);

  /* ---- mouse parallax ---- */
  const mouse = { x: 0, y: 0 };
  const target = { x: 0, y: 0 };
  window.addEventListener('pointermove', e => {
    target.x = (e.clientX / window.innerWidth) * 2 - 1;
    target.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }, { passive: true });

  /* pause rendering when tab hidden */
  let visible = true;
  document.addEventListener('visibilitychange', () => {
    visible = !document.hidden;
    if (visible) requestAnimationFrame(tick);
  });

  function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);

  const clock = new THREE.Clock();
  const posAttr = pGeo.getAttribute('position');

  function tick() {
    if (!visible) return;
    const t = clock.getElapsedTime();

    mouse.x += (target.x - mouse.x) * 0.04;
    mouse.y += (target.y - mouse.y) * 0.04;

    for (let i = 0; i < COUNT; i++) {
      posAttr.setY(i, Math.sin(t * seeds[i].speed + seeds[i].phase) * 1.2
        + Math.cos(seeds[i].phase) * 4);
    }
    posAttr.needsUpdate = true;

    group.children.forEach(mesh => {
      mesh.rotation.y += mesh.userData.rotSpeed || 0.001;
      mesh.rotation.x += (mesh.userData.rotSpeed || 0.001) * 0.6;
    });
    heroShape.rotation.y -= 0.0022;
    heroShape.rotation.z += 0.0012;

    camera.position.x += (mouse.x * 1.4 - camera.position.x) * 0.03;
    camera.position.y += (mouse.y * 1.0 - camera.position.y) * 0.03;
    camera.lookAt(0, 0, -4);

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  tick();
}
