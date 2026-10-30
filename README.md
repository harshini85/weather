# 🌤️ Live Weather App

A lightweight, responsive, and modern weather application built with vanilla **HTML5**, **CSS3 (Glassmorphism)**, and **JavaScript (ES6+)**. The app queries the free, open-source **Open-Meteo API** to display real-time weather conditions for any city worldwide with **zero API keys** and **zero configuration required**.

---

## 🚀 Features
- **Global City Search:** Search for any city worldwide.
- **Two-Step Open-Meteo API Workflow:**
  1. **Geocoding API:** Converts city names into geographic coordinates (latitude and longitude).
  2. **Forecast API:** Fetches live temperature, wind speed, and WMO weather codes.
- **WMO Code Translation:** Automatically converts numeric weather condition codes into visual emojis (☀️, ⛅, 🌧️, ⛈️, ❄️) and clear descriptions (Sunny, Moderate Rain, Thunderstorm).
- **Glassmorphism UI:** Features a sky-blue gradient background, a frosted translucent glass card (backdrop-filter), smooth shadows, and bold typography.
- **Full Keyboard Support:** Press the Enter key inside the search input or click the "Get Weather" button.
- **Robust Error Handling:** Friendly messages for empty searches, unknown cities, and offline network failures.
- **Mobile Responsive:** Adapts seamlessly to all smartphone and desktop screen sizes.

---

## 🛠️ Technologies Used
- **HTML5:** Semantic markup (<main>, <header>, <article>, <section>).
- **CSS3:** Flexbox, CSS Grid, Glassmorphism (backdrop-filter: blur()).
- **JavaScript (ES6+):** async/await, native fetch() API, DOM manipulation.
- **Open-Meteo APIs:** Geocoding API & Weather Forecast API (Free, no keys).

---

## 📁 Project Structure
weather-app/
├── index.html    # Application layout, search bar, and weather card
├── style.css     # Sky-blue gradient, glass card, and mobile styles
├── script.js     # Geocoding + Weather API calls & DOM updates
└── README.md     # Documentation and deployment instructions

---

## 💻 How to Run Locally
Double click index.html to open in any web browser, or use VS Code Live Server!

---

## 🌐 Publishing on GitHub Pages
1. Push index.html, style.css, script.js to a GitHub repository.
2. In GitHub repo Settings -> Pages, set Source to "Deploy from a branch" (main branch / root).
3. Visit https://YOUR_USERNAME.github.io/weather-app/
