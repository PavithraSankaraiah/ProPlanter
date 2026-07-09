// ===================================================
// PROPLANTER STATS.JS — Player Stats Comparison
// STANDALONE — zero touch to game.js
// Reads stat elements from both player cards
// and shows a comparison table on the win screen
// ===================================================
(function () {

  // Read a number from a player card stat element
  function readMoney(id) {
    var el = document.getElementById(id);
    if (!el) return 0;
    var txt = el.textContent.replace('₹','').replace(',','').trim();
    return parseInt(txt) || 0;
  }

  // Read turns from player location label (e.g. "📍 Tile 42 — Stage 5")
  // Turns are tracked in the log — count log entries per player
  function countTurns(playerName) {
    var logList = document.getElementById('logList');
    if (!logList) return '?';
    var entries = logList.querySelectorAll('.log-entry');
    var count = 0;
    entries.forEach(function(e) {
      if (e.textContent.includes(playerName) && e.textContent.includes('landed on Tile')) {
        count++;
      }
    });
    return count || '?';
  }

  function countRestarts(playerName) {
    var logList = document.getElementById('logList');
    if (!logList) return 0;
    var entries = logList.querySelectorAll('.log-entry');
    var count = 0;
    entries.forEach(function(e) {
      if (e.textContent.includes(playerName) && e.textContent.includes('restarted')) {
        count++;
      }
    });
    return count;
  }

  function countBonus(playerName) {
    var logList = document.getElementById('logList');
    if (!logList) return '₹0';
    var entries = logList.querySelectorAll('.log-entry');
    var total = 0;
    entries.forEach(function(e) {
      if (e.textContent.includes(playerName) && e.textContent.includes('bonus')) {
        // Each bonus is ₹250
        total += 250;
      }
    });
    return '₹' + total;
  }

  function calcEfficiency(turns) {
    if (turns === '?' || turns === 0) return '—';
    // Minimum possible turns to win = ~9 (theoretical)
    var minPossible = 9;
    var score = Math.max(0, Math.round(100 - ((turns - minPossible) / minPossible) * 8));
    score = Math.min(100, score);
    return score + '%';
  }

  // Build the comparison table
  function buildComparison() {
    var winStats = document.getElementById('winStats');
    if (!winStats) return;
    if (document.getElementById('statsComparison')) return; // already added

    // Get player names
    var name0 = (document.getElementById('pcname0') || {}).textContent || 'Player 1';
    var name1 = (document.getElementById('pcname1') || {}).textContent || 'Player 2';
    var av0   = (document.getElementById('pcav0')   || {}).textContent || '🐸';
    var av1   = (document.getElementById('pcav1')   || {}).textContent || '🦋';

    // Gather stats
    var money0    = readMoney('pm0');
    var money1    = readMoney('pm1');
    var turns0    = countTurns(name0);
    var turns1    = countTurns(name1);
    var restarts0 = countRestarts(name0);
    var restarts1 = countRestarts(name1);
    var bonus0    = countBonus(name0);
    var bonus1    = countBonus(name1);
    var eff0      = calcEfficiency(turns0);
    var eff1      = calcEfficiency(turns1);

    // Figure out who won each stat (for highlighting)
    function better(v0, v1, higherIsBetter) {
      if (v0 === '?' || v1 === '?') return [false, false];
      var n0 = parseFloat(String(v0).replace(/[₹%]/g,''));
      var n1 = parseFloat(String(v1).replace(/[₹%]/g,''));
      if (isNaN(n0) || isNaN(n1)) return [false, false];
      if (n0 === n1) return [false, false];
      return higherIsBetter ? [n0 > n1, n1 > n0] : [n0 < n1, n1 < n0];
    }

    var rows = [
      { label:'💰 Money Left',    v0:'₹'+money0,   v1:'₹'+money1,   hi:true  },
      { label:'🎲 Turns Taken',   v0:turns0,        v1:turns1,        hi:false },
      { label:'🔄 Restarts',      v0:restarts0,     v1:restarts1,     hi:false },
      { label:'🎁 Bonus Earned',  v0:bonus0,        v1:bonus1,        hi:true  },
      { label:'⚡ Efficiency',    v0:eff0,          v1:eff1,          hi:true  },
    ];

    // Build HTML
    var wrap = document.createElement('div');
    wrap.id = 'statsComparison';
    wrap.style.cssText = [
      'margin-top:1rem',
      'border-top:2px solid rgba(0,0,0,0.08)',
      'padding-top:0.9rem',
    ].join(';');

    // Title
    var title = document.createElement('div');
    title.style.cssText = 'font-family:Fredoka One,cursive;font-size:1rem;color:#1b5e20;text-align:center;margin-bottom:0.7rem;';
    title.textContent = '📊 Player Comparison';
    wrap.appendChild(title);

    // Table
    var table = document.createElement('table');
    table.style.cssText = 'width:100%;border-collapse:collapse;font-size:0.8rem;';

    // Header row
    var thead = document.createElement('thead');
    thead.innerHTML =
      '<tr>' +
        '<th style="padding:0.35rem 0.4rem;color:#aaa;font-weight:900;font-size:0.65rem;text-transform:uppercase;letter-spacing:1px;text-align:left;border-bottom:1px solid #eee">Stat</th>' +
        '<th style="padding:0.35rem 0.4rem;color:#e53935;font-weight:900;font-size:0.78rem;text-align:center;border-bottom:1px solid #eee">' + av0 + ' ' + name0 + '</th>' +
        '<th style="padding:0.35rem 0.4rem;color:#1e88e5;font-weight:900;font-size:0.78rem;text-align:center;border-bottom:1px solid #eee">' + av1 + ' ' + name1 + '</th>' +
      '</tr>';
    table.appendChild(thead);

    // Data rows
    var tbody = document.createElement('tbody');
    rows.forEach(function(row, i) {
      var b = better(row.v0, row.v1, row.hi);
      var bg = i % 2 === 0 ? '#f9f9f9' : '#ffffff';

      var cell0Style = 'padding:0.4rem 0.4rem;text-align:center;font-weight:900;font-size:0.82rem;border-radius:6px;' +
        (b[0] ? 'color:#1b5e20;background:rgba(67,160,71,0.12);' : 'color:#555;');
      var cell1Style = 'padding:0.4rem 0.4rem;text-align:center;font-weight:900;font-size:0.82rem;border-radius:6px;' +
        (b[1] ? 'color:#1b5e20;background:rgba(67,160,71,0.12);' : 'color:#555;');

      var tr = document.createElement('tr');
      tr.style.background = bg;
      tr.innerHTML =
        '<td style="padding:0.4rem 0.4rem;font-size:0.75rem;font-weight:800;color:#666">' + row.label + '</td>' +
        '<td style="' + cell0Style + '">' + row.v0 + (b[0] ? ' ✓' : '') + '</td>' +
        '<td style="' + cell1Style + '">' + row.v1 + (b[1] ? ' ✓' : '') + '</td>';
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    wrap.appendChild(table);

    // Note
    var note = document.createElement('div');
    note.style.cssText = 'font-size:0.62rem;color:#bbb;text-align:center;margin-top:0.5rem;font-weight:700;';
    note.textContent = '✓ = better stat';
    wrap.appendChild(note);

    winStats.appendChild(wrap);
  }

  // Watch win screen
  function watchWinScreen() {
    var winScreen = document.getElementById('winScreen');
    if (!winScreen) { setTimeout(watchWinScreen, 500); return; }

    new MutationObserver(function () {
      if (winScreen.classList.contains('show')) {
        // Small delay to let win screen render first
        setTimeout(buildComparison, 400);
      }
    }).observe(winScreen, { attributes: true, attributeFilter: ['class'] });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', watchWinScreen);
  } else {
    watchWinScreen();
  }

})();