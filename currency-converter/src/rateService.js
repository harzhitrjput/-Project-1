// Currency Data / API Module: fetches live rates, caches them, falls back to local data.
const fallback = require("./fallbackRates");

const API_URL = "https://open.er-api.com/v6/latest/USD"; // free, no API key
const CACHE_MS = 60 * 60 * 1000; // 1 hour

let cache = null; // { rates, updated, source, fetchedAt }

async function fetchLive() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6000);
  try {
    const res = await fetch(API_URL, { signal: controller.signal });
    if (!res.ok) throw new Error("API responded with status " + res.status);
    const data = await res.json();
    if (data.result !== "success" || !data.rates) throw new Error("Bad API payload");
    return {
      rates: data.rates,
      updated: data.time_last_update_utc || new Date().toUTCString(),
      source: "live",
      fetchedAt: Date.now()
    };
  } finally {
    clearTimeout(timer);
  }
}

async function getRates() {
  if (cache && Date.now() - cache.fetchedAt < CACHE_MS) return cache;
  try {
    cache = await fetchLive();
    return cache;
  } catch (err) {
    console.warn("Live rate fetch failed:", err.message);
    if (cache) return { ...cache, source: "cached" }; // stale but real data
    return { rates: fallback.rates, updated: fallback.updated, source: "offline", fetchedAt: 0 };
  }
}

module.exports = { getRates };
