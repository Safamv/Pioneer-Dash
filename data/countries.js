/* ==========================================================================
   PIONEER DASHBOARD -- COUNTRY DATA
   ==========================================================================

   STATUS: DEMO BUILD. All values below are fake placeholders.
           Real verified data will be swapped in by editing this file only.

   --------------------------------------------------------------------------
   SCHEMA REFERENCE -- each country object includes these fields.
   Use null for any missing field (do NOT omit the field).

   --- STATIC (do NOT change after launch) ---
   id                   kebab-case slug, used in URLs
   name                 country name as displayed
   flag                 emoji
   region               continent/region label
   capital              capital city name
   countryLatLng        [lat, lng] used for the map pin
   cities               array of { name, lat, lng, overview?, finances? }
                        overview / finances on a city override the country
                        value when that city tab is active. Null means
                        "use country-level data".

   --- SECTION: overview ---
   population               string (e.g. "1,400,000,000")
   officialLanguages        array of strings
   englishScore             integer 0--100
   englishScoreNote         string source/method
   climate                  one-line summary
   politicalStability       "Low" | "Moderate" | "High"
   internetSpeed            string (e.g. "45 Mbps avg")
   healthcareSystem         short description
   crimeSafetyIndex         string
   religionDemographics     string

   --- SECTION: finances (all AUD equivalents unless noted) ---
   costOfLivingIndex        number, 100 = Sydney
   rent1br                  monthly AUD
   rent2br                  monthly AUD
   rent3br                  monthly AUD
   groceryBasket            monthly AUD, standard household basket
   averageMealPrice         AUD, single mid-range meal
   publicTransportMonthly   AUD
   transportMode            "Car essential" | "Mixed" | "Walkable/Transit"
   utilitiesMonthly         AUD
   internetMonthly          AUD
   averageLocalSalary       AUD annual equivalent
   currencyCode             ISO 4217 code (e.g. "CNY")
   exchangeRateToAUD        number (1 AUD = X local)
   exchangeRateLastUpdated  ISO date string
   historicalRates          array of { month: "YYYY-MM", rate: number },
                            last 24 months, oldest first

   --- SECTION: visa (Australian passport holder) ---
   visaType                  string
   maxInitialStay            string
   renewalOptions            string
   religiousWorkerVisa       boolean
   workRights                string
   estimatedProcessingTime   string
   estimatedCostAUD          number
   officialSourceUrl         string
   notes                     string

   --- SECTION: community ---
   bahaiFamilyCount             number or null
   hasLSA                       true | false | null
   communitySize                "Small" | "Medium" | "Large"
   openPioneerGoal              boolean
   proximityToHouseOfWorship    string
   suitabilityTags              array drawn from the canonical list:
       "Good for families", "Solo pioneer friendly",
       "Strong existing community", "Low English penetration",
       "High cost of living", "Visa complexity", "Remote location"

   --- confidence: parallel object ---
   For every field above (except static fields and historicalRates) the
   confidence object holds a value of "high" | "medium" | "low".
   "low" triggers the yellow warning indicator in the UI.
   ========================================================================== */

