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
  // Helper to build 24-month historical rate series ending May 2026.
  // Wobbles a base rate. All FAKE -- the Refresh button overwrites the latest.
  function fakeHistory(base, drift) {
    const months = [];
    // 24 months from 2024-06 through 2026-05 inclusive
    let year = 2024, month = 6;
    for (let i = 0; i < 24; i++) {
      const wobble = Math.sin(i / 3) * drift + (Math.random() - 0.5) * drift * 0.4;
      months.push({
        month: `${year}-${String(month).padStart(2, "0")}`,
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
        id: "china",
        name: "China",
        flag: "🇨🇳",
        region: "East Asia",
        capital: "Beijing",
        countryLatLng: [35.8617, 104.1954],
        cities: [
          { name: "Beijing",   lat: 39.9042, lng: 116.4074, overview: null, finances: null },
          { name: "Shanghai",  lat: 31.2304, lng: 121.4737, overview: null,
            finances: { rent1br: 1850, rent2br: 2900, rent3br: 4100, groceryBasket: 720, averageMealPrice: 22, publicTransportMonthly: 60, transportMode: "Walkable/Transit", utilitiesMonthly: 180, internetMonthly: 35, averageLocalSalary: 28000, costOfLivingIndex: 78, currencyCode: "CNY", exchangeRateToAUD: 4.72, exchangeRateLastUpdated: "2026-05-28", historicalRates: null } },
          { name: "Guangzhou", lat: 23.1291, lng: 113.2644, overview: null, finances: null }
        ],
        overview: {
          population: "1,410,000,000",
          officialLanguages: ["Mandarin"],
          englishScore: 42,
          englishScoreNote: "Placeholder -- aligned with EF EPI style scale",
          climate: "Wide variation; humid subtropical south, continental north",
          politicalStability: "Moderate",
          internetSpeed: "55 Mbps avg",
          healthcareSystem: "Mixed public/private; quality varies widely by tier-1 vs rural",
          crimeSafetyIndex: "Generally safe in cities; petty theft in tourist areas",
          religionDemographics: "Officially atheist state; mixed folk traditions, Buddhism, Christianity"
        },
        finances: {
          costOfLivingIndex: 62,
          rent1br: 1400,
          rent2br: 2300,
          rent3br: 3400,
          groceryBasket: 620,
          averageMealPrice: 18,
          publicTransportMonthly: 55,
          transportMode: "Walkable/Transit",
          utilitiesMonthly: 150,
          internetMonthly: 30,
          averageLocalSalary: 24000,
          currencyCode: "CNY",
          exchangeRateToAUD: 4.72,
          exchangeRateLastUpdated: "2026-05-28",
          historicalRates: fakeHistory(4.7, 0.25)
        },
        visa: {
          visaType: "Z visa (work) / X visa (study) / S2 (family)",
          maxInitialStay: "12 months (work permit)",
          renewalOptions: "Annual renewal via employer sponsorship",
          religiousWorkerVisa: false,
          workRights: "Full, tied to sponsor",
          estimatedProcessingTime: "4--6 weeks",
          estimatedCostAUD: 320,
          officialSourceUrl: "https://www.visaforchina.cn/",
          notes: "Religious work historically constrained -- verify locally."
        },
        community: {
          bahaiFamilyCount: null,
          hasLSA: null,
          communitySize: "Small",
          openPioneerGoal: false,
          proximityToHouseOfWorship: "Nearest in Sydney, Australia (~9,000 km)",
          suitabilityTags: ["Visa complexity", "Low English penetration"]
        },
        confidence: {
          overview: { population: "high", officialLanguages: "high", englishScore: "low", englishScoreNote: "low", climate: "medium", politicalStability: "medium", internetSpeed: "medium", healthcareSystem: "medium", crimeSafetyIndex: "low", religionDemographics: "medium" },
          finances: { costOfLivingIndex: "medium", rent1br: "medium", rent2br: "medium", rent3br: "low", groceryBasket: "medium", averageMealPrice: "medium", publicTransportMonthly: "high", transportMode: "high", utilitiesMonthly: "medium", internetMonthly: "high", averageLocalSalary: "low", currencyCode: "high", exchangeRateToAUD: "high", exchangeRateLastUpdated: "high" },
          visa: { visaType: "high", maxInitialStay: "medium", renewalOptions: "medium", religiousWorkerVisa: "low", workRights: "medium", estimatedProcessingTime: "low", estimatedCostAUD: "low", officialSourceUrl: "high", notes: "low" },
          community: { bahaiFamilyCount: "low", hasLSA: "low", communitySize: "low", openPioneerGoal: "medium", proximityToHouseOfWorship: "high", suitabilityTags: "medium" }
        }
      },

      /* ===================================================================
         2. INDIA
         =================================================================== */
      {
        id: "india",
        name: "India",
        flag: "🇮🇳",
        region: "South Asia",
        capital: "New Delhi",
        countryLatLng: [20.5937, 78.9629],
        cities: [
          { name: "Mumbai",    lat: 19.0760, lng: 72.8777, overview: null, finances: null },
          { name: "Delhi",     lat: 28.7041, lng: 77.1025, overview: null, finances: null },
          { name: "Bangalore", lat: 12.9716, lng: 77.5946, overview: null, finances: null }
        ],
        overview: {
          population: "1,430,000,000",
          officialLanguages: ["Hindi", "English"],
          englishScore: 68,
          englishScoreNote: "Placeholder -- urban/professional skew",
          climate: "Tropical south; varied north; monsoon June--Sep",
          politicalStability: "Moderate",
          internetSpeed: "38 Mbps avg",
          healthcareSystem: "Strong private hospitals in metros; public underfunded",
          crimeSafetyIndex: "Varies; metros generally safe in daylight",
          religionDemographics: "Hindu majority; Muslim, Christian, Sikh minorities; small Baha'i community"
        },
        finances: {
          costOfLivingIndex: 38,
          rent1br: 520,
          rent2br: 880,
          rent3br: 1350,
          groceryBasket: 320,
          averageMealPrice: 9,
          publicTransportMonthly: 18,
          transportMode: "Mixed",
          utilitiesMonthly: 90,
          internetMonthly: 18,
          averageLocalSalary: 8500,
          currencyCode: "INR",
          exchangeRateToAUD: 55.4,
          exchangeRateLastUpdated: "2026-05-28",
          historicalRates: fakeHistory(54, 2.2)
        },
        visa: {
          visaType: "Employment visa / X-Misc (family) / Tourist e-visa",
          maxInitialStay: "Up to 12 months",
          renewalOptions: "Extension through FRRO",
          religiousWorkerVisa: false,
          workRights: "Restricted to sponsor",
          estimatedProcessingTime: "3--5 weeks",
          estimatedCostAUD: 180,
          officialSourceUrl: "https://indianvisaonline.gov.in/",
          notes: "Missionary visa category formally restricted; religious activity must be private."
        },
        community: {
          bahaiFamilyCount: 4200,
          hasLSA: true,
          communitySize: "Large",
          openPioneerGoal: true,
          proximityToHouseOfWorship: "Lotus Temple, New Delhi",
          suitabilityTags: ["Strong existing community", "Good for families", "Solo pioneer friendly"]
        },
        confidence: {
          overview: { population: "high", officialLanguages: "high", englishScore: "medium", englishScoreNote: "low", climate: "high", politicalStability: "medium", internetSpeed: "medium", healthcareSystem: "medium", crimeSafetyIndex: "medium", religionDemographics: "high" },
          finances: { costOfLivingIndex: "medium", rent1br: "medium", rent2br: "medium", rent3br: "low", groceryBasket: "medium", averageMealPrice: "high", publicTransportMonthly: "high", transportMode: "medium", utilitiesMonthly: "medium", internetMonthly: "high", averageLocalSalary: "low", currencyCode: "high", exchangeRateToAUD: "high", exchangeRateLastUpdated: "high" },
          visa: { visaType: "high", maxInitialStay: "medium", renewalOptions: "medium", religiousWorkerVisa: "high", workRights: "medium", estimatedProcessingTime: "medium", estimatedCostAUD: "medium", officialSourceUrl: "high", notes: "medium" },
          community: { bahaiFamilyCount: "medium", hasLSA: "high", communitySize: "high", openPioneerGoal: "high", proximityToHouseOfWorship: "high", suitabilityTags: "high" }
        }
      },

      /* ===================================================================
         3. BRAZIL
         =================================================================== */
      {
        id: "brazil",
        name: "Brazil",
        flag: "🇧🇷",
        region: "South America",
        capital: "Brasília",
        countryLatLng: [-14.2350, -51.9253],
        cities: [
          { name: "São Paulo",      lat: -23.5505, lng: -46.6333, overview: null, finances: null },
          { name: "Rio de Janeiro", lat: -22.9068, lng: -43.1729, overview: null, finances: null },
          { name: "Brasília",       lat: -15.7975, lng: -47.8919, overview: null, finances: null }
        ],
        overview: {
          population: "215,000,000",
          officialLanguages: ["Portuguese"],
          englishScore: 50,
          englishScoreNote: "Placeholder",
          climate: "Tropical; Amazon north, temperate south",
          politicalStability: "Moderate",
          internetSpeed: "70 Mbps avg",
          healthcareSystem: "Universal SUS public + strong private sector",
          crimeSafetyIndex: "Petty/violent crime concerns in some urban areas",
          religionDemographics: "Catholic majority, growing evangelical, established Baha'i community"
        },
        finances: {
          costOfLivingIndex: 45,
          rent1br: 640,
          rent2br: 980,
          rent3br: 1500,
          groceryBasket: 380,
          averageMealPrice: 14,
          publicTransportMonthly: 45,
          transportMode: "Mixed",
          utilitiesMonthly: 110,
          internetMonthly: 28,
          averageLocalSalary: 12500,
          currencyCode: "BRL",
          exchangeRateToAUD: 3.4,
          exchangeRateLastUpdated: "2026-05-28",
          historicalRates: fakeHistory(3.5, 0.3)
        },
        visa: {
          visaType: "VITEM XI (religious) / VITEM V (work) / VIVIS (residence)",
          maxInitialStay: "12 months, extendable",
          renewalOptions: "Permanent residence pathway after 2 years",
          religiousWorkerVisa: true,
          workRights: "Permitted under religious visa",
          estimatedProcessingTime: "8--12 weeks",
          estimatedCostAUD: 220,
          officialSourceUrl: "https://www.gov.br/mre/pt-br",
          notes: "Brazil has a clear religious worker visa category."
        },
        community: {
          bahaiFamilyCount: 2400,
          hasLSA: true,
          communitySize: "Large",
          openPioneerGoal: true,
          proximityToHouseOfWorship: "Western Hemisphere Mashriqu'l-Adhkar, Wilmette IL (~9,000 km)",
          suitabilityTags: ["Strong existing community", "Good for families", "Solo pioneer friendly"]
        },
        confidence: {
          overview: { population: "high", officialLanguages: "high", englishScore: "low", englishScoreNote: "low", climate: "high", politicalStability: "medium", internetSpeed: "medium", healthcareSystem: "medium", crimeSafetyIndex: "medium", religionDemographics: "high" },
          finances: { costOfLivingIndex: "medium", rent1br: "medium", rent2br: "medium", rent3br: "medium", groceryBasket: "medium", averageMealPrice: "high", publicTransportMonthly: "high", transportMode: "high", utilitiesMonthly: "medium", internetMonthly: "high", averageLocalSalary: "medium", currencyCode: "high", exchangeRateToAUD: "high", exchangeRateLastUpdated: "high" },
          visa: { visaType: "high", maxInitialStay: "high", renewalOptions: "medium", religiousWorkerVisa: "high", workRights: "high", estimatedProcessingTime: "medium", estimatedCostAUD: "medium", officialSourceUrl: "high", notes: "high" },
          community: { bahaiFamilyCount: "medium", hasLSA: "high", communitySize: "high", openPioneerGoal: "high", proximityToHouseOfWorship: "high", suitabilityTags: "high" }
        }
      },

      /* ===================================================================
         4. INDONESIA
         =================================================================== */
      {
        id: "indonesia",
        name: "Indonesia",
        flag: "🇮🇩",
        region: "Southeast Asia",
        capital: "Jakarta",
        countryLatLng: [-0.7893, 113.9213],
        cities: [
          { name: "Jakarta",  lat: -6.2088, lng: 106.8456, overview: null, finances: null },
          { name: "Bali",     lat: -8.4095, lng: 115.1889, overview: null,
            finances: { rent1br: 720, rent2br: 1100, rent3br: 1800, groceryBasket: 380, averageMealPrice: 10, publicTransportMonthly: 30, transportMode: "Car essential", utilitiesMonthly: 90, internetMonthly: 28, averageLocalSalary: 6000, costOfLivingIndex: 36, currencyCode: "IDR", exchangeRateToAUD: 10500, exchangeRateLastUpdated: "2026-05-28", historicalRates: null } },
          { name: "Surabaya", lat: -7.2575, lng: 112.7521, overview: null, finances: null }
        ],
        overview: {
          population: "279,000,000",
          officialLanguages: ["Indonesian"],
          englishScore: 49,
          englishScoreNote: "Placeholder -- higher in Bali tourism zones",
          climate: "Tropical, hot/humid year-round",
          politicalStability: "Moderate",
          internetSpeed: "28 Mbps avg",
          healthcareSystem: "Public BPJS + growing private sector",
          crimeSafetyIndex: "Generally safe; petty theft in tourist hubs",
          religionDemographics: "Muslim majority (~87%); Christian, Hindu (Bali), small Baha'i communities"
        },
        finances: {
          costOfLivingIndex: 35,
          rent1br: 480,
          rent2br: 780,
          rent3br: 1200,
          groceryBasket: 340,
          averageMealPrice: 8,
          publicTransportMonthly: 25,
          transportMode: "Mixed",
          utilitiesMonthly: 85,
          internetMonthly: 25,
          averageLocalSalary: 5800,
          currencyCode: "IDR",
          exchangeRateToAUD: 10500,
          exchangeRateLastUpdated: "2026-05-28",
          historicalRates: fakeHistory(10300, 320)
        },
        visa: {
          visaType: "KITAS (limited stay) / Second Home Visa / Social visa",
          maxInitialStay: "6--12 months",
          renewalOptions: "KITAS renewable annually; Second Home valid 5--10 years",
          religiousWorkerVisa: false,
          workRights: "Work KITAS required for paid work",
          estimatedProcessingTime: "4--8 weeks",
          estimatedCostAUD: 380,
          officialSourceUrl: "https://www.imigrasi.go.id/",
          notes: "Religious affairs visas exist but rarely issued to non-recognised faiths."
        },
        community: {
          bahaiFamilyCount: 350,
          hasLSA: true,
          communitySize: "Medium",
          openPioneerGoal: true,
          proximityToHouseOfWorship: "Local House of Worship plans -- verify",
          suitabilityTags: ["Good for families", "Solo pioneer friendly", "Visa complexity"]
        },
        confidence: {
          overview: { population: "high", officialLanguages: "high", englishScore: "low", englishScoreNote: "low", climate: "high", politicalStability: "medium", internetSpeed: "medium", healthcareSystem: "medium", crimeSafetyIndex: "medium", religionDemographics: "high" },
          finances: { costOfLivingIndex: "medium", rent1br: "medium", rent2br: "medium", rent3br: "low", groceryBasket: "medium", averageMealPrice: "high", publicTransportMonthly: "medium", transportMode: "medium", utilitiesMonthly: "medium", internetMonthly: "high", averageLocalSalary: "low", currencyCode: "high", exchangeRateToAUD: "high", exchangeRateLastUpdated: "high" },
          visa: { visaType: "high", maxInitialStay: "medium", renewalOptions: "medium", religiousWorkerVisa: "medium", workRights: "high", estimatedProcessingTime: "medium", estimatedCostAUD: "low", officialSourceUrl: "high", notes: "low" },
          community: { bahaiFamilyCount: "low", hasLSA: "medium", communitySize: "medium", openPioneerGoal: "high", proximityToHouseOfWorship: "low", suitabilityTags: "medium" }
        }
      },

      /* ===================================================================
         5. NIGERIA
         =================================================================== */
      {
        id: "nigeria",
        name: "Nigeria",
        flag: "🇳🇬",
        region: "West Africa",
        capital: "Abuja",
        countryLatLng: [9.0820, 8.6753],
        cities: [
          { name: "Lagos", lat: 6.5244, lng: 3.3792, overview: null, finances: null },
          { name: "Abuja", lat: 9.0765, lng: 7.3986, overview: null, finances: null },
          { name: "Kano",  lat: 12.0022, lng: 8.5919, overview: null, finances: null }
        ],
        overview: {
          population: "230,000,000",
          officialLanguages: ["English"],
          englishScore: 72,
          englishScoreNote: "Placeholder -- English is official, widely used in cities",
          climate: "Tropical; wet south, dry savannah north",
          politicalStability: "Low",
          internetSpeed: "22 Mbps avg",
          healthcareSystem: "Mixed; private preferred for expats",
          crimeSafetyIndex: "Caution advised, especially north and Niger Delta",
          religionDemographics: "Christian south, Muslim north, growing Baha'i community"
        },
        finances: {
          costOfLivingIndex: 32,
          rent1br: 380,
          rent2br: 620,
          rent3br: 950,
          groceryBasket: 280,
          averageMealPrice: 8,
          publicTransportMonthly: 30,
          transportMode: "Car essential",
          utilitiesMonthly: 95,
          internetMonthly: 32,
          averageLocalSalary: 4500,
          currencyCode: "NGN",
          exchangeRateToAUD: 1080,
          exchangeRateLastUpdated: "2026-05-28",
          historicalRates: fakeHistory(950, 140)
        },
        visa: {
          visaType: "Temporary work permit (TWP) / Subject to Regularisation (STR)",
          maxInitialStay: "3 months on STR, renewable",
          renewalOptions: "Convert to CERPAC residence permit",
          religiousWorkerVisa: true,
          workRights: "Yes via STR for missionary status",
          estimatedProcessingTime: "6--10 weeks",
          estimatedCostAUD: 290,
          officialSourceUrl: "https://immigration.gov.ng/",
          notes: "Religious worker pathway exists -- documentation requirements high."
        },
        community: {
          bahaiFamilyCount: 1800,
          hasLSA: true,
          communitySize: "Large",
          openPioneerGoal: true,
          proximityToHouseOfWorship: "Continental House of Worship, Kampala (~4,000 km)",
          suitabilityTags: ["Strong existing community", "Solo pioneer friendly"]
        },
        confidence: {
          overview: { population: "high", officialLanguages: "high", englishScore: "medium", englishScoreNote: "low", climate: "high", politicalStability: "high", internetSpeed: "medium", healthcareSystem: "medium", crimeSafetyIndex: "high", religionDemographics: "high" },
          finances: { costOfLivingIndex: "medium", rent1br: "low", rent2br: "low", rent3br: "low", groceryBasket: "medium", averageMealPrice: "medium", publicTransportMonthly: "low", transportMode: "high", utilitiesMonthly: "low", internetMonthly: "medium", averageLocalSalary: "low", currencyCode: "high", exchangeRateToAUD: "low", exchangeRateLastUpdated: "high" },
          visa: { visaType: "medium", maxInitialStay: "medium", renewalOptions: "medium", religiousWorkerVisa: "high", workRights: "medium", estimatedProcessingTime: "low", estimatedCostAUD: "low", officialSourceUrl: "high", notes: "medium" },
          community: { bahaiFamilyCount: "low", hasLSA: "high", communitySize: "high", openPioneerGoal: "high", proximityToHouseOfWorship: "high", suitabilityTags: "high" }
        }
      },

      /* ===================================================================
         6. MEXICO
         =================================================================== */
      {
        id: "mexico",
        name: "Mexico",
        flag: "🇲🇽",
        region: "North America",
        capital: "Mexico City",
        countryLatLng: [23.6345, -102.5528],
        cities: [
          { name: "Mexico City", lat: 19.4326, lng: -99.1332, overview: null, finances: null },
          { name: "Guadalajara", lat: 20.6597, lng: -103.3496, overview: null, finances: null },
          { name: "Monterrey",   lat: 25.6866, lng: -100.3161, overview: null, finances: null }
        ],
        overview: {
          population: "128,000,000",
          officialLanguages: ["Spanish"],
          englishScore: 51,
          englishScoreNote: "Placeholder -- urban professionals higher",
          climate: "Varied; tropical coasts, highland temperate, desert north",
          politicalStability: "Moderate",
          internetSpeed: "60 Mbps avg",
          healthcareSystem: "IMSS public + strong private clinics in metros",
          crimeSafetyIndex: "Varies by state; cartel activity in some regions",
          religionDemographics: "Catholic majority, growing evangelical, small Baha'i community"
        },
        finances: {
          costOfLivingIndex: 44,
          rent1br: 620,
          rent2br: 980,
          rent3br: 1500,
          groceryBasket: 360,
          averageMealPrice: 12,
          publicTransportMonthly: 28,
          transportMode: "Mixed",
          utilitiesMonthly: 100,
          internetMonthly: 28,
          averageLocalSalary: 11000,
          currencyCode: "MXN",
          exchangeRateToAUD: 11.8,
          exchangeRateLastUpdated: "2026-05-28",
          historicalRates: fakeHistory(11.5, 0.7)
        },
        visa: {
          visaType: "Temporary Resident / Religious Worker visa",
          maxInitialStay: "1 year, renewable up to 4",
          renewalOptions: "Permanent residence after 4 years",
          religiousWorkerVisa: true,
          workRights: "With residence + work permit",
          estimatedProcessingTime: "4--8 weeks",
          estimatedCostAUD: 260,
          officialSourceUrl: "https://www.gob.mx/inm",
          notes: "Religious worker category clearly defined."
        },
        community: {
          bahaiFamilyCount: 900,
          hasLSA: true,
          communitySize: "Medium",
          openPioneerGoal: true,
          proximityToHouseOfWorship: "Panama House of Worship (~3,500 km)",
          suitabilityTags: ["Good for families", "Solo pioneer friendly", "Strong existing community"]
        },
        confidence: {
          overview: { population: "high", officialLanguages: "high", englishScore: "low", englishScoreNote: "low", climate: "high", politicalStability: "medium", internetSpeed: "medium", healthcareSystem: "medium", crimeSafetyIndex: "high", religionDemographics: "high" },
          finances: { costOfLivingIndex: "medium", rent1br: "medium", rent2br: "medium", rent3br: "low", groceryBasket: "medium", averageMealPrice: "high", publicTransportMonthly: "high", transportMode: "medium", utilitiesMonthly: "medium", internetMonthly: "high", averageLocalSalary: "medium", currencyCode: "high", exchangeRateToAUD: "high", exchangeRateLastUpdated: "high" },
          visa: { visaType: "high", maxInitialStay: "high", renewalOptions: "high", religiousWorkerVisa: "high", workRights: "high", estimatedProcessingTime: "medium", estimatedCostAUD: "medium", officialSourceUrl: "high", notes: "high" },
          community: { bahaiFamilyCount: "medium", hasLSA: "high", communitySize: "high", openPioneerGoal: "high", proximityToHouseOfWorship: "high", suitabilityTags: "high" }
        }
      },

      /* ===================================================================
         7. VIETNAM
         =================================================================== */
      {
        id: "vietnam",
        name: "Vietnam",
        flag: "🇻🇳",
        region: "Southeast Asia",
        capital: "Hanoi",
        countryLatLng: [14.0583, 108.2772],
        cities: [
          { name: "Ho Chi Minh City", lat: 10.8231, lng: 106.6297, overview: null, finances: null },
          { name: "Hanoi",            lat: 21.0285, lng: 105.8542, overview: null, finances: null },
          { name: "Da Nang",          lat: 16.0544, lng: 108.2022, overview: null, finances: null }
        ],
        overview: {
          population: "98,000,000",
          officialLanguages: ["Vietnamese"],
          englishScore: 48,
          englishScoreNote: "Placeholder",
          climate: "Tropical south, subtropical north with cooler winters",
          politicalStability: "Moderate",
          internetSpeed: "65 Mbps avg",
          healthcareSystem: "Public + international private clinics in cities",
          crimeSafetyIndex: "Very low violent crime; petty theft in tourist zones",
          religionDemographics: "Folk + Buddhist majority; Catholic minority; very small Baha'i community"
        },
        finances: {
          costOfLivingIndex: 36,
          rent1br: 540,
          rent2br: 820,
          rent3br: 1250,
          groceryBasket: 300,
          averageMealPrice: 7,
          publicTransportMonthly: 18,
          transportMode: "Mixed",
          utilitiesMonthly: 80,
          internetMonthly: 18,
          averageLocalSalary: 6200,
          currencyCode: "VND",
          exchangeRateToAUD: 16400,
          exchangeRateLastUpdated: "2026-05-28",
          historicalRates: fakeHistory(16200, 320)
        },
        visa: {
          visaType: "Business / Investor / Work permit",
          maxInitialStay: "3 months single-entry, up to 12 months work permit",
          renewalOptions: "Renewable; 5-year temp residence possible",
          religiousWorkerVisa: false,
          workRights: "Tied to work permit",
          estimatedProcessingTime: "3--6 weeks",
          estimatedCostAUD: 210,
          officialSourceUrl: "https://evisa.xuatnhapcanh.gov.vn/",
          notes: "No dedicated religious worker visa -- alternative routes required."
        },
        community: {
          bahaiFamilyCount: 120,
          hasLSA: false,
          communitySize: "Small",
          openPioneerGoal: true,
          proximityToHouseOfWorship: "Local House of Worship planning -- verify",
          suitabilityTags: ["Solo pioneer friendly", "Low English penetration", "Visa complexity"]
        },
        confidence: {
          overview: { population: "high", officialLanguages: "high", englishScore: "low", englishScoreNote: "low", climate: "high", politicalStability: "medium", internetSpeed: "medium", healthcareSystem: "medium", crimeSafetyIndex: "medium", religionDemographics: "medium" },
          finances: { costOfLivingIndex: "medium", rent1br: "medium", rent2br: "medium", rent3br: "low", groceryBasket: "medium", averageMealPrice: "high", publicTransportMonthly: "high", transportMode: "medium", utilitiesMonthly: "medium", internetMonthly: "high", averageLocalSalary: "low", currencyCode: "high", exchangeRateToAUD: "high", exchangeRateLastUpdated: "high" },
          visa: { visaType: "medium", maxInitialStay: "medium", renewalOptions: "low", religiousWorkerVisa: "high", workRights: "high", estimatedProcessingTime: "low", estimatedCostAUD: "low", officialSourceUrl: "high", notes: "medium" },
          community: { bahaiFamilyCount: "low", hasLSA: "low", communitySize: "low", openPioneerGoal: "medium", proximityToHouseOfWorship: "low", suitabilityTags: "medium" }
        }
      },

      /* ===================================================================
         8. ETHIOPIA
         =================================================================== */
      {
        id: "ethiopia",
        name: "Ethiopia",
        flag: "🇪🇹",
        region: "East Africa",
        capital: "Addis Ababa",
        countryLatLng: [9.1450, 40.4897],
        cities: [
          { name: "Addis Ababa", lat: 9.0320,  lng: 38.7469, overview: null, finances: null },
          { name: "Dire Dawa",   lat: 9.5915,  lng: 41.8665, overview: null, finances: null }
        ],
        overview: {
          population: "126,000,000",
          officialLanguages: ["Amharic"],
          englishScore: 45,
          englishScoreNote: "Placeholder -- English widely taught, uneven spoken use",
          climate: "Highland temperate; lowland hot/dry",
          politicalStability: "Low",
          internetSpeed: "12 Mbps avg",
          healthcareSystem: "Limited public; private hospitals in Addis Ababa",
          crimeSafetyIndex: "Moderate; regional conflict areas to avoid",
          religionDemographics: "Orthodox Christian majority, Muslim ~30%, established Baha'i community"
        },
        finances: {
          costOfLivingIndex: 28,
          rent1br: 360,
          rent2br: 580,
          rent3br: 880,
          groceryBasket: 260,
          averageMealPrice: 6,
          publicTransportMonthly: 12,
          transportMode: "Mixed",
          utilitiesMonthly: 60,
          internetMonthly: 30,
          averageLocalSalary: 3800,
          currencyCode: "ETB",
          exchangeRateToAUD: 84.0,
          exchangeRateLastUpdated: "2026-05-28",
          historicalRates: fakeHistory(78, 8)
        },
        visa: {
          visaType: "Work / Religious / Investor",
          maxInitialStay: "12 months",
          renewalOptions: "Annual renewal",
          religiousWorkerVisa: true,
          workRights: "Yes via work or religious permit",
          estimatedProcessingTime: "4--10 weeks",
          estimatedCostAUD: 200,
          officialSourceUrl: "https://www.mfa.gov.et/",
          notes: "Religious worker visas issued through Ministry of Peace."
        },
        community: {
          bahaiFamilyCount: 600,
          hasLSA: true,
          communitySize: "Medium",
          openPioneerGoal: true,
          proximityToHouseOfWorship: "Kampala House of Worship (~1,500 km)",
          suitabilityTags: ["Solo pioneer friendly", "Strong existing community", "Remote location"]
        },
        confidence: {
          overview: { population: "high", officialLanguages: "high", englishScore: "low", englishScoreNote: "low", climate: "high", politicalStability: "high", internetSpeed: "low", healthcareSystem: "medium", crimeSafetyIndex: "high", religionDemographics: "high" },
          finances: { costOfLivingIndex: "medium", rent1br: "low", rent2br: "low", rent3br: "low", groceryBasket: "medium", averageMealPrice: "medium", publicTransportMonthly: "medium", transportMode: "medium", utilitiesMonthly: "low", internetMonthly: "low", averageLocalSalary: "low", currencyCode: "high", exchangeRateToAUD: "low", exchangeRateLastUpdated: "low" },
          visa: { visaType: "medium", maxInitialStay: "medium", renewalOptions: "low", religiousWorkerVisa: "medium", workRights: "medium", estimatedProcessingTime: "low", estimatedCostAUD: "low", officialSourceUrl: "medium", notes: "low" },
          community: { bahaiFamilyCount: "low", hasLSA: "medium", communitySize: "medium", openPioneerGoal: "high", proximityToHouseOfWorship: "high", suitabilityTags: "high" }
        }
      },

      /* ===================================================================
         9. KENYA
         =================================================================== */
      {
        id: "kenya",
        name: "Kenya",
        flag: "🇰🇪",
        region: "East Africa",
        capital: "Nairobi",
        countryLatLng: [-0.0236, 37.9062],
        cities: [
          { name: "Nairobi", lat: -1.2921, lng: 36.8219, overview: null, finances: null },
          { name: "Mombasa", lat: -4.0435, lng: 39.6682, overview: null, finances: null }
        ],
        overview: {
          population: "55,000,000",
          officialLanguages: ["Swahili", "English"],
          englishScore: 70,
          englishScoreNote: "Placeholder -- English is an official language",
          climate: "Tropical coast, temperate highlands",
          politicalStability: "Moderate",
          internetSpeed: "30 Mbps avg",
          healthcareSystem: "Public + strong private Nairobi sector",
          crimeSafetyIndex: "Urban crime concerns; rural areas generally safer",
          religionDemographics: "Christian majority, Muslim coast, established Baha'i community"
        },
        finances: {
          costOfLivingIndex: 38,
          rent1br: 520,
          rent2br: 820,
          rent3br: 1250,
          groceryBasket: 320,
          averageMealPrice: 9,
          publicTransportMonthly: 30,
          transportMode: "Mixed",
          utilitiesMonthly: 95,
          internetMonthly: 35,
          averageLocalSalary: 7800,
          currencyCode: "KES",
          exchangeRateToAUD: 88.0,
          exchangeRateLastUpdated: "2026-05-28",
          historicalRates: fakeHistory(85, 4)
        },
        visa: {
          visaType: "Class K (retiree/missionary) / Class D (work) / Permit I (missionary)",
          maxInitialStay: "12--24 months depending on class",
          renewalOptions: "Annual; permanent residence after 7 years",
          religiousWorkerVisa: true,
          workRights: "Yes via missionary or work permit",
          estimatedProcessingTime: "6--12 weeks",
          estimatedCostAUD: 350,
          officialSourceUrl: "https://www.ecitizen.go.ke/",
          notes: "Permit I specifically for missionary workers."
        },
        community: {
          bahaiFamilyCount: 1100,
          hasLSA: true,
          communitySize: "Medium",
          openPioneerGoal: true,
          proximityToHouseOfWorship: "Kampala House of Worship (~600 km)",
          suitabilityTags: ["Strong existing community", "Solo pioneer friendly", "Good for families"]
        },
        confidence: {
          overview: { population: "high", officialLanguages: "high", englishScore: "medium", englishScoreNote: "low", climate: "high", politicalStability: "medium", internetSpeed: "medium", healthcareSystem: "medium", crimeSafetyIndex: "medium", religionDemographics: "high" },
          finances: { costOfLivingIndex: "medium", rent1br: "medium", rent2br: "medium", rent3br: "low", groceryBasket: "medium", averageMealPrice: "high", publicTransportMonthly: "medium", transportMode: "medium", utilitiesMonthly: "medium", internetMonthly: "high", averageLocalSalary: "low", currencyCode: "high", exchangeRateToAUD: "low", exchangeRateLastUpdated: "high" },
          visa: { visaType: "high", maxInitialStay: "medium", renewalOptions: "medium", religiousWorkerVisa: "high", workRights: "high", estimatedProcessingTime: "medium", estimatedCostAUD: "medium", officialSourceUrl: "high", notes: "high" },
          community: { bahaiFamilyCount: "medium", hasLSA: "high", communitySize: "high", openPioneerGoal: "high", proximityToHouseOfWorship: "high", suitabilityTags: "high" }
        }
      },

      /* ===================================================================
         10. COLOMBIA
         =================================================================== */
      {
        id: "colombia",
        name: "Colombia",
        flag: "🇨🇴",
        region: "South America",
        capital: "Bogotá",
        countryLatLng: [4.5709, -74.2973],
        cities: [
          { name: "Bogotá",   lat: 4.7110,  lng: -74.0721, overview: null, finances: null },
          { name: "Medellín", lat: 6.2476,  lng: -75.5658, overview: null, finances: null },
          { name: "Cali",     lat: 3.4516,  lng: -76.5320, overview: null, finances: null }
        ],
        overview: {
          population: "52,000,000",
          officialLanguages: ["Spanish"],
          englishScore: 47,
          englishScoreNote: "Placeholder",
          climate: "Tropical lowlands, temperate highlands year-round",
          politicalStability: "Moderate",
          internetSpeed: "55 Mbps avg",
          healthcareSystem: "Well-regarded universal + strong private",
          crimeSafetyIndex: "Improved overall; caution in some neighborhoods",
          religionDemographics: "Catholic majority, growing evangelical, small Baha'i community"
        },
        finances: {
          costOfLivingIndex: 36,
          rent1br: 480,
          rent2br: 760,
          rent3br: 1150,
          groceryBasket: 310,
          averageMealPrice: 10,
          publicTransportMonthly: 38,
          transportMode: "Mixed",
          utilitiesMonthly: 85,
          internetMonthly: 24,
          averageLocalSalary: 8200,
          currencyCode: "COP",
          exchangeRateToAUD: 2750,
          exchangeRateLastUpdated: "2026-05-28",
          historicalRates: fakeHistory(2700, 90)
        },
        visa: {
          visaType: "Migrant Visa (M) -- Religious / Work / Spouse",
          maxInitialStay: "Up to 3 years",
          renewalOptions: "Resident visa (R) after 5 years",
          religiousWorkerVisa: true,
          workRights: "Yes under M-Religious or M-Work",
          estimatedProcessingTime: "4--8 weeks",
          estimatedCostAUD: 280,
          officialSourceUrl: "https://www.cancilleria.gov.co/",
          notes: "Religious migrant visa explicitly available."
        },
        community: {
          bahaiFamilyCount: 450,
          hasLSA: true,
          communitySize: "Medium",
          openPioneerGoal: true,
          proximityToHouseOfWorship: "Panama House of Worship (~800 km)",
          suitabilityTags: ["Good for families", "Solo pioneer friendly"]
        },
        confidence: {
          overview: { population: "high", officialLanguages: "high", englishScore: "low", englishScoreNote: "low", climate: "high", politicalStability: "medium", internetSpeed: "medium", healthcareSystem: "high", crimeSafetyIndex: "medium", religionDemographics: "high" },
          finances: { costOfLivingIndex: "medium", rent1br: "medium", rent2br: "medium", rent3br: "low", groceryBasket: "medium", averageMealPrice: "high", publicTransportMonthly: "high", transportMode: "high", utilitiesMonthly: "medium", internetMonthly: "high", averageLocalSalary: "medium", currencyCode: "high", exchangeRateToAUD: "high", exchangeRateLastUpdated: "high" },
          visa: { visaType: "high", maxInitialStay: "high", renewalOptions: "medium", religiousWorkerVisa: "high", workRights: "high", estimatedProcessingTime: "medium", estimatedCostAUD: "medium", officialSourceUrl: "high", notes: "high" },
          community: { bahaiFamilyCount: "medium", hasLSA: "high", communitySize: "high", openPioneerGoal: "high", proximityToHouseOfWorship: "high", suitabilityTags: "high" }
        }
      },

      /* ===================================================================
         11. PHILIPPINES
         =================================================================== */
      {
        id: "philippines",
        name: "Philippines",
        flag: "🇵🇭",
        region: "Southeast Asia",
        capital: "Manila",
        countryLatLng: [12.8797, 121.7740],
        cities: [
          { name: "Manila", lat: 14.5995, lng: 120.9842, overview: null, finances: null },
          { name: "Cebu",   lat: 10.3157, lng: 123.8854, overview: null, finances: null },
          { name: "Davao",  lat: 7.1907,  lng: 125.4553, overview: null, finances: null }
        ],
        overview: {
          population: "117,000,000",
          officialLanguages: ["Filipino", "English"],
          englishScore: 76,
          englishScoreNote: "Placeholder -- widely spoken, English is co-official",
          climate: "Tropical, typhoons June--Nov",
          politicalStability: "Moderate",
          internetSpeed: "50 Mbps avg",
          healthcareSystem: "Public PhilHealth + strong private hospitals in metros",
          crimeSafetyIndex: "Petty theft common; some regional caution required",
          religionDemographics: "Catholic majority (~80%), Muslim south, growing Baha'i community"
        },
        finances: {
          costOfLivingIndex: 38,
          rent1br: 540,
          rent2br: 820,
          rent3br: 1250,
          groceryBasket: 330,
          averageMealPrice: 11,
          publicTransportMonthly: 28,
          transportMode: "Mixed",
          utilitiesMonthly: 110,
          internetMonthly: 38,
          averageLocalSalary: 6500,
          currencyCode: "PHP",
          exchangeRateToAUD: 38.0,
          exchangeRateLastUpdated: "2026-05-28",
          historicalRates: fakeHistory(37.5, 1.4)
        },
        visa: {
          visaType: "Missionary Visa (9d) / Work Visa (9g) / SRRV (retiree)",
          maxInitialStay: "6--12 months",
          renewalOptions: "Annual renewal; permanent residency pathways exist",
          religiousWorkerVisa: true,
          workRights: "9d permits religious work; 9g for general work",
          estimatedProcessingTime: "6--10 weeks",
          estimatedCostAUD: 240,
          officialSourceUrl: "https://immigration.gov.ph/",
          notes: "Missionary visa 9d is a well-established category."
        },
        community: {
          bahaiFamilyCount: 950,
          hasLSA: true,
          communitySize: "Medium",
          openPioneerGoal: true,
          proximityToHouseOfWorship: "Local House of Worship planning -- verify",
          suitabilityTags: ["Strong existing community", "Solo pioneer friendly", "Good for families"]
        },
        confidence: {
          overview: { population: "high", officialLanguages: "high", englishScore: "medium", englishScoreNote: "low", climate: "high", politicalStability: "medium", internetSpeed: "medium", healthcareSystem: "medium", crimeSafetyIndex: "medium", religionDemographics: "high" },
          finances: { costOfLivingIndex: "medium", rent1br: "medium", rent2br: "medium", rent3br: "low", groceryBasket: "medium", averageMealPrice: "high", publicTransportMonthly: "high", transportMode: "medium", utilitiesMonthly: "medium", internetMonthly: "high", averageLocalSalary: "low", currencyCode: "high", exchangeRateToAUD: "high", exchangeRateLastUpdated: "high" },
          visa: { visaType: "high", maxInitialStay: "medium", renewalOptions: "medium", religiousWorkerVisa: "high", workRights: "high", estimatedProcessingTime: "medium", estimatedCostAUD: "medium", officialSourceUrl: "high", notes: "high" },
          community: { bahaiFamilyCount: "medium", hasLSA: "high", communitySize: "high", openPioneerGoal: "high", proximityToHouseOfWorship: "low", suitabilityTags: "high" }
        }
      },

      /* ===================================================================
         12. MOROCCO
         =================================================================== */
      {
        id: "morocco",
        name: "Morocco",
        flag: "🇲🇦",
        region: "North Africa",
        capital: "Rabat",
        countryLatLng: [31.7917, -7.0926],
        cities: [
          { name: "Casablanca", lat: 33.5731, lng: -7.5898, overview: null, finances: null },
          { name: "Marrakech",  lat: 31.6295, lng: -7.9811, overview: null, finances: null },
          { name: "Rabat",      lat: 34.0209, lng: -6.8417, overview: null, finances: null }
        ],
        overview: {
          population: "37,500,000",
          officialLanguages: ["Arabic", "Berber"],
          englishScore: 52,
          englishScoreNote: "Placeholder -- French more common; English rising",
          climate: "Mediterranean coast, semi-arid interior, mountain ranges",
          politicalStability: "Moderate",
          internetSpeed: "32 Mbps avg",
          healthcareSystem: "Public + growing private; expat-friendly clinics in cities",
          crimeSafetyIndex: "Generally low; tourist-targeted scams in souqs",
          religionDemographics: "Muslim majority (state religion); small Baha'i community"
        },
        finances: {
          costOfLivingIndex: 40,
          rent1br: 540,
          rent2br: 840,
          rent3br: 1300,
          groceryBasket: 320,
          averageMealPrice: 11,
          publicTransportMonthly: 22,
          transportMode: "Mixed",
          utilitiesMonthly: 90,
          internetMonthly: 22,
          averageLocalSalary: 9500,
          currencyCode: "MAD",
          exchangeRateToAUD: 6.4,
          exchangeRateLastUpdated: "2026-05-28",
          historicalRates: fakeHistory(6.3, 0.18)
        },
        visa: {
          visaType: "Residence Permit (carte de séjour) -- work / family / study",
          maxInitialStay: "90 days visa-free; up to 1 year residence",
          renewalOptions: "Annual renewal; permanent after 4--5 years",
          religiousWorkerVisa: false,
          workRights: "Yes via work residence permit",
          estimatedProcessingTime: "8--12 weeks",
          estimatedCostAUD: 180,
          officialSourceUrl: "https://www.consulat.ma/",
          notes: "Proselytising restricted by law; verify religious activity scope."
        },
        community: {
          bahaiFamilyCount: 80,
          hasLSA: false,
          communitySize: "Small",
          openPioneerGoal: true,
          proximityToHouseOfWorship: "Frankfurt House of Worship (~2,500 km)",
          suitabilityTags: ["Solo pioneer friendly", "Visa complexity", "Low English penetration"]
        },
        confidence: {
          overview: { population: "high", officialLanguages: "high", englishScore: "low", englishScoreNote: "low", climate: "high", politicalStability: "medium", internetSpeed: "medium", healthcareSystem: "medium", crimeSafetyIndex: "medium", religionDemographics: "high" },
          finances: { costOfLivingIndex: "medium", rent1br: "medium", rent2br: "medium", rent3br: "low", groceryBasket: "medium", averageMealPrice: "medium", publicTransportMonthly: "high", transportMode: "medium", utilitiesMonthly: "medium", internetMonthly: "high", averageLocalSalary: "medium", currencyCode: "high", exchangeRateToAUD: "low", exchangeRateLastUpdated: "high" },
          visa: { visaType: "medium", maxInitialStay: "high", renewalOptions: "medium", religiousWorkerVisa: "high", workRights: "medium", estimatedProcessingTime: "low", estimatedCostAUD: "low", officialSourceUrl: "medium", notes: "medium" },
          community: { bahaiFamilyCount: "low", hasLSA: "low", communitySize: "low", openPioneerGoal: "medium", proximityToHouseOfWorship: "high", suitabilityTags: "medium" }
        }
      },

      /* ===================================================================
         13. GEORGIA (country)
         =================================================================== */
      {
        id: "georgia",
        name: "Georgia",
        flag: "🇬🇪",
        region: "Caucasus",
        capital: "Tbilisi",
        countryLatLng: [42.3154, 43.3569],
        cities: [
          { name: "Tbilisi", lat: 41.7151, lng: 44.8271, overview: null, finances: null },
          { name: "Batumi",  lat: 41.6168, lng: 41.6367, overview: null, finances: null }
        ],
        overview: {
          population: "3,700,000",
          officialLanguages: ["Georgian"],
          englishScore: 56,
          englishScoreNote: "Placeholder -- younger generation higher",
          climate: "Humid subtropical coast, continental interior, alpine mountains",
          politicalStability: "Moderate",
          internetSpeed: "42 Mbps avg",
          healthcareSystem: "Reforming public + private; Tbilisi well-served",
          crimeSafetyIndex: "Very low crime rate",
          religionDemographics: "Georgian Orthodox majority; small Baha'i community"
        },
        finances: {
          costOfLivingIndex: 41,
          rent1br: 580,
          rent2br: 880,
          rent3br: 1300,
          groceryBasket: 340,
          averageMealPrice: 12,
          publicTransportMonthly: 20,
          transportMode: "Walkable/Transit",
          utilitiesMonthly: 100,
          internetMonthly: 22,
          averageLocalSalary: 10500,
          currencyCode: "GEL",
          exchangeRateToAUD: 1.78,
          exchangeRateLastUpdated: "2026-05-28",
          historicalRates: fakeHistory(1.75, 0.08)
        },
        visa: {
          visaType: "1-year visa-free entry / Residence Permit",
          maxInitialStay: "365 days visa-free for Australians",
          renewalOptions: "Exit/re-enter, or apply for temporary residence",
          religiousWorkerVisa: false,
          workRights: "Permitted under residence permit",
          estimatedProcessingTime: "2--6 weeks",
          estimatedCostAUD: 90,
          officialSourceUrl: "https://www.geoconsul.gov.ge/",
          notes: "365-day visa-free policy is unusually open for Australians."
        },
        community: {
          bahaiFamilyCount: 60,
          hasLSA: true,
          communitySize: "Small",
          openPioneerGoal: true,
          proximityToHouseOfWorship: "Frankfurt House of Worship (~3,000 km)",
          suitabilityTags: ["Solo pioneer friendly", "Good for families"]
        },
        confidence: {
          overview: { population: "high", officialLanguages: "high", englishScore: "low", englishScoreNote: "low", climate: "high", politicalStability: "medium", internetSpeed: "medium", healthcareSystem: "medium", crimeSafetyIndex: "high", religionDemographics: "high" },
          finances: { costOfLivingIndex: "medium", rent1br: "medium", rent2br: "medium", rent3br: "low", groceryBasket: "medium", averageMealPrice: "high", publicTransportMonthly: "high", transportMode: "high", utilitiesMonthly: "medium", internetMonthly: "high", averageLocalSalary: "medium", currencyCode: "high", exchangeRateToAUD: "low", exchangeRateLastUpdated: "high" },
          visa: { visaType: "high", maxInitialStay: "high", renewalOptions: "high", religiousWorkerVisa: "high", workRights: "high", estimatedProcessingTime: "medium", estimatedCostAUD: "medium", officialSourceUrl: "high", notes: "high" },
          community: { bahaiFamilyCount: "low", hasLSA: "medium", communitySize: "medium", openPioneerGoal: "high", proximityToHouseOfWorship: "high", suitabilityTags: "high" }
        }
      },

      /* ===================================================================
         14. PORTUGAL
         =================================================================== */
      {
        id: "portugal",
        name: "Portugal",
        flag: "🇵🇹",
        region: "Western Europe",
        capital: "Lisbon",
        countryLatLng: [39.3999, -8.2245],
        cities: [
          { name: "Lisbon", lat: 38.7223, lng: -9.1393, overview: null, finances: null },
          { name: "Porto",  lat: 41.1579, lng: -8.6291, overview: null, finances: null }
        ],
        overview: {
          population: "10,300,000",
          officialLanguages: ["Portuguese"],
          englishScore: 71,
          englishScoreNote: "Placeholder -- among highest in non-anglophone Europe",
          climate: "Mediterranean; mild wet winters, warm dry summers",
          politicalStability: "High",
          internetSpeed: "120 Mbps avg",
          healthcareSystem: "Strong universal SNS + accessible private",
          crimeSafetyIndex: "Very safe; one of safest in Europe",
          religionDemographics: "Catholic majority; small Baha'i community"
        },
        finances: {
          costOfLivingIndex: 72,
          rent1br: 1450,
          rent2br: 2100,
          rent3br: 2900,
          groceryBasket: 520,
          averageMealPrice: 22,
          publicTransportMonthly: 60,
          transportMode: "Walkable/Transit",
          utilitiesMonthly: 160,
          internetMonthly: 38,
          averageLocalSalary: 28000,
          currencyCode: "EUR",
          exchangeRateToAUD: 0.61,
          exchangeRateLastUpdated: "2026-05-28",
          historicalRates: fakeHistory(0.6, 0.03)
        },
        visa: {
          visaType: "D7 (passive income) / D8 (digital nomad) / D-Religious",
          maxInitialStay: "4 months entry, 2-year residence",
          renewalOptions: "Renewable; permanent residence after 5 years; citizenship pathway",
          religiousWorkerVisa: true,
          workRights: "Yes under D-Religious or D8",
          estimatedProcessingTime: "8--16 weeks",
          estimatedCostAUD: 320,
          officialSourceUrl: "https://www.sef.pt/",
          notes: "Long-stay religious purpose visa explicitly available."
        },
        community: {
          bahaiFamilyCount: 80,
          hasLSA: true,
          communitySize: "Small",
          openPioneerGoal: true,
          proximityToHouseOfWorship: "Frankfurt House of Worship (~2,000 km)",
          suitabilityTags: ["Good for families", "High cost of living", "Solo pioneer friendly"]
        },
        confidence: {
          overview: { population: "high", officialLanguages: "high", englishScore: "medium", englishScoreNote: "low", climate: "high", politicalStability: "high", internetSpeed: "high", healthcareSystem: "high", crimeSafetyIndex: "high", religionDemographics: "high" },
          finances: { costOfLivingIndex: "medium", rent1br: "medium", rent2br: "medium", rent3br: "low", groceryBasket: "medium", averageMealPrice: "high", publicTransportMonthly: "high", transportMode: "high", utilitiesMonthly: "medium", internetMonthly: "high", averageLocalSalary: "high", currencyCode: "high", exchangeRateToAUD: "high", exchangeRateLastUpdated: "high" },
          visa: { visaType: "high", maxInitialStay: "high", renewalOptions: "high", religiousWorkerVisa: "high", workRights: "high", estimatedProcessingTime: "medium", estimatedCostAUD: "medium", officialSourceUrl: "high", notes: "high" },
          community: { bahaiFamilyCount: "low", hasLSA: "medium", communitySize: "medium", openPioneerGoal: "high", proximityToHouseOfWorship: "high", suitabilityTags: "high" }
        }
      },

      /* ===================================================================
         15. PAPUA NEW GUINEA
         =================================================================== */
      {
        id: "papua-new-guinea",
        name: "Papua New Guinea",
        flag: "🇵🇬",
        region: "Oceania",
        capital: "Port Moresby",
        countryLatLng: [-6.3150, 143.9555],
        cities: [
          { name: "Port Moresby", lat: -9.4438, lng: 147.1803, overview: null, finances: null },
          { name: "Lae",          lat: -6.7155, lng: 146.9989, overview: null, finances: null }
        ],
        overview: {
          population: "10,400,000",
          officialLanguages: ["English", "Tok Pisin", "Hiri Motu"],
          englishScore: 60,
          englishScoreNote: "Placeholder -- English official, Tok Pisin lingua franca",
          climate: "Tropical, wet, high humidity",
          politicalStability: "Low",
          internetSpeed: "8 Mbps avg",
          healthcareSystem: "Limited; expats often evacuate to AUS for serious care",
          crimeSafetyIndex: "Significant urban crime; security planning required",
          religionDemographics: "Christian majority; growing Baha'i community"
        },
        finances: {
          costOfLivingIndex: 58,
          rent1br: 1100,
          rent2br: 1800,
          rent3br: 2800,
          groceryBasket: 580,
          averageMealPrice: 22,
          publicTransportMonthly: 35,
          transportMode: "Car essential",
          utilitiesMonthly: 180,
          internetMonthly: 80,
          averageLocalSalary: 11500,
          currencyCode: "PGK",
          exchangeRateToAUD: 2.5,
          exchangeRateLastUpdated: "2026-05-28",
          historicalRates: fakeHistory(2.48, 0.06)
        },
        visa: {
          visaType: "Working Resident / Special Exemption (religious workers)",
          maxInitialStay: "12 months, renewable",
          renewalOptions: "Annual",
          religiousWorkerVisa: true,
          workRights: "Yes with permit; sponsor-tied",
          estimatedProcessingTime: "6--12 weeks",
          estimatedCostAUD: 360,
          officialSourceUrl: "https://ica.gov.pg/",
          notes: "Special Exemption visa is the missionary route."
        },
        community: {
          bahaiFamilyCount: 1500,
          hasLSA: true,
          communitySize: "Large",
          openPioneerGoal: true,
          proximityToHouseOfWorship: "Local House of Worship, Port Moresby",
          suitabilityTags: ["Strong existing community", "Remote location", "Solo pioneer friendly"]
        },
        confidence: {
          overview: { population: "high", officialLanguages: "high", englishScore: "low", englishScoreNote: "low", climate: "high", politicalStability: "high", internetSpeed: "low", healthcareSystem: "high", crimeSafetyIndex: "high", religionDemographics: "high" },
          finances: { costOfLivingIndex: "medium", rent1br: "low", rent2br: "low", rent3br: "low", groceryBasket: "medium", averageMealPrice: "medium", publicTransportMonthly: "low", transportMode: "high", utilitiesMonthly: "low", internetMonthly: "low", averageLocalSalary: "low", currencyCode: "high", exchangeRateToAUD: "low", exchangeRateLastUpdated: "low" },
          visa: { visaType: "medium", maxInitialStay: "medium", renewalOptions: "medium", religiousWorkerVisa: "high", workRights: "high", estimatedProcessingTime: "low", estimatedCostAUD: "low", officialSourceUrl: "medium", notes: "medium" },
          community: { bahaiFamilyCount: "medium", hasLSA: "high", communitySize: "high", openPioneerGoal: "high", proximityToHouseOfWorship: "medium", suitabilityTags: "high" }
        }
      }

    ]
  };
})();
