const nav = document.querySelector('.nav');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
});

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

const revealElements = document.querySelectorAll(
  '.section-title, .about-grid, .member-card, .album-card, .chart-item, .news-card, .chart-intro'
);

revealElements.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
);

revealElements.forEach(el => observer.observe(el));

document.querySelectorAll('.member-card').forEach((card, i) => {
  card.style.transitionDelay = `${i * 0.08}s`;
});

const memberModal = document.getElementById('memberModal');
const memberModalGallery = document.getElementById('memberModalGallery');
const memberModalName = memberModal.querySelector('.member-modal-name');
const memberModalEn = memberModal.querySelector('.member-modal-en');
const memberModalRole = memberModal.querySelector('.member-modal-role');
const memberModalClose = memberModal.querySelector('.member-modal-close');
const memberModalBackdrop = memberModal.querySelector('.member-modal-backdrop');

const IMAGE_EXTENSIONS = ['.avif', '.webp', '.png', '.jfif', '.jpg'];
const IMAGE_SUFFIXES = ['', '1', '2', '3', '4', '5'];

function imageExists(src) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
}

async function findMemberImages(baseName) {
  const found = [];

  for (const suffix of IMAGE_SUFFIXES) {
    for (const ext of IMAGE_EXTENSIONS) {
      const src = `${baseName}${suffix}${ext}`;
      if (await imageExists(src)) {
        found.push(src);
        break;
      }
    }
  }

  return found;
}

function renderMemberGallery(images, name) {
  memberModalGallery.innerHTML = '';

  if (images.length === 0) {
    memberModalGallery.innerHTML = '<p class="member-modal-empty">이미지를 찾을 수 없습니다.</p>';
    return;
  }

  images.forEach((src, index) => {
    const item = document.createElement('figure');
    item.className = 'member-modal-gallery-item';

    const img = document.createElement('img');
    img.src = src;
    img.alt = index === 0 ? `${name} 대표 이미지` : `${name} 이미지 ${index + 1}`;
    img.loading = 'lazy';

    item.appendChild(img);
    memberModalGallery.appendChild(item);
  });
}

async function openMemberModal(card) {
  const baseName = card.dataset.baseName || card.querySelector('h3').textContent;
  const fallbackImage = card.dataset.image;
  const name = card.querySelector('h3').textContent;
  const enName = card.querySelector('.member-en').textContent;
  const role = card.querySelector('.member-role').textContent;

  document.querySelectorAll('.member-card').forEach(c => c.classList.remove('active'));
  card.classList.add('active');

  memberModalName.textContent = name;
  memberModalEn.textContent = enName;
  memberModalRole.textContent = role;

  memberModalGallery.innerHTML = '<p class="member-modal-loading">이미지 불러오는 중...</p>';
  memberModal.classList.add('open');
  memberModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  let images = await findMemberImages(baseName);
  if (images.length === 0 && fallbackImage) {
    images = [fallbackImage];
  }

  renderMemberGallery(images, name);
  memberModalGallery.dataset.count = String(images.length);
}

function closeMemberModal() {
  memberModal.classList.remove('open');
  memberModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.querySelectorAll('.member-card').forEach(card => {
  card.addEventListener('click', () => openMemberModal(card));
});

memberModalClose.addEventListener('click', closeMemberModal);
memberModalBackdrop.addEventListener('click', closeMemberModal);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && memberModal.classList.contains('open')) {
    closeMemberModal();
  }
});

document.querySelectorAll('.album-card').forEach((card, i) => {
  card.style.transitionDelay = `${i * 0.1}s`;
});

document.querySelectorAll('.chart-item').forEach((item, i) => {
  item.style.transitionDelay = `${i * 0.08}s`;
});

function updateHeroTime() {
  const el = document.getElementById('heroTime');
  if (!el) return;
  const now = new Date();
  el.textContent = now.toLocaleTimeString('ko-KR', { hour12: false });
}

updateHeroTime();
setInterval(updateHeroTime, 1000);

