/**
 * register_sw.js
 * Register Service Worker
 */

/* eslint-disable no-console */

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
      .register('./service-worker.js', {scope: './'})
      .then(console.log.bind(console, 'Service Worker Registered Restuarant Page'))
      .catch(console.error.bind(console, 'Error in <<Service Worker Registration>>'));
}
