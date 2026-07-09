// ===================================================
// PROPLANTER KEYBOARD.JS — Keyboard Shortcuts
// STANDALONE — zero touch to game.js
// ===================================================
(function () {

  // Flash animation when key pressed
  var style = document.createElement('style');
  style.textContent = [
    '@keyframes keyFlash {',
    '  0%   { transform:scale(1); box-shadow:0 6px 20px rgba(230,81,0,0.4); }',
    '  40%  { transform:scale(1.04); box-shadow:0 0 0 6px rgba(249,168,37,0.4); }',
    '  100% { transform:scale(1); box-shadow:0 6px 20px rgba(230,81,0,0.4); }',
    '}',
    '.key-pressed { animation: keyFlash 0.35s ease !important; }',
  ].join('\n');
  document.head.appendChild(style);

  // Handle keydown
  document.addEventListener('keydown', function (e) {

    // SPACE — Roll dice
    if (e.code === 'Space' || e.key === ' ') {
      e.preventDefault();
      var rollBtn = document.getElementById('rollBtn');
      if (rollBtn && !rollBtn.disabled) {
        rollBtn.classList.add('key-pressed');
        setTimeout(function () { rollBtn.classList.remove('key-pressed'); }, 350);
        rollBtn.click();
      }
    }

    // ESC — Close popup
    if (e.code === 'Escape' || e.key === 'Escape') {
      var popupBtn = document.getElementById('popupBtn');
      var overlay  = document.getElementById('popupOverlay');
      if (overlay && overlay.classList.contains('show') && popupBtn) {
        popupBtn.click();
      }
      var factOverlay = document.getElementById('factOverlay');
      if (factOverlay) {
        var factBtn = factOverlay.querySelector('button');
        if (factBtn) factBtn.click();
      }
    }

  });

})();