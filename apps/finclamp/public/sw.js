
// FinClamp Service Worker for Performance Optimization
// Detect environment and set base path accordingly
const isGitHubPages = self.location.hostname.includes('github.io');
const BASE_PATH = isGitHubPages ? '/OrgRJ/' : '/';
const CACHE_NAME = 'finclamp-v4';
const urlsToCache = [
  BASE_PATH,
  BASE_PATH + 'calculators',
  BASE_PATH + 'games',
  BASE_PATH + 'manifest.json',
  BASE_PATH + 'favicon.svg',
  BASE_PATH + 'android-chrome-192x192.svg',
  BASE_PATH + 'android-chrome-512x512.svg'
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
        if (url.pathname.startsWith(BASE_PATH + 'calculators') || url.pathname.startsWith(BASE_PATH + 'games')) {
          return fetch(BASE_PATH).catch(() => {
            // If root fails, return cached version
            return caches.match(BASE_PATH);
          });
        }

        return fetch(event.request).catch(error => {
          console.log('Fetch failed for:', event.request.url, error);
          // For navigation requests or SPA routes, return the main page
          if (event.request.mode === 'navigate' ||
              url.pathname.startsWith(BASE_PATH + 'calculators') ||
              url.pathname.startsWith(BASE_PATH + 'games')) {
            return caches.match(BASE_PATH) || fetch(BASE_PATH);
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
