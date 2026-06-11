/* === js/privacy-guard.js ===
 * Privacy & anti‑tamper layer for EmoTalk website.
 */
(function () {
    'use strict';
    console.log(
        '%c🛡️ EmoTalk – Protected Area %c\n%cUnauthorized access or tampering is prohibited.',
        'font-size:1.4em; font-weight:bold; color:#7C3AED;',
        '',
        'color:#F59E0B;'
    );
    document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        alert('🔒 Right‑click is disabled to protect this site.\n\nIf you need the APK, use the download button.');
        return false;
    });
    document.addEventListener('keydown', function (e) {
        if (e.keyCode === 123) { e.preventDefault(); return false; }
        if (e.ctrlKey && e.shiftKey && e.keyCode === 73) { e.preventDefault(); return false; }
        if (e.ctrlKey && e.shiftKey && e.keyCode === 74) { e.preventDefault(); return false; }
        if (e.ctrlKey && e.keyCode === 85) { e.preventDefault(); return false; }
        if (e.ctrlKey && e.keyCode === 83) { e.preventDefault(); return false; }
        if (e.ctrlKey && e.shiftKey && e.keyCode === 67) { e.preventDefault(); return false; }
    });
    if (window.top !== window.self) {
        window.top.location = window.self.location;
    }
    console.log('✅ Privacy guard active.');
})();