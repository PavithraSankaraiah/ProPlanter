// ===================================================
// PROPLANTER TOOLTIP.JS — Tile Hover Tooltips
// STANDALONE — zero touch to game.js
// Shows what each special tile does on hover
// ===================================================
(function () {

  var TILE_INFO = {
    1:  { icon:'🏁', title:'Start',          desc:'Your journey begins here!' },
    3:  { icon:'⭐', title:'Free Pot!',       desc:'Land here to get a FREE pot — no money needed!' },
    9:  { icon:'☠️', title:'Danger!',         desc:'Lose your pot! Journey restarts with ₹500.' },
    10: { icon:'🔚', title:'Stage 1 End',     desc:'Missed the free pot? Pay ₹120 mandatory here.' },
    12: { icon:'💰', title:'Buy Soil — ₹80',  desc:'Purchase quality soil for your pot.' },
    13: { icon:'💸', title:'Sell Pot TRAP!',  desc:'Selling gives ₹200 but causes a full restart!' },
    15: { icon:'💰', title:'Buy Soil — ₹10',  desc:'Cheap soil available here!' },
    17: { icon:'💰', title:'Buy Soil — ₹10',  desc:'Cheap soil available here!' },
    18: { icon:'💰', title:'Buy Soil — ₹10',  desc:'Cheap soil available here!' },
    20: { icon:'🔚', title:'Stage 2 End',     desc:'No soil? Pay ₹120 mandatory penalty here.' },
    22: { icon:'💰', title:'Buy Seed — ₹20',  desc:'Plant a seed to start growing!' },
    25: { icon:'💰', title:'Buy Seed — ₹10',  desc:'Cheaper seed available here!' },
    27: { icon:'🎁', title:'BONUS +₹250!',    desc:'Lucky tile! Answer a quiz to earn ₹250.' },
    28: { icon:'💰', title:'Buy Seed — ₹30',  desc:'Premium seed for your plant.' },
    30: { icon:'💰', title:'Buy Seed — ₹20',  desc:'Last chance to buy a seed in Stage 3!' },
    32: { icon:'💰', title:'Buy Manure — ₹20',desc:'Fertilise your plant with manure.' },
    34: { icon:'💰', title:'Buy Seed — ₹200', desc:'Expensive premium seed in Stage 4!' },
    37: { icon:'🎁', title:'BONUS +₹250!',    desc:'Lucky tile! Answer a quiz to earn ₹250.' },
    38: { icon:'💰', title:'Buy Manure — ₹30',desc:'Extra manure for stronger growth.' },
    40: { icon:'🔚', title:'Stage 4 End',     desc:'No manure? Pay ₹120 mandatory penalty here.' },
    42: { icon:'🌧️', title:'RAIN — WIN!',     desc:'Land here and the rain waters your plant — YOU WIN!' },
    43: { icon:'☠️', title:'Danger!',         desc:'Lose your pot! Journey restarts with ₹500.' },
    44: { icon:'🌧️', title:'RAIN — WIN!',     desc:'Land here and the rain waters your plant — YOU WIN!' },
    46: { icon:'🌧️', title:'RAIN — WIN!',     desc:'Land here and the rain waters your plant — YOU WIN!' },
    48: { icon:'🌧️', title:'RAIN — WIN!',     desc:'Land here and the rain waters your plant — YOU WIN!' },
    49: { icon:'☠️', title:'Danger!',         desc:'Lose your pot! Journey restarts with ₹500.' },
    50: { icon:'🏆', title:'FINISH LINE!',    desc:'Reach here and you WIN the game!' },
  };

  // Tooltip element
  var tip = null;

  function createTooltip() {
    tip = document.createElement('div');
    tip.id = 'tileTooltip';
    tip.style.cssText = [
      'position:fixed', 'z-index:9000',
      'background:#0f2a0f',
      'border:1px solid rgba(102,187,106,0.4)',
      'border-radius:12px',
      'padding:0.6rem 0.85rem',
      'max-width:200px',
      'pointer-events:none',
      'opacity:0',
      'transform:translateY(4px)',
      'transition:opacity 0.18s ease, transform 0.18s ease',
      'box-shadow:0 8px 24px rgba(0,0,0,0.4)',
      'font-family:Nunito,sans-serif',
    ].join(';');
    document.body.appendChild(tip);
  }

  function showTip(e, info) {
    if (!tip) return;
    tip.innerHTML =
      '<div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">' +
        '<span style="font-size:1.1rem">' + info.icon + '</span>' +
        '<span style="font-family:Fredoka One,cursive;font-size:0.88rem;color:#66bb6a">' + info.title + '</span>' +
      '</div>' +
      '<div style="font-size:0.72rem;color:rgba(255,255,255,0.65);font-weight:700;line-height:1.5">' + info.desc + '</div>';

    // Position near cursor
    var x = e.clientX + 14;
    var y = e.clientY - 10;
    // Keep inside viewport
    if (x + 210 > window.innerWidth)  x = e.clientX - 220;
    if (y + 80  > window.innerHeight) y = e.clientY - 80;
    tip.style.left = x + 'px';
    tip.style.top  = y + 'px';
    tip.style.opacity = '1';
    tip.style.transform = 'translateY(0)';
  }

  function hideTip() {
    if (!tip) return;
    tip.style.opacity = '0';
    tip.style.transform = 'translateY(4px)';
  }

  function attachTooltips() {
    var board = document.getElementById('boardGrid');
    if (!board) { setTimeout(attachTooltips, 600); return; }

    // Watch for board rebuild (game start)
    new MutationObserver(function() { attachTileListeners(); }).observe(board, { childList: true });
    attachTileListeners();
  }

  function attachTileListeners() {
    for (var n = 1; n <= 50; n++) {
      var tile = document.getElementById('tile-' + n);
      if (!tile) continue;
      var info = TILE_INFO[n];
      if (!info) continue;
      (function(el, inf) {
        el.addEventListener('mouseenter', function(e) { showTip(e, inf); });
        el.addEventListener('mousemove',  function(e) { showTip(e, inf); });
        el.addEventListener('mouseleave', hideTip);
      })(tile, info);
    }
  }

  function init() {
    createTooltip();
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', attachTooltips);
    } else {
      attachTooltips();
    }
  }

  init();
})();