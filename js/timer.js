// ===================================================
// PROPLANTER TIMER.JS — Game Timer
// STANDALONE — zero touch to game.js
// Tracks game duration and shows it on win screen
// ===================================================
(function () {

  var startTime  = null;
  var timerEl    = null;
  var intervalId = null;

  // Format milliseconds into "X min Y sec"
  function format(ms) {
    var total = Math.floor(ms / 1000);
    var mins  = Math.floor(total / 60);
    var secs  = total % 60;
    if (mins === 0) return secs + ' seconds';
    if (secs === 0) return mins + ' minute' + (mins > 1 ? 's' : '');
    return mins + ' min ' + secs + ' sec';
  }

  // Start timer when game screen appears
  function watchGameStart() {
    var gameScreen = document.getElementById('gameScreen');
    if (!gameScreen) { setTimeout(watchGameStart, 500); return; }

    new MutationObserver(function () {
      if (gameScreen.style.display !== 'none' && gameScreen.style.display !== '') {
        // Game just started
        startTime = Date.now();

        // Show live timer in dice card
        startLiveTimer();
      } else {
        stopLiveTimer();
      }
    }).observe(gameScreen, { attributes: true, attributeFilter: ['style'] });
  }

  // Live timer display next to turn counter
  function startLiveTimer() {
    stopLiveTimer();

    // Create timer element
    timerEl = document.createElement('div');
    timerEl.id = 'liveTimer';
    timerEl.style.cssText = [
      'font-size:0.62rem',
      'font-weight:800',
      'color:rgba(255,255,255,0.35)',
      'text-align:center',
      'margin-top:3px',
      'letter-spacing:0.5px',
    ].join(';');
    timerEl.textContent = '⏱ 00:00';

    // Insert after turn counter
    var counter = document.getElementById('turnCounter');
    if (counter && counter.parentNode) {
      counter.parentNode.insertBefore(timerEl, counter.nextSibling);
    }

    // Update every second
    intervalId = setInterval(function () {
      if (!startTime) return;
      var elapsed = Date.now() - startTime;
      var total   = Math.floor(elapsed / 1000);
      var mins    = Math.floor(total / 60);
      var secs    = total % 60;
      var mm = String(mins).padStart(2, '0');
      var ss = String(secs).padStart(2, '0');
      if (timerEl) timerEl.textContent = '⏱ ' + mm + ':' + ss;
    }, 1000);
  }

  function stopLiveTimer() {
    if (intervalId) { clearInterval(intervalId); intervalId = null; }
    if (timerEl && timerEl.parentNode) timerEl.parentNode.removeChild(timerEl);
    timerEl = null;
  }

  // Watch win screen — inject time when it appears
  function watchWinScreen() {
    var winScreen = document.getElementById('winScreen');
    if (!winScreen) { setTimeout(watchWinScreen, 500); return; }

    new MutationObserver(function () {
      if (!winScreen.classList.contains('show')) return;
      if (!startTime) return;

      // Calculate total time
      var elapsed   = Date.now() - startTime;
      var timeStr   = format(elapsed);

      // Find the win stats div and add time to it
      var winStats = document.getElementById('winStats');
      if (!winStats) return;

      // Check if already added
      if (document.getElementById('winTimerRow')) return;

      // Create a time row
      var row = document.createElement('div');
      row.id  = 'winTimerRow';
      row.style.cssText = [
        'margin-top:0.5rem',
        'padding-top:0.5rem',
        'border-top:1px solid rgba(0,0,0,0.08)',
        'font-size:0.88rem',
        'color:#555',
        'font-weight:700',
      ].join(';');
      row.innerHTML = '⏱ Game completed in <strong style="color:#1b5e20">' + timeStr + '</strong>';

      winStats.appendChild(row);

      // Stop live timer
      stopLiveTimer();
      startTime = null;

    }).observe(winScreen, { attributes: true, attributeFilter: ['class'] });
  }

  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () {
        watchGameStart();
        watchWinScreen();
      });
    } else {
      watchGameStart();
      watchWinScreen();
    }
  }

  init();

})();