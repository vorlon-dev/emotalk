/* === js/tilt.js === */
(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            console.log('[EmoTalk] Touch device — tilt disabled.');
            return;
        }
        const cards = document.querySelectorAll('.feature-card');
        if (cards.length === 0) {
            console.warn('[EmoTalk] No .feature-card elements for tilt effect.');
            return;
        }

        cards.forEach((card) => {
            let glow = card.querySelector('.card-glow');
            if (!glow) {
                glow = document.createElement('div');
                glow.classList.add('card-glow');
                card.appendChild(glow);
            }
            card.style.transition = 'transform 0.15s ease, box-shadow 0.3s ease';

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const relX = (e.clientX - rect.left) / rect.width - 0.5;
                const relY = (e.clientY - rect.top) / rect.height - 0.5;
                card.style.transform = `perspective(800px) rotateX(${relY * -12}deg) rotateY(${relX * 12}deg) translateY(-4px)`;
                glow.style.left = `${e.clientX - rect.left}px`;
                glow.style.top = `${e.clientY - rect.top}px`;
                glow.style.opacity = '0.15';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)';
                glow.style.opacity = '0';
            });
        });
        console.log(`[EmoTalk] Tilt effect on ${cards.length} cards.`);
    });
})();