// Service worker do Canta ou Morre: permite instalar o app e abrir a tela inicial mesmo com internet fraca.
const CACHE = 'canta-ou-morre-v3';
const ARQUIVOS = ['./', './index.html', './manifest.json', './icone-192.png', './icone-512.png'];

// INÍCIO FUNÇÃO: instalar — guarda os arquivos do app no celular
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARQUIVOS)));
  self.skipWaiting();
});
// FIM FUNÇÃO: instalar

// INÍCIO FUNÇÃO: ativar — apaga versões antigas guardadas
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
// FIM FUNÇÃO: ativar

// INÍCIO FUNÇÃO: buscar — tenta a internet primeiro (pega sempre a versão nova); sem internet, usa a guardada
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return; // YouTube e fontes passam direto
  e.respondWith(
    fetch(e.request).then(r => {
      const copia = r.clone();
      caches.open(CACHE).then(c => c.put(e.request, copia));
      return r;
    }).catch(() => caches.match(e.request))
  );
});
// FIM FUNÇÃO: buscar
