// Conversion Engine: Converted Amount = Amount x Exchange Rate
function getExchangeRate(rates, from, to) {
  // rates are relative to USD, so cross rate = rates[to] / rates[from]
  if (!rates[from] || !rates[to]) throw new Error(`Rate unavailable for ${from}/${to}`);
  return rates[to] / rates[from];
}

function convert(amount, rate) {
  return Math.round(amount * rate * 1e6) / 1e6;
}

module.exports = { getExchangeRate, convert };
