/**
 * ==============================================================================
 * Weather App Script (script.js)
 * 
 * Features:
 * (1) Converts WMO weather codes into emojis and friendly descriptions.
 * (2) Shows polite, friendly error messages for missing cities or network issues.
 * (3) Displays an interactive "Loading..." message while fetching data.
 * (4) Supports pressing the "Enter" key in the search box as well as clicking.
 * ==============================================================================
 */

// 1. Select DOM Elements
const cityInput = document.getElementById("cityInput");
const getWeatherBtn = document.getElementById("getWeatherBtn");
const statusMessage = document.getElementById("statusMessage");

const weatherCard = document.getElementById("weatherCard");
const cityNameEl = document.getElementById("cityName");
const weatherEmojiEl = document.getElementById("weatherEmoji");
const weatherDescEl = document.getElementById("weatherDesc");
const temperatureEl = document.getElementById("temperature");
const windSpeedEl = document.getElementById("windSpeed");
const forecastGridEl = document.getElementById("forecastGrid");

// 2. Weather Code Converter: Maps WMO codes to Emojis and Descriptions
const weatherCodeMap = {
  // Clear / Sunny
  0: { desc: "Sunny / Clear Sky", emoji: "☀️" },
  1: { desc: "Mainly Sunny", emoji: "🌤️" },

  // Clouds
  2: { desc: "Partly Cloudy", emoji: "⛅" },
  3: { desc: "Overcast / Cloudy", emoji: "☁️" },

  // Fog
  45: { desc: "Foggy", emoji: "🌫️" },
  48: { desc: "Icy Fog", emoji: "🌫️" },

  // Drizzle
  51: { desc: "Light Drizzle", emoji: "🌦️" },
  53: { desc: "Moderate Drizzle", emoji: "🌦️" },
  55: { desc: "Dense Drizzle", emoji: "🌧️" },

  // Rain
  61: { desc: "Slight Rain", emoji: "🌧️" },
  63: { desc: "Moderate Rain", emoji: "🌧️" },
  65: { desc: "Heavy Rain", emoji: "⛈️" },

  // Snow
  71: { desc: "Light Snow", emoji: "🌨️" },
  73: { desc: "Moderate Snow", emoji: "❄️" },
  75: { desc: "Heavy Snow", emoji: "❄️" },

  // Showers
  80: { desc: "Rain Showers", emoji: "🌦️" },
  81: { desc: "Heavy Showers", emoji: "🌧️" },
  82: { desc: "Violent Rain Showers", emoji: "⛈️" },

  // Thunderstorm
  95: { desc: "Thunderstorm", emoji: "⛈️" },
  96: { desc: "Thunderstorm with Hail", emoji: "⛈️" },
  99: { desc: "Severe Thunderstorm with Hail", emoji: "⛈️" },
};

function getWeatherInfo(code) {
  return weatherCodeMap[code] || { desc: "Pleasant / Fair", emoji: "🌤️" };
}

// 3. Helper: Display Friendly Status & Error Messages
function showStatus(message, isError = false) {
  statusMessage.textContent = message;
  statusMessage.className = isError ? "status-message error" : "status-message";
}

// 4. Main Function: Fetch Weather Data using Async / Await
async function fetchWeather() {
  const city = cityInput.value.trim();

  // (2) Friendly error message if search box is empty
  if (!city) {
    showStatus("Please type a city name first.", true);
    return;
  }

  // (3) Show "Loading..." message while data is being fetched
  showStatus(`Loading weather for "${city}"...`, false);
  weatherCard.classList.add("hidden");
  getWeatherBtn.disabled = true;

  try {
    // Step A: Geocoding API - Convert City Name into Latitude & Longitude
    const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      city
    )}&count=1&language=en&format=json`;

    const geoResponse = await fetch(geocodingUrl);
    if (!geoResponse.ok) {
      throw new Error(`Geocoding server responded with status ${geoResponse.status}`);
    }

    const geoData = await geoResponse.json();

    // (2) Friendly error message if the city was not found
    if (!geoData.results || geoData.results.length === 0) {
      showStatus(`We couldn't find "${city}". Please check the spelling and try again.`, true);
      return;
    }

    const { name, country, latitude, longitude } = geoData.results[0];

    // Step B: Forecast API - Fetch live numbers AND 3-day daily forecast
    const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;

    const weatherResponse = await fetch(forecastUrl);
    if (!weatherResponse.ok) {
      throw new Error(`Weather server responded with status ${weatherResponse.status}`);
    }

    const weatherData = await weatherResponse.json();
    const current = weatherData.current;
    const currentUnits = weatherData.current_units;
    const daily = weatherData.daily;
    const dailyUnits = weatherData.daily_units;

    // Step C: Update DOM elements with live data
    cityNameEl.textContent = country ? `${name}, ${country}` : name;
    temperatureEl.textContent = `${current.temperature_2m} ${currentUnits.temperature_2m}`;
    windSpeedEl.textContent = `${current.wind_speed_10m} ${currentUnits.wind_speed_10m}`;

    // (1) Convert weather code into emoji and friendly description
    const weatherInfo = getWeatherInfo(current.weather_code);
    weatherEmojiEl.textContent = weatherInfo.emoji;
    weatherDescEl.textContent = weatherInfo.desc;

    // Step D: Render 3-Day Forecast Cards
    let forecastHtml = "";
    for (let i = 0; i < 3 && i < daily.time.length; i++) {
      let dayName = "Today";
      if (i === 1) dayName = "Tomorrow";
      else if (i > 1) {
        dayName = new Date(daily.time[i] + "T00:00:00").toLocaleDateString("en-US", {
          weekday: "short",
        });
      }

      const dayEmoji = getWeatherInfo(daily.weather_code[i]).emoji;
      const maxTemp = Math.round(daily.temperature_2m_max[i]);
      const minTemp = Math.round(daily.temperature_2m_min[i]);
      const tempUnit = dailyUnits.temperature_2m_max || "°C";

      forecastHtml += `
        <div class="forecast-card">
          <div class="forecast-day">${dayName}</div>
          <span class="forecast-emoji" role="img" aria-label="Forecast icon">${dayEmoji}</span>
          <div class="forecast-temps">
            <span class="temp-max">${maxTemp}${tempUnit}</span>
            <span class="temp-min">${minTemp}${tempUnit}</span>
          </div>
        </div>
      `;
    }
    forecastGridEl.innerHTML = forecastHtml;

    weatherCard.classList.remove("hidden");
    showStatus("", false);

  } catch (error) {
    console.error("Fetch weather error:", error);
    // (2) Friendly error message if network or internet fails
    showStatus("Unable to load weather. Please check your internet connection.", true);
  } finally {
    getWeatherBtn.disabled = false;
  }
}

// 5. Event Listeners
getWeatherBtn.addEventListener("click", fetchWeather);

// (4) Trigger search when user presses "Enter" in the search box
cityInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    fetchWeather();
  }
});

// Load default city (Chennai) when webpage first opens
window.addEventListener("DOMContentLoaded", () => {
  cityInput.value = "Chennai";
  fetchWeather();
});
