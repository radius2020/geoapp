import DBHelper from './dbhelper.js';

/**
  main.js
*****/

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
  fetchNeighborhoods();
  fetchCuisines();
  document.getElementById('neighborhoods-select').setfocus;
});

const fillOptions = (select) => (option) => {
  const optionEl = document.createElement('option');
  optionEl.innerHTML = option;
  optionEl.value = option;
  select.append(optionEl);
};

/**
 * Set neighborhoods HTML.
 */
const fillNeighborhoodsHTML = (neighborhoods) => {
  const select = document.getElementById('neighborhoods-select');
  neighborhoods.forEach(fillOptions(select));
};

/**
 * Set cuisines HTML.
 */
const fillCuisinesHTML = (cuisines) => {
  const select = document.getElementById('cuisines-select');
  cuisines.forEach(fillOptions(select));
};

/**
 * Fetch all neighborhoods and set their HTML.
 */
const fetchNeighborhoods = () =>
  DBHelper.fetchNeighborhoods()
      .then(fillNeighborhoodsHTML)
      // eslint-disable-next-line no-console
      .catch(console.error);

/**
 * Fetch all cuisines and set their HTML.
 */
const fetchCuisines = () =>
  DBHelper.fetchCuisines()
      .then(fillCuisinesHTML)
      // eslint-disable-next-line no-console
      .catch(console.error);

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
  const loc = {
    lat: 40.722216,
    lng: -73.987501,
  };
  self.map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: loc,
    scrollwheel: false,
  });
  updateRestaurants();
};

const cSelect = document.getElementById('cuisines-select');
const nSelect = document.getElementById('neighborhoods-select');

/**
 * Update page and map for current restaurants.
 */
export const updateRestaurants = () => {
  const cIndex = cSelect.selectedIndex;
  const nIndex = nSelect.selectedIndex;

  const cuisine = cSelect[cIndex].value;
  const neighborhood = nSelect[nIndex].value;

  DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood)
      .then((restaurants) => {
        resetRestaurants(restaurants);
        fillRestaurantsHTML(restaurants);
      })
      // eslint-disable-next-line no-console
      .catch(console.error);
};

cSelect.addEventListener('change', updateRestaurants);
nSelect.addEventListener('change', updateRestaurants);

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
const resetRestaurants = (restaurants) => {
  // Remove all restaurants
  const ul = document.getElementById('restaurants-list');
  ul.innerHTML = '';
  self.markers = self.markers || [];
  // Remove all map markers
  self.markers.forEach((m) => m.setMap(null));
  self.markers = [];
};


/**
 * Create all restaurants HTML and add them to the webpage.
 */
const fillRestaurantsHTML = (restaurants) => {
  const ul = document.getElementById('restaurants-list');
  restaurants.forEach((restaurant) => {
    ul.append(createRestaurantHTML(restaurant));
  });
  addMarkersToMap(restaurants);
};

/**
 * Create restaurant HTML.
 */
const restaurantAltText = {
  1: 'A group of people eating at a table in a crowded restaurant.',
  2: 'A rustic pizza topped with cheese.',
  3: 'Wooden tables, each table equipped with built-in hot plate.',
  4: 'Corner in New York City featuring Katz delicatessen, at night.',
  5: 'Lively pizzeria with cosmopolitan crowd.',
  6: 'Friendly open atmosphere featuring the american flag.',
  7: 'Two men chatting outside the local burger eatery - many patrons inside.',
  8: 'Photo features classic signage of The Dutch restaurant, with solid brick and stucco building and shade tree to complete the classic look.',
  9: 'Busy millenials enjoying a meal with friends in a fast paced setting.',
  10: 'Restaurant featuring stainless steel countertops, white crisp decor, and bare entangled twigs adds a new age feeling to your evening entertainment.',
};

const createRestaurantHTML = (restaurant) => {
  /* create aria group here in li element?, so screen reader can read the whole card, but just tab to view details*/
  const li = document.createElement('li');
  // const altText = restaurantAltText[restaurant.id];

  const image = document.createElement('lazy-image');
  image.className = 'restaurant-img';
  image.src = DBHelper.imageUrlForRestaurant(restaurant);
console.log('image.src is......' + image.src);
  image.setAttribute('aria-label', 'Dining atmosphere at ' + restaurant.name);
  image.setAttribute('alt', restaurantAltText[restaurant.id]);
  li.append(image);

  const name = document.createElement('h2');
  name.innerHTML = restaurant.name;
  name.setAttribute('aria-label', restaurant.name);
  li.append(name);

  const isFavorite = restaurant.is_favorite === 'true';
  const fav_label = document.createElement('label');
  fav_label.textContent = isFavorite ? '💓' : '💔';
  const fav_button = document.createElement('input');
  fav_button.type = 'checkbox';
  fav_button.checked = isFavorite;
  fav_button.setAttribute('aria-label', 'favorite this restaurant');
  fav_label.appendChild(fav_button);
  fav_button.addEventListener('change', () => DBHelper.toggleFavorite(restaurant.id));
  li.append(fav_label);

  const neighborhood = document.createElement('p');
  neighborhood.innerHTML = restaurant.neighborhood;
  neighborhood.setAttribute('aria-label', restaurant.neighborhood);
  li.append(neighborhood);

  const address = document.createElement('p');
  address.innerHTML = restaurant.address;
  address.setAttribute('aria-label', restaurant.address);
  li.append(address);

  const more = document.createElement('a');
  more.innerHTML = 'View Details';
  more.setAttribute('aria-label', 'Go to details and reviews for ' + restaurant.name);
  more.href = DBHelper.urlForRestaurant(restaurant);
  li.append(more);

  return li;
};

/**
 * Add markers for current restaurants to the map.
 */
const addMarkersToMap = (restaurants) => {
  if (!('google' in window)) return;
  restaurants.forEach((restaurant) => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.map);
    google.maps.event.addListener(marker, 'click', () => {
      window.location.href = marker.url;
    });
    self.markers.push(marker);
  });
};

updateRestaurants();


const mapShowButton = document.getElementById('click-map');

const showMap = (event) => {
  const script = document.createElement('script');
  script.async = true;
  script.defer = true;
  script.src = 'https://maps.googleapis.com/maps/api/js?libraries=places&callback=initMap';
  script.onload = () => {
    document.getElementById('map').hidden = false;
    mapShowButton.hidden = true;
    mapShowButton.removeEventListener('click', showMap);
  };
  document.head.appendChild(script);
};

mapShowButton.addEventListener('click', showMap);

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
  const lat = 40.722216;
  const lng = -73.987501;
  const center = {lat, lng};
  const zoom = 12;
  const scrollwheel = false;
  const container = document.getElementById('map');
  window.map = new google.maps.Map(container, {center, scrollwheel, zoom});
  DBHelper.getAllCachedRestaurants().then(addMarkersToMap);
};
