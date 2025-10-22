/* eslint-disable no-restricted-globals */
// public/service-worker.js
self.addEventListener('install', event => {
  console.log('Service Worker installing');
});

self.addEventListener('activate', event => {
  console.log('Service Worker activating');
});

self.addEventListener('fetch', event => {
  // Basic fetch handling
  event.respondWith(fetch(event.request));
});