/* Minimal service worker så att Chrome på Android räknar Kokboken som en installerbar app.
   Den sparar ingenting och skickar alla anrop vidare som vanligt. */
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function (e) { e.respondWith(fetch(e.request)); });
