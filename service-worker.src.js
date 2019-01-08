/* eslint-env serviceworker */

// eslint-disable-next-line max-len
importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.1/workbox-sw.js');

workbox.routing.registerRoute(
    /\.(?:js|css|html)$/,
    workbox.strategies.staleWhileRevalidate({
      cacheName: 'static-resources',
    })
);

workbox.routing.registerRoute(
    /.*(?:googleapis)\.com/,
    workbox.strategies.staleWhileRevalidate({
      cacheName: 'googleapis',
    })
);

workbox.routing.registerRoute(
    /.*(?:gstatic)\.com/,
    workbox.strategies.staleWhileRevalidate({
      cacheName: 'gstatic',
    })
);

workbox.precaching.precacheAndRoute([], {
  ignoreUrlParametersMatching: [/id/],
});

self.addEventListener('fetch', (event) => {
  if (event.request.method === 'GET' && event.request.url.includes('.html')) {
    event.respondWith(
        fetch(event.request).catch(() =>
          caches.open(workbox.core.cacheNames.precache)
              .then((cache) =>
                cache.match(event.request.url, {ignoreSearch: true}))
        )
    );
  }
});
