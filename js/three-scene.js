/* === js/three-scene.js ===
 * Full 3D hero experience:
 * - Realistic 3D phone model
 * - Auto‑cycling screenshots on the screen
 * - Orbiting glowing particles
 * - Volumetric light beam
 * - Mouse parallax
 *
 * REQUIRES: Three.js r128 CDN (already in HTML)
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    if (typeof THREE === 'undefined') {
      console.warn('[EmoTalk] Three.js not found. Skipping 3D background.');
      return;
    }

    // ── Get phone container ──
    const container = document.getElementById('phone-3d-container');
    if (!container) {
      console.warn('[EmoTalk] #phone-3d-container not found. 3D phone not rendered.');
      return;
    }

    // ── Scene setup ──
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 5.8);
    camera.lookAt(0, 0, 0);

    // Renderer with transparency
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';

    // ── Lights ──
    const ambientLight = new THREE.AmbientLight(0x8844ff, 0.4);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0x7c3aed, 1.5, 10);
    pointLight.position.set(2, 1, 3);
    scene.add(pointLight);
    const backLight = new THREE.PointLight(0x06b6d4, 0.8, 12);
    backLight.position.set(-2, -0.5, -3);
    scene.add(backLight);

    // ── Phone model ──
    const phoneGroup = new THREE.Group();

    // Body (dark metal)
    const bodyGeo = new THREE.BoxGeometry(1.5, 3.2, 0.16);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x0a0a0a,
      roughness: 0.25,
      metalness: 0.9,
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.set(0, 0, 0);
    phoneGroup.add(body);

    // Screen (slightly recessed)
    const screenGeo = new THREE.PlaneGeometry(1.36, 2.78);
    const screenCanvas = document.createElement('canvas');
    screenCanvas.width = 700;
    screenCanvas.height = 1400;
    const screenCtx = screenCanvas.getContext('2d');
    const screenTexture = new THREE.CanvasTexture(screenCanvas);
    const screenMat = new THREE.MeshBasicMaterial({ map: screenTexture });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(0, 0.02, 0.081);
    phoneGroup.add(screen);

    // Camera punch-hole
    const punchGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.02, 16);
    const punchMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.1, metalness: 0.5 });
    const punch = new THREE.Mesh(punchGeo, punchMat);
    punch.position.set(0, 1.58, 0.081);
    punch.rotation.x = Math.PI / 2;
    phoneGroup.add(punch);

    // Side trim (glowing)
    const trimGeo = new THREE.BoxGeometry(1.54, 3.24, 0.005);
    const trimMat = new THREE.MeshStandardMaterial({
      color: 0x7c3aed,
      emissive: 0x7c3aed,
      emissiveIntensity: 0.7,
      roughness: 0.2,
      metalness: 0.3,
    });
    const trimTop = new THREE.Mesh(trimGeo, trimMat);
    trimTop.position.set(0, 0, 0.081);
    phoneGroup.add(trimTop);
    const trimBot = new THREE.Mesh(trimGeo, trimMat);
    trimBot.position.set(0, 0, -0.081);
    phoneGroup.add(trimBot);

    phoneGroup.position.y = 0.1;
    scene.add(phoneGroup);

    // ── Screenshot cycling ──
    const images = [];
    const imageUrls = [
      'assets/screenshots/screen1.png',
      'assets/screenshots/screen2.png',
      'assets/screenshots/screen3.png',
      'assets/screenshots/screen4.png',
      'assets/screenshots/screen5.png',
      'assets/screenshots/screen6.png',
      'assets/screenshots/screen7.png',
    ];
    let loadedCount = 0;
    imageUrls.forEach((url, index) => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        images[index] = img;
        loadedCount++;
        if (loadedCount === 1) {
          drawImageOnScreen(0);
        }
      };
      img.onerror = () => {
        console.warn('[EmoTalk] Could not load screenshot:', url);
        loadedCount++;
      };
    });

    let currentSlide = 0;
    function drawImageOnScreen(index) {
      if (!images[index]) return;
      screenCtx.clearRect(0, 0, screenCanvas.width, screenCanvas.height);
      screenCtx.drawImage(images[index], 0, 0, screenCanvas.width, screenCanvas.height);
      screenTexture.needsUpdate = true;
    }

    // Start slideshow once images are loaded
    const startSlideshow = setInterval(() => {
      if (loadedCount >= imageUrls.length) {
        clearInterval(startSlideshow);
        drawImageOnScreen(0);
        setInterval(() => {
          currentSlide = (currentSlide + 1) % imageUrls.length;
          if (images[currentSlide]) drawImageOnScreen(currentSlide);
        }, 3000);
      } else if (images[0] && loadedCount >= 1) {
        clearInterval(startSlideshow);
        drawImageOnScreen(0);
        setInterval(() => {
          currentSlide = (currentSlide + 1) % imageUrls.length;
          if (images[currentSlide]) drawImageOnScreen(currentSlide);
        }, 3000);
      }
    }, 200);

    // ── Orbiting glowing particles ──
    const particleGroup = new THREE.Group();
    const particleCount = 40;
    const particleGeo = new THREE.SphereGeometry(0.03, 6, 6);
    for (let i = 0; i < particleCount; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(0.75 + Math.random() * 0.15, 1, 0.6),
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const particle = new THREE.Mesh(particleGeo, mat);
      const angle = (i / particleCount) * Math.PI * 2;
      particle.position.set(
        Math.cos(angle) * 1.6,
        Math.sin(angle) * 0.3,
        Math.sin(angle) * 0.5
      );
      particle.userData = {
        baseAngle: angle,
        speed: 0.5 + Math.random() * 0.5,
        radius: 1.6 + Math.random() * 0.2,
        yAmp: 0.8 + Math.random() * 0.4,
      };
      particleGroup.add(particle);
    }
    scene.add(particleGroup);

    // ── Volumetric light beam ──
    const coneGeo = new THREE.ConeGeometry(0.5, 4, 32, 1, true);
    const coneMat = new THREE.MeshBasicMaterial({
      color: 0x7c3aed,
      transparent: true,
      opacity: 0.06,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const beam = new THREE.Mesh(coneGeo, coneMat);
    beam.position.set(0, -1.2, -2.5);
    beam.rotation.x = Math.PI;
    scene.add(beam);

    // ── Background twinkling stars ──
    const starsGeo = new THREE.BufferGeometry();
    const starsCount = 200;
    const starsPositions = new Float32Array(starsCount * 3);
    for (let i = 0; i < starsCount * 3; i += 3) {
      starsPositions[i] = (Math.random() - 0.5) * 6;
      starsPositions[i+1] = (Math.random() - 0.5) * 10;
      starsPositions[i+2] = (Math.random() - 0.5) * 4 - 1;
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3));
    const starsMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.02, blending: THREE.AdditiveBlending });
    const stars = new THREE.Points(starsGeo, starsMat);
    scene.add(stars);

    // ── Mouse interaction ──
    const mouse = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    window.addEventListener('mousemove', (e) => {
      target.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // ── Resize handler ──
    window.addEventListener('resize', () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    });

    // ── Animation loop ──
    let clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const time = performance.now() * 0.001;

      // Smooth mouse follow
      mouse.x += (target.x - mouse.x) * 0.05;
      mouse.y += (target.y - mouse.y) * 0.05;

      // Rotate phone with mouse
      phoneGroup.rotation.y = mouse.x * 0.4;
      phoneGroup.rotation.x = mouse.y * 0.15;

      // Float animation
      phoneGroup.position.y = 0.1 + Math.sin(time * 2) * 0.1;

      // Rotate particle ring
      particleGroup.rotation.y += 0.01;
      particleGroup.rotation.x = Math.sin(time * 0.5) * 0.1;

      // Pulse individual particles
      particleGroup.children.forEach((child, i) => {
        const scale = 0.8 + Math.sin(time * 8 + i) * 0.4;
        child.scale.set(scale, scale, scale);
      });

      // Beam rotation and opacity
      beam.rotation.z += 0.001;
      beam.material.opacity = 0.04 + Math.sin(time * 3) * 0.02;

      // Stars drift
      stars.rotation.y += 0.0002;

      renderer.render(scene, camera);
    }

    animate();
    console.log('[EmoTalk] 3D phone scene initialized.');
  });
})();