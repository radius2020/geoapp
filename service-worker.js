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

workbox.precaching.precacheAndRoute([
  {
    "url": "css/access_response_styles.css",
    "revision": "eccf12b87e64a17e505828df94ed9ad4"
  },
  {
    "url": "css/bak/access_response_styles copy.css",
    "revision": "5043c54f312c7f7acd74055ad55e8637"
  },
  {
    "url": "css/bak/styles copy.css",
    "revision": "9d296bad35a199829bb7327956e7257f"
  },
  {
    "url": "css/responsive_project2 copy.css",
    "revision": "fd7a7b5ff2e99bc03167bc9793b9cff8"
  },
  {
    "url": "css/responsive_project2.css",
    "revision": "80ab0fdde7638f52784df82bfe5a9163"
  },
  {
    "url": "css/styles_project2.css",
    "revision": "7a4546e0b18f0c7a75f90ace5a1eee04"
  },
  {
    "url": "css/styles.css",
    "revision": "3e1164a7e23ca05503836f11e6ea5640"
  },
  {
    "url": "css/untitled.css",
    "revision": "d76028d8a52a30d1dd602d51c978d48c"
  },
  {
    "url": "gulpfile.js",
    "revision": "615a31c940f6d51a20a4213d8a77a250"
  },
  {
    "url": "icon/glasses.svg",
    "revision": "a28b59fad963aaee4f7f28297644a93f"
  },
  {
    "url": "img/10.jpg",
    "revision": "2bd68efbe70c926de6609946e359faa2"
  },
  {
    "url": "img/1a.jpg",
    "revision": "cc074688becddd2725114187fba9471c"
  },
  {
    "url": "img/2.jpg",
    "revision": "759b34e9a95647fbea0933207f8fc401"
  },
  {
    "url": "img/3.jpg",
    "revision": "81ee36a32bcfeea00db09f9e08d56cd8"
  },
  {
    "url": "img/4.jpg",
    "revision": "23f21d5c53cbd8b0fb2a37af79d0d37f"
  },
  {
    "url": "img/5.jpg",
    "revision": "0a166f0f4e10c36882f97327b3835aec"
  },
  {
    "url": "img/6.jpg",
    "revision": "eaf1fec4ee66e121cadc608435fec72f"
  },
  {
    "url": "img/7.jpg",
    "revision": "bd0ac197c58cf9853dc49b6d1d7581cd"
  },
  {
    "url": "img/8.jpg",
    "revision": "6e0e6fb335ba49a4a732591f79000bb4"
  },
  {
    "url": "img/9.jpg",
    "revision": "ba4260dee2806745957f4ac41a20fa72"
  },
  {
    "url": "img/compressed/1.webp",
    "revision": "48118477bb422cbea33fa95e17acf2db"
  },
  {
    "url": "img/compressed/10.webp",
    "revision": "b6fa91e4fac4c5432d3a611e9055c45d"
  },
  {
    "url": "img/compressed/2.webp",
    "revision": "317439840a1ed66b71482838ed07b83a"
  },
  {
    "url": "img/compressed/3.webp",
    "revision": "bedb2362146e24649181a292b43896ca"
  },
  {
    "url": "img/compressed/4.webp",
    "revision": "7282d97e8c24b914d0d581e09a43b51c"
  },
  {
    "url": "img/compressed/5.webp",
    "revision": "07843d59273fc3b603eea120fe206e5e"
  },
  {
    "url": "img/compressed/6.webp",
    "revision": "4e0ffa08dbcc8011260c0bdd90508fb9"
  },
  {
    "url": "img/compressed/7.webp",
    "revision": "10e5a17677bff51a868cf9f762fbcece"
  },
  {
    "url": "img/compressed/8.webp",
    "revision": "d56324bfae98bef2d518f0520cb711b5"
  },
  {
    "url": "img/compressed/9.webp",
    "revision": "aa161205764c00e9f52cadd05bad79e1"
  },
  {
    "url": "img/compressed/default.webp",
    "revision": "b6fa91e4fac4c5432d3a611e9055c45d"
  },
  {
    "url": "img/default.jpg",
    "revision": "2bd68efbe70c926de6609946e359faa2"
  },
  {
    "url": "img/icons-192-bak.png",
    "revision": "ae79b97d167a4134f1d94cc0436e2c15"
  },
  {
    "url": "img/icons-192.png",
    "revision": "f28b9b0e42d4361b8ebb3dc0fef91e61"
  },
  {
    "url": "img/icons-512.png",
    "revision": "c2a3dd820b4b10865b00670b640fa762"
  },
  {
    "url": "index.html",
    "revision": "dfa30de4cef9fe17288eac3d00ba6b95"
  },
  {
    "url": "js/app.js",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "js/dbhelper.js",
    "revision": "261ecaef91d20c96c36622687527251a"
  },
  {
    "url": "js/helpers.js",
    "revision": "7d5d5b3ebfe27d69ae701adaf83a523e"
  },
  {
    "url": "js/idb-keyval.js",
    "revision": "0d58238ca7cb34e4f422cfee9baa63c3"
  },
  {
    "url": "js/lazy-image.js",
    "revision": "42797f1c54f34dcd8a87d1786932367e"
  },
  {
    "url": "js/main.js",
    "revision": "a5ea51d129e84fa518a1b74360e79cec"
  },
  {
    "url": "js/offline.js",
    "revision": "7864f540ffa492274316ce9f0a40d391"
  },
  {
    "url": "js/register_sw.js",
    "revision": "c2f9c5e01eed74f72e4ec5ee0b5072e7"
  },
  {
    "url": "js/restaurant_info.js",
    "revision": "da840cd7487323f243ebe75364a7ea45"
  },
  {
    "url": "js/restaurantInitMap.js",
    "revision": "833af23bfa4222513ae41656b2e1b2bd"
  },
  {
    "url": "manifest.json",
    "revision": "b32b26a9cd5087e705f92d7def9c2618"
  },
  {
    "url": "package-lock.json",
    "revision": "18900550e3666fad24b2169db1bf8bb0"
  },
  {
    "url": "package.json",
    "revision": "6b7cf642d59452c718c94720ca440565"
  },
  {
    "url": "restaurant.html",
    "revision": "da55dd6c66aeaab1e3fbaa872079ca36"
  },
  {
    "url": "service-worker.src.js",
    "revision": "5a5b432e2ea68e625c4fbd90ddceea77"
  },
  {
    "url": "workbox-config.js",
    "revision": "3bb1c6b1b9658cb7716d9832912fb39b"
  }
], {
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
