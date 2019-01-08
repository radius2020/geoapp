MWS Restaurant Review 
Phase 3
Karen Sullivan

RESUBMIT COMMENTS
Reviewer comment: Aria roles needed to be added for the user review form
-I added "role=form" to the form element to indicate this area of the page is a form
-I added to the labels for the form element the property "for=<labeled_field_name>" to link the label to the element being labeled
-I added "type=text" to the input element to indicate the user should enter text
-(the "type=number" was already part of the rating input element)
-I added "role=listbox" to the datalist for the rating options
-I added "role=button" to the submit button on the form
/END Resubmit comments  -- :)


For Performance and Consistency, Using:
- Lazy Image Custom Element from Github Repo (https://www.npmjs.com/package/@power-elements/lazy-image)
- idb_keyval.js Promise Library from Jake Archibald
- Workbox, assist in caching static assets in Service Worker (also using plain vanilla s.w. code to fetch restaurant_info page for example)

Changed Callbacks to Promises in original code, for consistency in Promise usage.

Due to google maps resource load, implemented a button on page 1 to load the map should it be necessary. This can also be identically implemented on the restaurant page (due to time constraint issue, I have left this aside).

Additional CSS beautification was not implemented due to time constraints (on my lunch break now!). Hopefully you agree the challenge for phase 3 - offline usage - has been successfully implemented.

Dependencies:
-use Chrome browser only
-package should already be fine, since I have already run: npm run build (or better: npm run watch)
-when testing offline posting, use on a page you have already loaded from the server, as per rubric

Thank you and looking forward to your feedback!

steps
- clone repo
- npm i
- npm run watch
or
- npm run build
chill and serve

