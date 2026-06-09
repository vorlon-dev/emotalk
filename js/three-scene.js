/* === js/three-scene.js === */
(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        if (typeof THREE === 'undefined') {
            console.warn('[EmoTalk] Three.js not found. Skipping 3D background.');
            return;
        }

        const canvas = document.createElement('canvas');
        canvas.id = 'bg-canvas';
        canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;';
        document.body.prepend(canvas);

        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(window.innerWidth, window.innerHeight);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 50;

        const meshes = [];
        const MESH_COUNT = 80;
        const geometry = new THREE.IcosahedronGeometry(1, 0);
        const material = new THREE.MeshBasicMaterial({
            color: 0x7c3aed,
            wireframe: true,
            transparent: true,
            opacity: 0.55,
        });

        for (let i = 0; i < MESH_COUNT; i++) {
            const mesh = new THREE.Mesh(geometry, material.clone());
            mesh.position.x = (Math.random() - 0.5) * 160;
            mesh.position.y = (Math.random() - 0.5) * 160;
            mesh.position.z = (Math.random() - 0.5) * 80;
            mesh.rotation.x = Math.random() * Math.PI * 2;
            mesh.rotation.y = Math.random() * Math.PI * 2;
            mesh.userData.rotSpeedX = (Math.random() - 0.5) * 0.01;
            mesh.userData.rotSpeedY = (Math.random() - 0.5) * 0.01;
            mesh.userData.rotSpeedZ = (Math.random() - 0.5) * 0.005;
            mesh.userData.driftX = (Math.random() - 0.5) * 0.03;
            mesh.userData.driftY = (Math.random() - 0.5) * 0.03;
            const scale = 0.5 + Math.random() * 1.5;
            mesh.scale.set(scale, scale, scale);
            scene.add(mesh);
            meshes.push(mesh);
        }

        const mouse = { x: 0, y: 0 };
        const target = { x: 0, y: 0 };

        window.addEventListener('mousemove', (e) => {
            target.x = (e.clientX / window.innerWidth - 0.5) * 2;
            target.y = (e.clientY / window.innerHeight - 0.5) * 2;
        });

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        function animate() {
            requestAnimationFrame(animate);
            mouse.x += (target.x - mouse.x) * 0.05;
            mouse.y += (target.y - mouse.y) * 0.05;
            camera.rotation.x = mouse.y * 0.02;
            camera.rotation.y = mouse.x * 0.02;

            for (const mesh of meshes) {
                mesh.rotation.x += mesh.userData.rotSpeedX;
                mesh.rotation.y += mesh.userData.rotSpeedY;
                mesh.rotation.z += mesh.userData.rotSpeedZ;
                mesh.position.x += mesh.userData.driftX;
                mesh.position.y += mesh.userData.driftY;
                if (Math.abs(mesh.position.x) > 80) mesh.userData.driftX *= -1;
                if (Math.abs(mesh.position.y) > 80) mesh.userData.driftY *= -1;
            }

            renderer.render(scene, camera);
        }
        animate();
        console.log('[EmoTalk] 3D background scene initialized.');
    });
})();