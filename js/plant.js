// ===================================================
// PROPLANTER PLANT.JS — Animated Plant Growth
// COMPLETELY STANDALONE — never touches game.js
// Watches player location label to update plant stage
// ===================================================

(function() {

  // Stage definitions — what the plant looks like per stage
  var STAGES = [
    {
      label: 'No pot yet 🏺',
      stemH: 0, leafScale: 0, flowerShow: false,
      potColor: '#8B6914', soilColor: 'transparent',
      stemColor: 'transparent', leafColor: 'transparent',
    },
    {
      label: 'Pot ready! 🏺',
      stemH: 0, leafScale: 0, flowerShow: false,
      potColor: '#8B6914', soilColor: '#5D4037',
      stemColor: 'transparent', leafColor: 'transparent',
    },
    {
      label: 'Soil added! 🌱',
      stemH: 8, leafScale: 0.3, flowerShow: false,
      potColor: '#8B6914', soilColor: '#5D4037',
      stemColor: '#2e7d32', leafColor: '#43a047',
    },
    {
      label: 'Seed planted! 🌰',
      stemH: 18, leafScale: 0.65, flowerShow: false,
      potColor: '#8B6914', soilColor: '#4e342e',
      stemColor: '#2e7d32', leafColor: '#43a047',
    },
    {
      label: 'Fertilised! 🌿',
      stemH: 30, leafScale: 1.0, flowerShow: false,
      potColor: '#8B6914', soilColor: '#3e2723',
      stemColor: '#1b5e20', leafColor: '#388e3c',
    },
    {
      label: 'Fully Grown! 🌳',
      stemH: 44, leafScale: 1.4, flowerShow: true,
      potColor: '#6d4c41', soilColor: '#3e2723',
      stemColor: '#1b5e20', leafColor: '#2e7d32',
    },
  ];

  // Get stage number from tile position label
  function getStageFromLabel(locText) {
    if (!locText) return 0;
    var t = locText.match(/Tile\s*(\d+)/);
    if (!t) return 0;
    var tile = parseInt(t[1]);
    if (tile <= 0)  return 0;
    if (tile <= 10) return 1;
    if (tile <= 20) return 2;
    if (tile <= 30) return 3;
    if (tile <= 40) return 4;
    return 5;
  }

  // Get refined stage based on what player has collected
  function getRefinedStage(pi, tileStage) {
    // Read the stat indicators from the card
    var pot    = document.getElementById('pp'  + pi)?.textContent || '';
    var soil   = document.getElementById('ps'  + pi)?.textContent || '';
    var seed   = document.getElementById('pse' + pi)?.textContent || '';
    var manure = document.getElementById('pma' + pi)?.textContent || '';

    var hasPot    = pot.includes('✅');
    var hasSoil   = soil.includes('✅');
    var hasSeed   = seed.includes('✅');
    var hasManure = manure.includes('✅');

    // Determine visual stage based on what they have
    if (tileStage >= 5) return 5;           // stage 5 = full grown
    if (hasManure)       return 4;           // has manure = stage 4 look
    if (hasSeed)         return 3;           // has seed = stage 3 look
    if (hasSoil)         return 2;           // has soil = stage 2 look
    if (hasPot)          return 1;           // has pot = stage 1 look
    return 0;                                // nothing yet
  }

  // Apply stage visuals to a player's plant
  function applyStage(pi, stageIdx, animate) {
    var s = STAGES[stageIdx] || STAGES[0];

    var stem    = document.getElementById('pstem'     + pi);
    var leafL   = document.getElementById('pleafl'    + pi);
    var leafR   = document.getElementById('pleafr'    + pi);
    var flower  = document.getElementById('pflower'   + pi);
    var soil    = document.getElementById('psoil'     + pi);
    var pot     = document.getElementById('ppot'      + pi);
    var label   = document.getElementById('pplantlabel' + pi);

    if (!stem || !pot) return;

    var transition = animate ? 'all 0.6s cubic-bezier(0.34,1.56,0.64,1)' : 'none';

    // Pot
    pot.style.transition   = transition;
    pot.style.background   = s.potColor;
    pot.style.borderColor  = s.potColor;
    pot.style.opacity      = stageIdx >= 1 ? '1' : '0.3';

    // Soil
    soil.style.transition  = transition;
    soil.style.background  = s.soilColor;
    soil.style.opacity     = stageIdx >= 1 ? '1' : '0';

    // Stem
    stem.style.transition  = transition;
    stem.style.height      = s.stemH + 'px';
    stem.style.background  = s.stemColor;
    stem.style.opacity     = s.stemH > 0 ? '1' : '0';

    // Leaves
    var ls = s.leafScale;
    leafL.style.transition = transition;
    leafR.style.transition = transition;
    leafL.style.transform  = 'scaleX(-1) scale(' + ls + ')';
    leafR.style.transform  = 'scale(' + ls + ')';
    leafL.style.background = s.leafColor;
    leafR.style.background = s.leafColor;
    leafL.style.opacity    = ls > 0 ? '1' : '0';
    leafR.style.opacity    = ls > 0 ? '1' : '0';

    // Flower (Stage 5 only)
    flower.style.transition = transition;
    flower.style.opacity    = s.flowerShow ? '1' : '0';
    flower.style.transform  = s.flowerShow ? 'scale(1)' : 'scale(0)';

    // Label
    if (label) label.textContent = s.label;
  }

  // Track last known stage to detect changes
  var lastStage = [-1, -1];

  // Update both players' plants
  function updatePlants() {
    for (var i = 0; i < 2; i++) {
      var locEl = document.getElementById('pcloc' + i);
      if (!locEl) continue;

      var tileStage   = getStageFromLabel(locEl.textContent);
      var refinedStage = getRefinedStage(i, tileStage);

      if (refinedStage !== lastStage[i]) {
        var animate = lastStage[i] !== -1; // don't animate on first load
        applyStage(i, refinedStage, animate);
        lastStage[i] = refinedStage;
      }
    }
  }

  // Watch for changes to player location labels
  function startWatching() {
    // Initial update
    updatePlants();

    // Watch pcloc0 and pcloc1 for changes
    for (var i = 0; i < 2; i++) {
      (function(idx) {
        var el = document.getElementById('pcloc' + idx);
        if (!el) return;
        new MutationObserver(function() {
          setTimeout(function() { updatePlants(); }, 100);
        }).observe(el, { childList: true, characterData: true, subtree: true });

        // Also watch the stat indicators (pot/soil/seed/manure)
        ['pp','ps','pse','pma'].forEach(function(id) {
          var statEl = document.getElementById(id + idx);
          if (!statEl) return;
          new MutationObserver(function() {
            setTimeout(function() { updatePlants(); }, 150);
          }).observe(statEl, { childList: true, characterData: true, subtree: true });
        });
      })(i);
    }

    // Also poll every second as backup
    setInterval(updatePlants, 1000);
  }

  // Wait for game to start (elements may not exist on setup screen)
  function waitForGame() {
    var gameScreen = document.getElementById('gameScreen');
    if (!gameScreen) { setTimeout(waitForGame, 500); return; }

    new MutationObserver(function() {
      if (gameScreen.style.display !== 'none') {
        setTimeout(startWatching, 300);
      }
    }).observe(gameScreen, { attributes: true, attributeFilter: ['style'] });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForGame);
  } else {
    waitForGame();
  }

})();