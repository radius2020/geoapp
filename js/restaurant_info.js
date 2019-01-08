import {trace} from './helpers.js';

import DBHelper from './dbhelper.js';

/**
 * Get current restaurant from page URL.
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

const fetchRestaurantFromURL = (callback) => {
  if (self.restaurant) { // restaurant already fetched!
    callback(null, self.restaurant);
    return;
  }

  const id = getParameterByName('id');

  if (!id) { // no id found in URL
    const error = '**************No restaurant id in URL';
    callback(error, null);
  } else {
    return DBHelper.fetchRestaurantById(id)
        .then((restaurant) =>
          (!restaurant) ? trace('fetchRestaurantById: ')('no restaurant')
        : DBHelper.fetchRestaurantReviews(id)
            .then((reviews) => {
              const newRecord = {...restaurant, reviews};
              self.restaurant = newRecord;
              fillRestaurantHTML(newRecord);
              callback(null, restaurant);
            })
        );
  }
};

/**
 * Create restaurant HTML and add it to the webpage
 */
const fillRestaurantHTML = (restaurant = self.restaurant) => {
  const name = document.getElementById('restaurant-name');
  name.innerHTML = restaurant.name;

  const address = document.getElementById('restaurant-address');
  address.innerHTML = restaurant.address;

  const image = document.getElementById('restaurant-img');
  image.className = 'restaurant-img';
  image.src = DBHelper.imageUrlForRestaurant(restaurant);
  // image.alt = DBHelper.imageAltTextForRestaurant(restaurant);
  image.alt = restaurantAltText[restaurant.id];

  const cuisine = document.getElementById('restaurant-cuisine');
  cuisine.innerHTML = restaurant.cuisine_type;

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML(restaurant.operating_hours);
  }
  // fill reviews
  fillReviewsHTML(restaurant.reviews);
};

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
const fillRestaurantHoursHTML = (operatingHours) => {
  const hours = document.getElementById('restaurant-hours');
  Object.entries(operatingHours).forEach(([weekday, openHours]) => {
    const row = document.createElement('tr');
    const day = document.createElement('td');

    day.innerHTML = weekday;
    row.appendChild(day);

    const time = document.createElement('td');
    time.innerHTML = openHours;
    row.appendChild(time);

    hours.appendChild(row);
  });
};

const reviewsContainer = document.getElementById('reviews-container');

/**
 * Create all reviews HTML and add them to the webpage.
 */
const fillReviewsHTML = (reviews) => {
  reviews = [...reviews].reverse();
  reviewsContainer.querySelector('ul').innerHTML = '';
  if (!reviews) {
    const noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    reviewsContainer.appendChild(noReviews);
    return;
  }
  const ul = document.getElementById('reviews-list');
  reviews.forEach((review) => {
    ul.appendChild(createReviewHTML(review));
  });
  reviewsContainer.appendChild(ul);
};

/**
 * Create review HTML and add it to the webpage.
 */
const createReviewHTML = (review) => {
  const li = document.createElement('li');

  const name = document.createElement('p');
  name.innerHTML = review.name;
  li.appendChild(name);

  const date = document.createElement('p');
  date.innerHTML =
    review.updatedAt ||
    review.createdAt ||
    'This review not yet posted. Check back after you reconnect';

  li.appendChild(date);

  const rating = document.createElement('p');
  rating.innerHTML = `Rating: ${review.rating}`;
  li.appendChild(rating);

  const comments = document.createElement('p');
  comments.innerHTML = review.comments;
  li.appendChild(comments);

  return li;
};

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
const fillBreadcrumb = (restaurant = self.restaurant) => {
  const breadcrumb = document.getElementById('breadcrumb');
  const li = document.createElement('li');
  li.innerHTML = restaurant.name;
  li.setAttribute('aria-current', 'page');
  breadcrumb.appendChild(li);
};

/**
 * Get a parameter by name from page URL.
 */
const getParameterByName = (name, url) => {
  if (!url) {
    url = window.location.href;
  }
  name = name.replace(/[[]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);


  const results = regex.exec(url);
  if (!results) {
    return null;
  }
  if (!results[2]) {
    return '';
  }
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};


fetchRestaurantFromURL((error, restaurant) => {
  if (error) { // Got an error!
    // eslint-disable-next-line no-console
    console.error(error);
  } else {
    fillBreadcrumb();

    DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
  }
});

const onMapReady = () => {
  if (!self.restaurant) return setTimeout(onMapReady, 1000);
  self.map.setCenter(self.restaurant.latlng);
};

document.documentElement.addEventListener('map-ready', onMapReady);

const form = document.getElementById('reviews-form');

const updateHTML = (restaurant) =>
  fillReviewsHTML(restaurant.reviews);

form.onsubmit = (event) => {
  event.preventDefault();
  if (!form.checkValidity()) return;
  const restaurant_id = getParameterByName('id');
  const rating = form.elements.rating.value;
  const name = form.elements.name.value;
  const comments = form.elements.comments.value;
  DBHelper.postReview({restaurant_id, rating, name, comments})
      .then(updateHTML);
};
