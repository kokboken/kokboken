/* Service worker: gör att Chrome på Android räknar Kokboken som en installerbar app,
   och sparar nya appen (app.html) i telefonen så att den startar utan att vänta på nätet.
   app.html visas ur telefonens minne och uppdateras i bakgrunden; en ny version syns vid nästa start.
   Allt annat (startsidan, Googles server, bilder) går vidare som vanligt. */
var CACHE = 'kokboken-app-1';
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function (e) {
  var url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== self.location.origin || !/\/app\.html$/.test(url.pathname)) {
    e.respondWith(fetch(e.request));
    return;
  }
  /* Adressen bär nyckeln (?k=…); den sparas aldrig, bara sidan utan frågedel. */
  var plain = url.origin + url.pathname;
  e.respondWith(caches.open(CACHE).then(function (c) {
    return c.match(plain).then(function (hit) {
      var fresh = fetch(plain, { cache: 'no-cache' }).then(function (r) { if (r.ok) c.put(plain, r.clone()); return r; });
      if (hit) { e.waitUntil(fresh.catch(function () {})); return hit; }
      return fresh;
    });
  }));
});
