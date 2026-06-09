/* === js/scroll-effects.js === */
(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        const revealItems = document.querySelectorAll('.reveal-item');
        if (revealItems.length === 0) {
            console.warn('[EmoTalk] No .reveal-item elements found.');
            return;
        }

        const parentGroups = new Map();
        revealItems.forEach((item) => {
            const parent = item.parentElement;
            if (!parentGroups.has(parent)) parentGroups.set(parent, []);
            parentGroups.get(parent).push(item);
        });

        parentGroups.forEach((items) => {
            items.forEach((item, index) => {
                item.style.transitionDelay = `${index * 100}ms`;
            });
        });

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
        );

        revealItems.forEach((item) => observer.observe(item));
        console.log(`[EmoTalk] Scroll effects observing ${revealItems.length} reveal-item elements.`);
    });
})();