const currentInformation = document.getElementById('current-location');
const url = 'https://api.open-meteo.com/v1/forecast';


async function loadLocation() {
    const res = await fetch('https://get.geojs.io/v1/ip/geo.json');
    const obj = await res.json();
    console.log(obj);
    const {longitude, latitude, city} = obj;
    console.log(longitude, latitude, city);
    return {longitude, latitude, city};

}

async function loadWeather() {
    try{
    const locationData = await loadLocation();
    if (!locationData) {
        console.log('Ошибка при получении данных о местоположении.');
        return null;
      }
    const {latitude, longitude} = locationData;
    const response = await fetch(`${url}?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
    if(!response.ok){
        throw new Error(response.status +" " + response.statusText);
    }
    console.log(response);
    const data = await response.json();
    console.log(data);
    const {current_weather} = data;
    console.log(current_weather);
    const {
        temperature,
        windspeed,
        winddirection,
        weathercode,
        time
    } = current_weather;
    const cityName = locationData.city;
    return {temperature, windspeed, weathercode, cityName};
 }
    catch {(err) => console.log(err)
    return null;
}   
}
loadWeather();

function interpretationCode(code){
    switch (code) {
        case 0:
            return 'Clear sky';
        case 1:
            return 'Mainly clear';
        case 2: 
            return 'Partly cloudy';
        case 3:
            return 'Overcast';
        case 45:
            return 'Fog';
        case 48:
            return 'Depositing rime fog';
        case 51:
            return 'Light drizzle';
        case 53:
            return 'Moderate drizzle';
        case 55:
            return 'Dense intensity drizzle';
        case 56:
            return 'Light freezing drizzle';
        case 57:
            return 'Dense intensity freezing drizzle';
        case 61:
            return 'Slight rain';
        case 63:
            return 'Moderate rain';
        case 65:
            return 'Heavy intensity rain';
        case 66:
            return 'Light freezing rain';
        case 67:
            return 'Heavy intensity freezing rain';
        case 71:
            return 'Slight snow fall';
        case 73:
            return 'Moderate snow fall';
        case 75:
            return 'Heavy intensity snow fall';
        case 77:
            return 'Snow grains';
        case 80:
            return 'Slight rain showers';
        case 81:
            return 'Moderate rain showers';
        case 82:
            return 'Violent rain showers';
        case 85:
            return 'Slight snow showers';
        case 86:
            return 'Heavy snow showers';
        case 95:
            return 'Thunderstorm';
        default: ' ';
            break;
    }
}

function showWeather(cityName, temperature, windspeed, weatherCode) {
    const weatherDescription = interpretationCode(weatherCode);
  
    let weatherHTML = `<h2>${cityName}</h2>`;
    weatherHTML += `<p>Temperature: ${temperature}°C</p>`;
    weatherHTML += `<p>Wind speed: ${windspeed} м/с</p>`;
    weatherHTML += `<p>${weatherDescription}</p>`;
  
    currentInformation.innerHTML = weatherHTML;
  }
  loadWeather().then((data) => {
    if (data) {
      showWeather(data.cityName, data.temperature, data.windspeed, data.weathercode);
    }
  });
