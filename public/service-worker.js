/* eslint-disable no-restricted-globals */
// public/service-worker.js

const CACHE_NAME = 'lts-cache-v1';
const API_URLS = [
  'https://lts-backend-qg6a.onrender.com',
  'http://localhost:5000'
];

// Install event
self.addEventListener('install', event => {
  console.log('Service Worker installing');
  
  // Skip waiting to activate immediately
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', event => {
  console.log('Service Worker activating');
  
  // Claim clients immediately
  event.waitUntil(self.clients.claim());
});

// Fetch event - BYPASS ALL API CALLS
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Skip service worker entirely for:
  // 1. API requests (any /api/ path)
  // 2. Backend server requests
  // 3. Any non-GET requests
  // 4. Any request with no-cache header
  
  const shouldBypass = 
    url.pathname.startsWith('/api/') ||
    API_URLS.some(apiUrl => url.href.includes(apiUrl)) ||
    event.request.method !== 'GET' ||
    event.request.headers.get('pragma') === 'no-cache' ||
    event.request.headers.get('cache-control') === 'no-cache' ||
    event.request.mode === 'cors' ||
    event.request.destination === 'empty' ||
    url.search.includes('_t=') || // Bypass timestamped requests
    url.href.includes('api/auth/') || // Specifically bypass auth endpoints
    url.href.includes('lts-backend-'); // Bypass any render.com backend

  if (shouldBypass) {
    // For API calls, don't use service worker at all
    // This allows the request to go directly to the network
    return;
  }

  // Only cache static assets for same-origin GET requests
  if (event.request.method === 'GET' && 
      url.origin === self.location.origin &&
      !url.pathname.includes('/api/')) {
    
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return cache.match(event.request).then(response => {
          // Return cached response if found
          if (response) {
            return response;
          }
          
          // Otherwise fetch from network
          return fetch(event.request).then(networkResponse => {
            // Only cache successful responses for static assets
            if (networkResponse.ok && 
                (networkResponse.headers.get('content-type')?.includes('text/html') ||
                 networkResponse.headers.get('content-type')?.includes('text/css') ||
                 networkResponse.headers.get('content-type')?.includes('javascript') ||
                 networkResponse.headers.get('content-type')?.includes('image/'))) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          });
        });
      })
    );
  } else {
    // For everything else, just fetch from network
    event.respondWith(fetch(event.request));
  }
});

// Message event for debugging
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Error handling
self.addEventListener('error', event => {
  console.error('Service Worker error:', event.error);
});

self.addEventListener('unhandledrejection', event => {
  console.error('Service Worker unhandled rejection:', event.reason);
});