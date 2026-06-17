// ---- Top summary strip (4 KPI cards) -----------------------------------
// shape: { totalDemand, totalCollection, totalOutstanding, collectionPercent }
export const summaryData = {
  totalDemand: 4637.83,
  totalCollection: 976.59,
  totalOutstanding: 3645.28,
  collectionPercent: 21.06,
};

// ---- Today's Collection (Amount in Lakhs) -------------------------------
// shape: { rows: [{ corporation, count, amount }], total: { count, amount } }
export const todaysCollectionData = {
  rows: [
    { corporation: "Ichalkaranji", count: 31, amount: 2.24 },
    { corporation: "Ulhasnagar", count: 36, amount: 3.19 },
  ],
  total: { count: 67, amount: 5.43 },
};

// ---- Property Summary table + chart --------------------------------------
// shape: array of { corporation, residential, commercial, mixed, total }
export const propertySummaryData = [
  {
    corporation: "Ahilyanagar",
    residential: 88656,
    commercial: 50389,
    mixed: 1807,
    total: 140852,
  },
  {
    corporation: "Bhiwandi Nizampur",
    residential: 246912,
    commercial: 40162,
    mixed: 2991,
    total: 290071,
  },
  {
    corporation: "Dhule",
    residential: 69349,
    commercial: 9365,
    mixed: 1260,
    total: 79974,
  },
  {
    corporation: "Ichalkaranji",
    residential: 40151,
    commercial: 13628,
    mixed: 10056,
    total: 63835,
  },
  {
    corporation: "Khamgaon",
    residential: 19339,
    commercial: 8768,
    mixed: 1749,
    total: 29856,
  },
  {
    corporation: "Latur",
    residential: 84682,
    commercial: 10957,
    mixed: 7850,
    total: 103489,
  },
  {
    corporation: "Malegaon",
    residential: 95081,
    commercial: 21694,
    mixed: 5277,
    total: 122052,
  },
  {
    corporation: "Thane",
    residential: 597679,
    commercial: 70117,
    mixed: 12729,
    total: 680525,
  },
  {
    corporation: "Ulhasnagar",
    residential: 135747,
    commercial: 42887,
    mixed: 6206,
    total: 184840,
  },
  {
    corporation: "Urun Islampur",
    residential: 16810,
    commercial: 6497,
    mixed: 1733,
    total: 25040,
  },
  {
    corporation: "Vasai Virar",
    residential: 853180,
    commercial: 168342,
    mixed: 0,
    total: 1021522,
  },
  {
    corporation: "Wadi",
    residential: 10871,
    commercial: 6735,
    mixed: 0,
    total: 17606,
  },
];

export const propertySummaryTotal = propertySummaryData.reduce(
  (acc, row) => ({
    residential: acc.residential + row.residential,
    commercial: acc.commercial + row.commercial,
    mixed: acc.mixed + row.mixed,
    total: acc.total + row.total,
  }),
  { residential: 0, commercial: 0, mixed: 0, total: 0 },
);

// ---- Collection % (Amount in Cr) table -----------------------------------
// shape: array of { corporation, demand, collection, outstanding, percent }
export const collectionPercentData = [
  {
    corporation: "Ahilyanagar",
    demand: 153.67,
    collection: 37.17,
    outstanding: 118.52,
    percent: 24.18,
  },
  {
    corporation: "Bhiwandi Nizampur",
    demand: 670.69,
    collection: 61.68,
    outstanding: 614.24,
    percent: 9.19,
  },
  {
    corporation: "Dhule",
    demand: 0.03,
    collection: 0.03,
    outstanding: 0.03,
    percent: 0.0,
  },
  {
    corporation: "Ichalkaranji",
    demand: 151.84,
    collection: 29.47,
    outstanding: 125.36,
    percent: 19.4,
  },
  {
    corporation: "Khamgaon",
    demand: 201.81,
    collection: 0.0,
    outstanding: 201.81,
    percent: 0.0,
  },
  {
    corporation: "Latur",
    demand: 180.11,
    collection: 37.46,
    outstanding: 147.19,
    percent: 20.79,
  },
  {
    corporation: "Malegaon",
    demand: 130.52,
    collection: 12.26,
    outstanding: 115.68,
    percent: 9.39,
  },
  {
    corporation: "Thane",
    demand: 1287.37,
    collection: 507.35,
    outstanding: 772.78,
    percent: 39.4,
  },
  {
    corporation: "Ulhasnagar",
    demand: 993.36,
    collection: 39.09,
    outstanding: 938.72,
    percent: 3.93,
  },
  {
    corporation: "Urun Islampur",
    demand: 13.9,
    collection: 4.6,
    outstanding: 9.57,
    percent: 33.09,
  },
  {
    corporation: "Vasai Virar",
    demand: 840.89,
    collection: 245.34,
    outstanding: 589.9,
    percent: 29.17,
  },
  {
    corporation: "Wadi",
    demand: 13.64,
    collection: 2.17,
    outstanding: 11.48,
    percent: 15.9,
  },
];

export const collectionPercentTotal = {
  demand: 4637.83,
  collection: 976.59,
  outstanding: 3645.28,
  percent: 21.06,
};

// ---- Collection Status Mode Wise (donut + table) -------------------------
// shape: array of { mode, amount, percent, color }
export const collectionModeData = [
  { mode: "Cheque", amount: 323.11, percent: 33.08, color: "blue" },
  { mode: "Online", amount: 250.84, percent: 25.66, color: "orange" },
  { mode: "Cash", amount: 296.64, percent: 30.44, color: "red" },
];

export const collectionModeTotal = { amount: 976.59, percent: 100 };

// ---- Top Performing Corporations (By Collection %) ------------------------
// shape: array of { corporation, percent }, pre-sorted for display
export const topPerformingData = [
  { corporation: "Thane", percent: 39.4 },
  { corporation: "Urun Islampur", percent: 33.09 },
  { corporation: "Vasai Virar", percent: 29.17 },
  { corporation: "Ahilyanagar", percent: 24.18 },
  { corporation: "Latur", percent: 20.79 },
];

// ---- Payment Mode Analysis (Collection in Cr) ------------------------------
// Re-uses the same shape as collectionModeData since it represents the same
// underlying figures, just rendered as a standalone donut + legend card.
export const paymentModeAnalysisData = collectionModeData;

// ---- Collection Ranking (By Collection in Cr) ------------------------------
// shape: array of { corporation, amount }
export const collectionRankingData = [
  { corporation: "Thane", amount: 507.35 },
  { corporation: "Vasai Virar", amount: 245.34 },
  { corporation: "Ahilyanagar", amount: 37.17 },
  { corporation: "Latur", amount: 37.46 },
  { corporation: "Ulhasnagar", amount: 39.09 },
];

// ---- Footer -----------------------------------------------------------------
export const footerData = {
  note: "Note: Amounts are in Lakhs for Today's Collection & in Crores for Others",
  dataAsOn: "Today",
};
