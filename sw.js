// ===================================================
// PROPLANTER SERVICE WORKER
// Caches all game files for offline play
// ===================================================

var CACHE_NAME = 'proplanter-v1';

// All files to cache for offline use
var FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/game.html',
  '/leaderboard.html',
  '/about.html',
  '/analytics.html',
  '/loading.html',
  '/css/style.css',
  '/css/game.css',
  '/css/leaderboard.css',
  '/js/game.js',
  '/js/main.js',
  '/js/leaderboard.js',
  '/js/music.js',
  '/js/sounds.js',
  '/js/plant.js',
  '/js/facts.js',
  '/js/tooltip.js',
  '/js/glow.js',
  '/js/quiz.js',
  '/js/theme.js',
  '/js/keyboard.js',
  '/js/timer.js',
  '/manifest.json',
];

// Install — cache all files
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log('ProPlanter: Caching all files for offline use');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(key) { return key !== CACHE_NAME; })
            .map(function(key)  { return caches.delete(key); })
      );
    })
  );
  self.clients.claim();
});

// Fetch — serve from cache, fallback to network
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      return cached || fetch(e.request).catch(function() {
        // If both cache and network fail, return index
        return caches.match('/index.html');
      });
    })
  );
});