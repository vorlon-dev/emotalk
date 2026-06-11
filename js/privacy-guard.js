/* === js/privacy-guard.js ===
 * Privacy & anti‑tamper layer for EmoTalk website.
 * Blocks right‑click, disables devtools shortcuts, and warns intruders.
 */

(function () {
    'use strict';

    // ── Clear console warning ──
    console.log(
        '%c🛡️ EmoTalk – Protected Area %c\n%cUnauthorized access or tampering is prohibited.',
        'font-size:1.4em; font-weight:bold; color:#7C3AED;',
        '',
        'color:#F59E0B;'
    );

    // ── Block right‑click context menu ──
    document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        // Show a subtle custom message (can be replaced with a toast)
        alert('🔒 Right‑click is disabled to protect this site.\n\nIf you need the APK, use the download button.');
        return false;
    });

    // ── Disable dangerous keyboard shortcuts ──
    document.addEventListener('keydown', function (e) {
        // F12
        if (e.keyCode === 123) {
            e.preventDefault();
            return false;
        }
        // Ctrl+Shift+I (devtools)
        if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
            e.preventDefault();
            return false;
        }
        // Ctrl+Shift+J (console)
        if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
            e.preventDefault();
            return false;
        }
        // Ctrl+U (view source)
        if (e.ctrlKey && e.keyCode === 85) {
            e.preventDefault();
            return false;
        }
        // Ctrl+S (save page)
        if (e.ctrlKey && e.keyCode === 83) {
            e.preventDefault();
            return false;
        }
        // Ctrl+Shift+C (element picker)
        if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
            e.preventDefault();
            return false;
        }
    });

    // ── Prevent iframe embedding (clickjacking) ──
    if (window.top !== window.self) {
        window.top.location = window.self.location;
    }

    console.log('✅ Privacy guard active.');
})();