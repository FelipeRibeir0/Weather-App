const searchButton = document.querySelector(".fa-magnifying-glass");
const cityInput = document.getElementById("city-input");
const weatherCardsDiv = document.querySelector(".weather-cards");
const currentWeatherDiv = document.querySelector(".current-weather");
const map = document.querySelector(".fa-map-location-dot");

const countryAPI = "https://flagsapi.com/country/flat/32.png";
const API_KEY = "2702bfeaabff181c567781a07c0289d3";

const cities = [
  "Brasília",
  "Washington",
  "Ottawa",
  "Cidade do México",
  "Tokyo",
  "Pequim",
  "Veneza",
  "Paris",
  "Rabat",
  "Berna",
];
const cityIndex = Math.floor(Math.random() * 10);
const localCity = localStorage.getItem("cityName")
  ? localStorage.getItem("cityName")
  : cities[cityIndex];

getWeatherDetails();

function getWeatherDetails() {
  const cityName = cityInput.value ? cityInput.value.trim() : localCity;
  localStorage.setItem("cityName", cityName);
  const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&APPID=${API_KEY}`;
  cityInput.value = "";
  fetch(forecastURL)
    .then((res) => res.json())
    .then((data) => {
      const uniqueForecast = [];
      const fourDays = data.list.filter((forecast) => {
        const forecastDate = new Date(forecast.dt_txt).getDate();
        if (!uniqueForecast.includes(forecastDate)) {
          return uniqueForecast.push(forecastDate);
        }
      });
      const lat = data.city.coord.lat;
      const lon = data.city.coord.lon;
      const country = data.city.country;

      fourDays.splice(5, 1);
      currentWeatherDiv.innerHTML = "";
      weatherCardsDiv.innerHTML = "";
      fourDays.forEach((weatherItem, index) => {
        if (index === 0) {
          currentWeatherDiv.insertAdjacentHTML(
            "beforeend",
            createWeatherCard(weatherItem, cityName, index, lat, lon, country)
          );
        } else {
          weatherCardsDiv.insertAdjacentHTML(
            "beforeend",
            createWeatherCard(weatherItem, cityName, index, lat, lon, country)
          );
        }
      });
    })
    .catch(() => {
      cityInput.placeholder = "Erro: Cidade indisponível ou não existe";
      localStorage.setItem("cityName", cities[cityIndex]);
    });
}

function createWeatherCard(weatherItem, cityName, index, lat, lon, country) {
  if (index === 0) {
    let newURL = `https://openweathermap.org/img/wn/${replaceIcon(
      weatherItem.weather[0].icon
    )}@2x.png`;

    const newDate = new Date(weatherItem.dt_txt).toLocaleDateString();

    return `
<div class="details">
<img src=${countryAPI.replace("country", country)}>
<span>${cityName} (${newDate})</span>
<h3><i class="fa-solid fa-temperature-quarter"></i> ${(
      weatherItem.main.temp - 273.15
    ).toFixed(0)}ºC</h3>
<h4><i class="fa-solid fa-wind"></i> ${weatherItem.wind.speed} M/S</h4>
<h4><i class="fa-solid fa-water"></i> ${weatherItem.main.humidity}%</h4>
<h4><i class="fa-solid fa-cloud"></i> ${weatherItem.clouds.all}%</h4>
<div class="max-min">
<i class="fa-solid fa-arrow-up"></i>
<span>${(weatherItem.main.temp_max - 273.15).toFixed(0)}ºC</span>
<i class="fa-solid fa-arrow-down"></i>
<span>${(weatherItem.main.temp_min - 273.15).toFixed(0)}ºC</span>
</div>
</div>
<div class="icon">
<img src=${newURL} alt="Weather"> 
<h4>${weatherItem.weather[0].description}</h4>
</div>
<a href=${getWeatherMap(lat, lon)} target="_blank">
<i class="fa-solid fa-map-location-dot"></i>
</a>`;
  } else {
    let cardUrl = `https://openweathermap.org/img/wn/${replaceIcon(
      weatherItem.weather[0].icon
    )}@2x.png`;
    let cardDate = new Date(weatherItem.dt_txt).toLocaleDateString();

    return `
        <li class="card">
            <h2>(${cardDate})</h2>
            <img src=${cardUrl} alt="Weather">
            <h4><i class="fa-solid fa-temperature-quarter"></i> ${(
              weatherItem.main.temp - 273.15
            ).toFixed(0)}ºC</h4>
            <h4><i class="fa-solid fa-wind"></i> ${
              weatherItem.wind.speed
            } M/S</h4>
            <h4><i class="fa-solid fa-water"></i> ${
              weatherItem.main.humidity
            }%</h4>
            <h4><i class="fa-solid fa-cloud"></i> ${weatherItem.clouds.all}% </h4>
            <div class="max-min">
            <i class="fa-solid fa-arrow-up"></i>
            <span>${(weatherItem.main.temp_max - 273.15).toFixed(0)}ºC</span>
            <i class="fa-solid fa-arrow-down"></i>
            <span>${(weatherItem.main.temp_min - 273.15).toFixed(0)}ºC</span>
            </div>
            </li> `;
  }
}

function getWeatherMap(lat, lon) {
  return ($url = `https://openweathermap.org/weathermap?basemap=map&cities=true&layer=radar&lat=${lat}&lon=${lon}&zoom=6`);
}

function replaceIcon(icon) {
  if (document.body.classList.contains("darkTheme")) {
    return icon.replace("d", "n");
  }
  return icon.replace("n", "d");
}

searchButton.addEventListener("click", () => {
  if (!cityInput.value) {
    cityInput.placeholder = "Erro: Insira o nome de uma Cidade";
  }
  getWeatherDetails();
});
cityInput.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    if (!cityInput.value) {
      cityInput.placeholder = "Erro: Insira o nome de uma Cidade";
    }
    getWeatherDetails();
  }
});

cityInput.addEventListener("input", function (event) {
  const txt = event.target.value;

  if (txt.match(/[0-9!@#$%^¹²³£¢¬&*()_+¨{}\[\]:;<>,.?~\\|]|-|[-]/)) {
    event.target.value = txt.replace(
      /[0-9!@#$%^¹²³£¢¬&*()_+¨{}\[\]:;<>,.?~\\|]|-|[-]/g,
      ""
    );
  }
});
