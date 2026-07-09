// ===================================================
// PROPLANTER GLOW.JS — Player Turn Glow Effect
// STANDALONE — zero touch to game.js
// Pulses the active player card when turn changes
// ===================================================
(function () {

  var lastTurnText = '';

  function watchTurnPill() {
    var pill = document.getElementById('turnPill');
    if (!pill) { setTimeout(watchTurnPill, 500); return; }

    new MutationObserver(function () {
      var current = pill.textContent || '';
      if (current === lastTurnText) return;
      lastTurnText = current;

      // Figure out which player index is active
      // turnPill text contains player name
      var name0 = (document.getElementById('pcname0') || {}).textContent || '';
      var name1 = (document.getElementById('pcname1') || {}).textContent || '';

      var activeIdx = -1;
      if (name0 && current.includes(name0)) activeIdx = 0;
      else if (name1 && current.includes(name1)) activeIdx = 1;

      if (activeIdx === -1) return;

      // Pulse the active card
      pulseCard(activeIdx);

      // Flash the dice button
      flashDice();

    }).observe(pill, { childList: true, characterData: true, subtree: true });
  }

  function pulseCard(idx) {
    var card = document.getElementById('pc' + idx);
    if (!card) return;

    // Remove existing pulse
    card.classList.remove('turn-pulse');
    void card.offsetWidth; // reflow to restart animation

    // Add pulse class
    card.classList.add('turn-pulse');

    // Remove after animation
    setTimeout(function () {
      card.classList.remove('turn-pulse');
    }, 1000);
  }

  function flashDice() {
    var btn = document.getElementById('rollBtn');
    if (!btn || btn.disabled) return;
    btn.classList.add('dice-flash');
    setTimeout(function () { btn.classList.remove('dice-flash'); }, 800);
  }

  // Inject CSS
  function injectCSS() {
    var style = document.createElement('style');
    style.textContent = [
      '@keyframes turnPulse {',
      '  0%   { box-shadow: 0 0 0 0 rgba(102,187,106,0.0); transform: scale(1); }',
      '  30%  { box-shadow: 0 0 0 8px rgba(102,187,106,0.4); transform: scale(1.01); }',
      '  70%  { box-shadow: 0 0 0 4px rgba(102,187,106,0.15); transform: scale(1.005); }',
      '  100% { box-shadow: 0 0 0 0 rgba(102,187,106,0.0); transform: scale(1); }',
      '}',
      '.turn-pulse {',
      '  animation: turnPulse 0.9s cubic-bezier(0.34,1.56,0.64,1) !important;',
      '}',
      '@keyframes diceFlash {',
      '  0%,100% { box-shadow: 0 6px 20px rgba(230,81,0,0.4); }',
      '  50%     { box-shadow: 0 0 0 6px rgba(249,168,37,0.5), 0 6px 20px rgba(230,81,0,0.6); transform: scale(1.03); }',
      '}',
      '.dice-flash {',
      '  animation: diceFlash 0.7s ease !important;',
      '}',
    ].join('\n');
    document.head.appendChild(style);
  }

  function init() {
    injectCSS();
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', watchTurnPill);
    } else {
      watchTurnPill();
    }
  }

  init();
})();