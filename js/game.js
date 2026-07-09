// ===================================================
// PROPLANTER GAME.JS — FULL LEVELS + TOURNAMENT
// ===================================================

// ---- TILE DATA ----
const TILES = {
  1:  { e:'🏁', l1:'START',    l2:'',             cls:'t-start', action:null },
  2:  { e:'🏺', l1:'',         l2:'',             cls:'',        action:null },
  3:  { e:'⭐', l1:'+1 POT',   l2:'FREE!',        cls:'t-free',  action:'freePot' },
  4:  { e:'🏺', l1:'',         l2:'',             cls:'',        action:null },
  5:  { e:'🏺', l1:'',         l2:'',             cls:'',        action:null },
  6:  { e:'🏺', l1:'',         l2:'',             cls:'',        action:null },
  7:  { e:'🏺', l1:'',         l2:'',             cls:'',        action:null },
  8:  { e:'🏺', l1:'',         l2:'',             cls:'',        action:null },
  9:  { e:'☠️', l1:'-1 POT',   l2:'DANGER!',      cls:'t-danger',action:'losePot' },
  10: { e:'🔚', l1:'Stage 1',  l2:'End',          cls:'t-end',   action:null },

  11: { e:'🌱', l1:'',         l2:'',             cls:'',        action:null },
  12: { e:'💰', l1:'Buy SOIL', l2:'₹80',          cls:'t-buy',   action:'buySoil', cost:80 },
  13: { e:'💸', l1:'Sell POT', l2:'₹200→DANGER',  cls:'t-sell',  action:'sellPot' },
  14: { e:'🌱', l1:'',         l2:'',             cls:'',        action:null },
  15: { e:'💰', l1:'Buy SOIL', l2:'₹10',          cls:'t-buy',   action:'buySoil', cost:10 },
  16: { e:'🌱', l1:'',         l2:'',             cls:'',        action:null },
  17: { e:'💰', l1:'Buy SOIL', l2:'₹10',          cls:'t-buy',   action:'buySoil', cost:10 },
  18: { e:'💰', l1:'Buy SOIL', l2:'₹10',          cls:'t-buy',   action:'buySoil', cost:10 },
  19: { e:'🌱', l1:'',         l2:'',             cls:'',        action:null },
  20: { e:'🔚', l1:'Stage 2',  l2:'End',          cls:'t-end',   action:null },

  21: { e:'🌰', l1:'',         l2:'',             cls:'',        action:null },
  22: { e:'💰', l1:'Buy SEED', l2:'₹20',          cls:'t-buy',   action:'buySeed', cost:20 },
  23: { e:'🌰', l1:'',         l2:'',             cls:'',        action:null },
  24: { e:'🌰', l1:'',         l2:'',             cls:'',        action:null },
  25: { e:'💰', l1:'Buy SEED', l2:'₹10',          cls:'t-buy',   action:'buySeed', cost:10 },
  26: { e:'🌰', l1:'',         l2:'',             cls:'',        action:null },
  27: { e:'🎁', l1:'BONUS!',   l2:'+₹250',        cls:'t-free',  action:'bonus250' },
  28: { e:'💰', l1:'Buy SEED', l2:'₹30',          cls:'t-buy',   action:'buySeed', cost:30 },
  29: { e:'🌰', l1:'',         l2:'',             cls:'',        action:null },
  30: { e:'💰', l1:'Buy SEED', l2:'₹20',          cls:'t-buy',   action:'buySeed', cost:20 },

  31: { e:'🌿', l1:'',         l2:'',             cls:'',        action:null },
  32: { e:'💰', l1:'MANURE',   l2:'₹20',          cls:'t-buy',   action:'buyManure', cost:20 },
  33: { e:'🌿', l1:'',         l2:'',             cls:'',        action:null },
  34: { e:'💰', l1:'Buy SEED', l2:'₹200',         cls:'t-buy',   action:'buySeed', cost:200 },
  35: { e:'🌿', l1:'',         l2:'',             cls:'',        action:null },
  36: { e:'🌿', l1:'',         l2:'',             cls:'',        action:null },
  37: { e:'🎁', l1:'BONUS!',   l2:'+₹250',        cls:'t-free',  action:'bonus250' },
  38: { e:'💰', l1:'MANURE',   l2:'₹30',          cls:'t-buy',   action:'buyManure', cost:30 },
  39: { e:'🌿', l1:'',         l2:'',             cls:'',        action:null },
  40: { e:'🔚', l1:'Stage 4',  l2:'End',          cls:'t-end',   action:null },

  41: { e:'🌳', l1:'',         l2:'',             cls:'',        action:null },
  42: { e:'🌧️', l1:'RAIN!',    l2:'YOU WIN!',     cls:'t-win',   action:'win' },
  43: { e:'☠️', l1:'-1 POT',   l2:'DANGER!',      cls:'t-danger',action:'losePot' },
  44: { e:'🌧️', l1:'RAIN!',    l2:'YOU WIN!',     cls:'t-win',   action:'win' },
  45: { e:'🌳', l1:'',         l2:'',             cls:'',        action:null },
  46: { e:'🌧️', l1:'RAIN!',    l2:'YOU WIN!',     cls:'t-win',   action:'win' },
  47: { e:'🌳', l1:'',         l2:'',             cls:'',        action:null },
  48: { e:'🌧️', l1:'RAIN!',    l2:'YOU WIN!',     cls:'t-win',   action:'win' },
  49: { e:'☠️', l1:'-1 POT',   l2:'DANGER!',      cls:'t-danger',action:'losePot' },
  50: { e:'🏆', l1:'FINISH!',  l2:'',             cls:'t-win',   action:'win' },
};

