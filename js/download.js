/* === js/download.js === */
(function () {
    'use strict';

    function triggerApkDownload() {
        const link = document.createElement('a');
        link.href = 'assets/emotalk.apk';
        link.download = 'EmoTalk.apk';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        console.log('[EmoTalk] APK download triggered at', new Date().toISOString());
    }

    document.addEventListener('DOMContentLoaded', () => {
        const downloadButtons = document.querySelectorAll('.btn-download');
        if (downloadButtons.length === 0) {
            console.warn('[EmoTalk] No .btn-download elements found.');
            return;
        }

        downloadButtons.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                if (btn.classList.contains('downloading')) return;
                btn.classList.add('downloading');
                const originalText = btn.textContent;
                btn.textContent = '⬇ Starting Download...';
                setTimeout(() => {
                    triggerApkDownload();
                    btn.classList.remove('downloading');
                    btn.textContent = originalText;
                }, 800);
            });
        });

        console.log(`[EmoTalk] Download handler attached to ${downloadButtons.length} button(s).`);
    });
})();