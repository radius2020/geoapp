/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
  self.map = new google.maps.Map(document.getElementById('map'), {
    zoom: 16,
    scrollwheel: false,
  });
  document.documentElement.dispatchEvent(new CustomEvent('map-ready'));
};
