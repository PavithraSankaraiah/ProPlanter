// ===== PROPLANTER LEADERBOARD.JS =====
const MEDALS = ['🥇','🥈','🥉'];
const RANK_CLS = ['gold','silver','bronze'];

function loadLeaderboard() {
  const lb = JSON.parse(localStorage.getItem('proplanter_lb') || '[]');
  const container = document.getElementById('lbEntries');

  // Stats
  document.getElementById('statGames').textContent = lb.length;
  if (lb.length > 0) {
    // Top winner (most wins)
    const wins = {};
    lb.forEach(r => { wins[r.winner] = (wins[r.winner] || 0) + 1; });
    const top = Object.entries(wins).sort((a,b)=>b[1]-a[1])[0];
    document.getElementById('statTop').textContent = top ? top[0] : '—';
    // Avg turns
    const avg = Math.round(lb.reduce((s,r)=>s+r.turns,0)/lb.length);
    document.getElementById('statAvg').textContent = avg;
  }

  if (lb.length === 0) {
    container.innerHTML = `<div class="lb-empty"><span class="em-icon">🌱</span>No champions yet! Play a game to appear here.</div>`;
    return;
  }

  container.innerHTML = lb.map((r, i) => `
    <div class="lb-entry ${RANK_CLS[i] || ''}">
      <div class="lb-rank ${RANK_CLS[i] || 'other'}">${MEDALS[i] || (i+1)}</div>
      <div class="lb-av">${r.avatar}</div>
      <div class="lb-info">
        <div class="lb-winner">${r.winner}</div>
        <div class="lb-meta">vs ${r.opponent} · ${r.turns} turns · ${r.date}</div>
      </div>
      <div class="lb-score">₹${r.money}</div>
    </div>
  `).join('');
}

function clearBoard() {
  if (confirm('Clear all leaderboard records?')) {
    localStorage.removeItem('proplanter_lb');
    loadLeaderboard();
  }
}

loadLeaderboard();