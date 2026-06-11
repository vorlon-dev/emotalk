/* === js/feedback.js ===
 * Floating feedback button + modal form.
 * Submissions open the user's email client with a pre-written message
 * sent to: pratamnarvekar@gmail.com
 */
(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        // Avoid duplicating the overlay if already injected
        if (document.getElementById('feedback-overlay')) return;

        // ── Create overlay + modal card ──
        const overlay = document.createElement('div');
        overlay.id = 'feedback-overlay';
        overlay.className = 'feedback-overlay';
        overlay.innerHTML = `
            <div class="feedback-card">
                <button class="feedback-close" id="feedback-close">&times;</button>
                <h3>Send Feedback 💬</h3>
                <p>Help us improve EmoTalk – report a bug or suggest a feature.</p>
                <form id="feedback-form"
                      action="mailto:pratamnarvekar@gmail.com?subject=EmoTalk%20Feedback"
                      method="POST"
                      enctype="text/plain">
                    <input type="text" name="name" placeholder="Your name (optional)" />
                    <textarea name="message" rows="4" placeholder="Your message..." required></textarea>
                    <button type="submit" class="btn-submit">Send Feedback</button>
                </form>
            </div>
        `;
        document.body.appendChild(overlay);

        // ── Floating action button ──
        const fab = document.createElement('button');
        fab.className = 'feedback-btn';
        fab.innerHTML = '✉️';
        fab.setAttribute('aria-label', 'Send feedback');
        document.body.appendChild(fab);

        // ── Toggle modal ──
        const closeBtn = overlay.querySelector('#feedback-close');
        fab.addEventListener('click', () => overlay.classList.add('active'));
        closeBtn.addEventListener('click', () => overlay.classList.remove('active'));
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.classList.remove('active');
        });

        // ── Form submit → clear form, close overlay ──
        const form = overlay.querySelector('#feedback-form');
        form.addEventListener('submit', () => {
            // mailto will open the user's email client; close the modal in the meantime
            overlay.classList.remove('active');
            form.reset();
        });
    });
})();