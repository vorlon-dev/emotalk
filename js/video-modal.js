/* === js/video-modal.js === */
document.addEventListener('DOMContentLoaded', () => {
    const thumbnail = document.getElementById('video-thumbnail');
    const modal = document.getElementById('video-modal');
    const backdrop = document.getElementById('modal-backdrop');
    const closeBtn = document.getElementById('modal-close');
    const video = document.getElementById('demo-video');

    if (!thumbnail || !modal) return;

    thumbnail.addEventListener('click', () => {
        modal.classList.add('active');
        video.play();
    });

    function closeModal() {
        modal.classList.remove('active');
        video.pause();
    }

    backdrop.addEventListener('click', closeModal);
    closeBtn.addEventListener('click', closeModal);

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
});