import {Store, get, set, del, keys} from './idb-keyval.js';
import {trace} from './helpers.js';
import DBHelper from './dbhelper.js';

const store = new Store('offline-requests');

export const queueOfflineRequest = async ({url, method, body, headers}) =>
  set(url, {url, method, body, headers}, store);

const getRequest = (key) =>
  get(key, store);

const allPromises = Promise.all.bind(Promise);

const getAllQueuedRequests = () =>
  keys(store)
      .then((ks) => ks.map(getRequest))
      .then(allPromises);

const notificationTemplate = document.createElement('template');
notificationTemplate.innerHTML = `
  <h2>You're back online!</h2>
  <button id="online-refresh-button" onclick="location.reload()">Click here to reload the page</button>
`;

const notifyOnline = (resolved = []) => {
  if (!resolved.length) return;
  resolved.map(trace('resolved request'));
  const notification = document.createElement('dialog');
  notification.appendChild(notificationTemplate.content.cloneNode(true));
  document.body.appendChild(notification);
  notification.showModal();
};

const tryRequest = ({url, headers, ...init}) =>
  fetch(url, {...init, headers: new Headers(headers)})
      .then((response) => (del(url, store), response));

const fetchReview = (id) =>
  DBHelper.fetchRestaurantReviews(id);

const updateRestaurants = keys()
    .then((restKeys) => restKeys.map(fetchReview));

const onOnline = (event) =>
  getAllQueuedRequests()
      .then(trace('requests'))
      .then((requests) => requests.map(tryRequest))
      .then(allPromises)
      .then(notifyOnline)
      .then(updateRestaurants);

window.addEventListener('online', onOnline);
