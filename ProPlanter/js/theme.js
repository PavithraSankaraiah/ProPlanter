// ===================================================
// PROPLANTER THEME.JS — Day / Night Theme Toggle
// STANDALONE — zero touch to game.js
// Adds a floating toggle button for light/dark mode
// ===================================================
(function () {

  var isDark = true; // starts dark

  // Light theme CSS overrides
  var LIGHT_CSS = [
    'body { background: #f0f7f0 !important; color: #1a1a1a !important; }',
    'body::before { opacity: 0.15 !important; }',

    // Board panel
    '.board-panel { background: #ffffff !important; border-color: rgba(46,125,50,0.3) !important; }',
    '.board-name { color: #1b5e20 !important; }',
    '.back-home { color: #555 !important; border-color: #ddd !important; }',
    '.back-home:hover { color: #2e7d32 !important; border-color: #2e7d32 !important; }',
    '.turn-pill { background: #e8f5e9 !important; color: #2e7d32 !important; border-color: #a5d6a7 !important; }',
    '.stage-strip .sstrip { text-shadow: none !important; }',

    // Sidebar cards
    '.pcard { background: #ffffff !important; border-color: #e0e0e0 !important; }',
    '.pcard.active { border-color: var(--pc,#43a047) !important; }',
    '.pcard-name { color: #1a1a1a !important; }',
    '.pcard-loc  { color: #888 !important; }',
    '.stat { background: #f5f5f5 !important; }',
    '.stat-k { color: #888 !important; }',
    '.stat-v { color: #333 !important; }',
    '.stat-v.money { color: #e65100 !important; }',
    '.prog-wrap { background: #e0e0e0 !important; }',
    '.prog-label { color: #999 !important; }',
    '.pc-stage-label { color: #999 !important; }',

    // Dice card
    '.dice-card { background: #ffffff !important; border-color: #e0e0e0 !important; }',
    '.dice-turn { color: #666 !important; }',
    '.turn-counter { color: #aaa !important; }',

    // Log card
    '.log-card { background: #ffffff !important; border-color: #e0e0e0 !important; }',
    '.log-heading { color: #555 !important; }',
    '.log-entry.log-info { background: #f5f5f5 !important; border-color: #ddd !important; color: #666 !important; }',

    // Plant growth
    '.plant-growth-wrap { background: rgba(0,0,0,0.04) !important; border-color: rgba(0,0,0,0.08) !important; }',
    '.plant-stage-label { color: #999 !important; }',

    // Board background
    '.board-grid { background: transparent !important; }',
    '.board-legend .leg-free { background: #fff9c4 !important; }',

    // Tournament bar
    '.tourn-bar { background: rgba(171,71,188,0.08) !important; }',
    '.tourn-mid { color: #7b1fa2 !important; }',

    // Mode badge
    '.mode-badge { color: white !important; }',

    // Setup screen  
    '.setup-card { background: #ffffff !important; border-color: rgba(46,125,50,0.2) !important; }',
    '.setup-logo { color: #1b5e20 !important; }',
    '.setup-heading { color: #333 !important; }',
    '.diff-btn { background: #f5f5f5 !important; border-color: #ddd !important; color: #333 !important; }',
    '.diff-btn.active { border-color: #43a047 !important; background: #e8f5e9 !important; }',
    '.diff-info { background: #f5f5f5 !important; border-color: #e0e0e0 !important; }',
    '#diffInfoText { color: #555 !important; }',
    '.player-row { background: #fafafa !important; }',
    '.name-input { color: #333 !important; border-color: rgba(0,0,0,0.15) !important; }',
    '.setup-section-label { color: #888 !important; }',
    '.btn-back { color: #aaa !important; }',
    '.av { background: #eee !important; border-color: rgba(0,0,0,0.12) !important; }',
    '.av.selected { border-color: #2e7d32 !important; background: #e8f5e9 !important; }',
  ].join('\n');

  var styleEl = null;

  function applyLight() {
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'proplanter-light-theme';
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = LIGHT_CSS;
    isDark = false;
    updateBtn();
    localStorage.setItem('proplanter_theme', 'light');
  }

  function applyDark() {
    if (styleEl) styleEl.textContent = '';
    isDark = true;
    updateBtn();
    localStorage.setItem('proplanter_theme', 'dark');
  }

  function updateBtn() {
    var btn = document.getElementById('themeBtn');
    if (!btn) return;
    btn.textContent = isDark ? '☀️' : '🌙';
    btn.title = isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode';
  }

  function createBtn() {
    var btn = document.createElement('button');
    btn.id = 'themeBtn';
    btn.textContent = '☀️';
    btn.title = 'Switch to Light Mode';
    btn.style.cssText = [
      'position:fixed',
      'bottom:1.2rem',
      'right:4.2rem',   // sits next to music button
      'z-index:9999',
      'width:44px', 'height:44px',
      'border-radius:50%',
      'border:2px solid rgba(255,255,255,0.2)',
      'background:rgba(0,0,0,0.45)',
      'color:white',
      'font-size:1.2rem',
      'cursor:pointer',
      'backdrop-filter:blur(8px)',
      'transition:transform 0.15s, background 0.2s',
      'display:flex', 'align-items:center', 'justify-content:center',
      'box-shadow:0 4px 16px rgba(0,0,0,0.3)',
    ].join(';');

    btn.onmouseover = function () { btn.style.transform = 'scale(1.1)'; };
    btn.onmouseout  = function () { btn.style.transform = 'scale(1)'; };
    btn.onclick = function () {
      if (isDark) applyLight();
      else applyDark();
    };
    document.body.appendChild(btn);
  }

  function init() {
    // Create button
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', createBtn);
    } else {
      createBtn();
    }

    // Restore saved theme
    var saved = localStorage.getItem('proplanter_theme');
    if (saved === 'light') {
      setTimeout(applyLight, 100);
    }
  }

  init();
})();