// Nama cache yang unik. Ganti 'v1' menjadi 'v2' jika Anda mengubah daftar file di bawah.
const CACHE_NAME = 'divina-app-v1';

// Daftar aset penting yang akan disimpan untuk mode offline.
const URLS_TO_CACHE = [
  // Halaman utama aplikasi Anda
  '/',
  'index.html', // Ganti nama ini jika file HTML Anda punya nama lain

  // Ikon yang digunakan untuk PWA dan favicon
  'https://images2.imgbox.com/c4/02/as2b5MEJ_o.png',

  // File CSS untuk Google Fonts (ini penting agar font tetap tampil offline)
  'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Cormorant+Garamond:ital,wght@0,400;1,400&display=swap',
  
  // File font dari Google (browser akan memanggil ini setelah membaca CSS di atas)
  // Kita tidak perlu menulis URL lengkapnya, service worker akan menangkapnya saat diminta.
  'https://fonts.gstatic.com/s/cinzel/v20/8vIK7ww63mVu7gtz2-d6.woff2',
  'https://fonts.gstatic.com/s/cormorantgaramond/v16/co3HkG5hK_9S-AheMvAFH-lYxA8wqolx.woff2'
];

// 1. Event 'install': Menyimpan semua aset di atas ke dalam cache.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache dibuka. Menambahkan aset inti...');
        // addAll akan gagal jika salah satu file gagal diunduh.
        return cache.addAll(URLS_TO_CACHE);
      })
      .catch(err => {
        console.error('Gagal menambahkan aset ke cache:', err);
      })
  );
});

// 2. Event 'fetch': Menyajikan aset dari cache terlebih dahulu.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Jika aset ditemukan di cache, kembalikan dari cache.
        if (response) {
          return response;
        }
        // Jika tidak, lanjutkan permintaan ke jaringan.
        return fetch(event.request);
      })
  );
});

// 3. Event 'activate': Membersihkan cache lama saat versi service worker diperbarui.
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Menghapus cache lama:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
