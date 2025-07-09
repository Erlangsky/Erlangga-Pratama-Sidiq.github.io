// sw.js
// Nama cache tidak terlalu penting jika tidak ada caching, tapi tetap good practice.
const CACHE_NAME = 'minimal-pwa-cache-v1'; 

// Event 'install': Dipicu saat Service Worker pertama kali diinstal
self.addEventListener('install', (event) => {
    console.log('Service Worker: Menginstal (minimal).');
    // Jika Anda ingin meng-cache halaman utama agar langsung bisa offline saat diinstal, 
    // Anda bisa tambahkan ini:
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                // Hanya cache halaman utama dan manifest untuk instalasi
                return cache.addAll(['/', '/index.html', '/manifest.json']);
            })
    );
    self.skipWaiting(); // Memaksa Service Worker baru untuk aktif segera
});

// Event 'activate': Dipicu setelah Service Worker berhasil diinstal
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Mengaktifkan (minimal).');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Menghapus cache lama:', cacheName);
                        return caches.delete(cacheName);
                    }
                    return null;
                })
            );
        })
    );
    // Mengklaim klien segera setelah aktivasi agar Service Worker langsung mengontrol halaman
    return self.clients.claim();
});

// Event 'fetch': Ini diperlukan agar browser tahu Service Worker mengontrol permintaan jaringan.
// Bahkan jika Anda tidak melakukan caching, event ini harus ada.
self.addEventListener('fetch', (event) => {
    // Logika ini hanya meneruskan request ke jaringan, tidak ada caching offline yang aktif.
    // Jika Anda ingin elemen PWA Anda tetap bisa diakses saat offline, Anda harus menambahkan
    // logika caching yang lebih lengkap di sini seperti contoh sebelumnya.
    event.respondWith(fetch(event.request));
});