function initGlobe() {
  const container = document.getElementById('globe-canvas');
  if (!container || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const width = container.clientWidth;
  const height = container.clientHeight;
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.z = 2.8;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const globeGroup = new THREE.Group();
  scene.add(globeGroup);

  const innerGeo = new THREE.SphereGeometry(1, 64, 64);
  const innerMat = new THREE.MeshPhongMaterial({
    color: 0x0a1a30,
    emissive: 0x001a33,
    shininess: 25,
    transparent: true,
    opacity: 0.95
  });
  const innerGlobe = new THREE.Mesh(innerGeo, innerMat);
  globeGroup.add(innerGlobe);

  const wireGeo = new THREE.SphereGeometry(1.002, 48, 48);
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0x00ccff,
    wireframe: true,
    transparent: true,
    opacity: 0.12
  });
  const wireGlobe = new THREE.Mesh(wireGeo, wireMat);
  globeGroup.add(wireGlobe);

  const atmosGeo = new THREE.SphereGeometry(1.08, 64, 64);
  const atmosMat = new THREE.MeshBasicMaterial({
    color: 0x00ccff,
    transparent: true,
    opacity: 0.06,
    side: THREE.BackSide
  });
  const atmosphere = new THREE.Mesh(atmosGeo, atmosMat);
  globeGroup.add(atmosphere);

  const glowGeo = new THREE.SphereGeometry(1.15, 64, 64);
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0x0066aa,
    transparent: true,
    opacity: 0.03,
    side: THREE.BackSide
  });
  const outerGlow = new THREE.Mesh(glowGeo, glowMat);
  globeGroup.add(outerGlow);

  const cityPositions = [
    [0.3, 0.7, 0.65],
    [-0.5, 0.4, 0.75],
    [0.8, -0.2, 0.55],
    [-0.7, -0.3, 0.62],
    [0.1, -0.85, 0.52],
    [0.6, 0.5, -0.62],
    [-0.4, 0.6, -0.68],
    [0.0, 0.2, -0.97]
  ];

  const pointGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(cityPositions.flat());
  pointGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const pointMat = new THREE.PointsMaterial({
    color: 0x00ff88,
    size: 0.04,
    transparent: true,
    opacity: 0.9,
    sizeAttenuation: true
  });
  const cityPoints = new THREE.Points(pointGeo, pointMat);
  globeGroup.add(cityPoints);

  cityPositions.forEach(pos => {
    const ringGeo = new THREE.RingGeometry(0.02, 0.035, 16);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00ccff,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.set(pos[0] * 1.01, pos[1] * 1.01, pos[2] * 1.01);
    ring.lookAt(0, 0, 0);
    globeGroup.add(ring);
  });

  const orbitGeo = new THREE.TorusGeometry(1.35, 0.003, 8, 100);
  const orbitMat = new THREE.MeshBasicMaterial({
    color: 0x00ccff,
    transparent: true,
    opacity: 0.25
  });
  const orbit = new THREE.Mesh(orbitGeo, orbitMat);
  orbit.rotation.x = Math.PI / 2.5;
  globeGroup.add(orbit);

  const orbit2 = orbit.clone();
  orbit2.rotation.x = Math.PI / 3.5;
  orbit2.rotation.y = Math.PI / 4;
  orbit2.material = orbitMat.clone();
  orbit2.material.opacity = 0.15;
  globeGroup.add(orbit2);

  const ambient = new THREE.AmbientLight(0x223344, 0.8);
  scene.add(ambient);

  const pointLight = new THREE.PointLight(0x00ccff, 1.2, 100);
  pointLight.position.set(5, 3, 5);
  scene.add(pointLight);

  const pointLight2 = new THREE.PointLight(0x00ff88, 0.5, 100);
  pointLight2.position.set(-4, -2, 3);
  scene.add(pointLight2);

  let mouseX = 0;
  let mouseY = 0;
  let targetRotX = 0;
  let targetRotY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  let autoRot = 0;

  function animate() {
    requestAnimationFrame(animate);

    autoRot += 0.002;
    targetRotY = autoRot + mouseX * 0.3;
    targetRotX = mouseY * 0.15;

    globeGroup.rotation.y += (targetRotY - globeGroup.rotation.y) * 0.05;
    globeGroup.rotation.x += (targetRotX - globeGroup.rotation.x) * 0.05;

    orbit.rotation.z += 0.001;
    orbit2.rotation.z -= 0.0008;

    renderer.render(scene, camera);
  }

  animate();

  function onResize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }

  window.addEventListener('resize', onResize);
}

initGlobe();