// ---- DIFFICULTY CONFIGS ----
const DIFF_CONFIG = {
  easy: {
    startMoney: 800, mandatoryCost: 60,
    dangerAction: 'goBack',  // go back 3 tiles instead of restart
    sellPotRestart: false,   // lose pot + back to tile 1, no full restart
    sellPotMoney: 200,
    diceMax: 6,
    weatherEvents: false,
    powerCards: false,
    label: '🟢 EASY',
    color: '#2e7d32',
  },
  medium: {
    startMoney: 500, mandatoryCost: 120,
    dangerAction: 'restart',
    sellPotRestart: true,
    sellPotMoney: 200,
    diceMax: 6,
    weatherEvents: false,
    powerCards: false,
    label: '🟡 MEDIUM',
    color: '#f9a825',
  },
  hard: {
    startMoney: 300, mandatoryCost: 150,
    dangerAction: 'restart',
    sellPotRestart: true,
    sellPotMoney: 100,       // only ₹100 in hard mode
    diceMax: 4,              // dice 1-4 only
    weatherEvents: true,
    powerCards: false,
    label: '🔴 HARD',
    color: '#b71c1c',
  },
  tournament: {
    startMoney: 500, mandatoryCost: 120,
    dangerAction: 'restart',
    sellPotRestart: true,
    sellPotMoney: 200,
    diceMax: 6,
    weatherEvents: false,
    powerCards: true,
    totalRounds: 3,
    label: '🏆 TOURNAMENT',
    color: '#7b1fa2',
  },
};

// ---- WEATHER EVENTS (Hard mode) ----
const WEATHER_EVENTS = [
  { icon:'☀️', name:'Heatwave!',    msg:'Scorching heat damages your plant!', effect:'money',   val:-50 },
  { icon:'🌧️', name:'Flood!',       msg:'Heavy rain pushes you back!',        effect:'move',    val:-2  },
  { icon:'🐛', name:'Pest Attack!', msg:'Pests ate your soil and seeds!',      effect:'losePlants', val:0 },
  { icon:'💨', name:'Good Wind!',   msg:'Wind carries your seeds forward!',    effect:'move',    val:2  },
  { icon:'❄️', name:'Frost!',       msg:'Frost damage costs you money!',       effect:'money',   val:-40 },
  { icon:'🌈', name:'Perfect Day!', msg:'Ideal conditions! Earn a bonus!',     effect:'money',   val:80  },
];

// ---- POWER CARDS ----
const POWER_CARDS = [
  { id:'shield',    icon:'🛡️', name:'Shield',    desc:'Skip one restart — used automatically',  auto:true  },
  { id:'loan',      icon:'💰', name:'Loan',      desc:'Borrow ₹150 instantly',                  auto:false },
  { id:'precision', icon:'🎯', name:'Precision', desc:'Move exactly 6 tiles forward',            auto:false },
  { id:'swap',      icon:'🔄', name:'Swap',      desc:'Swap positions with opponent',             auto:false },
];

const STAGE_OF     = t => t<=10?1 : t<=20?2 : t<=30?3 : t<=40?4 : 5;
const STAGE_LABELS = ['','🏺 Getting a Pot','🌱 Filling Soil','🌰 Planting Seeds','🌿 Adding Manure','🌳 Growing!'];
const DICE_FACES   = ['⚀','⚁','⚂','⚃','⚄','⚅'];
const P_COLORS     = ['#e53935','#1e88e5'];
const MOVE_SPEED   = 280;

// ---- GLOBAL STATE ----
let players      = [];
let currentTurn  = 0;
let rolling      = false;
let gameOver     = false;
let popupCb      = null;
let difficulty   = 'medium';
let cfg          = DIFF_CONFIG.medium;
let globalTurn   = 0;  // counts every turn for weather events

// Tournament state
let tournamentRound = 1;
let tournamentWins  = [0, 0];

// ================================================================
// SETUP SCREEN — DIFFICULTY SELECTION
// ================================================================
const DIFF_INFO = {
  easy:       '🟢 Relaxed rules · ₹800 start · ₹60 penalty · Danger = go back 3 tiles',
  medium:     '🟡 Balanced rules · ₹500 start · ₹120 penalty · Normal restarts',
  hard:       '🔴 Brutal rules · ₹300 start · ₹150 penalty · Dice 1–4 · Weather events every 5 turns',
  tournament: '🏆 Best of 3 rounds · ₹500 start · Power cards · Normal rules',
};

function selectDiff(d) {
  difficulty = d;
  cfg        = DIFF_CONFIG[d];
  document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('d-' + d).classList.add('active');
  document.getElementById('diffInfoText').textContent = DIFF_INFO[d];
}

