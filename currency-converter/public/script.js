// Currency Converter - front-end logic
const $ = (id) => document.getElementById(id);
const amountEl = $("amount"), fromEl = $("from"), toEl = $("to");
const convertBtn = $("convert"), errorEl = $("error"), resultEl = $("result");

let currencies = [];
const HISTORY_KEY = "cc_history";

const byCode = (code) => currencies.find((c) => c.code === code);

function formatMoney(value, code) {
  const c = byCode(code);
  try {
    return new Intl.NumberFormat(c ? c.locale : "en-US", {
      style: "currency", currency: code, maximumFractionDigits: 2
    }).format(value);
  } catch {
    return value.toFixed(2) + " " + code;
  }
}

function showError(msg) {
  errorEl.textContent = msg;
  errorEl.hidden = false;
  resultEl.hidden = true;
}

function clientValidate() {
  const raw = amountEl.value.trim();
  if (raw === "") return "Please enter an amount.";
  const n = Number(raw);
  if (!Number.isFinite(n)) return "Amount must be a valid number.";
  if (n < 0) return "Amount cannot be negative.";
  if (!fromEl.value || !toEl.value) return "Please select both currencies.";
  return null;
}

async function convert() {
  errorEl.hidden = true;
  const problem = clientValidate();
  if (problem) return showError(problem);

  convertBtn.disabled = true;
  convertBtn.textContent = "Converting...";
  try {
    const qs = new URLSearchParams({ amount: amountEl.value, from: fromEl.value, to: toEl.value });
    const res = await fetch("/api/convert?" + qs);
    const data = await res.json();
    if (!res.ok) return showError(data.error || "Something went wrong.");
    renderResult(data);
    saveHistory(data);
  } catch {
    showError("Cannot reach the server. Is it running?");
  } finally {
    convertBtn.disabled = false;
    convertBtn.textContent = "Convert";
  }
}

function renderResult(d) {
  $("fromLine").textContent = formatMoney(d.amount, d.from) + " =";
  $("toLine").textContent = formatMoney(d.result, d.to);
  $("rateLine").textContent = `1 ${d.from} = ${d.rate.toFixed(4)} ${d.to}`;
  const badge = $("badge");
  badge.textContent = d.source === "live" ? "LIVE" : d.source === "cached" ? "CACHED" : "OFFLINE";
  badge.className = "badge " + d.source;
  $("updated").textContent = d.updated;
  resultEl.hidden = false;
}

/* ---------- history (stored in the browser) ---------- */
function loadHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; } catch { return []; }
}
function saveHistory(d) {
  const list = loadHistory();
  list.unshift({ amount: d.amount, from: d.from, to: d.to, result: d.result });
  try { localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, 5))); } catch {}
  renderHistory();
}
function renderHistory() {
  const list = loadHistory();
  $("historyBox").hidden = list.length === 0;
  $("historyList").innerHTML = "";
  list.forEach((h) => {
    const li = document.createElement("li");
    li.textContent = `${formatMoney(h.amount, h.from)} → ${formatMoney(h.result, h.to)}`;
    $("historyList").appendChild(li);
  });
}

/* ---------- setup ---------- */
async function init() {
  try {
    const res = await fetch("/api/currencies");
    currencies = (await res.json()).currencies;
  } catch {
    return showError("Cannot reach the server. Start it with: node server.js");
  }
  const options = currencies.map((c) => `<option value="${c.code}">${c.code} - ${c.name}</option>`).join("");
  fromEl.innerHTML = options;
  toEl.innerHTML = options;
  fromEl.value = "USD";
  toEl.value = "INR";
  renderHistory();
  convert();
}

$("swap").addEventListener("click", () => {
  [fromEl.value, toEl.value] = [toEl.value, fromEl.value];
  convert();
});
convertBtn.addEventListener("click", convert);
amountEl.addEventListener("keydown", (e) => { if (e.key === "Enter") convert(); });
fromEl.addEventListener("change", convert);
toEl.addEventListener("change", convert);
$("clearHistory").addEventListener("click", () => { localStorage.removeItem(HISTORY_KEY); renderHistory(); });

init();
