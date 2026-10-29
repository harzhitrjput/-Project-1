// Approximate offline rates (1 USD = X). Used ONLY if the live API is unreachable
// and no cached live rates exist yet. Update occasionally.
module.exports = {
  updated: "Offline fallback data (approximate)",
  rates: {
    USD: 1, INR: 83.5, EUR: 0.92, GBP: 0.79, JPY: 150,
    AUD: 1.52, CAD: 1.37, AED: 3.6725, SGD: 1.34, CNY: 7.25
  }
};
