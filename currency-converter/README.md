# Currency Converter - Mini Project

B.Tech CSE (Data Science) | Lloyd Institute of Engineering & Technology | Session 2026-27
Student: Harshit Rajput | Guide: Deepesh Kumar

## How to run
1. Install Node.js (v18 or newer): https://nodejs.org
2. Open this folder in VS Code.
3. Press F5 and select **Run Currency Converter** to start the server and open the app in your browser.

Alternatively, open a terminal in this folder and run `npm start` (or `node server.js`), then open http://localhost:3000 in Chrome/Edge.

No npm install is needed - the project has no external dependencies.

## Structure
- server.js            - HTTP server + REST API (/api/currencies, /api/convert)
- src/currencies.js    - supported currencies (add new ones here)
- src/rateService.js   - Currency Data/API module (live API, 1-hour cache, offline fallback)
- src/validate.js      - Input Validation module
- src/converter.js     - Conversion Engine (Amount x Rate)
- public/              - Front-end: index.html, style.css, script.js

## API
GET /api/convert?amount=100&from=USD&to=INR
