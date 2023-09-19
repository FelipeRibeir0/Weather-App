const API_KEY = '2702bfeaabff181c567781a07c0289d3';
const searchButton = document.querySelector(".search-button");
const cityInput = document.querySelector(".city-input");
const weatherCardsDiv = document.querySelector(".weather-cards");
const currentWeatherDiv = document.querySelector(".current-weather");
const localCity = localStorage.getItem('cityName') ? localStorage.getItem('cityName') : 'São Paulo';

const getWeatherDetails = () => {
    const cityName = cityInput.value ? cityInput.value.trim() : localCity;
    if (!cityName) return;
    localStorage.setItem('cityName', cityName);
    const forecastURL = `http://api.openweathermap.org/data/2.5/forecast?q=${cityName}&APPID=${API_KEY}`;

    fetch(forecastURL).then(res => res.json()).then(data => {
        const uniqueForecast = [];
        const fourDays = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if (!uniqueForecast.includes(forecastDate)) {
                return uniqueForecast.push(forecastDate);
            }
        });
        fourDays.splice(5, 1);
        cityInput.value = "";
        currentWeatherDiv.innerHTML = "";
        weatherCardsDiv.innerHTML = "";

        fourDays.forEach((weatherItem, index) => {
            if (index === 0) {
                currentWeatherDiv.insertAdjacentHTML("beforeend", createWeatherCard(weatherItem, cityName, index));
            }
            else {
                weatherCardsDiv.insertAdjacentHTML("beforeend", createWeatherCard(weatherItem, cityName, index));
            }
        })
    }).catch(() => {
        localStorage.setItem('cityName', 'São Paulo');
        alert("Ops! Houve um problema, tente novamente mais tarde");
    });
}
searchButton.addEventListener("click", getWeatherDetails)

const createWeatherCard = (weatherItem, cityName, index) => {
    if (index === 0) {

        let newURL = formatURL(`https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png`);
        let newDate = formatDate(weatherItem.dt_txt.split(" ")[0])

        return `
<div class="details">
<h2>${cityName} (${newDate})</h2>
<h4>Temperatura: ${(Math.round(weatherItem.main.temp - 273.15))}ºC</h4>
<h4>Vento: ${weatherItem.wind.speed} M/S</h4>
<h4>Umidade: ${weatherItem.main.humidity}%</h4>
</div>
<div class="icon">
<img src=${newURL} alt="Weather"> 
<h4>${capitalizeFirst(weatherItem.weather[0].description)}</h4>
</div>`
    } else {
        let newUrl = formatURL(`https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png`);
        let newDate = formatDate(weatherItem.dt_txt.split(" ")[0])

        return `
        <li class="card">
            <h2>(${newDate})</h2>
            <img src=${newUrl} alt="Weather">
            <h4>Temperatura: ${(Math.round(weatherItem.main.temp - 273.15))}ºC</h4>
            <h4>Vento: ${weatherItem.wind.speed} M/S</h4>
            <h4>Umidade: ${weatherItem.main.humidity}%</h4>
        </li> `;
    }
}

getWeatherDetails();

function formatURL(url) {
    function replaceNtoD(match) {
        const numero = parseInt(match);
        if (!isNaN(numero)) {
            const numeroFormatado = numero < 10 ? `0${numero}` : numero;
            return `${numeroFormatado}d`;
        }
        return match;
    }
    return url.replace(/\d+n/g, replaceNtoD);
}

function formatDate(dataOriginal) {
    const partes = dataOriginal.split("-");
    const ano = partes[0];
    const mes = partes[1];
    const dia = partes[2];

    return `${dia}/${mes}/${ano}`;
};

function capitalizeFirst(desc) {
    const subst = desc.toLowerCase().replace(/(?:^|\s)\S/g, function (str) {
        return str.toUpperCase();
    });

    return subst;
}

cityInput.addEventListener('input', function (event) {
    const txt = event.target.value;
  
    if (txt.match(/[0-9!@#$%^¹²³£¢¬&*()_+¨{}\[\]:;<>,.?~\\|]|-|[-]/)) {
      event.target.value = txt.replace(/[0-9!@#$%^¹²³£¢¬&*()_+¨{}\[\]:;<>,.?~\\|]|-|[-]/g, '');
    }
});