/* ==========================================================================
   PIONEER DASHBOARD -- MAP MODULE
   Initializes Leaflet and exposes window.PioneerMap for the app.
   ========================================================================== */

window.PioneerMap = (function () {
  var map = null;
  var markers = {};
  var onCountryClick = null;

  function init(countries, options) {
    options = options || {};
    onCountryClick = options.onCountryClick;

    map = L.map('map', {
      worldCopyJump: true,
      zoomControl: true,
      scrollWheelZoom: true
    }).setView([15, 30], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 12,
      minZoom: 2
    }).addTo(map);

    countries.forEach(function (country) {
      var marker = L.circleMarker(country.countryLatLng, {
        radius: 9,
        fillColor: '#2A9D8F',
        color: '#1E7268',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.85
      }).addTo(map);

      marker.bindTooltip(
        country.flag + ' ' + country.name + ' &middot; ' + country.community.communitySize,
        { className: 'pioneer-tip', direction: 'top', offset: [0, -6] }
      );

      marker.on('click', function () {
        if (onCountryClick) onCountryClick(country.id);
      });

      marker.on('mouseover', function () {
        marker.setStyle({ radius: 11, fillColor: '#E9C46A', color: '#C8A24F' });
      });
      marker.on('mouseout', function () {
        marker.setStyle({ radius: 9, fillColor: '#2A9D8F', color: '#1E7268' });
      });

      markers[country.id] = marker;
    });
  }

  function highlight(countryIds) {
    Object.keys(markers).forEach(function (id) {
      var m = markers[id];
      if (!countryIds || countryIds.indexOf(id) !== -1) {
        m.setStyle({ opacity: 1, fillOpacity: 0.85 });
        m.getElement && m.getElement() && (m.getElement().style.display = '');
      } else {
        m.setStyle({ opacity: 0.15, fillOpacity: 0.1 });
      }
    });
  }

  function resize() {
    if (map) map.invalidateSize();
  }

  return {
    init: init,
    highlight: highlight,
    resize: resize
  };
})();
