// ===================================================
// PROPLANTER SOUNDS.JS — Game Sound Effects
// COMPLETELY STANDALONE — zero changes to game.js
// Hooks into game events by watching DOM changes
// ===================================================

const SFX = (() => {
  let ctx = null;

  function getCtx() {
    try {
      if (!ctx || ctx.state === 'closed') {
        ctx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (ctx.state === 'suspended') ctx.resume();
      return ctx;
    } catch(e) { return null; }
  }

  function tone(freq, dur, type, vol, delay) {
    type  = type  || 'sine';
    vol   = vol   || 0.2;
    delay = delay || 0;
    try {
      var c = getCtx(); if (!c) return;
      var o = c.createOscillator();
      var g = c.createGain();
      o.connect(g); g.connect(c.destination);
      o.type = type;
      o.frequency.setValueAtTime(freq, c.currentTime + delay);
      g.gain.setValueAtTime(0, c.currentTime + delay);
      g.gain.linearRampToValueAtTime(vol, c.currentTime + delay + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + delay + dur);
      o.start(c.currentTime + delay);
      o.stop(c.currentTime + delay + dur + 0.05);
    } catch(e) {}
  }

  function mel(notes) {
    notes.forEach(function(n) {
      tone(n[0], n[1], n[4]||'sine', n[3]||0.18, n[2]||0);
    });
  }

  return {
    dice:      function() { tone(300,0.04,'square',0.12,0); tone(250,0.04,'square',0.10,0.06); tone(350,0.04,'square',0.12,0.12); },
    move:      function() { tone(600,0.05,'sine',0.07,0); },
    freePot:   function() { mel([[523,0.12,0],[659,0.12,0.10],[784,0.12,0.20],[1047,0.30,0.30]]); },
    buySoil:   function() { mel([[220,0.15,0,0.15],[277,0.15,0.12,0.15],[330,0.25,0.24,0.15]]); },
    buySeed:   function() { mel([[440,0.10,0],[554,0.10,0.10],[659,0.22,0.20]]); },
    buyManure: function() { mel([[110,0.20,0,0.18,'triangle'],[165,0.20,0.12,0.15,'triangle'],[220,0.30,0.28,0.15,'triangle']]); },
    bonus:     function() { mel([[523,0.10,0],[659,0.10,0.08],[784,0.10,0.16],[1047,0.10,0.24],[1319,0.35,0.34]]); },
    danger:    function() { mel([[392,0.18,0,0.22],[330,0.18,0.18,0.22],[262,0.18,0.36,0.22],[220,0.40,0.54,0.22]]); },
    sellPot:   function() { mel([[440,0.15,0],[370,0.15,0.15],[311,0.15,0.30],[185,0.50,0.48,0.25,'triangle']]); },
    mandatory: function() { tone(370,0.12,'square',0.18,0); tone(330,0.12,'square',0.16,0.16); tone(277,0.20,'square',0.18,0.32); },
    restart:   function() { mel([[440,0.12,0,0.22],[370,0.12,0.14,0.22],[311,0.12,0.28,0.22],[233,0.12,0.42,0.22],[185,0.45,0.58,0.25,'triangle']]); },
    win:       function() { mel([[523,0.14,0,0.22],[523,0.14,0.16,0.22],[523,0.14,0.32,0.22],[415,0.10,0.48],[523,0.40,0.60,0.25],[659,0.14,1.05],[784,0.14,1.20],[1047,0.60,1.36,0.28]]); },
    stageUp:   function() { mel([[392,0.10,0],[523,0.10,0.10],[659,0.10,0.20],[784,0.30,0.32,0.22]]); },
    weather:   function() { try { var c=getCtx(); if(!c) return; var o=c.createOscillator(),g=c.createGain(); o.connect(g); g.connect(c.destination); o.type='sawtooth'; o.frequency.setValueAtTime(100,c.currentTime); o.frequency.linearRampToValueAtTime(500,c.currentTime+0.4); g.gain.setValueAtTime(0.12,c.currentTime); g.gain.exponentialRampToValueAtTime(0.001,c.currentTime+0.9); o.start(c.currentTime); o.stop(c.currentTime+0.95); } catch(e){} },
    powerCard: function() { mel([[1047,0.07,0,0.16],[1319,0.07,0.07,0.16],[1568,0.07,0.14,0.16],[2093,0.22,0.22,0.18]]); },
    rain:      function() { mel([[784,0.14,0,0.22],[784,0.14,0.16,0.22],[784,0.14,0.32,0.22],[659,0.10,0.48],[784,0.40,0.60,0.25],[988,0.14,1.05],[1175,0.14,1.20],[1568,0.60,1.36,0.28]]); },
  };
})();

// ══════════════════════════════════════════
// HOOK INTO GAME — watch DOM only, never
// touch any game.js variable or function
// ══════════════════════════════════════════
(function() {

  function hookSounds() {
    // ── Watch game log for events ──
    var logList = document.getElementById('logList');
    if (logList) {
      new MutationObserver(function(muts) {
        muts.forEach(function(m) {
          m.addedNodes.forEach(function(node) {
            var txt = (node.textContent || '').toLowerCase();
            if      (txt.includes('rolled'))                     SFX.dice();
            else if (txt.includes('free pot'))                   SFX.freePot();
            else if (txt.includes('bought soil') || txt.includes('paid mandatory') && txt.includes('soil'))    SFX.buySoil();
            else if (txt.includes('bought seed') || txt.includes('paid mandatory') && txt.includes('seed'))    SFX.buySeed();
            else if (txt.includes('bought manure') || txt.includes('paid mandatory') && txt.includes('manure'))SFX.buyManure();
            else if (txt.includes('₹250 bonus'))                 SFX.bonus();
            else if (txt.includes('restart'))                    SFX.restart();
            else if (txt.includes('sold pot'))                   SFX.sellPot();
            else if (txt.includes('danger') || txt.includes('lost their pot')) SFX.danger();
            else if (txt.includes('mandatory'))                  SFX.mandatory();
            else if (txt.includes('won') || txt.includes('rain'))SFX.rain();
            else if (txt.includes('weather'))                    SFX.weather();
            else if (txt.includes('stage'))                      SFX.stageUp();
            else if (txt.includes('landed on tile'))             SFX.move();
          });
        });
      }).observe(logList, { childList: true });
    }

    // ── Watch popup for additional context ──
    var overlay = document.getElementById('popupOverlay');
    if (overlay) {
      new MutationObserver(function() {
        if (!overlay.classList.contains('show')) return;
        var title = (document.getElementById('popupTitle')?.textContent || '').toLowerCase();
        if      (title.includes('rain') || title.includes('win') || title.includes('champion')) SFX.rain();
        else if (title.includes('free pot'))   SFX.freePot();
        else if (title.includes('soil'))       SFX.buySoil();
        else if (title.includes('seed'))       SFX.buySeed();
        else if (title.includes('manure'))     SFX.buyManure();
        else if (title.includes('bonus'))      SFX.bonus();
        else if (title.includes('destroyed') || title.includes('restart')) SFX.danger();
        else if (title.includes('sold'))       SFX.sellPot();
        else if (title.includes('mandatory'))  SFX.mandatory();
        else if (title.includes('weather'))    SFX.weather();
        else if (title.includes('shield') || title.includes('loan') || title.includes('swap') || title.includes('precision')) SFX.powerCard();
      }).observe(overlay, { attributes: true, attributeFilter: ['class'] });
    }

    // ── Watch win screen ──
    var winScreen = document.getElementById('winScreen');
    if (winScreen) {
      new MutationObserver(function() {
        if (winScreen.classList.contains('show')) SFX.rain();
      }).observe(winScreen, { attributes: true, attributeFilter: ['class'] });
    }
  }

  // Start after DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hookSounds);
  } else {
    hookSounds();
  }

})();