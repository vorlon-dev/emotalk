/* === js/slider.js === */
/*
 * Automatic screenshot slider for the phone mockup.
 * Cycles through all .phone-slide images inside #phone-slider every 3 seconds.
 * The first image should already have the class "active" in the HTML.
 */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        const slides = document.querySelectorAll('#phone-slider .phone-slide');
        if (slides.length === 0) {
            console.warn('[EmoTalk] No phone slides found. Add images inside #phone-slider.');
            return;
        }

        let currentIndex = 0;
        const totalSlides = slides.length;

        // Ensure only the first slide is active initially (in case of multiple active classes)
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === 0);
        });

        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
            });
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % totalSlides;
            showSlide(currentIndex);
        }

        // Auto-advance every 3 seconds
        setInterval(nextSlide, 3000);

        console.log(`[EmoTalk] Phone screenshot slider initialized with ${totalSlides} slides.`);
    });
})();