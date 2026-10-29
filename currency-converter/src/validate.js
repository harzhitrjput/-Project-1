// Input Validation module
const currencies = require("./currencies");
const codes = new Set(currencies.map((c) => c.code));
const MAX_AMOUNT = 1e12;

function validateConversion({ amount, from, to }) {
  if (amount === undefined || amount === null || String(amount).trim() === "")
    return "Please enter an amount.";
  const n = Number(amount);
  if (!Number.isFinite(n)) return "Amount must be a valid number.";
  if (n < 0) return "Amount cannot be negative.";
  if (n > MAX_AMOUNT) return "Amount is too large (max 1,000,000,000,000).";
  if (!from || !codes.has(String(from).toUpperCase())) return "Please select a valid source currency.";
  if (!to || !codes.has(String(to).toUpperCase())) return "Please select a valid target currency.";
  return null;
}

module.exports = { validateConversion };