// Avatar picking
document.querySelectorAll('.avatar-group').forEach(grp => {
  grp.querySelectorAll('.av').forEach(btn => {
    btn.addEventListener('click', () => {
      grp.querySelectorAll('.av').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
  });
});

// ================================================================
// START GAME
// ================================================================
function startGame() {
  cfg = DIFF_CONFIG[difficulty];
  const names = [
    document.getElementById('p1name').value.trim() || 'Player 1',
    document.getElementById('p2name').value.trim() || 'Player 2',
  ];
  const avatars = [
    document.querySelector('#av0 .av.selected')?.dataset.av || '🐸',
    document.querySelector('#av1 .av.selected')?.dataset.av || '🦋',
  ];

  players = [0,1].map(i => makePlayer(i, names[i], avatars[i]));

  // Assign random power cards in tournament mode
  if (cfg.powerCards) {
    players.forEach((p, i) => {
      const card = POWER_CARDS[Math.floor(Math.random() * POWER_CARDS.length)];
      p.powerCard = { ...card, used: false };
    });
  }

  globalTurn       = 0;
  tournamentRound  = 1;
  tournamentWins   = [0, 0];

  document.getElementById('setupScreen').style.display = 'none';
  document.getElementById('gameScreen').style.display  = 'block';

  // Show/hide tournament bar
  document.getElementById('tournBar').style.display = cfg.powerCards ? 'flex' : 'none';
  // Show/hide power card slots
  document.getElementById('pslot0').style.display = cfg.powerCards ? 'flex' : 'none';
  document.getElementById('pslot1').style.display = cfg.powerCards ? 'flex' : 'none';

  // Mode badge
  const badge = document.getElementById('modeBadge');
  badge.textContent = cfg.label;
  badge.style.background = cfg.color;

  buildBoard();
  refreshAll();
  updateTournamentBar();
  addLog(`🌱 Game started! Mode: ${cfg.label}`, 'log-good');
  addLog(`💰 Each player starts with ₹${cfg.startMoney}`, 'log-info');
  if (cfg.weatherEvents) addLog('⚡ Weather events active every 5 turns!', 'log-warn');
  if (cfg.powerCards)    addLog('🃏 Power cards assigned! Use them wisely.', 'log-warn');
}

function makePlayer(i, name, avatar) {
  return {
    name, avatar, color: P_COLORS[i],
    pos: 0, money: cfg.startMoney,
    hasPot: false, hasSoil: false, hasSeed: false, hasManure: false,
    landedPotTile: false, landedSoilTile: false,
    landedSeedTile: false, landedManureTile: false,
    lastStage: 1, stagesChecked: [],
    shieldActive: false,
    stats: {
      tilesLanded: 0, totalSpent: 0, totalEarned: 0,
      restarts: 0, mandatoryPaid: 0, bonusEarned: 0,
    },
    powerCard: null,
    turns: 0,
  };
}

// ================================================================
// BUILD BOARD
// ================================================================
function buildBoard() {
  const grid = document.getElementById('boardGrid');
  grid.innerHTML = '';
  for (let n = 1; n <= 50; n++) {
    const t   = TILES[n] || { e:'⬜', l1:'', l2:'', cls:'' };
    const stg = STAGE_OF(n);
    const div = document.createElement('div');
    div.className = `tile s${stg} ${t.cls}`.trim();
    div.id = `tile-${n}`;
    div.innerHTML = `
      <span class="tile-num">${n}</span>
      <span class="tile-emoji">${t.e}</span>
      ${t.l1 ? `<span class="tile-line1">${t.l1}</span>` : ''}
      ${t.l2 ? `<span class="tile-line2">${t.l2}</span>` : ''}
      <div class="tile-players" id="tp-${n}"></div>
    `;
    grid.appendChild(div);
  }
  renderAvatars();
}

// ================================================================
// RENDER AVATARS
// ================================================================
function renderAvatars() {
  for (let n = 0; n <= 50; n++) {
    const el = document.getElementById(`tp-${n}`);
    if (el) el.innerHTML = '';
  }
  document.querySelectorAll('.tile.player-here').forEach(t => t.classList.remove('player-here'));
  players.forEach((p, i) => {
    if (p.pos < 1) return;
    const container = document.getElementById(`tp-${p.pos}`);
    if (container) {
      const token = document.createElement('div');
      token.className = 'av-token' + (i === currentTurn ? ' av-active' : '');
      token.style.setProperty('--pc', p.color);
      token.textContent = p.avatar;
      container.appendChild(token);
    }
    if (i === currentTurn) {
      document.getElementById(`tile-${p.pos}`)?.classList.add('player-here');
    }
  });
}

// ================================================================
// REFRESH UI
// ================================================================
function refreshAll() {
  players.forEach((_, i) => refreshCard(i));
  renderAvatars();
  updateTurnUI();
  updateTournamentBar();
}

function refreshCard(i) {
  const p     = players[i];
  const stage = STAGE_OF(Math.max(p.pos, 1));
  document.getElementById(`pcav${i}`).textContent   = p.avatar;
  document.getElementById(`pcname${i}`).textContent = p.name;
  document.getElementById(`pcloc${i}`).textContent  = `📍 Tile ${p.pos} — Stage ${stage}`;
  document.getElementById(`pm${i}`).textContent     = `₹${p.money}`;
  document.getElementById(`pp${i}`).textContent     = p.hasPot    ? '✅' : '❌';
  document.getElementById(`ps${i}`).textContent     = p.hasSoil   ? '✅' : '❌';
  document.getElementById(`pse${i}`).textContent    = p.hasSeed   ? '✅' : '❌';
  document.getElementById(`pma${i}`).textContent    = p.hasManure ? '✅' : '❌';
  document.getElementById(`pstage${i}`).textContent = STAGE_LABELS[stage] || '';
  document.getElementById(`prog${i}`).style.width   = Math.round((p.pos/50)*100) + '%';
  const card = document.getElementById(`pc${i}`);
  card.style.setProperty('--pc', p.color);
  card.classList.toggle('active', i === currentTurn);

  // Power card display
  if (cfg.powerCards && p.powerCard) {
    const pn = document.getElementById(`pname${i}`);
    const pb = document.getElementById(`pbtn${i}`);
    if (pn) pn.textContent = `${p.powerCard.icon} ${p.powerCard.name}`;
    if (pb) {
      pb.disabled = p.powerCard.used || p.powerCard.auto || i !== currentTurn;
      pb.textContent = p.powerCard.used ? '✅ Used' : 'Use Card';
    }
  }
}

function updateTurnUI() {
  const p = players[currentTurn];
  document.getElementById('turnPill').textContent  = `${p.avatar} ${p.name}'s Turn`;
  document.getElementById('turnLabel').textContent = `${p.name}'s Turn`;
  document.getElementById('rollBtn').disabled = gameOver;
  // Hard mode dice label
  if (cfg.diceMax === 4) {
    document.getElementById('turnLabel').textContent = `${p.name}'s Turn (Dice 1–4)`;
  }
  // Turn counter
  document.getElementById('turnCounter').textContent =
    cfg.weatherEvents ? `Turn ${globalTurn} · Next weather: Turn ${Math.ceil((globalTurn+1)/5)*5}` : '';
}

function updateTournamentBar() {
  if (!cfg.powerCards) return;
  document.getElementById('tsav0').textContent   = players[0].avatar;
  document.getElementById('tsname0').textContent = players[0].name;
  document.getElementById('tsav1').textContent   = players[1].avatar;
  document.getElementById('tsname1').textContent = players[1].name;
  document.getElementById('roundNum').textContent = tournamentRound;
  // Win stars
  const stars = (n) => '🌟'.repeat(n) + '⭐'.repeat(3 - n);
  document.getElementById('tswins0').textContent = stars(tournamentWins[0]);
  document.getElementById('tswins1').textContent = stars(tournamentWins[1]);
}

// ================================================================
// LOGGING
// ================================================================
function addLog(msg, cls = 'log-info') {
  const list = document.getElementById('logList');
  const el   = document.createElement('div');
  el.className   = 'log-entry ' + cls;
  el.textContent = msg;
  list.prepend(el);
  while (list.children.length > 40) list.removeChild(list.lastChild);
}

// ================================================================
// DICE ROLL
// ================================================================
function rollDice() {
  if (rolling || gameOver) return;
  rolling = true;
  document.getElementById('rollBtn').disabled = true;
  const face = document.getElementById('diceFace');
  face.classList.add('rolling');
  let flashes = 0;
  const iv = setInterval(() => {
    face.textContent = DICE_FACES[Math.floor(Math.random() * cfg.diceMax)];
    if (++flashes >= 12) {
      clearInterval(iv);
      face.classList.remove('rolling');
      const roll = Math.floor(Math.random() * cfg.diceMax) + 1;
      face.textContent = DICE_FACES[roll - 1];
      globalTurn++;
      addLog(`🎲 ${players[currentTurn].name} rolled a ${roll}`, 'log-info');

      // Check weather event (Hard mode every 5 turns)
      if (cfg.weatherEvents && globalTurn % 5 === 0) {
        triggerWeatherEvent(() => movePlayer(currentTurn, roll));
      } else {
        movePlayer(currentTurn, roll);
      }
    }
  }, 70);
}

// ================================================================
// WEATHER EVENTS (Hard mode)
// ================================================================
function triggerWeatherEvent(cb) {
  const ev = WEATHER_EVENTS[Math.floor(Math.random() * WEATHER_EVENTS.length)];
  const strip = document.getElementById('weatherStrip');
  strip.textContent = `${ev.icon} ${ev.name}`;
  strip.style.display = 'block';
  setTimeout(() => { strip.style.display = 'none'; }, 4000);

  // Apply effect to BOTH players
  let effectDesc = '';
  players.forEach((p, i) => {
    if (ev.effect === 'money') {
      p.money = Math.max(0, p.money + ev.val);
      effectDesc = ev.val > 0 ? `+₹${ev.val} each!` : `₹${Math.abs(ev.val)} lost each!`;
    } else if (ev.effect === 'move') {
      p.pos = Math.max(0, Math.min(50, p.pos + ev.val));
      effectDesc = ev.val > 0 ? `+${ev.val} tiles forward!` : `${Math.abs(ev.val)} tiles back!`;
    } else if (ev.effect === 'losePlants') {
      p.hasSoil = false; p.hasSeed = false;
      effectDesc = 'Soil & Seeds lost!';
    }
    refreshCard(i);
  });
  renderAvatars();

  addLog(`⚡ WEATHER: ${ev.name} — ${effectDesc}`, 'log-bad');
  showPopup({
    icon: ev.icon, title: `Weather Event! ${ev.name}`, theme: ev.val >= 0 ? 'green' : 'red',
    lines: [
      { label: 'Event',   value: ev.name },
      { label: 'Effect',  value: ev.msg },
      { label: 'Result',  value: effectDesc },
      { label: 'Affects', value: 'BOTH players!' },
    ],
    btn: 'Continue Rolling →', btnColor: ev.val >= 0 ? '#2e7d32' : '#b71c1c',
    cb
  });
}

// ================================================================
// POWER CARDS (Tournament mode)
// ================================================================
function usePowerCard(pi) {
  if (pi !== currentTurn) return;
  const p = players[pi];
  if (!p.powerCard || p.powerCard.used) return;

  const card = p.powerCard;
  card.used = true;

  if (card.id === 'loan') {
    p.money += 150;
    addLog(`💰 ${p.name} used LOAN card! +₹150`, 'log-good');
    showPopup({
      icon:'💰', title:'Loan Card Used!', theme:'gold',
      lines:[
        { label:'Player',      value: p.name },
        { label:'Card',        value: '💰 Loan' },
        { label:'Borrowed',    value: '+₹150' },
        { label:'New Balance', value: `₹${p.money}` },
      ],
      btn:'Continue →', btnColor:'#c77700',
      cb: () => { refreshCard(pi); }
    });
  } else if (card.id === 'precision') {
    p.pos = Math.min(50, p.pos + 6);
    addLog(`🎯 ${p.name} used PRECISION card! +6 tiles`, 'log-good');
    renderAvatars(); refreshCard(pi);
    showPopup({
      icon:'🎯', title:'Precision Card!', theme:'blue',
      lines:[
        { label:'Player', value: p.name },
        { label:'Card',   value: '🎯 Precision' },
        { label:'Moved',  value: '+6 tiles forward' },
        { label:'Now on', value: `Tile ${p.pos}` },
      ],
      btn:'Continue →', btnColor:'#0d47a1',
      cb: () => { processTile(pi); }
    });
  } else if (card.id === 'swap') {
    const opp  = players[1 - pi];
    const temp = p.pos;
    p.pos      = opp.pos;
    opp.pos    = temp;
    addLog(`🔄 ${p.name} used SWAP! Positions swapped!`, 'log-good');
    renderAvatars(); refreshCard(pi); refreshCard(1-pi);
    showPopup({
      icon:'🔄', title:'Swap Card Used!', theme:'purple',
      lines:[
        { label:'Player',      value: p.name },
        { label:'Swapped with',value: opp.name },
        { label:'Your tile',   value: `Tile ${p.pos}` },
        { label:'Their tile',  value: `Tile ${opp.pos}` },
      ],
      btn:'Continue →', btnColor:'#6a1b9a',
      cb: () => {}
    });
  }
  refreshCard(pi);
}

// ================================================================
// MOVE PLAYER — safe step by step
// ================================================================
function movePlayer(pi, steps) {
  const p      = players[pi];
  const target = Math.min(p.pos + steps, 50);

  function stepOne() {
    if (p.pos >= target) {
      p.turns++;
      p.stats.tilesLanded++;
      refreshCard(pi);
      addLog(`📍 ${p.name} landed on Tile ${p.pos}`, 'log-info');
      setTimeout(() => processTile(pi), 450);
      return;
    }
    document.getElementById(`tile-${p.pos}`)?.classList.remove('player-here');
    p.pos += 1;
    renderAvatars();
    refreshCard(pi);
    setTimeout(stepOne, MOVE_SPEED);
  }
  stepOne();
}

// ================================================================
// PROCESS TILE — checks stage transition first
// ================================================================
function processTile(pi) {
  const p = players[pi];
  const t = TILES[p.pos];
  if (!t) { endTurn(); return; }

  const currentStage = STAGE_OF(p.pos);
  if (currentStage > p.lastStage) {
    const stageJustLeft = p.lastStage;
    p.lastStage = currentStage;
    handleStageEnd(pi, stageJustLeft, () => runTileAction(pi));
    return;
  }
  runTileAction(pi);
}

// ================================================================
// RUN TILE ACTION
// ================================================================
function runTileAction(pi) {
  const p = players[pi];
  const t = TILES[p.pos];
  if (!t || !t.action) { endTurn(); return; }

  switch (t.action) {

    // ── FREE POT ────────────────────────────────────────────────
    case 'freePot':
      p.hasPot = true; p.landedPotTile = true;
      addLog(`⭐ ${p.name} got FREE pot on Tile 3!`, 'log-good');
      showPopup({
        icon:'⭐', title:'Free Pot!', theme:'green',
        lines:[
          { label:'Player',  value: p.name },
          { label:'Tile',    value: '3 — Lucky!' },
          { label:'Reward',  value: '🏺 FREE pot!' },
          { label:'Balance', value: `₹${p.money} (unchanged)` },
        ],
        btn:'Great! →', btnColor:'#2e7d32',
        cb: () => { refreshCard(pi); endTurn(); }
      }); break;

    // ── LOSE POT ────────────────────────────────────────────────
    case 'losePot':
      if (cfg.dangerAction === 'goBack') {
        // EASY MODE — just go back 3 tiles
        p.pos = Math.max(1, p.pos - 3);
        addLog(`⚠️ ${p.name} stepped on danger! Goes back 3 tiles (Easy mode)`, 'log-bad');
        renderAvatars(); refreshCard(pi);
        showPopup({
          icon:'⚠️', title:'Danger Tile! (Easy Mode)', theme:'orange',
          lines:[
            { label:'Player', value: p.name },
            { label:'Tile',   value: `${p.pos + 3} — Oops!` },
            { label:'Effect', value: 'Go back 3 tiles (Easy mode)' },
            { label:'Now on', value: `Tile ${p.pos}` },
          ],
          btn:'Okay! →', btnColor:'#e65100',
          cb: () => { endTurn(); }
        });
      } else {
        // Check shield power card
        if (p.powerCard?.id === 'shield' && !p.powerCard.used) {
          p.powerCard.used = true;
          addLog(`🛡️ ${p.name}'s Shield blocked the restart!`, 'log-good');
          showPopup({
            icon:'🛡️', title:'Shield Activated!', theme:'blue',
            lines:[
              { label:'Player', value: p.name },
              { label:'Tile',   value: `${p.pos} — Danger!` },
              { label:'Shield', value: '🛡️ Restart blocked!' },
              { label:'Note',   value: 'Shield used up.' },
            ],
            btn:'Safe! →', btnColor:'#0d47a1',
            cb: () => { refreshCard(pi); endTurn(); }
          });
        } else {
          p.hasPot = false; p.hasSoil = false; p.hasSeed = false; p.hasManure = false;
          addLog(`☠️ ${p.name} hit danger on Tile ${p.pos}! RESTART!`, 'log-bad');
          showPopup({
            icon:'☠️', title:'Pot Destroyed! Restart!', theme:'red',
            lines:[
              { label:'Player', value: p.name },
              { label:'Tile',   value: `${p.pos} — Danger!` },
              { label:'Lost',   value: '🏺 Pot gone!' },
              { label:'Action', value: '🔄 Restart · ₹500 reset' },
            ],
            btn:'Restart →', btnColor:'#b71c1c',
            cb: () => { refreshCard(pi); doReset(pi, endTurn); }
          });
        }
      }
      break;

    // ── SELL POT ────────────────────────────────────────────────
    case 'sellPot':
      const sellAmt = cfg.sellPotMoney;
      p.money += sellAmt;
      p.hasPot = false; p.hasSoil = false; p.hasSeed = false; p.hasManure = false;
      addLog(`💸 ${p.name} sold pot ₹${sellAmt} on Tile 13! Restart!`, 'log-bad');
      if (cfg.sellPotRestart) {
        showPopup({
          icon:'💸', title:'Pot Sold! Restart!', theme:'purple',
          lines:[
            { label:'Player',   value: p.name },
            { label:'Tile',     value: '13 — Sold Pot!' },
            { label:'Received', value: `₹${sellAmt}` },
            { label:'Action',   value: '🔄 Restart · Money resets to ₹500' },
          ],
          btn:'Restart →', btnColor:'#6a1b9a',
          cb: () => { refreshCard(pi); doReset(pi, endTurn); }
        });
      } else {
        // EASY MODE — goes to tile 1, keeps money
        p.pos = 1; p.lastStage = 1; p.stagesChecked = [];
        renderAvatars(); refreshCard(pi);
        showPopup({
          icon:'💸', title:'Pot Sold! (Easy Mode)', theme:'orange',
          lines:[
            { label:'Player',   value: p.name },
            { label:'Received', value: `₹${sellAmt}` },
            { label:'Effect',   value: 'Back to Tile 1 (Easy mode)' },
            { label:'Money',    value: `₹${p.money} (kept)` },
          ],
          btn:'Continue →', btnColor:'#e65100',
          cb: () => { endTurn(); }
        });
      }
      break;

    // ── BUY SOIL ────────────────────────────────────────────────
    case 'buySoil':
      p.landedSoilTile = true;
      buyItem(pi, '🌱', 'Soil', t.cost, 'green', () => { p.hasSoil = true; endTurn(); });
      break;

    // ── BUY SEED ────────────────────────────────────────────────
    case 'buySeed':
      p.landedSeedTile = true;
      buyItem(pi, '🌰', 'Seed', t.cost, 'amber', () => { p.hasSeed = true; endTurn(); });
      break;

    // ── BUY MANURE ──────────────────────────────────────────────
    case 'buyManure':
      p.landedManureTile = true;
      buyItem(pi, '🌿', 'Manure', t.cost, 'teal', () => { p.hasManure = true; endTurn(); });
      break;

    // ── BONUS ────────────────────────────────────────────────────
    case 'bonus250':
      p.money += 250;
      p.stats.bonusEarned += 250;
      addLog(`🎁 ${p.name} earned ₹250 bonus on Tile ${p.pos}!`, 'log-good');
      showPopup({
        icon:'🎁', title:'Bonus ₹250!', theme:'gold',
        lines:[
          { label:'Player',      value: p.name },
          { label:'Tile',        value: `${p.pos} — Bonus!` },
          { label:'Earned',      value: '+₹250 💰' },
          { label:'New Balance', value: `₹${p.money}` },
        ],
        btn:'Collect! →', btnColor:'#c77700',
        cb: () => { refreshCard(pi); endTurn(); }
      }); break;

    // ── WIN ──────────────────────────────────────────────────────
    case 'win':
      addLog(`🌧️ ${p.name} hit RAIN on Tile ${p.pos}! WINNER!`, 'log-good');
      showPopup({
        icon:'🌧️', title:"It's Raining! You Win!", theme:'blue',
        lines:[
          { label:'Player', value: p.name },
          { label:'Tile',   value: `${p.pos} — Rain!` },
          { label:'Turns',  value: `${p.turns}` },
          { label:'Money',  value: `₹${p.money}` },
        ],
        btn:'🏆 Victory!', btnColor:'#0d47a1',
        cb: () => handleWin(pi)
      }); break;

    default: endTurn();
  }
}

// ================================================================
// BUY ITEM HELPER — always charges every landing
// ================================================================
function buyItem(pi, icon, name, cost, theme, onBought) {
  const p = players[pi];
  if (p.money < cost) {
    addLog(`❌ ${p.name} can't afford ${name} ₹${cost}! RESTART!`, 'log-bad');
    showPopup({
      icon:'😰', title:'Not Enough Money!', theme:'red',
      lines:[
        { label:'Player',  value: p.name },
        { label:'Item',    value: `${icon} ${name}` },
        { label:'Cost',    value: `₹${cost}` },
        { label:'Balance', value: `₹${p.money} ❌` },
        { label:'Action',  value: '🔄 Restart!' },
      ],
      btn:'Restart →', btnColor:'#b71c1c',
      cb: () => { refreshCard(pi); doReset(pi, endTurn); }
    });
  } else {
    showPopup({
      icon, title:`Buy ${name} — ₹${cost}`, theme,
      lines:[
        { label:'Player',    value: p.name },
        { label:'Tile',      value: `${p.pos}` },
        { label:'Cost',      value: `₹${cost}` },
        { label:'Balance',   value: `₹${p.money}` },
        { label:'After buy', value: `₹${p.money - cost}` },
      ],
      btn:`Pay ₹${cost} →`, btnColor: theme==='green'?'#2e7d32':theme==='teal'?'#00695c':'#e65100',
      cb: () => {
        p.money -= cost;
        p.stats.totalSpent += cost;
        addLog(`${icon} ${p.name} bought ${name} ₹${cost}. Balance: ₹${p.money}`, 'log-warn');
        refreshCard(pi);
        onBought();
      }
    });
  }
}

// ================================================================
// STAGE END — MANDATORY PURCHASES
// ================================================================
function handleStageEnd(pi, stage, cb) {
  const p    = players[pi];
  const cost = cfg.mandatoryCost;

  const items = {
    1: { need: !p.hasPot,     icon:'🏺', name:'Pot',    setFlag: () => { p.hasPot = true; }    },
    2: { need: !p.hasSoil,    icon:'🌱', name:'Soil',   setFlag: () => { p.hasSoil = true; }   },
    3: { need: !p.hasSeed,    icon:'🌰', name:'Seed',   setFlag: () => { p.hasSeed = true; }   },
    4: { need: !p.hasManure,  icon:'🌿', name:'Manure', setFlag: () => { p.hasManure = true; } },
  };

  const item = items[stage];
  if (!item || !item.need) { cb(); return; } // already have it
  addLog(`⚠️ ${p.name} missed ${item.name} in Stage ${stage}! Mandatory ₹${cost}`, 'log-bad');

  if (p.money < cost) {
    showPopup({
      icon:'😰', title:`Can't Afford ${item.name}!`, theme:'red',
      lines:[
        { label:'Player',  value: p.name },
        { label:'Stage',   value: `${stage} End — Need ${item.name}` },
        { label:'Cost',    value: `₹${cost} (mandatory)` },
        { label:'Balance', value: `₹${p.money} ❌ Not enough!` },
        { label:'Action',  value: '🔄 Restart!' },
      ],
      btn:'Restart →', btnColor:'#b71c1c',
      cb: () => { refreshCard(pi); doReset(pi, cb); }
    });
  } else {
    showPopup({
      icon: item.icon, title:`Mandatory ${item.name} — ₹${cost}`, theme:'orange',
      lines:[
        { label:'Player',    value: p.name },
        { label:'Stage',     value: `${stage} End — Missed ${item.name}!` },
        { label:'Penalty',   value: `₹${cost} mandatory` },
        { label:'Balance',   value: `₹${p.money}` },
        { label:'After buy', value: `₹${p.money - cost}` },
      ],
      btn:`Buy ${item.name} ₹${cost} →`, btnColor:'#e65100',
      cb: () => {
        p.money -= cost;
        item.setFlag();
        addLog(`${item.icon} ${p.name} paid mandatory ${item.name} ₹${cost}. Balance: ₹${p.money}`, 'log-warn');
        refreshCard(pi); cb();
      }
    });
  }
}

// ================================================================
// RESET PLAYER
// ================================================================
function doReset(pi, cb) {
  const p = players[pi];
  p.pos = 0; p.money = cfg.startMoney;
  p.hasPot = false; p.hasSoil = false; p.hasSeed = false; p.hasManure = false;
  p.landedPotTile = false; p.landedSoilTile = false;
  p.landedSeedTile = false; p.landedManureTile = false;
  p.lastStage = 1; p.stagesChecked = [];
  refreshCard(pi); renderAvatars();
  p.stats.restarts++;
  addLog(`🔄 ${p.name} restarted! Money reset to ₹${cfg.startMoney}`, 'log-bad');
  showPopup({
    icon:'🔄', title:'Journey Restarted!', theme:'blue',
    lines:[
      { label:'Player',  value: p.name },
      { label:'Back to', value: 'Tile 1' },
      { label:'Money',   value: `₹${cfg.startMoney} (reset)` },
      { label:'Pot',     value: '❌ Must earn again' },
    ],
    btn:"Let's Go! →", btnColor:'#1565c0',
    cb
  });
}

// ================================================================
// END TURN
// ================================================================
function endTurn() {
  rolling = false;
  if (gameOver) return;
  currentTurn = currentTurn === 0 ? 1 : 0;
  refreshAll();
  document.getElementById('rollBtn').disabled = false;
}

// ================================================================
// HANDLE WIN — normal or tournament
// ================================================================
function handleWin(pi) {
  if (difficulty === 'tournament') {
    tournamentWins[pi]++;
    addLog(`🏆 ${players[pi].name} wins Round ${tournamentRound}! Score: ${tournamentWins[0]}–${tournamentWins[1]}`, 'log-good');

    // Check if someone won the tournament (2 out of 3)
    if (tournamentWins[pi] >= 2) {
      showWin(pi, true);
    } else if (tournamentRound >= 3) {
      // All 3 rounds done — whoever has more wins
      const champion = tournamentWins[0] > tournamentWins[1] ? 0 : 1;
      showWin(champion, true);
    } else {
      // Start next round
      tournamentRound++;
      updateTournamentBar();
      const bonus = Math.round(players[pi].money * 0.1); // 10% money carries forward as bonus
      showPopup({
        icon:'🌟', title:`Round ${tournamentRound-1} Complete!`, theme:'purple',
        lines:[
          { label:'Winner',       value: `${players[pi].avatar} ${players[pi].name}` },
          { label:'Score',        value: `${tournamentWins[0]}–${tournamentWins[1]}` },
          { label:'Next',         value: `Round ${tournamentRound} of 3` },
          { label:'Carry-over',   value: `₹${bonus} bonus for winner` },
        ],
        btn:`Start Round ${tournamentRound}! →`, btnColor:'#7b1fa2',
        cb: () => {
          // Reset board for next round
          players.forEach((p, i) => {
            const startBonus = i === pi ? bonus : 0;
            Object.assign(p, {
              pos: 0, money: cfg.startMoney + startBonus,
              hasPot: false, hasSoil: false, hasSeed: false, hasManure: false,
              landedPotTile: false, landedSoilTile: false,
              landedSeedTile: false, landedManureTile: false,
              lastStage: 1, stagesChecked: [], turns: 0,
            });
            // Give new power card for next round
            if (cfg.powerCards) {
              p.powerCard = { ...POWER_CARDS[Math.floor(Math.random() * POWER_CARDS.length)], used: false };
            }
          });
          gameOver    = false;
          currentTurn = pi; // winner goes first next round
          buildBoard();
          refreshAll();
          addLog(`🌱 Round ${tournamentRound} started!`, 'log-good');
        }
      });
    }
  } else {
    showWin(pi, false);
  }
}

// ================================================================
// WIN SCREEN
// ================================================================
function showWin(pi, isTournament) {
  gameOver = true;
  const p  = players[pi];
  const lb = JSON.parse(localStorage.getItem('proplanter_lb') || '[]');
  lb.unshift({
    winner: p.name, avatar: p.avatar, turns: p.turns,
    money: p.money, tile: p.pos, mode: cfg.label,
    date: new Date().toLocaleDateString('en-IN'),
    opponent: players[1-pi].name,
  });
  if (lb.length > 10) lb.length = 10;
  localStorage.setItem('proplanter_lb', JSON.stringify(lb));

  setTimeout(() => {
    document.getElementById('winTrophy').textContent = isTournament ? '🏆' : '🌧️';
    document.getElementById('winTitle').textContent  = isTournament ? 'TOURNAMENT CHAMPION!' : 'WINNER!';
    document.getElementById('winName').textContent   = p.name;
    document.getElementById('winAv').textContent     = p.avatar;

    // Calculate efficiency score (lower turns = better, max 100)
    const minPossible = 9; // theoretical minimum turns
    const efficiency  = Math.max(0, Math.round(100 - ((p.turns - minPossible) / minPossible) * 10));
    const effStar     = efficiency >= 80 ? '🌟' : efficiency >= 60 ? '⭐' : '💫';

    document.getElementById('winStats').innerHTML = `
      <div class="win-stat-grid">
        <div class="win-stat-item">
          <div class="wsi-icon">🎮</div>
          <div class="wsi-val">${cfg.label.replace(/🟢|🟡|🔴|🏆/g,'').trim()}</div>
          <div class="wsi-key">Mode</div>
        </div>
        <div class="win-stat-item">
          <div class="wsi-icon">🎲</div>
          <div class="wsi-val">${p.turns}</div>
          <div class="wsi-key">Turns</div>
        </div>
        <div class="win-stat-item">
          <div class="wsi-icon">💰</div>
          <div class="wsi-val">₹${p.money}</div>
          <div class="wsi-key">Remaining</div>
        </div>
        <div class="win-stat-item">
          <div class="wsi-icon">📊</div>
          <div class="wsi-val">₹${p.stats.totalSpent}</div>
          <div class="wsi-key">Spent</div>
        </div>
        <div class="win-stat-item">
          <div class="wsi-icon">🎁</div>
          <div class="wsi-val">₹${p.stats.bonusEarned}</div>
          <div class="wsi-key">Bonus Earned</div>
        </div>
        <div class="win-stat-item">
          <div class="wsi-icon">🔄</div>
          <div class="wsi-val">${p.stats.restarts}</div>
          <div class="wsi-key">Restarts</div>
        </div>
        <div class="win-stat-item">
          <div class="wsi-icon">⚠️</div>
          <div class="wsi-val">₹${p.stats.mandatoryPaid}</div>
          <div class="wsi-key">Penalties</div>
        </div>
        <div class="win-stat-item highlight">
          <div class="wsi-icon">${effStar}</div>
          <div class="wsi-val">${efficiency}%</div>
          <div class="wsi-key">Efficiency</div>
        </div>
      </div>
      ${isTournament ? `<div style="margin-top:0.8rem;font-weight:900;color:#ce93d8">🌟 Final Score: ${tournamentWins[0]}–${tournamentWins[1]}</div>` : ''}
    `;
    spawnConfetti();
    document.getElementById('winScreen').classList.add('show');
  }, 600);
}

// ================================================================
// CONFETTI
// ================================================================
function spawnConfetti() {
  const wrap    = document.getElementById('confettiWrap');
  const colours = ['#f9a825','#e53935','#1e88e5','#43a047','#9c27b0','#ff6f00','#fff'];
  for (let i = 0; i < 100; i++) {
    const c = document.createElement('div');
    c.className = 'conf-piece';
    c.style.cssText = `
      left:${Math.random()*100}%;
      width:${6+Math.random()*9}px; height:${6+Math.random()*9}px;
      background:${colours[Math.floor(Math.random()*colours.length)]};
      animation-duration:${1.8+Math.random()*2.2}s;
      animation-delay:${Math.random()*1}s;
      border-radius:${Math.random()>0.5?'50%':'3px'};
    `;
    wrap.appendChild(c);
  }
}

// ================================================================
// POPUP SYSTEM
// ================================================================
const THEMES = {
  green:  { bg:'#1b5e20', accent:'#43a047' },
  red:    { bg:'#b71c1c', accent:'#e53935' },
  orange: { bg:'#e65100', accent:'#ff6f00' },
  amber:  { bg:'#c77700', accent:'#f9a825' },
  gold:   { bg:'#b07800', accent:'#ffd54f' },
  teal:   { bg:'#00695c', accent:'#00897b' },
  blue:   { bg:'#0d47a1', accent:'#1e88e5' },
  purple: { bg:'#6a1b9a', accent:'#8e24aa' },
  info:   { bg:'#1565c0', accent:'#1e88e5' },
};

function showPopup({ icon, title, theme='info', lines=[], btn='Continue →', btnColor='#1b5e20', cb }) {
  const th = THEMES[theme] || THEMES.info;
  const box = document.getElementById('popupBox');
  box.className = 'popup-box';
  box.style.borderTop = `6px solid ${th.accent}`;
  document.getElementById('popupIcon').textContent  = icon;
  document.getElementById('popupTitle').textContent = title;
  document.getElementById('popupTitle').style.color = th.bg;
  const rowsHtml = lines.map(r => `
    <div class="popup-row">
      <span class="popup-row-label">${r.label}</span>
      <span class="popup-row-value" style="color:${th.bg}">${r.value}</span>
    </div>
  `).join('');
  document.getElementById('popupMsg').innerHTML = rowsHtml;
  document.getElementById('popupDetail').textContent = '';
  const btnEl = document.getElementById('popupBtn');
  btnEl.textContent = btn;
  btnEl.className   = 'popup-btn';
  btnEl.style.background = `linear-gradient(135deg, ${th.accent}, ${th.bg})`;
  btnEl.style.boxShadow  = `0 6px 20px ${th.accent}55`;
  popupCb = cb;
  document.getElementById('popupOverlay').classList.add('show');
}

function closePopup() {
  document.getElementById('popupOverlay').classList.remove('show');
  const cb = popupCb; popupCb = null;
  if (cb) cb();
}