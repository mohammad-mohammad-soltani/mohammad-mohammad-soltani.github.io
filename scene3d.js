/* Interactive lime constellation field behind the portfolio. */
import * as THREE from 'three';

const canvas = document.getElementById('particles');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (canvas && window.WebGLRenderingContext) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
  } catch {
    renderer = null;
  }

  if (!renderer) {
  } else {
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(58, 1, 0.1, 100);
  camera.position.z = 16;

  const LIME = 0xd6ff3f;
  const SOFT_LIME = 0x91a923;
  const isSmall = window.innerWidth < 768;
  const particleCount = isSmall ? 150 : 300;
  const nodeCount = isSmall ? 64 : 100;
  const maxLines = isSmall ? 100 : 190;

  const basePositions = new Float32Array(particleCount * 3);
  const positions = new Float32Array(particleCount * 3);
  const seeds = [];

  for (let i = 0; i < particleCount; i++) {
    const x = (Math.random() - 0.5) * 32;
    const y = (Math.random() - 0.5) * 20;
    const z = (Math.random() - 0.5) * 14 - 3;
    basePositions[i * 3] = x;
    basePositions[i * 3 + 1] = y;
    basePositions[i * 3 + 2] = z;
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
    seeds.push({
      phase: Math.random() * Math.PI * 2,
      speed: 0.12 + Math.random() * 0.3,
      drift: 0.25 + Math.random() * 0.6
    });
  }

  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particleMaterial = new THREE.PointsMaterial({
    color: LIME,
    size: isSmall ? 0.11 : 0.14,
    transparent: true,
    opacity: 0.62,
    depthWrite: false,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending
  });
  const particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);

  const linePositions = new Float32Array(maxLines * 6);
  const lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
  lineGeometry.setDrawRange(0, 0);
  const lineMaterial = new THREE.LineBasicMaterial({
    color: SOFT_LIME,
    transparent: true,
    opacity: 0.28,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  const constellationLines = new THREE.LineSegments(lineGeometry, lineMaterial);
  scene.add(constellationLines);

  function wireframe(geometry, color, opacity) {
    const mesh = new THREE.LineSegments(
      new THREE.WireframeGeometry(geometry),
      new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      })
    );
    geometry.dispose();
    return mesh;
  }

  function addConstellation({ position, scale, phase, kind }) {
    const root = new THREE.Group();
    root.position.set(...position);
    root.scale.setScalar(scale);
    root.userData = {
      baseX: position[0],
      baseY: position[1],
      phase,
      spin: 0.00045 + Math.random() * 0.00045
    };

    const geometry = kind === 'knot'
      ? new THREE.TorusKnotGeometry(1.75, 0.34, 72, 9)
      : kind === 'octa'
        ? new THREE.OctahedronGeometry(2.1, 1)
        : new THREE.IcosahedronGeometry(2.55, 1);
    root.add(wireframe(geometry, LIME, 0.25));

    const ringA = wireframe(new THREE.TorusGeometry(2.8, 0.012, 8, 64), SOFT_LIME, 0.38);
    ringA.rotation.set(0.9, 0.25, 0.2);
    root.add(ringA);

    const ringB = wireframe(new THREE.TorusGeometry(2.25, 0.009, 8, 64), LIME, 0.25);
    ringB.rotation.set(-0.35, 0.8, 0.7);
    root.add(ringB);

    const nodeData = [];
    const nodeGeometry = new THREE.BufferGeometry();
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const radius = 1.8 + (i % 3) * 0.25;
      nodeData.push(
        Math.cos(angle) * radius,
        Math.sin(angle * 1.7) * radius * 0.72,
        Math.sin(angle) * radius
      );
    }
    nodeGeometry.setAttribute('position', new THREE.Float32BufferAttribute(nodeData, 3));
    root.add(new THREE.Points(nodeGeometry, new THREE.PointsMaterial({
      color: LIME,
      size: 0.1,
      transparent: true,
      opacity: 0.82,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })));

    scene.add(root);
    return root;
  }

  const constellations = [
    addConstellation({ position: [7.2, 2.5, -5], scale: 1.15, phase: 0.4, kind: 'ico' }),
    addConstellation({ position: [-7.8, -2.2, -6], scale: 1.05, phase: 1.8, kind: 'knot' }),
    addConstellation({ position: [2.8, -5.2, -9], scale: 0.9, phase: 3.2, kind: 'octa' })
  ];

  const halo = new THREE.Mesh(
    new THREE.RingGeometry(0.22, 0.25, 32),
    new THREE.MeshBasicMaterial({
      color: LIME,
      transparent: true,
      opacity: 0.62,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })
  );
  halo.position.z = 1;
  scene.add(halo);

  const pointer = { x: 0, y: 0 };
  const pointerTarget = { x: 0, y: 0 };
  let scrollTarget = 0;

  function setPointer(event) {
    pointerTarget.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointerTarget.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }
  window.addEventListener('pointermove', setPointer, { passive: true });
  window.addEventListener('pointerleave', () => {
    pointerTarget.x = 0;
    pointerTarget.y = 0;
  }, { passive: true });
  window.addEventListener('scroll', () => {
    scrollTarget = window.scrollY * 0.00035;
  }, { passive: true });

  function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();

  let visible = !document.hidden;
  let frame = 0;
  document.addEventListener('visibilitychange', () => {
    visible = !document.hidden;
    if (visible && !reduceMotion) requestAnimationFrame(tick);
  });

  const clock = new THREE.Clock();
  const positionAttribute = particleGeometry.getAttribute('position');
  const lineAttribute = lineGeometry.getAttribute('position');

  function updateParticles(time) {
    const cursorX = pointer.x * 7.2;
    const cursorY = pointer.y * 4.2;

    for (let i = 0; i < particleCount; i++) {
      const index = i * 3;
      const seed = seeds[i];
      const baseX = basePositions[index];
      const baseY = basePositions[index + 1];
      const baseZ = basePositions[index + 2];
      const wave = reduceMotion ? 0 : Math.sin(time * seed.speed + seed.phase) * seed.drift;
      const dx = baseX - cursorX;
      const dy = baseY - cursorY;
      const distance = Math.sqrt(dx * dx + dy * dy) || 0.001;
      const influence = Math.max(0, 1 - distance / 3.4);
      const push = influence * influence * 0.72;

      positions[index] = baseX + Math.cos(seed.phase) * wave * 0.24 + (dx / distance) * push;
      positions[index + 1] = baseY + Math.sin(seed.phase) * wave * 0.3 + (dy / distance) * push;
      positions[index + 2] = baseZ + wave * 0.16;
    }
    positionAttribute.needsUpdate = true;
  }

  function updateConnections() {
    let lineCount = 0;
    const threshold = isSmall ? 2.25 : 2.65;

    for (let i = 0; i < nodeCount && lineCount < maxLines; i++) {
      const indexA = i * 3;
      for (let j = i + 1; j < nodeCount && lineCount < maxLines; j++) {
        const indexB = j * 3;
        const dx = positions[indexA] - positions[indexB];
        const dy = positions[indexA + 1] - positions[indexB + 1];
        const dz = positions[indexA + 2] - positions[indexB + 2];
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (distance > threshold) continue;

        const lineIndex = lineCount * 6;
        linePositions[lineIndex] = positions[indexA];
        linePositions[lineIndex + 1] = positions[indexA + 1];
        linePositions[lineIndex + 2] = positions[indexA + 2];
        linePositions[lineIndex + 3] = positions[indexB];
        linePositions[lineIndex + 4] = positions[indexB + 1];
        linePositions[lineIndex + 5] = positions[indexB + 2];
        lineCount++;
      }
    }

    lineGeometry.setDrawRange(0, lineCount * 2);
    lineAttribute.needsUpdate = true;
  }

  function render(time) {
    updateParticles(time);
    updateConnections();

    halo.position.x += (pointer.x * 7.2 - halo.position.x) * 0.08;
    halo.position.y += (pointer.y * 4.2 - halo.position.y) * 0.08;
    halo.rotation.z = time * 0.18;
    halo.scale.setScalar(1 + Math.sin(time * 2.2) * 0.12);

    constellations.forEach((shape, index) => {
      const data = shape.userData;
      const depth = index * 0.12;
      shape.position.x += (data.baseX + pointer.x * (0.52 + depth) - shape.position.x) * 0.025;
      shape.position.y += (data.baseY + pointer.y * (0.38 + depth) - shape.position.y) * 0.025;
      shape.rotation.x += data.spin * (index % 2 ? -1 : 1);
      shape.rotation.y += data.spin * 1.25;
      shape.rotation.z = Math.sin(time * 0.22 + data.phase) * 0.08 + scrollTarget * (index % 2 ? -1 : 1);
      const pulse = 1 + Math.sin(time * 0.7 + data.phase) * 0.035 + Math.abs(pointer.x + pointer.y) * 0.025;
      shape.scale.lerp(new THREE.Vector3(pulse, pulse, pulse), 0.04);
    });

    camera.position.x += (pointer.x * 0.6 - camera.position.x) * 0.025;
    camera.position.y += (pointer.y * 0.42 - camera.position.y) * 0.025;
    camera.lookAt(0, 0, -4);
    renderer.render(scene, camera);
  }

  function tick() {
    if (!visible) return;
    frame = requestAnimationFrame(tick);
    const time = clock.getElapsedTime();
    pointer.x += (pointerTarget.x - pointer.x) * 0.06;
    pointer.y += (pointerTarget.y - pointer.y) * 0.06;
    render(time);
  }

  if (reduceMotion) {
    render(0);
  } else {
    tick();
  }
  }
}
