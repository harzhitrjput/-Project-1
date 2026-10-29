// Currency Converter - backend (plain Node.js, no external packages needed)
const http = require("http");
const fs = require("fs");
const path = require("path");

const currencies = require("./src/currencies");
const { getRates } = require("./src/rateService");
const { validateConversion } = require("./src/validate");
const { getExchangeRate, convert } = require("./src/converter");

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, "public");
const MIME = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8", ".json": "application/json",
  ".svg": "image/svg+xml", ".ico": "image/x-icon", ".png": "image/png"
};

function sendJson(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}

async function handleApi(url, res) {
  if (url.pathname === "/api/currencies") {
    return sendJson(res, 200, { currencies });
  }

  if (url.pathname === "/api/convert") {
    const amount = url.searchParams.get("amount");
    const from = (url.searchParams.get("from") || "").toUpperCase();
    const to = (url.searchParams.get("to") || "").toUpperCase();

    const error = validateConversion({ amount, from, to });
    if (error) return sendJson(res, 400, { error });

    try {
      const data = await getRates();
      const rate = getExchangeRate(data.rates, from, to);
      return sendJson(res, 200, {
        amount: Number(amount), from, to, rate,
        result: convert(Number(amount), rate),
        source: data.source, updated: data.updated
      });
    } catch (err) {
      return sendJson(res, 502, { error: "Could not get exchange rate. Please try again." });
    }
  }

  sendJson(res, 404, { error: "Unknown API endpoint." });
}

function serveStatic(url, res) {
  let rel = url.pathname === "/" ? "/index.html" : url.pathname;
  const filePath = path.normalize(path.join(PUBLIC_DIR, rel));
  if (!filePath.startsWith(PUBLIC_DIR)) { res.writeHead(403); return res.end("Forbidden"); }
  fs.readFile(filePath, (err, content) => {
    if (err) { res.writeHead(404, { "Content-Type": "text/plain" }); return res.end("Not found"); }
    res.writeHead(200, { "Content-Type": MIME[path.extname(filePath)] || "application/octet-stream" });
    res.end(content);
  });
}

http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (req.method !== "GET") { res.writeHead(405); return res.end(); }
  if (url.pathname.startsWith("/api/")) return handleApi(url, res);
  serveStatic(url, res);
}).listen(PORT, () => {
  console.log(`Currency Converter running at http://localhost:${PORT}`);
});
