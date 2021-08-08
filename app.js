const inputField = document.querySelector('input')
const temperatureToggle = document.querySelector('.toggler')
const searchIcon = document.querySelector("ion-icon[name='search-outline']")

const init = () => {
    unit = 'metric'
    document.querySelector('.c').classList.add('selected')
    cityLookup('Milano').then((data) => {
        let city
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
    cityName = inputField.value
    cityLookup(cityName)
    .then((data) => {console.log(data)}    
        )
});

const updateTemperature = (temperature) => {
    unit = temperature == "c" ? 'metric' : 'imperial'
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

init()
