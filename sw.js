/* سعد البديري — service worker: يخلي الموقع يفتح بسرعة وحتى بدون نت */
var V = 'sab-v8';
var CORE = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png', './shop-route.jpg',
  './vendor/three.min.js',
  './vendor/OrbitControls.js'];
self.addEventListener('install', function(e){
  e.waitUntil(caches.open(V).then(function(c){ return Promise.all(CORE.map(function(u){ return c.add(u).catch(function(){}); })); }).then(function(){ return self.skipWaiting(); }));
});
self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(ks){ return Promise.all(ks.filter(function(k){ return k!==V; }).map(function(k){ return caches.delete(k); })); }).then(function(){ return self.clients.claim(); }));
});
self.addEventListener('fetch', function(e){
  var r = e.request, u = new URL(r.url);
  if(r.method !== 'GET' || /\.mp4$|offers\.json$|admin\.html$/.test(u.pathname) || /goatcounter|zgo\.at|wa\.me/.test(u.hostname)) return;
  if(r.mode === 'navigate'){ // الصفحة: من النت أول حتى التحديثات تبين، وإذا ماكو نت من الكاش
    e.respondWith(fetch(r).then(function(res){ var cp = res.clone(); caches.open(V).then(function(c){ c.put('./index.html', cp); }); return res; })
      .catch(function(){ return caches.match('./index.html').then(function(m){ return m || caches.match('./'); }); }));
    return;
  }
  if(u.origin === location.origin || /jsdelivr|gstatic|googleapis/.test(u.hostname)){
    e.respondWith(caches.match(r).then(function(m){
      var net = fetch(r).then(function(res){ if(res && (res.ok || res.type==='opaque')){ var cp = res.clone(); caches.open(V).then(function(c){ c.put(r, cp); }); } return res; }).catch(function(){ return m; });
      return m || net;
    }));
  }
});