(function () {
  // Generates 24 months of fake historical rates ending May 2026 (2024-06 to 2026-05).
  // base = approximate rate, drift = amplitude of seasonal wobble.
  // All FAKE -- the Refresh button overwrites the latest rate for supported currencies.
  function fakeHistory(base, drift) {
    var months = [];
    var year = 2024, month = 6;
    for (var i = 0; i < 24; i++) {
      var wobble = Math.sin(i / 3) * drift + (Math.random() - 0.5) * drift * 0.4;
      months.push({
        month: year + '-' + (month < 10 ? '0' : '') + month,
        rate: Math.round((base + wobble) * 10000) / 10000
      });
      month++;
      if (month > 12) { month = 1; year++; }
    }
    return months;
  }

  window.PIONEER_DATA = {
    countries: [

      /* ===================================================================
         1. CHINA
         =================================================================== */
      {
        id: 'china',
        name: 'China',
        flag: '🇨🇳',
        region: 'East Asia',
        capital: 'Beijing',
        countryLatLng: [35.8617, 104.1954],
        cities: [
          { name: 'Beijing',   lat: 39.9042, lng: 116.4074, overview: null, finances: null },
          { name: 'Shanghai',  lat: 31.2304, lng: 121.4737, overview: null,
            finances: { costOfLivingIndex: 78, rent1br: 1850, rent2br: 2900, rent3br: 4100, groceryBasket: 720, averageMealPrice: 22, publicTransportMonthly: 60, transportMode: 'Walkable/Transit', utilitiesMonthly: 180, internetMonthly: 35, averageLocalSalary: 28000, currencyCode: 'CNY', exchangeRateToAUD: 4.72, exchangeRateLastUpdated: '2026-05-28', historicalRates: null } },
          { name: 'Guangzhou', lat: 23.1291, lng: 113.2644, overview: null, finances: null }
        ],
        overview: {
          population: '1,410,000,000',
          officialLanguages: ['Mandarin'],
          englishScore: 42,
          englishScoreNote: 'Placeholder -- aligned with EF EPI style scale',
          climate: 'Wide variation; humid subtropical south, continental north',
          politicalStability: 'Moderate',
          internetSpeed: '55 Mbps avg',
          healthcareSystem: 'Mixed public/private; quality varies widely by tier-1 vs rural',
          crimeSafetyIndex: 'Generally safe in cities; petty theft in tourist areas',
          religionDemographics: 'Officially atheist state; mixed folk traditions, Buddhism, Christianity'
        },
        finances: {
          costOfLivingIndex: 62,
          rent1br: 1400,
          rent2br: 2300,
          rent3br: 3400,
          groceryBasket: 620,
          averageMealPrice: 18,
          publicTransportMonthly: 55,
          transportMode: 'Walkable/Transit',
          utilitiesMonthly: 150,
          internetMonthly: 30,
          averageLocalSalary: 24000,
          currencyCode: 'CNY',
          exchangeRateToAUD: 4.72,
          exchangeRateLastUpdated: '2026-05-28',
          historicalRates: fakeHistory(4.7, 0.25)
        },
        visa: {
          visaType: 'Z visa (work) / X visa (study) / S2 (family)',
          maxInitialStay: '12 months (work permit)',
          renewalOptions: 'Annual renewal via employer sponsorship',
          religiousWorkerVisa: false,
          workRights: 'Full, tied to sponsor',
          estimatedProcessingTime: '4--6 weeks',
          estimatedCostAUD: 320,
          officialSourceUrl: 'https://www.visaforchina.cn/',
          notes: 'Religious work historically constrained -- verify locally.'
        },
        community: {
          bahaiFamilyCount: null,
          hasLSA: null,
          communitySize: 'Small',
          openPioneerGoal: false,
          proximityToHouseOfWorship: 'Nearest in Sydney, Australia (~9,000 km)',
          suitabilityTags: ['Visa complexity', 'Low English penetration']
        },
        confidence: {
          overview: { population: 'high', officialLanguages: 'high', englishScore: 'low', englishScoreNote: 'low', climate: 'medium', politicalStability: 'medium', internetSpeed: 'medium', healthcareSystem: 'medium', crimeSafetyIndex: 'low', religionDemographics: 'medium' },
          finances: { costOfLivingIndex: 'medium', rent1br: 'medium', rent2br: 'medium', rent3br: 'low', groceryBasket: 'medium', averageMealPrice: 'medium', publicTransportMonthly: 'high', transportMode: 'high', utilitiesMonthly: 'medium', internetMonthly: 'high', averageLocalSalary: 'low', currencyCode: 'high', exchangeRateToAUD: 'high', exchangeRateLastUpdated: 'high' },
          visa: { visaType: 'high', maxInitialStay: 'medium', renewalOptions: 'medium', religiousWorkerVisa: 'low', workRights: 'medium', estimatedProcessingTime: 'low', estimatedCostAUD: 'low', officialSourceUrl: 'high', notes: 'low' },
          community: { bahaiFamilyCount: 'low', hasLSA: 'low', communitySize: 'low', openPioneerGoal: 'medium', proximityToHouseOfWorship: 'high', suitabilityTags: 'medium' }
        }
      },

      /* ===================================================================
         2. ALBANIA
         =================================================================== */
      {
        id: 'albania',
        name: 'Albania',
        flag: '🇦🇱',
        region: 'Southeast Europe',
        capital: 'Tirana',
        countryLatLng: [41.1533, 20.1683],
        cities: [
          { name: 'Tirana', lat: 41.3275, lng: 19.8187, overview: null, finances: null },
          { name: 'Durr\xEBs', lat: 41.3234, lng: 19.4413, overview: null, finances: null }
        ],
        overview: {
          population: '2,800,000',
          officialLanguages: ['Albanian'],
          englishScore: 58,
          englishScoreNote: 'Placeholder -- younger population skews higher',
          climate: 'Mediterranean coast; continental interior with cold winters',
          politicalStability: 'Moderate',
          internetSpeed: '48 Mbps avg',
          healthcareSystem: 'Public system underfunded; private clinics in Tirana improving',
          crimeSafetyIndex: 'Generally safe; petty crime in urban centres',
          religionDemographics: 'Muslim majority; Orthodox and Catholic minorities; small Bah\xE1\'i community'
        },
        finances: {
          costOfLivingIndex: 34,
          rent1br: 380,
          rent2br: 590,
          rent3br: 880,
          groceryBasket: 280,
          averageMealPrice: 9,
          publicTransportMonthly: 20,
          transportMode: 'Mixed',
          utilitiesMonthly: 85,
          internetMonthly: 18,
          averageLocalSalary: 7200,
          currencyCode: 'ALL',
          exchangeRateToAUD: 96.0,
          exchangeRateLastUpdated: '2026-05-28',
          historicalRates: fakeHistory(94, 3.2)
        },
        visa: {
          visaType: 'Type D long-stay visa / Residence permit',
          maxInitialStay: '90 days visa-free; up to 1 year residence',
          renewalOptions: 'Annual renewal; permanent residence after 5 years',
          religiousWorkerVisa: null,
          workRights: 'Yes via residence permit with work authorisation',
          estimatedProcessingTime: '3--6 weeks',
          estimatedCostAUD: 110,
          officialSourceUrl: 'https://e-albania.al/',
          notes: 'Albania has a secular constitution; religious activity broadly permitted.'
        },
        community: {
          bahaiFamilyCount: 80,
          hasLSA: true,
          communitySize: 'Small',
          openPioneerGoal: true,
          proximityToHouseOfWorship: 'Frankfurt House of Worship (~2,000 km)',
          suitabilityTags: ['Solo pioneer friendly', 'Good for families']
        },
        confidence: {
          overview: { population: 'high', officialLanguages: 'high', englishScore: 'low', englishScoreNote: 'low', climate: 'high', politicalStability: 'medium', internetSpeed: 'medium', healthcareSystem: 'medium', crimeSafetyIndex: 'medium', religionDemographics: 'high' },
          finances: { costOfLivingIndex: 'medium', rent1br: 'medium', rent2br: 'medium', rent3br: 'low', groceryBasket: 'medium', averageMealPrice: 'medium', publicTransportMonthly: 'medium', transportMode: 'medium', utilitiesMonthly: 'medium', internetMonthly: 'medium', averageLocalSalary: 'low', currencyCode: 'high', exchangeRateToAUD: 'low', exchangeRateLastUpdated: 'high' },
          visa: { visaType: 'medium', maxInitialStay: 'high', renewalOptions: 'medium', religiousWorkerVisa: 'low', workRights: 'medium', estimatedProcessingTime: 'low', estimatedCostAUD: 'low', officialSourceUrl: 'medium', notes: 'medium' },
          community: { bahaiFamilyCount: 'low', hasLSA: 'medium', communitySize: 'medium', openPioneerGoal: 'high', proximityToHouseOfWorship: 'high', suitabilityTags: 'high' }
        }
      },

      /* ===================================================================
         3. POLAND
         =================================================================== */
      {
        id: 'poland',
        name: 'Poland',
        flag: '🇵🇱',
        region: 'Central Europe',
        capital: 'Warsaw',
        countryLatLng: [51.9194, 19.1451],
        cities: [
          { name: 'Warsaw',  lat: 52.2297, lng: 21.0122, overview: null, finances: null },
          { name: 'Krak\xF3w', lat: 50.0647, lng: 19.9450, overview: null, finances: null },
          { name: 'Wrocław', lat: 51.1079, lng: 17.0385, overview: null, finances: null }
        ],
        overview: {
          population: '38,000,000',
          officialLanguages: ['Polish'],
          englishScore: 66,
          englishScoreNote: 'Placeholder -- high among younger urban populations',
          climate: 'Temperate continental; cold winters, warm summers',
          politicalStability: 'High',
          internetSpeed: '105 Mbps avg',
          healthcareSystem: 'Universal public NFZ + strong private sector',
          crimeSafetyIndex: 'Very safe; one of safest in Europe',
          religionDemographics: 'Catholic majority (~87%); small Bah\xE1\'i community'
        },
        finances: {
          costOfLivingIndex: 52,
          rent1br: 780,
          rent2br: 1200,
          rent3br: 1800,
          groceryBasket: 420,
          averageMealPrice: 16,
          publicTransportMonthly: 45,
          transportMode: 'Walkable/Transit',
          utilitiesMonthly: 135,
          internetMonthly: 22,
          averageLocalSalary: 22000,
          currencyCode: 'PLN',
          exchangeRateToAUD: 2.82,
          exchangeRateLastUpdated: '2026-05-28',
          historicalRates: fakeHistory(2.8, 0.12)
        },
        visa: {
          visaType: 'National D visa / Temporary residence permit',
          maxInitialStay: 'Up to 1 year; 3-year temporary residence',
          renewalOptions: 'Renewal every 3 years; permanent residence after 5 years',
          religiousWorkerVisa: true,
          workRights: 'Full with residence permit',
          estimatedProcessingTime: '4--8 weeks',
          estimatedCostAUD: 160,
          officialSourceUrl: 'https://www.gov.pl/web/mswia',
          notes: 'Religious worker residence category available; well-established process.'
        },
        community: {
          bahaiFamilyCount: 120,
          hasLSA: true,
          communitySize: 'Small',
          openPioneerGoal: true,
          proximityToHouseOfWorship: 'Frankfurt House of Worship (~900 km)',
          suitabilityTags: ['Solo pioneer friendly', 'Good for families']
        },
        confidence: {
          overview: { population: 'high', officialLanguages: 'high', englishScore: 'medium', englishScoreNote: 'low', climate: 'high', politicalStability: 'high', internetSpeed: 'high', healthcareSystem: 'high', crimeSafetyIndex: 'high', religionDemographics: 'high' },
          finances: { costOfLivingIndex: 'medium', rent1br: 'medium', rent2br: 'medium', rent3br: 'low', groceryBasket: 'medium', averageMealPrice: 'high', publicTransportMonthly: 'high', transportMode: 'high', utilitiesMonthly: 'medium', internetMonthly: 'high', averageLocalSalary: 'medium', currencyCode: 'high', exchangeRateToAUD: 'high', exchangeRateLastUpdated: 'high' },
          visa: { visaType: 'high', maxInitialStay: 'high', renewalOptions: 'high', religiousWorkerVisa: 'high', workRights: 'high', estimatedProcessingTime: 'medium', estimatedCostAUD: 'medium', officialSourceUrl: 'high', notes: 'high' },
          community: { bahaiFamilyCount: 'low', hasLSA: 'medium', communitySize: 'medium', openPioneerGoal: 'high', proximityToHouseOfWorship: 'high', suitabilityTags: 'high' }
        }
      },

      /* ===================================================================
         4. BOSNIA-HERZEGOVINA
         =================================================================== */
      {
        id: 'bosnia-herzegovina',
        name: 'Bosnia-Herzegovina',
        flag: '🇧🇦',
        region: 'Southeast Europe',
        capital: 'Sarajevo',
        countryLatLng: [43.9159, 17.6791],
        cities: [
          { name: 'Sarajevo', lat: 43.8563, lng: 18.4131, overview: null, finances: null },
          { name: 'Mostar',   lat: 43.3438, lng: 17.8078, overview: null, finances: null }
        ],
        overview: {
          population: '3,300,000',
          officialLanguages: ['Bosnian', 'Croatian', 'Serbian'],
          englishScore: 54,
          englishScoreNote: 'Placeholder',
          climate: 'Continental; cold snowy winters, warm summers',
          politicalStability: 'Moderate',
          internetSpeed: '38 Mbps avg',
          healthcareSystem: 'Public system; quality variable; private clinics in Sarajevo',
          crimeSafetyIndex: 'Generally safe; landmine awareness in rural areas',
          religionDemographics: 'Muslim (~50%), Orthodox (~31%), Catholic (~15%); very small Bah\xE1\'i community'
        },
        finances: {
          costOfLivingIndex: 30,
          rent1br: 340,
          rent2br: 540,
          rent3br: 820,
          groceryBasket: 260,
          averageMealPrice: 8,
          publicTransportMonthly: 22,
          transportMode: 'Mixed',
          utilitiesMonthly: 80,
          internetMonthly: 18,
          averageLocalSalary: 7500,
          currencyCode: 'BAM',
          exchangeRateToAUD: 1.22,
          exchangeRateLastUpdated: '2026-05-28',
          historicalRates: fakeHistory(1.2, 0.04)
        },
        visa: {
          visaType: 'Temporary stay permit / Long-stay D visa',
          maxInitialStay: '90 days visa-free; up to 1 year permit',
          renewalOptions: 'Annual renewal; permanent residence after 5 years',
          religiousWorkerVisa: null,
          workRights: 'Yes with work permit',
          estimatedProcessingTime: '4--8 weeks',
          estimatedCostAUD: 120,
          officialSourceUrl: 'https://www.mvp.gov.ba/',
          notes: null
        },
        community: {
          bahaiFamilyCount: 40,
          hasLSA: false,
          communitySize: 'Small',
          openPioneerGoal: true,
          proximityToHouseOfWorship: 'Frankfurt House of Worship (~1,600 km)',
          suitabilityTags: ['Solo pioneer friendly', 'Low English penetration']
        },
        confidence: {
          overview: { population: 'high', officialLanguages: 'high', englishScore: 'low', englishScoreNote: 'low', climate: 'high', politicalStability: 'medium', internetSpeed: 'medium', healthcareSystem: 'medium', crimeSafetyIndex: 'medium', religionDemographics: 'high' },
          finances: { costOfLivingIndex: 'medium', rent1br: 'low', rent2br: 'low', rent3br: 'low', groceryBasket: 'medium', averageMealPrice: 'medium', publicTransportMonthly: 'medium', transportMode: 'medium', utilitiesMonthly: 'medium', internetMonthly: 'medium', averageLocalSalary: 'low', currencyCode: 'high', exchangeRateToAUD: 'low', exchangeRateLastUpdated: 'high' },
          visa: { visaType: 'medium', maxInitialStay: 'high', renewalOptions: 'medium', religiousWorkerVisa: 'low', workRights: 'medium', estimatedProcessingTime: 'low', estimatedCostAUD: 'low', officialSourceUrl: 'medium', notes: 'low' },
          community: { bahaiFamilyCount: 'low', hasLSA: 'low', communitySize: 'low', openPioneerGoal: 'medium', proximityToHouseOfWorship: 'high', suitabilityTags: 'medium' }
        }
      },

      /* ===================================================================
         5. MOLDOVA
         =================================================================== */
      {
        id: 'moldova',
        name: 'Moldova',
        flag: '🇲🇩',
        region: 'Eastern Europe',
        capital: 'Chișinău',
        countryLatLng: [47.4116, 28.3699],
        cities: [
          { name: 'Chișinău', lat: 47.0105, lng: 28.8638, overview: null, finances: null },
          { name: 'Bălți',    lat: 47.7626, lng: 27.9291, overview: null, finances: null }
        ],
        overview: {
          population: '2,600,000',
          officialLanguages: ['Romanian'],
          englishScore: 52,
          englishScoreNote: 'Placeholder',
          climate: 'Continental; cold winters, hot dry summers',
          politicalStability: 'Moderate',
          internetSpeed: '55 Mbps avg',
          healthcareSystem: 'Public system strained; affordable private clinics in Chișinău',
          crimeSafetyIndex: 'Generally safe; petty crime in capital',
          religionDemographics: 'Orthodox Christian majority (~90%); very small Bah\xE1\'i community'
        },
        finances: {
          costOfLivingIndex: 28,
          rent1br: 280,
          rent2br: 440,
          rent3br: 660,
          groceryBasket: 240,
          averageMealPrice: 7,
          publicTransportMonthly: 14,
          transportMode: 'Mixed',
          utilitiesMonthly: 75,
          internetMonthly: 14,
          averageLocalSalary: 5800,
          currencyCode: 'MDL',
          exchangeRateToAUD: 12.4,
          exchangeRateLastUpdated: '2026-05-28',
          historicalRates: fakeHistory(12.2, 0.5)
        },
        visa: {
          visaType: 'Type D long-stay visa / Temporary residence',
          maxInitialStay: '90 days visa-free; up to 1 year residence',
          renewalOptions: 'Annual; permanent residence after 10 years',
          religiousWorkerVisa: null,
          workRights: 'Yes with work permit',
          estimatedProcessingTime: '4--8 weeks',
          estimatedCostAUD: 90,
          officialSourceUrl: 'https://www.migratie.md/',
          notes: null
        },
        community: {
          bahaiFamilyCount: 30,
          hasLSA: false,
          communitySize: 'Small',
          openPioneerGoal: true,
          proximityToHouseOfWorship: 'Frankfurt House of Worship (~1,800 km)',
          suitabilityTags: ['Solo pioneer friendly', 'Low English penetration']
        },
        confidence: {
          overview: { population: 'high', officialLanguages: 'high', englishScore: 'low', englishScoreNote: 'low', climate: 'high', politicalStability: 'medium', internetSpeed: 'medium', healthcareSystem: 'medium', crimeSafetyIndex: 'medium', religionDemographics: 'high' },
          finances: { costOfLivingIndex: 'medium', rent1br: 'low', rent2br: 'low', rent3br: 'low', groceryBasket: 'medium', averageMealPrice: 'medium', publicTransportMonthly: 'medium', transportMode: 'medium', utilitiesMonthly: 'low', internetMonthly: 'medium', averageLocalSalary: 'low', currencyCode: 'high', exchangeRateToAUD: 'low', exchangeRateLastUpdated: 'high' },
          visa: { visaType: 'medium', maxInitialStay: 'high', renewalOptions: 'low', religiousWorkerVisa: 'low', workRights: 'medium', estimatedProcessingTime: 'low', estimatedCostAUD: 'low', officialSourceUrl: 'medium', notes: 'low' },
          community: { bahaiFamilyCount: 'low', hasLSA: 'low', communitySize: 'low', openPioneerGoal: 'medium', proximityToHouseOfWorship: 'high', suitabilityTags: 'medium' }
        }
      },

      /* ===================================================================
         6. NORTH MACEDONIA
         =================================================================== */
      {
        id: 'north-macedonia',
        name: 'North Macedonia',
        flag: '🇲🇰',
        region: 'Southeast Europe',
        capital: 'Skopje',
        countryLatLng: [41.6086, 21.7453],
        cities: [
          { name: 'Skopje', lat: 41.9981, lng: 21.4254, overview: null, finances: null },
          { name: 'Bitola', lat: 41.0297, lng: 21.3335, overview: null, finances: null }
        ],
        overview: {
          population: '2,100,000',
          officialLanguages: ['Macedonian', 'Albanian'],
          englishScore: 53,
          englishScoreNote: 'Placeholder',
          climate: 'Continental; cold winters, hot summers',
          politicalStability: 'Moderate',
          internetSpeed: '42 Mbps avg',
          healthcareSystem: 'Public system improving; private clinics in Skopje',
          crimeSafetyIndex: 'Generally safe; some tensions in multi-ethnic areas',
          religionDemographics: 'Orthodox Christian majority; Muslim minority; very small Bah\xE1\'i community'
        },
        finances: {
          costOfLivingIndex: 32,
          rent1br: 320,
          rent2br: 500,
          rent3br: 760,
          groceryBasket: 250,
          averageMealPrice: 8,
          publicTransportMonthly: 16,
          transportMode: 'Mixed',
          utilitiesMonthly: 80,
          internetMonthly: 16,
          averageLocalSalary: 7800,
          currencyCode: 'MKD',
          exchangeRateToAUD: 38.4,
          exchangeRateLastUpdated: '2026-05-28',
          historicalRates: fakeHistory(38.0, 1.2)
        },
        visa: {
          visaType: 'Type D visa / Temporary residence permit',
          maxInitialStay: '90 days visa-free; up to 1 year permit',
          renewalOptions: 'Annual; permanent residence after 5 years',
          religiousWorkerVisa: null,
          workRights: 'Yes with permit',
          estimatedProcessingTime: '3--6 weeks',
          estimatedCostAUD: 100,
          officialSourceUrl: 'https://www.mvr.gov.mk/',
          notes: null
        },
        community: {
          bahaiFamilyCount: 25,
          hasLSA: false,
          communitySize: 'Small',
          openPioneerGoal: true,
          proximityToHouseOfWorship: 'Frankfurt House of Worship (~1,700 km)',
          suitabilityTags: ['Solo pioneer friendly', 'Low English penetration']
        },
        confidence: {
          overview: { population: 'high', officialLanguages: 'high', englishScore: 'low', englishScoreNote: 'low', climate: 'high', politicalStability: 'medium', internetSpeed: 'medium', healthcareSystem: 'medium', crimeSafetyIndex: 'medium', religionDemographics: 'high' },
          finances: { costOfLivingIndex: 'medium', rent1br: 'low', rent2br: 'low', rent3br: 'low', groceryBasket: 'medium', averageMealPrice: 'medium', publicTransportMonthly: 'medium', transportMode: 'medium', utilitiesMonthly: 'low', internetMonthly: 'medium', averageLocalSalary: 'low', currencyCode: 'high', exchangeRateToAUD: 'low', exchangeRateLastUpdated: 'high' },
          visa: { visaType: 'medium', maxInitialStay: 'high', renewalOptions: 'medium', religiousWorkerVisa: 'low', workRights: 'medium', estimatedProcessingTime: 'low', estimatedCostAUD: 'low', officialSourceUrl: 'medium', notes: 'low' },
          community: { bahaiFamilyCount: 'low', hasLSA: 'low', communitySize: 'low', openPioneerGoal: 'medium', proximityToHouseOfWorship: 'high', suitabilityTags: 'medium' }
        }
      },

      /* ===================================================================
         7. SERBIA
         =================================================================== */
      {
        id: 'serbia',
        name: 'Serbia',
        flag: '🇷🇸',
        region: 'Southeast Europe',
        capital: 'Belgrade',
        countryLatLng: [44.0165, 21.0059],
        cities: [
          { name: 'Belgrade', lat: 44.8176, lng: 20.4569, overview: null, finances: null },
          { name: 'Novi Sad', lat: 45.2671, lng: 19.8335, overview: null, finances: null }
        ],
        overview: {
          population: '6,800,000',
          officialLanguages: ['Serbian'],
          englishScore: 58,
          englishScoreNote: 'Placeholder -- strong English among under-40s in cities',
          climate: 'Continental; cold winters, hot summers; mild in Vojvodina',
          politicalStability: 'Moderate',
          internetSpeed: '62 Mbps avg',
          healthcareSystem: 'Universal public + growing private; Belgrade well-served',
          crimeSafetyIndex: 'Generally safe; Belgrade among safer Balkan capitals',
          religionDemographics: 'Orthodox Christian majority (~84%); Muslim minority; small Bah\xE1\'i community'
        },
        finances: {
          costOfLivingIndex: 42,
          rent1br: 560,
          rent2br: 870,
          rent3br: 1300,
          groceryBasket: 340,
          averageMealPrice: 12,
          publicTransportMonthly: 28,
          transportMode: 'Mixed',
          utilitiesMonthly: 100,
          internetMonthly: 18,
          averageLocalSalary: 14000,
          currencyCode: 'RSD',
          exchangeRateToAUD: 74.0,
          exchangeRateLastUpdated: '2026-05-28',
          historicalRates: fakeHistory(72, 2.8)
        },
        visa: {
          visaType: 'Type D long-stay visa / Temporary residence permit',
          maxInitialStay: '90 days visa-free; up to 1 year permit',
          renewalOptions: 'Annual; permanent residence after 5 years',
          religiousWorkerVisa: null,
          workRights: 'Yes with work permit',
          estimatedProcessingTime: '4--8 weeks',
          estimatedCostAUD: 130,
          officialSourceUrl: 'https://www.mup.gov.rs/',
          notes: null
        },
        community: {
          bahaiFamilyCount: 55,
          hasLSA: true,
          communitySize: 'Small',
          openPioneerGoal: true,
          proximityToHouseOfWorship: 'Frankfurt House of Worship (~1,400 km)',
          suitabilityTags: ['Solo pioneer friendly', 'Good for families']
        },
        confidence: {
          overview: { population: 'high', officialLanguages: 'high', englishScore: 'low', englishScoreNote: 'low', climate: 'high', politicalStability: 'medium', internetSpeed: 'medium', healthcareSystem: 'medium', crimeSafetyIndex: 'medium', religionDemographics: 'high' },
          finances: { costOfLivingIndex: 'medium', rent1br: 'medium', rent2br: 'medium', rent3br: 'low', groceryBasket: 'medium', averageMealPrice: 'high', publicTransportMonthly: 'high', transportMode: 'medium', utilitiesMonthly: 'medium', internetMonthly: 'high', averageLocalSalary: 'medium', currencyCode: 'high', exchangeRateToAUD: 'low', exchangeRateLastUpdated: 'high' },
          visa: { visaType: 'high', maxInitialStay: 'high', renewalOptions: 'medium', religiousWorkerVisa: 'low', workRights: 'high', estimatedProcessingTime: 'medium', estimatedCostAUD: 'medium', officialSourceUrl: 'high', notes: 'low' },
          community: { bahaiFamilyCount: 'low', hasLSA: 'medium', communitySize: 'medium', openPioneerGoal: 'high', proximityToHouseOfWorship: 'high', suitabilityTags: 'high' }
        }
      },

      /* ===================================================================
         8. ARMENIA
         =================================================================== */
      {
        id: 'armenia',
        name: 'Armenia',
        flag: '🇦🇲',
        region: 'South Caucasus',
        capital: 'Yerevan',
        countryLatLng: [40.0691, 45.0382],
        cities: [
          { name: 'Yerevan', lat: 40.1872, lng: 44.5152, overview: null, finances: null },
          { name: 'Gyumri',  lat: 40.7942, lng: 43.8453, overview: null, finances: null }
        ],
        overview: {
          population: '3,000,000',
          officialLanguages: ['Armenian'],
          englishScore: 50,
          englishScoreNote: 'Placeholder -- Russian more common as second language',
          climate: 'Highland continental; cold winters, hot dry summers',
          politicalStability: 'Moderate',
          internetSpeed: '45 Mbps avg',
          healthcareSystem: 'Improving public; affordable private in Yerevan',
          crimeSafetyIndex: 'Very safe; very low violent crime',
          religionDemographics: 'Armenian Apostolic majority (~93%); very small Bah\xE1\'i community'
        },
        finances: {
          costOfLivingIndex: 36,
          rent1br: 400,
          rent2br: 640,
          rent3br: 960,
          groceryBasket: 290,
          averageMealPrice: 10,
          publicTransportMonthly: 18,
          transportMode: 'Mixed',
          utilitiesMonthly: 85,
          internetMonthly: 20,
          averageLocalSalary: 9500,
          currencyCode: 'AMD',
          exchangeRateToAUD: 265.0,
          exchangeRateLastUpdated: '2026-05-28',
          historicalRates: fakeHistory(260, 12)
        },
        visa: {
          visaType: '180-day e-Visa / Temporary residence permit',
          maxInitialStay: '180 days visa; up to 1 year permit',
          renewalOptions: 'Annual; permanent residence pathway',
          religiousWorkerVisa: null,
          workRights: 'Yes with work permit',
          estimatedProcessingTime: '2--6 weeks',
          estimatedCostAUD: 80,
          officialSourceUrl: 'https://www.mfa.am/',
          notes: '180-day e-Visa is a very accessible entry route.'
        },
        community: {
          bahaiFamilyCount: 35,
          hasLSA: false,
          communitySize: 'Small',
          openPioneerGoal: true,
          proximityToHouseOfWorship: 'New Delhi House of Worship (~4,500 km)',
          suitabilityTags: ['Solo pioneer friendly', 'Low English penetration']
        },
        confidence: {
          overview: { population: 'high', officialLanguages: 'high', englishScore: 'low', englishScoreNote: 'low', climate: 'high', politicalStability: 'medium', internetSpeed: 'medium', healthcareSystem: 'medium', crimeSafetyIndex: 'high', religionDemographics: 'high' },
          finances: { costOfLivingIndex: 'medium', rent1br: 'medium', rent2br: 'low', rent3br: 'low', groceryBasket: 'medium', averageMealPrice: 'medium', publicTransportMonthly: 'medium', transportMode: 'medium', utilitiesMonthly: 'low', internetMonthly: 'medium', averageLocalSalary: 'low', currencyCode: 'high', exchangeRateToAUD: 'low', exchangeRateLastUpdated: 'high' },
          visa: { visaType: 'high', maxInitialStay: 'high', renewalOptions: 'medium', religiousWorkerVisa: 'low', workRights: 'medium', estimatedProcessingTime: 'medium', estimatedCostAUD: 'medium', officialSourceUrl: 'high', notes: 'high' },
          community: { bahaiFamilyCount: 'low', hasLSA: 'low', communitySize: 'low', openPioneerGoal: 'medium', proximityToHouseOfWorship: 'high', suitabilityTags: 'medium' }
        }
      },

      /* ===================================================================
         9. EGYPT
         =================================================================== */
      {
        id: 'egypt',
        name: 'Egypt',
        flag: '🇪🇬',
        region: 'North Africa',
        capital: 'Cairo',
        countryLatLng: [26.8206, 30.8025],
        cities: [
          { name: 'Cairo',      lat: 30.0444, lng: 31.2357, overview: null, finances: null },
          { name: 'Alexandria', lat: 31.2001, lng: 29.9187, overview: null, finances: null },
          { name: 'Luxor',      lat: 25.6872, lng: 32.6396, overview: null, finances: null }
        ],
        overview: {
          population: '105,000,000',
          officialLanguages: ['Arabic'],
          englishScore: 52,
          englishScoreNote: 'Placeholder -- higher in Cairo professional/expat circles',
          climate: 'Hot desert; mild winters along the coast',
          politicalStability: 'Low',
          internetSpeed: '28 Mbps avg',
          healthcareSystem: 'Mixed public/private; private hospitals in Cairo for expats',
          crimeSafetyIndex: 'Generally safe for daily life; awareness advised in crowds',
          religionDemographics: 'Sunni Muslim majority (~90%); Coptic Christian minority; Bah\xE1\'i Faith not legally recognised'
        },
        finances: {
          costOfLivingIndex: 30,
          rent1br: 290,
          rent2br: 460,
          rent3br: 700,
          groceryBasket: 250,
          averageMealPrice: 7,
          publicTransportMonthly: 16,
          transportMode: 'Mixed',
          utilitiesMonthly: 70,
          internetMonthly: 22,
          averageLocalSalary: 6500,
          currencyCode: 'EGP',
          exchangeRateToAUD: 33.5,
          exchangeRateLastUpdated: '2026-05-28',
          historicalRates: fakeHistory(32, 2.5)
        },
        visa: {
          visaType: 'Tourist e-Visa / Residence permit',
          maxInitialStay: '30 days e-Visa, extendable; 1 year residence permit',
          renewalOptions: 'Annual renewal',
          religiousWorkerVisa: false,
          workRights: 'Tied to sponsor',
          estimatedProcessingTime: '2--6 weeks',
          estimatedCostAUD: 160,
          officialSourceUrl: 'https://www.visa2egypt.gov.eg/',
          notes: 'Bah\xE1\'i Faith not officially recognised -- verify legal situation carefully before pioneering.'
        },
        community: {
          bahaiFamilyCount: null,
          hasLSA: null,
          communitySize: 'Small',
          openPioneerGoal: false,
          proximityToHouseOfWorship: 'Kampala House of Worship (~3,800 km)',
          suitabilityTags: ['Visa complexity', 'Low English penetration']
        },
        confidence: {
          overview: { population: 'high', officialLanguages: 'high', englishScore: 'low', englishScoreNote: 'low', climate: 'high', politicalStability: 'high', internetSpeed: 'medium', healthcareSystem: 'medium', crimeSafetyIndex: 'medium', religionDemographics: 'high' },
          finances: { costOfLivingIndex: 'medium', rent1br: 'low', rent2br: 'low', rent3br: 'low', groceryBasket: 'medium', averageMealPrice: 'medium', publicTransportMonthly: 'low', transportMode: 'medium', utilitiesMonthly: 'low', internetMonthly: 'medium', averageLocalSalary: 'low', currencyCode: 'high', exchangeRateToAUD: 'low', exchangeRateLastUpdated: 'high' },
          visa: { visaType: 'high', maxInitialStay: 'medium', renewalOptions: 'medium', religiousWorkerVisa: 'high', workRights: 'medium', estimatedProcessingTime: 'low', estimatedCostAUD: 'low', officialSourceUrl: 'high', notes: 'high' },
          community: { bahaiFamilyCount: 'low', hasLSA: 'low', communitySize: 'low', openPioneerGoal: 'high', proximityToHouseOfWorship: 'high', suitabilityTags: 'high' }
        }
      }

    ]
  };
})();
