For Performance and Consistency, Using:
- Lazy Image Custom Element from Github Repo (https://www.npmjs.com/package/@power-elements/lazy-image)
- idb_keyval.js Promise Library from Jake Archibald
- Workbox, assist in caching static assets in Service Worker (also using plain vanilla s.w. code to fetch restaurant_info page for example)

Changed Callbacks to Promises in original code, for consistency in Promise usage.

Due to google maps resource load, implemented a button on page 1 to load the map should it be necessary. This can also be identically implemented on the restaurant page (due to time constraint issue, I have left this aside).

Additional CSS beautification was not implemented due to time constraints, ongoing... 

Dependencies:
-use Chrome browser only
