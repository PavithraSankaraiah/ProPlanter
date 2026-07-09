// ===================================================
// PROPLANTER MUSIC.JS — Background Ambient Music
// COMPLETELY STANDALONE — never touches game logic
// Safe to load/unload without affecting anything
// ===================================================

const BGMusic = (() => {
  let ctx       = null;
  let playing   = false;
  let muted     = false;
  let masterGain = null;
  let intervalIds = [];

  // ── Soft pentatonic scale notes (plant/nature feel) ──
  const SCALE = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25];

  function getCtx() {
    if (!ctx || ctx.state === 'closed') {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.18, ctx.currentTime);
      masterGain.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  // ── Play a single soft note ──
  function softNote(freq, duration, delay = 0, vol = 0.12) {
    try {
      const c   = getCtx();
      const osc = c.createOscillator();
      const env = c.createGain();
      osc.connect(env);
      env.connect(masterGain);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, c.currentTime + delay);
      // Soft attack and long decay — ambient feel
      env.gain.setValueAtTime(0, c.currentTime + delay);
      env.gain.linearRampToValueAtTime(vol, c.currentTime + delay + 0.3);
      env.gain.exponentialRampToValueAtTime(0.001, c.currentTime + delay + duration);
      osc.start(c.currentTime + delay);
      osc.stop(c.currentTime + delay + duration + 0.1);
    } catch(e) {}
  }

  // ── Low bass drone ──
  function bassNote(freq, duration) {
    try {
      const c   = getCtx();
      const osc = c.createOscillator();
      const env = c.createGain();
      const flt = c.createBiquadFilter();
      osc.connect(flt); flt.connect(env); env.connect(masterGain);
      osc.type = 'sine';
      flt.type = 'lowpass';
      flt.frequency.value = 200;
      osc.frequency.setValueAtTime(freq, c.currentTime);
      env.gain.setValueAtTime(0, c.currentTime);
      env.gain.linearRampToValueAtTime(0.08, c.currentTime + 1);
      env.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
      osc.start(c.currentTime);
      osc.stop(c.currentTime + duration + 0.1);
    } catch(e) {}
  }

  // ── Play one ambient phrase (randomly picked notes) ──
  function playPhrase() {
    if (!playing || muted) return;
    try {
      // Pick 4 random notes from scale
      const notes = Array.from({length: 4}, () =>
        SCALE[Math.floor(Math.random() * SCALE.length)]
      );
      // Play them with random delays
      notes.forEach((freq, i) => {
        softNote(freq, 1.8 + Math.random() * 1.5, i * (0.5 + Math.random() * 0.8), 0.08);
      });
      // Occasionally add a low octave note
      if (Math.random() > 0.6) {
        softNote(SCALE[0] / 2, 3, 0.2, 0.05);
      }
    } catch(e) {}
  }

  // ── Slowly pulsing bass drone ──
  function playBass() {
    if (!playing || muted) return;
    try {
      bassNote(65.41, 6 + Math.random() * 4); // C2
    } catch(e) {}
  }

  // ── START music ──
  function start() {
    if (playing) return;
    try {
      playing = true;
      getCtx();

      // Play phrases every 3-5 seconds
      playPhrase();
      const phraseInterval = setInterval(() => {
        if (!playing) { clearInterval(phraseInterval); return; }
        playPhrase();
      }, 3000 + Math.random() * 2000);
      intervalIds.push(phraseInterval);

      // Bass drone every 7 seconds
      playBass();
      const bassInterval = setInterval(() => {
        if (!playing) { clearInterval(bassInterval); return; }
        playBass();
      }, 7000);
      intervalIds.push(bassInterval);

    } catch(e) {
      playing = false;
    }
  }

  // ── STOP music ──
  function stop() {
    playing = false;
    intervalIds.forEach(id => clearInterval(id));
    intervalIds = [];
    try {
      if (masterGain) {
        masterGain.gain.setValueAtTime(masterGain.gain.value, ctx.currentTime);
        masterGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1);
      }
    } catch(e) {}
  }

  // ── TOGGLE mute ──
  function toggleMute() {
    muted = !muted;
    try {
      if (masterGain) {
        masterGain.gain.setValueAtTime(masterGain.gain.value, ctx.currentTime);
        masterGain.gain.linearRampToValueAtTime(muted ? 0 : 0.18, ctx.currentTime + 0.5);
      }
    } catch(e) {}
    updateBtn();
    return muted;
  }

  function updateBtn() {
    const btn = document.getElementById('musicBtn');
    if (!btn) return;
    btn.textContent = muted ? '🔇' : '🎵';
    btn.title = muted ? 'Unmute music' : 'Mute music';
  }

  function isPlaying() { return playing; }

  return { start, stop, toggleMute, isPlaying };
})();

// ── CREATE MUSIC BUTTON ──
// Injected as a floating button — never touches any game element
function createMusicButton() {
  const btn = document.createElement('button');
  btn.id        = 'musicBtn';
  btn.textContent = '🎵';
  btn.title     = 'Mute music';
  btn.style.cssText = `
    position: fixed;
    bottom: 1.2rem;
    right: 1.2rem;
    z-index: 9999;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.2);
    background: rgba(0,0,0,0.45);
    color: white;
    font-size: 1.2rem;
    cursor: pointer;
    backdrop-filter: blur(8px);
    transition: transform 0.15s, background 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 16px rgba(0,0,0,0.3);
  `;
  btn.onmouseover = () => btn.style.transform = 'scale(1.1)';
  btn.onmouseout  = () => btn.style.transform = 'scale(1)';
  btn.onclick = () => {
    if (!BGMusic.isPlaying()) {
      BGMusic.start();
    } else {
      BGMusic.toggleMute();
    }
  };
  document.body.appendChild(btn);
}

// ── AUTO START on first user interaction ──
// Music starts only after user clicks anything (browser requirement)
let musicStarted = false;
function tryStartMusic() {
  if (musicStarted) return;
  musicStarted = true;
  BGMusic.start();
  document.removeEventListener('click', tryStartMusic);
}

// Wait for DOM then set up
document.addEventListener('DOMContentLoaded', () => {
  createMusicButton();
  // Start music on first click anywhere
  document.addEventListener('click', tryStartMusic);
});