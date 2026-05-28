/* ==========================================================================
   PIONEER DASHBOARD -- MAIN APP
   ========================================================================== */

(function () {
  'use strict';

  // ========================================================================
  // FIELD SPEC -- single source of truth for labels, formatting, comparison
  // direction (used for color coding). __label is the section header.
  // ========================================================================
  var FIELDS = {
    overview: {
      __label: 'Overview',
      population:          { label: 'Population' },
      officialLanguages:   { label: 'Official Languages', format: 'list' },
      englishScore:        { label: 'English Proficiency', format: 'score', dir: 'higher' },
      englishScoreNote:    { label: 'English Score Source' },
      climate:             { label: 'Climate' },
      politicalStability:  { label: 'Political Stability' },
      internetSpeed:       { label: 'Internet Speed' },
      healthcareSystem:    { label: 'Healthcare' },
      crimeSafetyIndex:    { label: 'Crime & Safety' },
      religionDemographics:{ label: 'Religion Demographics' }
    },
    finances: {
      __label: 'Finances (AUD)',
      costOfLivingIndex:        { label: 'Cost of Living Index', dir: 'lower' },
      rent1br:                  { label: 'Rent -- 1 bedroom', format: 'aud', dir: 'lower' },
      rent2br:                  { label: 'Rent -- 2 bedroom', format: 'aud', dir: 'lower' },
      rent3br:                  { label: 'Rent -- 3 bedroom', format: 'aud', dir: 'lower' },
      groceryBasket:            { label: 'Groceries (monthly)', format: 'aud', dir: 'lower' },
      averageMealPrice:         { label: 'Average meal (mid-range)', format: 'aud', dir: 'lower' },
      publicTransportMonthly:   { label: 'Public transport (monthly)', format: 'aud', dir: 'lower' },
      transportMode:            { label: 'Transport mode' },
      utilitiesMonthly:         { label: 'Utilities (monthly)', format: 'aud', dir: 'lower' },
      internetMonthly:          { label: 'Internet (monthly)', format: 'aud', dir: 'lower' },
      averageLocalSalary:       { label: 'Average local salary (annual)', format: 'aud', dir: 'higher' },
      currencyCode:             { label: 'Currency code' },
      exchangeRateToAUD:        { label: '1 AUD =' },
      exchangeRateLastUpdated:  { label: 'Rate last updated' }
    },
    visa: {
      __label: 'Visa (Australian passport)',
      visaType:                 { label: 'Visa type' },
      maxInitialStay:           { label: 'Max initial stay' },
      renewalOptions:           { label: 'Renewal options' },
      religiousWorkerVisa:      { label: 'Religious worker visa available', format: 'bool' },
      workRights:               { label: 'Work rights' },
      estimatedProcessingTime:  { label: 'Estimated processing time' },
      estimatedCostAUD:         { label: 'Estimated cost', format: 'aud', dir: 'lower' },
      officialSourceUrl:        { label: 'Official source', format: 'url' },
      notes:                    { label: 'Notes' }
    },
    community: {
      __label: 'Community',
      bahaiFamilyCount:          { label: "Baha'i family count", dir: 'higher' },
      hasLSA:                    { label: 'Has Local Spiritual Assembly', format: 'bool' },
      communitySize:             { label: 'Community size' },
      openPioneerGoal:           { label: 'Open pioneer goal', format: 'bool' },
      proximityToHouseOfWorship: { label: 'Nearest House of Worship' },
      suitabilityTags:           { label: 'Suitability tags', format: 'tags' }
    }
  };

  var SECTION_KEYS = ['overview', 'finances', 'visa', 'community'];

  var TAG_TYPES = {
    'Good for families':          'positive',
    'Solo pioneer friendly':      'positive',
    'Strong existing community':  'positive',
    'Low English penetration':    'caution',
    'High cost of living':        'caution',
    'Visa complexity':            'caution',
    'Remote location':            'caution'
  };

  var HOUSEHOLD_SCALING = {
    '1': { rent: 'rent1br', grocery: 1.0, transport: 1, label: '1 adult' },
    '2': { rent: 'rent1br', grocery: 1.6, transport: 2, label: '2 adults' },
    '3': { rent: 'rent2br', grocery: 2.1, transport: 3, label: '2 adults + child' },
    '4': { rent: 'rent3br', grocery: 2.6, transport: 4, label: '4+ people' }
  };

  // ========================================================================
  // STATE
  // ========================================================================
  var state = {
    currentView: 'home',
    currentCountryId: null,
    currentTab: 'overview',
    currentCity: null,
    shortlist: new Set(),
    showOnlyShortlisted: false,
    detailToggles: {},
    compareToggles: {},
    compareSelection: new Set(),
    householdSize: '1',
    chartPeriod: '1Y'
  };

  var currentChart = null;

  // ========================================================================
  // LOCALSTORAGE
  // ========================================================================
  function loadShortlist() {
    try {
      var raw = localStorage.getItem('pioneer-shortlist');
      if (raw) state.shortlist = new Set(JSON.parse(raw));
    } catch (e) {}
  }
  function saveShortlist() {
    localStorage.setItem('pioneer-shortlist', JSON.stringify(Array.from(state.shortlist)));
  }
  function loadToggles(countryId) {
    if (state.detailToggles[countryId]) return state.detailToggles[countryId];
    try {
      var raw = localStorage.getItem('pioneer-toggles-' + countryId);
      state.detailToggles[countryId] = raw ? JSON.parse(raw) : {};
    } catch (e) { state.detailToggles[countryId] = {}; }
    return state.detailToggles[countryId];
  }
  function saveToggles(countryId) {
    localStorage.setItem(
      'pioneer-toggles-' + countryId,
      JSON.stringify(state.detailToggles[countryId] || {})
    );
  }
  function loadCompareToggles() {
    try {
      var raw = localStorage.getItem('pioneer-compare-toggles');
      state.compareToggles = raw ? JSON.parse(raw) : {};
    } catch (e) { state.compareToggles = {}; }
  }
  function saveCompareToggles() {
    localStorage.setItem('pioneer-compare-toggles', JSON.stringify(state.compareToggles));
  }

  // ========================================================================
  // UTILITY
  // ========================================================================
  function getCountry(id) {
    return window.PIONEER_DATA.countries.find(function (c) { return c.id === id; });
  }

  function formatAUD(n) {
    if (n === null || n === undefined) return 'No data available';
    return 'A$' + Number(n).toLocaleString();
  }

  function formatValue(key, value, spec) {
    if (value === null || value === undefined || value === '') return null;
    if (spec && spec.format === 'aud') return formatAUD(value);
    if (spec && spec.format === 'list' && Array.isArray(value)) return value.join(', ');
    if (spec && spec.format === 'bool') return value ? 'Yes' : 'No';
    if (Array.isArray(value)) return value.join(', ');
    return String(value);
  }

  function getCompleteness(country) {
    var total = 0, filled = 0;
    SECTION_KEYS.forEach(function (sec) {
      var spec = FIELDS[sec];
      Object.keys(spec).forEach(function (k) {
        if (k.startsWith('__')) return;
        total++;
        var v = country[sec] ? country[sec][k] : null;
        if (v !== null && v !== undefined && v !== '' && !(Array.isArray(v) && v.length === 0)) filled++;
      });
    });
    return { total: total, filled: filled, pct: Math.round(filled * 100 / total) };
  }

  // ========================================================================
  // EVENTS
  // ========================================================================
  function bindEvents() {
    document.getElementById('brand').addEventListener('click', function () {
      navigateTo('');
    });

    document.getElementById('nav-logout').addEventListener('click', function () {
      sessionStorage.removeItem('pioneer_auth');
      window.location.href = 'index.html';
    });

    document.getElementById('nav-shortlist-filter').addEventListener('click', function () {
      state.showOnlyShortlisted = !state.showOnlyShortlisted;
      this.classList.toggle('active', state.showOnlyShortlisted);
      renderHome();
    });

    document.getElementById('nav-compare').addEventListener('click', function () {
      state.compareSelection = new Set(state.shortlist);
      navigateTo('compare');
    });

    document.getElementById('detail-back').addEventListener('click', function () {
      navigateTo('');
    });
    document.getElementById('compare-back').addEventListener('click', function () {
      navigateTo('');
    });

    document.getElementById('detail-shortlist').addEventListener('click', function () {
      toggleShortlist(state.currentCountryId);
      updateDetailShortlistBtn();
    });

    document.getElementById('detail-export').addEventListener('click', function () {
      var country = getCountry(state.currentCountryId);
      var visible = computeVisibleMap(loadToggles(country.id));
      PioneerExport.exportCountry(country, SECTION_KEYS, visible, FIELDS);
    });

    document.getElementById('compare-export').addEventListener('click', function () {
      var countries = Array.from(state.compareSelection).slice(0, 4).map(getCountry).filter(Boolean);
      if (!countries.length) { alert('Select at least one country to compare.'); return; }
      var visible = computeVisibleMap(state.compareToggles);
      PioneerExport.exportComparison(countries, SECTION_KEYS, visible, FIELDS);
    });

    document.getElementById('toggle-panel-header').addEventListener('click', function () {
      var panel = document.getElementById('toggle-panel');
      panel.classList.toggle('open');
      document.getElementById('toggle-panel-caret').textContent =
        panel.classList.contains('open') ? '−' : '+';
    });
    document.getElementById('compare-toggle-header').addEventListener('click', function () {
      document.getElementById('compare-toggle-panel').classList.toggle('open');
    });
  }

  function computeVisibleMap(toggleMap) {
    // returns { 'section.field': bool } -- defaults to true if unset
    var result = {};
    SECTION_KEYS.forEach(function (sec) {
      Object.keys(FIELDS[sec]).forEach(function (k) {
        if (k.startsWith('__')) return;
        var key = sec + '.' + k;
        result[key] = toggleMap[key] !== false; // default true
      });
    });
    return result;
  }

  // ========================================================================
  // ROUTING
  // ========================================================================
  function navigateTo(hash) { window.location.hash = hash; }

  function handleHashChange() {
    var hash = window.location.hash.replace(/^#/, '');
    if (hash.indexOf('country/') === 0) {
      showDetail(hash.split('/')[1]);
    } else if (hash === 'compare') {
      showCompare();
    } else {
      showHome();
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function setActiveView(viewId) {
    ['view-home', 'view-detail', 'view-compare'].forEach(function (id) {
      document.getElementById(id).classList.toggle('active', id === viewId);
    });
    if (viewId === 'view-home') setTimeout(PioneerMap.resize, 50);
  }

  // ========================================================================
  // HOME VIEW
  // ========================================================================
  function showHome() {
    state.currentView = 'home';
    setActiveView('view-home');
    renderHome();
  }

  function renderHome() {
    var countries = window.PIONEER_DATA.countries;
    var visible = state.showOnlyShortlisted
      ? countries.filter(function (c) { return state.shortlist.has(c.id); })
      : countries;

    document.getElementById('cards-heading').textContent =
      state.showOnlyShortlisted ? 'Shortlisted' : 'All Countries';
    document.getElementById('cards-count').textContent =
      visible.length + ' of ' + countries.length;

    var grid = document.getElementById('cards-grid');
    grid.innerHTML = '';
    visible.forEach(function (c) { grid.appendChild(createCard(c)); });

    if (!visible.length) {
      grid.innerHTML = '<div class="compare-empty">No countries shortlisted yet. Star a country to add it.</div>';
    }

    updateShortlistCount();
    PioneerMap.highlight(state.showOnlyShortlisted ? visible.map(function (c) { return c.id; }) : null);
  }

  function createCard(country) {
    var card = document.createElement('div');
    card.className = 'country-card';
    card.addEventListener('click', function (e) {
      if (e.target.closest('.card-star')) return;
      navigateTo('country/' + country.id);
    });

    var comp = getCompleteness(country);
    var starred = state.shortlist.has(country.id);
    var sizeKey = (country.community.communitySize || 'Small').toLowerCase();
    var tagsHtml = (country.community.suitabilityTags || [])
      .slice(0, 4)
      .map(function (t) {
        var type = TAG_TYPES[t] || 'neutral';
        return '<span class="tag ' + type + '">' + escapeHtml(t) + '</span>';
      })
      .join('');

    card.innerHTML =
      '<div class="card-top">' +
        '<span class="card-flag" aria-hidden="true">' + country.flag + '</span>' +
        '<span class="card-star ' + (starred ? 'starred' : '') + '" title="Toggle shortlist">' +
          (starred ? '★' : '☆') +
        '</span>' +
      '</div>' +
      '<div>' +
        '<h3 class="card-name">' + escapeHtml(country.name) + '</h3>' +
        '<p class="card-region">' + escapeHtml(country.region) + '</p>' +
      '</div>' +
      '<span class="card-badge size-' + sizeKey + '">' +
        escapeHtml(country.community.communitySize || 'Unknown') + ' community' +
      '</span>' +
      (tagsHtml ? '<div class="card-tags">' + tagsHtml + '</div>' : '') +
      '<div class="card-completeness">' +
        '<span>' + comp.filled + '/' + comp.total + '</span>' +
        '<div class="completeness-bar"><div class="completeness-bar-fill" style="width:' + comp.pct + '%"></div></div>' +
        '<span>' + comp.pct + '%</span>' +
      '</div>';

    card.querySelector('.card-star').addEventListener('click', function (e) {
      e.stopPropagation();
      toggleShortlist(country.id);
      this.classList.toggle('starred');
      this.textContent = state.shortlist.has(country.id) ? '★' : '☆';
      updateShortlistCount();
    });

    return card;
  }

  function toggleShortlist(countryId) {
    if (state.shortlist.has(countryId)) state.shortlist.delete(countryId);
    else state.shortlist.add(countryId);
    saveShortlist();
    updateShortlistCount();
  }

  function updateShortlistCount() {
    document.getElementById('shortlist-count').textContent = state.shortlist.size;
    document.getElementById('nav-compare').style.display = state.shortlist.size >= 2 ? '' : 'none';
  }

  function updateDetailShortlistBtn() {
    var btn = document.getElementById('detail-shortlist');
    var starred = state.shortlist.has(state.currentCountryId);
    btn.innerHTML = starred ? '★ Shortlisted' : '☆ Shortlist';
    btn.classList.toggle('active', starred);
    updateShortlistCount();
  }

  // ========================================================================
  // DETAIL VIEW
  // ========================================================================
  function showDetail(countryId) {
    var country = getCountry(countryId);
    if (!country) { navigateTo(''); return; }

    state.currentView = 'detail';
    state.currentCountryId = countryId;
    state.currentTab = 'overview';
    state.currentCity = null;
    setActiveView('view-detail');

    document.getElementById('detail-flag').textContent = country.flag;
    document.getElementById('detail-name').textContent = country.name;
    document.getElementById('detail-region').textContent =
      country.region + '  -  Capital: ' + country.capital;

    renderTabs();
    renderCityTabs();
    renderTogglePanel();
    renderDetailContent();
    updateDetailShortlistBtn();
  }

  function renderTabs() {
    var tabsEl = document.getElementById('detail-tabs');
    tabsEl.innerHTML = '';
    SECTION_KEYS.forEach(function (sec) {
      var btn = document.createElement('button');
      btn.className = 'tab' + (state.currentTab === sec ? ' active' : '');
      btn.textContent = FIELDS[sec].__label;
      btn.addEventListener('click', function () {
        state.currentTab = sec;
        renderTabs();
        renderDetailContent();
      });
      tabsEl.appendChild(btn);
    });
  }

  function renderCityTabs() {
    var country = getCountry(state.currentCountryId);
    var el = document.getElementById('city-tabs');
    el.innerHTML = '';

    var tabs = [{ key: null, name: 'Country level' }].concat(
      country.cities.map(function (c) { return { key: c.name, name: c.name }; })
    );

    tabs.forEach(function (t) {
      var btn = document.createElement('button');
      btn.className = 'city-tab' + (state.currentCity === t.key ? ' active' : '');
      btn.textContent = t.name;
      btn.addEventListener('click', function () {
        state.currentCity = t.key;
        renderCityTabs();
        renderDetailContent();
      });
      el.appendChild(btn);
    });
  }

  function renderTogglePanel() {
    var country = getCountry(state.currentCountryId);
    var toggles = loadToggles(country.id);
    var body = document.getElementById('toggle-panel-body');
    body.innerHTML = '';

    var spec = FIELDS[state.currentTab];
    Object.keys(spec).forEach(function (k) {
      if (k.startsWith('__')) return;
      var key = state.currentTab + '.' + k;
      var label = document.createElement('label');
      var cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = toggles[key] !== false;
      cb.addEventListener('change', function () {
        toggles[key] = cb.checked;
        saveToggles(country.id);
        renderDetailContent();
      });
      label.appendChild(cb);
      label.appendChild(document.createTextNode(' ' + spec[k].label));
      body.appendChild(label);
    });

    var actions = document.createElement('div');
    actions.className = 'toggle-panel-actions';
    var showAll = document.createElement('button');
    showAll.textContent = 'Show all';
    showAll.addEventListener('click', function () {
      Object.keys(spec).forEach(function (k) {
        if (k.startsWith('__')) return;
        toggles[state.currentTab + '.' + k] = true;
      });
      saveToggles(country.id);
      renderTogglePanel();
      renderDetailContent();
    });
    var hideAll = document.createElement('button');
    hideAll.textContent = 'Hide all';
    hideAll.addEventListener('click', function () {
      Object.keys(spec).forEach(function (k) {
        if (k.startsWith('__')) return;
        toggles[state.currentTab + '.' + k] = false;
      });
      saveToggles(country.id);
      renderTogglePanel();
      renderDetailContent();
    });
    actions.appendChild(showAll);
    actions.appendChild(hideAll);
    body.appendChild(actions);
  }

  function renderDetailContent() {
    var country = getCountry(state.currentCountryId);
    var container = document.getElementById('detail-content');
    container.innerHTML = '';

    var data = resolveSectionData(country, state.currentTab, state.currentCity);
    var conf = country.confidence[state.currentTab] || {};
    var toggles = loadToggles(country.id);
    var spec = FIELDS[state.currentTab];

    var panel = document.createElement('div');
    panel.className = 'tab-panel';

    var note = cityContextNote(country, state.currentCity, state.currentTab);
    if (note) {
      var noteEl = document.createElement('div');
      noteEl.className = 'text-muted';
      noteEl.style.fontSize = '12px';
      noteEl.style.marginBottom = '12px';
      noteEl.textContent = note;
      panel.appendChild(noteEl);
    }

    var grid = document.createElement('div');
    grid.className = 'fields-grid';

    Object.keys(spec).forEach(function (k) {
      if (k.startsWith('__')) return;
      if (toggles[state.currentTab + '.' + k] === false) return;
      var value = data ? data[k] : null;
      var cardEl = createFieldCard(k, value, spec[k], conf[k]);
      if (cardEl) grid.appendChild(cardEl);
    });

    panel.appendChild(grid);

    if (state.currentTab === 'finances' && data) {
      panel.appendChild(renderRentVisual(data, toggles));
      panel.appendChild(renderEstimator(data));
      panel.appendChild(renderCurrencyBlock(country, data));
    }

    container.appendChild(panel);
  }

  function resolveSectionData(country, section, cityName) {
    if (!cityName) return country[section];
    var city = country.cities.find(function (c) { return c.name === cityName; });
    if (!city) return country[section];
    var override = (section === 'overview') ? city.overview
                  : (section === 'finances') ? city.finances : null;
    if (!override) return country[section];
    // Merge: city values win except where null/undefined, then fall back to country.
    var merged = Object.assign({}, country[section]);
    Object.keys(override).forEach(function (k) {
      if (override[k] !== null && override[k] !== undefined) merged[k] = override[k];
    });
    return merged;
  }

  function cityContextNote(country, cityName, section) {
    if (!cityName) return null;
    var city = country.cities.find(function (c) { return c.name === cityName; });
    if (section === 'visa' || section === 'community') {
      return 'Showing country-level data -- ' + section + ' fields do not vary by city.';
    }
    if (city && ((section === 'overview' && !city.overview) || (section === 'finances' && !city.finances))) {
      return 'No ' + cityName + '-specific data -- showing country-level fallback.';
    }
    return null;
  }

  function createFieldCard(key, value, spec, conf) {
    var card = document.createElement('div');
    card.className = 'field-card';

    var label = document.createElement('div');
    label.className = 'field-label';
    label.textContent = spec.label;

    if (conf === 'low') {
      var flag = document.createElement('span');
      flag.className = 'confidence-flag';
      flag.textContent = '!';
      flag.setAttribute('data-tooltip', 'Data confidence is low -- verify independently before relying on this.');
      label.appendChild(flag);
    }
    card.appendChild(label);

    var valueEl = document.createElement('div');
    valueEl.className = 'field-value';

    if (value === null || value === undefined || value === '' || (Array.isArray(value) && !value.length)) {
      valueEl.classList.add('muted');
      valueEl.textContent = 'No data available';
      card.appendChild(valueEl);
      return card;
    }

    if (spec.format === 'tags') {
      valueEl.innerHTML = value.map(function (t) {
        var type = TAG_TYPES[t] || 'neutral';
        return '<span class="tag ' + type + '">' + escapeHtml(t) + '</span>';
      }).join(' ');
      valueEl.style.display = 'flex';
      valueEl.style.flexWrap = 'wrap';
      valueEl.style.gap = '4px';
      card.classList.add('wide');
      card.appendChild(valueEl);
      return card;
    }
    if (spec.format === 'url') {
      valueEl.innerHTML = '<a href="' + escapeAttr(value) + '" target="_blank" rel="noopener">' + escapeHtml(value) + '</a>';
      card.appendChild(valueEl);
      return card;
    }
    if (spec.format === 'score') {
      valueEl.classList.add('large');
      valueEl.textContent = value + ' / 100';
      card.appendChild(valueEl);
      var bar = document.createElement('div');
      bar.className = 'score-bar';
      bar.innerHTML = '<div class="score-bar-fill" style="width:' + value + '%"></div>';
      card.appendChild(bar);
      return card;
    }
    if (key === 'notes' || key === 'religionDemographics' || key === 'healthcareSystem' ||
        key === 'climate' || key === 'crimeSafetyIndex' || key === 'englishScoreNote' ||
        key === 'renewalOptions' || key === 'visaType' || key === 'proximityToHouseOfWorship') {
      card.classList.add('wide');
    }

    valueEl.textContent = formatValue(key, value, spec);
    card.appendChild(valueEl);
    return card;
  }

  // ----- Finances widgets -----
  function renderRentVisual(data, toggles) {
    var section = document.createElement('div');
    var anyRentVisible = ['rent1br', 'rent2br', 'rent3br'].some(function (k) {
      return toggles['finances.' + k] !== false && data[k] !== null && data[k] !== undefined;
    });
    if (!anyRentVisible) return section;

    section.innerHTML = '<div class="section-header">Rent comparison</div>';
    var max = Math.max(data.rent1br || 0, data.rent2br || 0, data.rent3br || 0, 1);
    var bars = document.createElement('div');
    bars.className = 'rent-bars';

    [['1 bedroom', data.rent1br], ['2 bedroom', data.rent2br], ['3 bedroom', data.rent3br]].forEach(function (row) {
      if (row[1] === null || row[1] === undefined) return;
      var pct = (row[1] / max) * 100;
      var rowEl = document.createElement('div');
      rowEl.className = 'rent-row';
      rowEl.innerHTML =
        '<div class="rent-row-label">' + row[0] + '</div>' +
        '<div class="rent-row-bar"><div class="rent-row-bar-fill" style="width:' + pct + '%"></div></div>' +
        '<div class="rent-row-value">' + formatAUD(row[1]) + '</div>';
      bars.appendChild(rowEl);
    });
    section.appendChild(bars);
    return section;
  }

  function renderEstimator(data) {
    var section = document.createElement('div');
    section.innerHTML = '<div class="section-header">Monthly budget estimator</div>';

    var box = document.createElement('div');
    box.className = 'estimator';
    box.innerHTML =
      '<div class="estimator-row">' +
        '<label for="hh-size">Household size</label>' +
        '<select id="hh-size">' +
          '<option value="1">1 adult</option>' +
          '<option value="2">2 adults</option>' +
          '<option value="3">2 adults + child</option>' +
          '<option value="4">4+ people</option>' +
        '</select>' +
      '</div>' +
      '<div class="estimator-row">' +
        '<span class="text-muted">Estimated monthly total</span>' +
        '<span class="estimator-total" id="hh-total">--</span>' +
      '</div>' +
      '<div class="estimator-breakdown" id="hh-breakdown"></div>';
    section.appendChild(box);

    function recalc() {
      var rule = HOUSEHOLD_SCALING[state.householdSize];
      var rent = data[rule.rent] || 0;
      var grocery = (data.groceryBasket || 0) * rule.grocery;
      var transport = (data.publicTransportMonthly || 0) * rule.transport;
      var utilities = data.utilitiesMonthly || 0;
      var internet = data.internetMonthly || 0;
      var total = rent + grocery + transport + utilities + internet;
      document.getElementById('hh-total').textContent = formatAUD(Math.round(total));
      var bd = document.getElementById('hh-breakdown');
      bd.innerHTML =
        '<span>Rent (' + rule.rent.replace('rent', '') + '):</span><span>' + formatAUD(Math.round(rent)) + '</span>' +
        '<span>Groceries:</span><span>' + formatAUD(Math.round(grocery)) + '</span>' +
        '<span>Transport:</span><span>' + formatAUD(Math.round(transport)) + '</span>' +
        '<span>Utilities:</span><span>' + formatAUD(Math.round(utilities)) + '</span>' +
        '<span>Internet:</span><span>' + formatAUD(Math.round(internet)) + '</span>';
    }
    setTimeout(function () {
      var sel = document.getElementById('hh-size');
      sel.value = state.householdSize;
      sel.addEventListener('change', function () { state.householdSize = sel.value; recalc(); });
      recalc();
    }, 0);

    return section;
  }

  function renderCurrencyBlock(country, data) {
    var section = document.createElement('div');
    section.innerHTML = '<div class="section-header">Currency</div>';

    var card = document.createElement('div');
    card.className = 'field-card wide';
    card.innerHTML =
      '<div class="currency-card">' +
        '<div class="currency-rate">' +
          '<span class="currency-rate-value" id="cur-rate">' + (data.exchangeRateToAUD ?? '--') + '</span>' +
          '<span class="currency-rate-unit">' + (data.currencyCode || '') + ' per 1 AUD</span>' +
        '</div>' +
        '<div class="currency-meta">Last updated: <span id="cur-updated">' + (data.exchangeRateLastUpdated || 'never') + '</span></div>' +
        '<button class="currency-refresh" id="cur-refresh">Refresh live rate</button>' +
      '</div>' +
      '<div class="chart-controls" style="margin-top:12px">' +
        '<button data-period="1M">1M</button>' +
        '<button data-period="3M">3M</button>' +
        '<button data-period="1Y" class="active">1Y</button>' +
        '<button data-period="2Y">2Y</button>' +
      '</div>' +
      '<div class="chart-wrap"><canvas id="rate-chart"></canvas></div>';
    section.appendChild(card);

    setTimeout(function () {
      document.getElementById('cur-refresh').addEventListener('click', function () {
        refreshLiveRate(country, data);
      });
      card.querySelectorAll('.chart-controls button').forEach(function (btn) {
        btn.addEventListener('click', function () {
          state.chartPeriod = btn.getAttribute('data-period');
          card.querySelectorAll('.chart-controls button').forEach(function (b) {
            b.classList.toggle('active', b === btn);
          });
          drawRateChart(data);
        });
      });
      drawRateChart(data);
    }, 0);

    return section;
  }

  function refreshLiveRate(country, data) {
    var btn = document.getElementById('cur-refresh');
    var code = data.currencyCode;
    btn.disabled = true;
    btn.textContent = 'Refreshing...';

    fetch('https://api.frankfurter.app/latest?from=AUD&to=' + encodeURIComponent(code))
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (json) {
        var newRate = json.rates && json.rates[code];
        if (!newRate) throw new Error('no rate');
        document.getElementById('cur-rate').textContent = newRate.toFixed(4);
        document.getElementById('cur-updated').textContent = json.date + ' (live)';
        btn.textContent = 'Refresh live rate';
        btn.disabled = false;
      })
      .catch(function () {
        document.getElementById('cur-updated').textContent =
          (data.exchangeRateLastUpdated || 'unknown') + ' -- live unavailable for ' + code;
        btn.textContent = 'Refresh live rate';
        btn.disabled = false;
      });
  }

  function drawRateChart(data) {
    if (currentChart) { currentChart.destroy(); currentChart = null; }
    var canvas = document.getElementById('rate-chart');
    if (!canvas) return;
    if (!data.historicalRates || !data.historicalRates.length) {
      canvas.parentElement.innerHTML = '<div class="text-muted" style="text-align:center;padding-top:60px">No historical data.</div>';
      return;
    }
    var counts = { '1M': 2, '3M': 4, '1Y': 12, '2Y': 24 };
    var n = counts[state.chartPeriod] || 12;
    var slice = data.historicalRates.slice(-n);

    currentChart = new Chart(canvas.getContext('2d'), {
      type: 'line',
      data: {
        labels: slice.map(function (r) { return r.month; }),
        datasets: [{
          label: data.currencyCode + ' per AUD',
          data: slice.map(function (r) { return r.rate; }),
          borderColor: '#2A9D8F',
          backgroundColor: 'rgba(42, 157, 143, 0.12)',
          fill: true,
          tension: 0.3,
          pointRadius: 3,
          pointBackgroundColor: '#2A9D8F'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#8A9396', font: { size: 10 } } },
          y: { grid: { color: '#E1E3E0' }, ticks: { color: '#8A9396', font: { size: 10 } } }
        }
      }
    });
  }

  // ========================================================================
  // COMPARE VIEW
  // ========================================================================
  function showCompare() {
    state.currentView = 'compare';
    if (state.compareSelection.size === 0) {
      state.compareSelection = new Set(Array.from(state.shortlist).slice(0, 4));
    }
    setActiveView('view-compare');
    renderCompareToggles();
    renderCompare();
  }

  function renderCompareToggles() {
    var body = document.getElementById('compare-toggle-body');
    body.innerHTML = '';

    // Country selector
    var selectorTitle = document.createElement('div');
    selectorTitle.style.width = '100%';
    selectorTitle.style.fontSize = '12px';
    selectorTitle.style.fontWeight = '600';
    selectorTitle.style.color = '#4A5A5D';
    selectorTitle.style.marginBottom = '4px';
    selectorTitle.textContent = 'Countries (max 4):';
    body.appendChild(selectorTitle);

    var selRow = document.createElement('div');
    selRow.style.display = 'flex';
    selRow.style.flexWrap = 'wrap';
    selRow.style.gap = '6px';
    selRow.style.width = '100%';
    selRow.style.marginBottom = '10px';
    selRow.style.paddingBottom = '10px';
    selRow.style.borderBottom = '1px solid #E1E3E0';

    window.PIONEER_DATA.countries.forEach(function (c) {
      var btn = document.createElement('button');
      var sel = state.compareSelection.has(c.id);
      btn.className = 'city-tab' + (sel ? ' active' : '');
      btn.textContent = c.flag + ' ' + c.name;
      btn.addEventListener('click', function () {
        if (sel) state.compareSelection.delete(c.id);
        else {
          if (state.compareSelection.size >= 4) {
            alert('Comparison is limited to 4 countries. Remove one first.');
            return;
          }
          state.compareSelection.add(c.id);
        }
        renderCompareToggles();
        renderCompare();
      });
      selRow.appendChild(btn);
    });
    body.appendChild(selRow);

    // Field toggles
    var fieldsTitle = document.createElement('div');
    fieldsTitle.style.width = '100%';
    fieldsTitle.style.fontSize = '12px';
    fieldsTitle.style.fontWeight = '600';
    fieldsTitle.style.color = '#4A5A5D';
    fieldsTitle.style.marginBottom = '4px';
    fieldsTitle.textContent = 'Fields shown:';
    body.appendChild(fieldsTitle);

    SECTION_KEYS.forEach(function (sec) {
      var group = document.createElement('div');
      group.style.minWidth = '200px';
      var head = document.createElement('div');
      head.style.fontSize = '11px';
      head.style.fontWeight = '700';
      head.style.color = '#2A9D8F';
      head.style.textTransform = 'uppercase';
      head.style.letterSpacing = '0.06em';
      head.style.marginBottom = '4px';
      head.textContent = FIELDS[sec].__label;
      group.appendChild(head);

      Object.keys(FIELDS[sec]).forEach(function (k) {
        if (k.startsWith('__')) return;
        var key = sec + '.' + k;
        var label = document.createElement('label');
        label.style.display = 'flex';
        label.style.gap = '6px';
        label.style.fontSize = '12px';
        var cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.checked = state.compareToggles[key] !== false;
        cb.addEventListener('change', function () {
          state.compareToggles[key] = cb.checked;
          saveCompareToggles();
          renderCompare();
        });
        label.appendChild(cb);
        label.appendChild(document.createTextNode(FIELDS[sec][k].label));
        group.appendChild(label);
      });
      body.appendChild(group);
    });
  }

  function renderCompare() {
    var container = document.getElementById('compare-content');
    var countries = Array.from(state.compareSelection).slice(0, 4).map(getCountry).filter(Boolean);

    if (!countries.length) {
      container.innerHTML = '<div class="compare-empty">Select at least 2 countries above to compare.</div>';
      return;
    }
    if (countries.length === 1) {
      container.innerHTML = '<div class="compare-empty">Select one more country to compare.</div>';
      return;
    }

    var html = ['<table class="compare-table"><thead><tr><th>Field</th>'];
    countries.forEach(function (c) {
      html.push('<th><div class="country-th"><span style="font-size:18px">' + c.flag + '</span>' + escapeHtml(c.name) + '</div></th>');
    });
    html.push('</tr></thead><tbody>');

    SECTION_KEYS.forEach(function (sec) {
      var spec = FIELDS[sec];
      var visibleKeys = Object.keys(spec).filter(function (k) {
        return !k.startsWith('__') && state.compareToggles[sec + '.' + k] !== false;
      });
      if (!visibleKeys.length) return;

      html.push('<tr class="compare-section-row"><th colspan="' + (countries.length + 1) + '">' + spec.__label + '</th></tr>');

      visibleKeys.forEach(function (k) {
        html.push('<tr><th>' + escapeHtml(spec[k].label) + '</th>');
        var values = countries.map(function (c) {
          return c[sec] ? c[sec][k] : null;
        });
        var colorRank = computeColorRank(values, spec[k].dir);
        countries.forEach(function (c, i) {
          var v = values[i];
          var conf = c.confidence[sec] ? c.confidence[sec][k] : null;
          var display = formatValueForCell(k, v, spec[k]);
          var cls = 'compare-cell';
          if (colorRank && colorRank[i]) cls += ' ' + colorRank[i];
          var flagHtml = conf === 'low' ? ' <span class="confidence-flag" data-tooltip="Data confidence is low -- verify independently before relying on this.">!</span>' : '';
          html.push('<td class="' + cls + '">' + display + flagHtml + '</td>');
        });
        html.push('</tr>');
      });
    });

    html.push('</tbody></table>');
    container.innerHTML = html.join('');
  }

  function formatValueForCell(key, value, spec) {
    if (value === null || value === undefined || value === '') {
      return '<span class="text-muted">No data</span>';
    }
    if (spec.format === 'tags' && Array.isArray(value)) {
      return value.map(function (t) {
        var type = TAG_TYPES[t] || 'neutral';
        return '<span class="tag ' + type + '">' + escapeHtml(t) + '</span>';
      }).join(' ');
    }
    if (spec.format === 'url') {
      return '<a href="' + escapeAttr(value) + '" target="_blank" rel="noopener">link</a>';
    }
    return escapeHtml(formatValue(key, value, spec));
  }

  function computeColorRank(values, dir) {
    if (!dir) return null;
    var nums = values.map(function (v) {
      return (typeof v === 'number') ? v : null;
    });
    var validNums = nums.filter(function (n) { return n !== null; });
    if (validNums.length < 2) return null;

    var min = Math.min.apply(null, validNums);
    var max = Math.max.apply(null, validNums);
    if (min === max) return null;

    return nums.map(function (n) {
      if (n === null) return null;
      var bestEnd = dir === 'higher' ? max : min;
      var worstEnd = dir === 'higher' ? min : max;
      if (n === bestEnd) return 'best';
      if (n === worstEnd) return 'worst';
      return 'mid';
    });
  }

  // ========================================================================
  // ESCAPING
  // ========================================================================
  function escapeHtml(s) {
    if (s === null || s === undefined) return '';
    return String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function escapeAttr(s) { return escapeHtml(s); }

  // ========================================================================
  // INIT
  // ========================================================================
  function init() {
    loadShortlist();
    loadCompareToggles();
    bindEvents();
    PioneerMap.init(window.PIONEER_DATA.countries, {
      onCountryClick: function (id) { navigateTo('country/' + id); }
    });
    updateShortlistCount();
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
