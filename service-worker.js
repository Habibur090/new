const CACHE_NAME = 'my-cache-v2'; // ক্যাশ ভার্সন আপডেট করো

// ক্যাশে ফাইল অ্যাড করা
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll([
                '/',
                '/index.html',
                '/style.css',
                '/script.js',
                '/image.jpg', // যদি নতুন ইমেজ বা ফাইল যোগ করা হয়, এখানে তা অ্যাড করো
            ]);
        })
    );
});

// ক্যাশ ফেচ এবং নেটওয়ার্ক থেকে রেসপন্স দেয়া
self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => {
            return response || fetch(e.request).then((networkResponse) => {
                // নতুন কনটেন্ট যদি ফেচ হয় তবে ক্যাশে স্টোর করো
                return caches.open(CACHE_NAME).then((cache) => {
                    cache.put(e.request, networkResponse.clone());
                    return networkResponse;
                });
            });
        })
    );
});

// ক্যাশ ক্লিনআপ এবং পুরানো ক্যাশ মুছে ফেলা
self.addEventListener('activate', (e) => {
    const cacheWhitelist = [CACHE_NAME]; // নতুন ক্যাশ নাম যুক্ত করো
    e.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName); // পুরানো ক্যাশ মুছে ফেলো
                    }
                })
            );
        })
    );
});
