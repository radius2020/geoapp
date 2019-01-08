import {get, set, keys} from './idb-keyval.js';
import {queueOfflineRequest} from './offline.js';
import {trace} from './helpers.js';

/**
 * Common database helper functions.
 */

const getNeighborhood = ({neighborhood}) => neighborhood;
const getCuisine = ({cuisine_type}) => cuisine_type;
const uniq = (xs) => [...new Set(xs)];

const handleAsJson = (response) => response.json();

const checkFor200 = (response) => {
  if (response.status === 200) return response;
  else throw new Error(`Request failed. Returned status of ${response.status}`);
};

const getCachedRestaurant = (id) => get(id);

const getAllCachedRestaurants = () =>
  keys()
      .then(trace('keys'))
      .then((ks) => ks.map(getCachedRestaurant))
      .then(trace('cached'))
      .then((rs) => Promise.all(rs));

// cacheInDB, cacheAllInIDB used to store restaurants with idb
const cacheInIDB = async (r) => (await set(r.id, r), r);

// retrieve/map to the return array, everything from idb Store to restaurants
const cacheAllInIDB = (restaurants = []) =>
  // i think this overwrites the reviews
  Promise.all(
      restaurants
          .map(cacheInIDB)
  );

const appendReview = (review) => (restaurant) =>
  ({...restaurant, reviews: [...restaurant.reviews, review]});

// updateIdb used to store/retrieve reviews as an
// array of objects in the restaurant idb table
const updateIdb = (review) =>
  get(Number(review.restaurant_id))
      .then(appendReview(review))
      .then(cacheInIDB);

/**
 * Helper functions for fetching and caching restaurant data
 * @type {Number}
 */
export default class DBHelper {
  /**
   * Database URL.
   */
  static get DATABASE_URL() {
    //const port = 1337;
   // return `http://localhost:${port}/restaurants`;
   return 'http://www.radiuscampus.com/geospatial/json/restaurants.json';
  }

  /**
   * Restaurant Reviews URL.
   */
  static get REVIEWS_URL() {
    //const port = 1337;
    //return `http://localhost:${port}/reviews`;
    return 'http://www.radiuscampus.com/geospatial/json/reviews.json';
  }

  static getAllCachedRestaurants() {
    return getAllCachedRestaurants();
  }

  /**
   * Fetch all restaurants.
   */
  static async fetchRestaurants() {
    if (!navigator.onLine) {
      // here get/retrieve restaurants from idb
      const restaurants = await getAllCachedRestaurants();
      return restaurants;
    }

    return fetch(DBHelper.DATABASE_URL) // only fetches the restaurants
        .then(checkFor200)
        .then(handleAsJson)
        .then(cacheAllInIDB); // fill the restaurants object in indexedDB cache
  }

  /**
   * Gets the restaurant reviews from the server
   */
  static async fetchRestaurantReviews(id) {
    if (!navigator.onLine) {
      const {reviews = []} = (await get(Number(id))) || {};
      return reviews;
    } else {
    console.log("********hello**********");
    console.log(`${DBHelper.REVIEWS_URL}?restaurant_id=${id}`);
      return fetch(`${DBHelper.REVIEWS_URL}?restaurant_id=${id}`)
          .then(checkFor200)
          .then(handleAsJson)
          .then((reviews) => get(Number(id))
              .then((restaurant) =>
                // set is defined in idb_keyval library
                (set(Number(id), {...restaurant, reviews}), reviews)));
    }
  }

  /**
   * Sends a review to the server
   */
  static async postReview(review) {
    const url = DBHelper.REVIEWS_URL;
    const body = JSON.stringify(review);
    const method = 'POST';
    const headers = {'Content-Type': 'application/json'};
    const request = new Request(url, {body, headers, method});

    if (navigator.onLine) {
      return fetch(request).then(handleAsJson).then(updateIdb);
    } else {
      queueOfflineRequest({url, method, headers, body});
      return updateIdb(review);
    }
  }

  /**
   * Fetch a restaurant by its ID.
   */
  static fetchRestaurantById(id) {
    // fetch all restaurants with proper error handling.
    return DBHelper.fetchRestaurants()
        .then((restaurants) => {
          const restaurant = restaurants.find((r) => r.id == id); // find in idb
          if (!restaurant) throw new Error('Restaurant does not exist');
          return restaurant;
        });
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine) {
    // Fetch all restaurants  with proper error handling
    return DBHelper.fetchRestaurants()
        .then((restaurants) =>
          // Filter restaurants to have only given cuisine type
          restaurants.filter((r) => r.cuisine_type == cuisine));
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood) {
    const isNeighborhood = (r) => r.neighborhood == neighborhood;
    // Fetch all restaurants
    return DBHelper.fetchRestaurants()
        // Filter restaurants to have only given neighborhood
        .then((restaurants) => restaurants.filter(isNeighborhood));
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood
   * with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood) {
    // Fetch all restaurants
    return DBHelper.fetchRestaurants()
        .then((restaurants) => {
          let results = restaurants;
          if (cuisine != 'all') { // filter by cuisine
            results = results.filter((r) => r.cuisine_type == cuisine);
          }
          if (neighborhood != 'all') { // filter by neighborhood
            results = results.filter((r) => r.neighborhood == neighborhood);
          }
          return results;
        });
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods() {
    // Fetch all restaurants
    return DBHelper.fetchRestaurants()
        // Get all cuisines from all restaurants
        .then((rs) => rs.map(getNeighborhood))
        // Remove duplicates from cuisines
        .then(uniq);
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines() {
    // Fetch all restaurants
    return DBHelper.fetchRestaurants()
        // Get all cuisines from all restaurants
        .then((rs) => rs.map(getCuisine))
        // Remove duplicates from cuisines
        .then(uniq);
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
  }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant({photograph}) {
    const imgURL = `/img/compressed/${photograph || 'default'}.webp`;
console.log(imgURL);
    return (imgURL);
  }

  /**
   * Map marker for a restaurant.
   */
  static mapMarkerForRestaurant(restaurant, map) {
    return new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP}
    );
  }

  /**
   * Toggles a restaurant as favorite
   * @param  {[type]}  restaurant_id [description]
   * @return {Promise}               [description]
   */
  static async toggleFavorite(restaurant_id) {
    const {is_favorite, ...restaurant} = await get(restaurant_id);
    // shoud update server 1337 with new, toggled value for is_favorite
    const updatedState = is_favorite === 'false' ? 'true' : 'false';
    const url = `${DBHelper.DATABASE_URL}/${restaurant_id}/?is_favorite=${updatedState}`;
    const method = 'PUT';
    const request = new Request(url, {method});
    if (!navigator.onLine) {
      queueOfflineRequest({url, method});
      const updatedRestaurant = {...restaurant, is_favorite: String(updatedState)};
      await set(restaurant_id, updatedRestaurant);
      return updatedRestaurant;
    } else {
      return fetch(request)
          .then(handleAsJson)
          .then(cacheInIDB);
    }
  }
}
