/* ==========================================================================
   PIONEER DASHBOARD -- MAP MODULE
   CartoDB Positron base, teal circle markers, persistent country labels.
   ========================================================================== */

window.PioneerMap = (function () {
  var map = null;
  var markers = {};
  var onCountryClick = null;

  function init(countries, options) {
    options = options || {};
    onCountryClick = options.onCountryClick;

    map = L.map('map', {
      worldCopyJump: false,
      zoomControl: true,
      scrollWheelZoom: true
    }).setView([42, 35], 3);

    L.tileLayer(
      'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
      {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CartoDB</a>',
        subdomains: 'abcd',
        maxZoom: 19,
        minZoom: 2
      }
    ).addTo(map);

    var bounds = [];

    countries.forEach(function (country) {
      var latlng = country.countryLatLng;
      bounds.push(latlng);

      var marker = L.circleMarker(latlng, {
        radius: 11,
        fillColor: '#2A9D8F',
        color: '#FFFFFF',
        weight: 2.5,
        opacity: 1,
        fillOpacity: 0.92
      }).addTo(map);

      // Persistent country name label always visible above pin
      marker.bindTooltip(country.name, {
        permanent: true,
        direction: 'top',
        offset: [0, -14],
        className: 'pioneer-label'
      }).openTooltip();

      marker.on('click', function () {
        if (onCountryClick) onCountryClick(country.id);
      });

      marker.on('mouseover', function () {
        marker.setStyle({ radius: 13, fillColor: '#E9C46A', color: '#FFFFFF' });
      });
      marker.on('mouseout', function () {
        marker.setStyle({ radius: 11, fillColor: '#2A9D8F', color: '#FFFFFF' });
      });

      markers[country.id] = marker;
    });

    if (bounds.length) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 5 });
    }
  }

  function highlight(countryIds) {
    Object.keys(markers).forEach(function (id) {
      var m = markers[id];
      if (!countryIds || countryIds.indexOf(id) !== -1) {
        m.setStyle({ opacity: 1, fillOpacity: 0.92 });
      } else {
        m.setStyle({ opacity: 0.18, fillOpacity: 0.1 });
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
