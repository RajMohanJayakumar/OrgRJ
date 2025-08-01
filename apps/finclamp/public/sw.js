
// FinClamp Service Worker for Performance Optimization
const CACHE_NAME = 'finclamp-v3';
const urlsToCache = [
  '/',
  '/calculators',
  '/games',
  '/manifest.json',
  '/favicon.svg',
  '/android-chrome-192x192.svg',
  '/android-chrome-512x512.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Take control of all clients immediately
  return self.clients.claim();
});

self.addEventListener('fetch', event => {
  // Skip non-GET requests and external URLs
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip if not from our origin
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }

        // For SPA routes (calculators, games), serve the main index.html
        const url = new URL(event.request.url);
        if (url.pathname.startsWith('/calculators') || url.pathname.startsWith('/games')) {
          return fetch('/').catch(() => {
            // If root fails, return cached version
            return caches.match('/');
          });
        }

        return fetch(event.request).catch(error => {
          console.log('Fetch failed for:', event.request.url, error);
          // For navigation requests or SPA routes, return the main page
          if (event.request.mode === 'navigate' ||
              url.pathname.startsWith('/calculators') ||
              url.pathname.startsWith('/games')) {
            return caches.match('/') || fetch('/');
          }
          throw error;
        });
      })
      .catch(error => {
        console.log('Cache match failed for:', event.request.url, error);
        // Return a basic response for failed requests
        return new Response('Service Worker: Resource not available', {
          status: 404,
          statusText: 'Not Found'
        });
      })
  );
});
