/* === js/particles.js === */
(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        const canvas = document.getElementById('particle-canvas');
        if (!canvas) {
            console.warn('[EmoTalk] #particle-canvas not found.');
            return;
        }
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const EMOJIS = ['💬', '❤️', '😂', '🔥', '✨', '🎉', '👋', '🫶'];

        class Particle {
            constructor(cx, cy) {
                this.emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
                this.x = cx + (Math.random() - 0.5) * 40;
                this.y = cy + (Math.random() - 0.5) * 40;
                this.size = 18 + Math.random() * 22;
                const angle = Math.random() * Math.PI * 2;
                const speed = 0.4 + Math.random() * 1.2;
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed;
                this.alpha = 1;
                this.decay = 0.004 + Math.random() * 0.008;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.alpha -= this.decay;
            }
            get dead() { return this.alpha <= 0; }
            draw(ctx) {
                ctx.font = `${this.size}px serif`;
                ctx.globalAlpha = Math.max(0, this.alpha);
                ctx.fillText(this.emoji, this.x, this.y);
                ctx.globalAlpha = 1;
            }
        }

        let particles = [];
        let frameCount = 0;
        const MAX_PARTICLES = 30;
        const SPAWN_INTERVAL = 8;

        function resizeCanvas() {
            const parent = canvas.parentElement;
            if (!parent) return;
            canvas.width = parent.offsetWidth;
            canvas.height = parent.offsetHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        function animate() {
            requestAnimationFrame(animate);
            const cx = canvas.width / 2;
            const cy = canvas.height / 2;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            frameCount++;
            if (frameCount >= SPAWN_INTERVAL && particles.length < MAX_PARTICLES) {
                frameCount = 0;
                particles.push(new Particle(cx, cy));
            }
            particles = particles.filter(p => !p.dead);
            for (const p of particles) {
                p.update();
                p.draw(ctx);
            }
        }
        animate();
        console.log('[EmoTalk] Emoji particle system initialized.');
    });
})();