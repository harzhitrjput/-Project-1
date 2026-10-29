// Supported currencies (ISO 4217). To add a new currency, just add a line here
// (and optionally a fallback rate in fallbackRates.js).
module.exports = [
  { code: "INR", name: "Indian Rupee",        symbol: "₹",   locale: "en-IN" },
  { code: "USD", name: "US Dollar",           symbol: "$",   locale: "en-US" },
  { code: "EUR", name: "Euro",                symbol: "€",   locale: "de-DE" },
  { code: "GBP", name: "British Pound",       symbol: "£",   locale: "en-GB" },
  { code: "JPY", name: "Japanese Yen",        symbol: "¥",   locale: "ja-JP" },
  { code: "AUD", name: "Australian Dollar",   symbol: "A$",  locale: "en-AU" },
  { code: "CAD", name: "Canadian Dollar",     symbol: "C$",  locale: "en-CA" },
  { code: "AED", name: "UAE Dirham",          symbol: "د.إ", locale: "ar-AE" },
  { code: "SGD", name: "Singapore Dollar",    symbol: "S$",  locale: "en-SG" },
  { code: "CNY", name: "Chinese Yuan",        symbol: "¥",   locale: "zh-CN" }
];
