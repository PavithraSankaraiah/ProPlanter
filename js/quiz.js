// ===================================================
// PROPLANTER QUIZ.JS — Plant Quiz on Bonus Tiles
// STANDALONE — zero touch to game.js
// ===================================================
(function () {

  var QUESTIONS = [
    { q:'What do plants use to make their own food?', opts:['Only water','Sunlight, water & CO₂','Soil and minerals','Oxygen and sunlight'], ans:1, fact:'Plants use photosynthesis — converting sunlight, water and CO₂ into glucose and oxygen!' },
    { q:'What is the ideal soil pH for most plants?', opts:['3.0 – 4.0','4.0 – 5.5','6.0 – 7.0','8.0 – 9.0'], ans:2, fact:'A pH of 6.0–7.0 allows plants to absorb all essential nutrients efficiently.' },
    { q:'What do seeds need to germinate?', opts:['Light, wind and rain','Water, warmth and oxygen','Sunlight, soil and cold','Only water'], ans:1, fact:'Seeds germinate using water, warmth and oxygen — light is NOT needed until the seedling appears!' },
    { q:'Which part of the plant absorbs water from soil?', opts:['Leaves','Stem','Roots','Flowers'], ans:2, fact:'Roots absorb water and minerals from the soil and anchor the plant firmly.' },
    { q:'What gas do plants release during photosynthesis?', opts:['Carbon Dioxide','Nitrogen','Hydrogen','Oxygen'], ans:3, fact:'Plants release oxygen as a by-product of photosynthesis — this is the air we breathe!' },
    { q:'What is the function of manure/fertiliser?', opts:['Make soil dry','Kill insects','Provide nutrients to soil','Reduce water need'], ans:2, fact:'Manure adds nitrogen, phosphorus and potassium — key nutrients plants need to grow strong.' },
    { q:'Why does rain water help plants more than tap water?', opts:['It is colder','It has natural nitrates','It has more minerals','It is cleaner'], ans:1, fact:'Rain water contains natural nitrates from the atmosphere and is slightly acidic — perfect for plants!' },
    { q:'What is photosynthesis?', opts:['How plants drink water','How plants make food using sunlight','How roots grow','How plants reproduce'], ans:1, fact:'Photosynthesis converts sunlight + water + CO₂ into glucose (food) and oxygen inside the leaves.' },
    { q:'Which nutrient helps plants grow green leaves?', opts:['Phosphorus','Potassium','Nitrogen','Calcium'], ans:2, fact:'Nitrogen is essential for chlorophyll — the green pigment that absorbs sunlight for photosynthesis.' },
    { q:"What is the function of a pot's drainage hole?", opts:['Water plants automatically','Prevent waterlogging and root rot','Add oxygen to soil','Cool the roots'], ans:1, fact:'Without drainage holes, water collects at the bottom causing root rot — the #1 killer of potted plants!' },
  ];

  // ── STATE — prevent double firing ──
  var quizShowing  = false;  // is quiz currently open?
  var quizHandled  = false;  // has THIS bonus event been handled?
  var observer     = null;

  function getQuestion() {
    return QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
  }

  // ── Show quiz ──
  function showQuiz(playerName) {
    if (quizShowing) return;
    quizShowing = true;

    var q = getQuestion();

    // Overlay
    var overlay = document.createElement('div');
    overlay.id = 'quizOverlay';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:900;background:rgba(0,0,0,0.78);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:1rem;font-family:Nunito,sans-serif;';

    var box = document.createElement('div');
    box.style.cssText = 'background:#fff;border-radius:22px;max-width:400px;width:100%;overflow:hidden;box-shadow:0 40px 100px rgba(0,0,0,0.4);border-top:6px solid #f9a825;animation:quizIn 0.4s cubic-bezier(0.34,1.56,0.64,1);';

    if (!document.getElementById('quizStyle')) {
      var st = document.createElement('style');
      st.id  = 'quizStyle';
      st.textContent = '@keyframes quizIn{0%{transform:scale(0.6)translateY(20px);opacity:0}100%{transform:scale(1)translateY(0);opacity:1}}';
      document.head.appendChild(st);
    }

    // Header
    var header = document.createElement('div');
    header.style.cssText = 'background:linear-gradient(135deg,#f9a825,#e65100);padding:1.2rem 1.5rem;text-align:center;';
    header.innerHTML =
      '<div style="font-size:2.2rem;margin-bottom:0.3rem">🌱</div>' +
      '<div style="font-family:Fredoka One,cursive;font-size:1.4rem;color:white">Plant Quiz!</div>' +
      '<div style="font-size:0.75rem;font-weight:800;color:rgba(255,255,255,0.85);margin-top:3px">' +
        playerName + ' — Answer correctly for full ₹250!' +
      '</div>';

    // Question
    var qBody = document.createElement('div');
    qBody.style.cssText = 'padding:1.2rem 1.5rem 0.8rem;';
    qBody.innerHTML = '<div style="font-size:0.95rem;font-weight:800;color:#1a1a1a;line-height:1.6;margin-bottom:1rem">❓ ' + q.q + '</div>';

    // Options
    var grid = document.createElement('div');
    grid.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;';

    var answered = false;

    q.opts.forEach(function(opt, i) {
      var btn = document.createElement('button');
      btn.style.cssText = 'padding:0.6rem 0.5rem;border-radius:10px;border:2px solid #e0e0e0;background:#fafafa;font-family:Nunito,sans-serif;font-size:0.78rem;font-weight:800;cursor:pointer;text-align:left;color:#333;transition:all 0.15s;';
      btn.textContent = (i+1) + '. ' + opt;

      btn.onmouseover = function() { if (!answered) { btn.style.borderColor='#f9a825'; btn.style.background='#fffde7'; } };
      btn.onmouseout  = function() { if (!answered) { btn.style.borderColor='#e0e0e0'; btn.style.background='#fafafa'; } };

      btn.onclick = function() {
        if (answered) return;
        answered = true;
        grid.querySelectorAll('button').forEach(function(b){ b.style.cursor='default'; });

        var correct = (i === q.ans);
        btn.style.background  = correct ? '#e8f5e9' : '#ffebee';
        btn.style.borderColor = correct ? '#43a047' : '#e53935';
        btn.style.color       = correct ? '#1b5e20' : '#b71c1c';

        if (!correct) {
          var correctBtn = grid.querySelectorAll('button')[q.ans];
          if (correctBtn) { correctBtn.style.background='#e8f5e9'; correctBtn.style.borderColor='#43a047'; correctBtn.style.color='#1b5e20'; }
        }

        // Show result after brief pause
        setTimeout(function() { showResult(overlay, box, correct, q.fact); }, 400);
      };

      grid.appendChild(btn);
    });

    qBody.appendChild(grid);
    box.appendChild(header);
    box.appendChild(qBody);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
  }

  function showResult(overlay, box, correct, fact) {
    var amt = correct ? 250 : 100;
    var result = document.createElement('div');
    result.style.cssText = 'padding:1rem 1.5rem 1.4rem;border-top:1px solid #f0f0f0;';
    result.innerHTML =
      '<div style="text-align:center;margin-bottom:0.7rem">' +
        '<span style="font-size:1.8rem">' + (correct?'🎉':'😅') + '</span>' +
        '<div style="font-family:Fredoka One,cursive;font-size:1.1rem;color:' + (correct?'#1b5e20':'#e53935') + ';margin-top:2px">' +
          (correct ? 'Correct! Full ₹250!' : 'Wrong! Partial ₹100') +
        '</div>' +
      '</div>' +
      '<div style="font-size:0.78rem;font-weight:700;color:#555;line-height:1.7;background:#f5f5f5;border-radius:10px;padding:0.6rem 0.8rem;margin-bottom:0.9rem">💡 ' + fact + '</div>';

    var closeBtn = document.createElement('button');
    closeBtn.textContent = 'Got it! Continue →';
    closeBtn.style.cssText = 'width:100%;padding:0.8rem;border-radius:12px;border:none;background:linear-gradient(135deg,' + (correct?'#43a047,#1b5e20':'#f9a825,#e65100') + ');color:white;font-family:Fredoka One,cursive;font-size:1rem;cursor:pointer;';

    closeBtn.onclick = function() {
      // Remove quiz overlay
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      quizShowing = false;
      // Now let the original game popup continue by clicking its button
      setTimeout(function() {
        var popupBtn = document.getElementById('popupBtn');
        if (popupBtn) popupBtn.click();
      }, 100);
    };

    result.appendChild(closeBtn);
    box.appendChild(result);
  }

  // ── Watch the game log for bonus events ──
  // This is the ONLY safe way — watch the log, not the popup
  function watchLog() {
    var logList = document.getElementById('logList');
    if (!logList) { setTimeout(watchLog, 600); return; }

    new MutationObserver(function(mutations) {
      mutations.forEach(function(m) {
        m.addedNodes.forEach(function(node) {
          if (!node.textContent) return;
          var txt = node.textContent.toLowerCase();

          // Only trigger on the bonus log entry
          if (txt.includes('₹250 bonus') && !quizShowing && !quizHandled) {
            quizHandled = true;

            // Get active player name from turn label
            var turnEl = document.getElementById('turnLabel');
            var playerName = turnEl ? turnEl.textContent.replace("'s Turn",'').replace('(Dice 1–4)','').trim() : 'Player';

            // Wait a tiny bit for the game popup to appear, then show quiz
            setTimeout(function() {
              // Hide the game bonus popup temporarily
              var popOverlay = document.getElementById('popupOverlay');
              if (popOverlay) popOverlay.style.visibility = 'hidden';

              showQuiz(playerName);

              // Reset flag after quiz closes
              var waitClose = setInterval(function() {
                if (!quizShowing) {
                  clearInterval(waitClose);
                  quizHandled = false;
                  // Restore popup visibility
                  if (popOverlay) popOverlay.style.visibility = '';
                }
              }, 300);
            }, 200);
          }
        });
      });
    }).observe(logList, { childList: true });
  }

  // ── Wait for game screen ──
  function waitForGame() {
    var gameScreen = document.getElementById('gameScreen');
    if (!gameScreen) { setTimeout(waitForGame, 500); return; }
    new MutationObserver(function() {
      if (gameScreen.style.display !== 'none' && gameScreen.style.display !== '') {
        setTimeout(watchLog, 400);
      }
    }).observe(gameScreen, { attributes: true, attributeFilter: ['style'] });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForGame);
  } else {
    waitForGame();
  }

})();