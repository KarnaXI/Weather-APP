const apiKey = "6b5ad6318463263c699fe7ed88855157";
const cityField = document.querySelector("input.city-field");
const dataDisplayContainer = document.createElement("div");
dataDisplayContainer.className = "weather-info";
document.body.append(dataDisplayContainer);

const errorContainer = document.querySelector(".error");

const dataDisplay = document.querySelector(".weather-info");
const celsiusOrFahrenheit = document.querySelector("select.celsius-or-fahrenheit");
const form = document.querySelector("form");

form.addEventListener("submit", (e) => {
    if (cityField.validity.valueMissing){
        errorContainer.innerHTML = "<p>Please enter a city</p>";
        errorContainer.classList.add("active");
        e.preventDefault();
    }
    else{
        getWeather(cityField.value);
        errorContainer.classList.remove("active");
        e.preventDefault();
    }
});


async function getWeather(city){
    let units;
    let unitLetter;
    if (celsiusOrFahrenheit.value === "Celsius"){
        units = "metric"
        unitLetter = "C"
    }
    else{
        units = "imperial"
        unitLetter = "F"
    }
    try {
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`);
        let weatherData = await response.json();
        errorContainer.classList.remove("active");
        const weatherType = weatherData.weather[0].main;
        
        dataDisplay.innerHTML = `
        <h2>Temperature for ${weatherData.name + " " + weatherData.sys.country}</h2>
        <p>${weatherData.main.temp}°${unitLetter} but feels like ${weatherData.main.feels_like}°${unitLetter}</p>
        <p>Today's high will be ${weatherData.main.temp_max}°${unitLetter} with a low of ${weatherData.main.temp_min}°${unitLetter}</p>
        `
        getGif(weatherType);
    }
    catch (error){
        errorContainer.innerHTML = "<p>Couldn't find that city, please try again.</p>";
        errorContainer.classList.add("active");
    }

}
   
async function getGif(weatherType){
    let response = await fetch(`https://api.giphy.com/v1/gifs/translate?api_key=GZ5S5L0IXC3NfRv7kC5qYQQZ4V9oHhtW&s=${weatherType + " weather"}`);
    let gif = await response.json();

    const img = document.createElement("img");
    img.src = gif.data.images.original.url;
    dataDisplay.appendChild(img);
}
