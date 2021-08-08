const inputField = document.querySelector('input')
const temperatureToggle = document.querySelector('.toggler')
const searchIcon = document.querySelector("ion-icon[name='search-outline']")

let unit, currentCity

const init = () => {
    unit = 'metric'
    currentCity = 'Milano'
    document.querySelector('.c').classList.add('selected')
    cityLookup(currentCity).then((data) => {
        extractData(data).then((obj) => {
            updateData(obj)
        })   
    })
}

temperatureToggle.addEventListener('click', (e) => {
    if (!e.target.classList.contains('selected') && e.target.classList.contains('c') || e.target.classList.contains('f')) {
        document.querySelector('.selected').classList.remove('selected')
        temperature = e.target.classList[0]
        e.target.classList.add('selected')
        updateTemperature(temperature)
    }
})

searchIcon.addEventListener('click', () => {
    cityName = inputField.value ? inputField.value : 'Milano'
    currentCity = cityName
    cityLookup(cityName).then((data) => {
        extractData(data).then((json) => {
            console.log(json)
            updateData(json)
        })
    })
});

const updateTemperature = (temperature) => {
    unit = temperature == "c" ? 'metric' : 'imperial'
    cityLookup(currentCity).then((data) => {
        extractData(data).then((obj) => {
            updateData(obj)
        })   
    })
}

async function extractData(data){
    let city, state, currentWeather, weatherIcon, temperature, humidity, sunrise, sunset
    city = await data.name
    state = await data.sys.country ? data.sys.country : data.country
    currentWeather = await data.weather[0].main
    weatherIcon = await data.weather[0].icon
    temperature = await Math.round(data.main.temp)
    humidity = await data.main.humidity
    sunrise = await new Date(data.sys.sunrise * 1000)
    sunset = await new Date(data.sys.sunset * 1000)
    return {
            city,
            state,
            currentWeather,
            weatherIcon,
            temperature,
            humidity,
            sunrise,
            sunset
        }
    }

async function cityLookup(cityName) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=46b96d7348d85d52a6751ae943fd667f&units=${unit}`)
    if (response.ok) {
        const json = await response.json()
        return json
    } else {
        showErrorBox()
    }
}

const updateData = (dataObj) => {
    let iconImg, location, temperature, currentWeather, humidity, sunrise, sunset

    iconImg = document.querySelector('img')
    location = document.querySelector('p.location')
    temperature = document.querySelector('p.temperature')
    currentWeather = document.querySelector('p.currentWeather')
    humidity = document.querySelector('p.humidity')
    sunrise = document.querySelector('p.sunrise')
    sunrise_minutes = dataObj.sunrise.toLocaleString('it-IT', {minute : 'numeric'});
    if (sunrise_minutes < 10){
        sunrise_minutes = `0${sunrise_minutes}`
    }
    sunset = document.querySelector('p.sunset')
    sunset_minutes = dataObj.sunset.toLocaleString('it-IT', {minute : 'numeric'});
    if (sunset_minutes < 10) {
        sunset_minutes = `0${sunset_minutes}`
    }



    iconImg.src = `http://openweathermap.org/img/wn/${dataObj.weatherIcon}@2x.png`
    location.textContent = `${dataObj.city}, ${dataObj.state}`
    temperature.textContent = `${dataObj.temperature} °${unit == 'metric' ? 'C' : 'F'}`
    currentWeather.textContent = dataObj.currentWeather
    humidity.textContent = `${dataObj.humidity}%`
    sunrise.textContent = `${dataObj.sunrise.toLocaleString('it-IT', {hour : 'numeric'})}:${sunrise_minutes}`
    sunset.textContent = `${dataObj.sunset.toLocaleString('it-IT', {hour : 'numeric'})}:${sunset_minutes}`
}

init()
