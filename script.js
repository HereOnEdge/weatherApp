// loading function
function loading() {
    let mainContainer = document.createElement('div')
    mainContainer.classList.add('main-loading-container')
    let body = document.querySelector('body')
    body.appendChild(mainContainer)
    let loadContainer = document.createElement('div')
    loadContainer.classList.add('loading-container')
    mainContainer.appendChild(loadContainer)
    let cloudSvg = document.createElement('div')
    cloudSvg.classList.add('cloud-div')
    cloudSvg.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clouds" viewBox="0 0 16 16"><path d="M16 7.5a2.5 2.5 0 0 1-1.456 2.272 3.513 3.513 0 0 0-.65-.824 1.5 1.5 0 0 0-.789-2.896.5.5 0 0 1-.627-.421 3 3 0 0 0-5.22-1.625 5.587 5.587 0 0 0-1.276.088 4.002 4.002 0 0 1 7.392.91A2.5 2.5 0 0 1 16 7.5z"/><path d="M7 5a4.5 4.5 0 0 1 4.473 4h.027a2.5 2.5 0 0 1 0 5H3a3 3 0 0 1-.247-5.99A4.502 4.502 0 0 1 7 5zm3.5 4.5a3.5 3.5 0 0 0-6.89-.873.5.5 0 0 1-.51.375A2 2 0 1 0 3 13h8.5a1.5 1.5 0 1 0-.376-2.953.5.5 0 0 1-.624-.492V9.5z"/></svg>`;
    loadContainer.appendChild(cloudSvg)
    let loading = document.createElement('div')
    loading.classList.add('loading')
    loading.innerHTML = '<div class = "snow">*</div><div class = "snow">*</div><div class = "snow">*</div><div class = "snow">*</div><div class = "snow">*</div>'
    loadContainer.appendChild(loading)

    return console.log('i did my fucking job')
    
} 
loading()

// load images when page runs
function loadImages() {
    let clearDay = new Image()
    clearDay.src = './img/clear-day.jpg'
    let cloudDay = new Image()
    cloudDay.src = './img/cloud-day.jpg'
    let rainy = new Image()
    rainy.src = './img/rain-night.jpg'
    let snowy = new Image()
    snowy.src = './img/snow.jpg'
    let clearNight = new Image()
    clearNight.src = './img/clear-night.jpg'
    let cloudNight = new Image()
    cloudNight.src = './img/cloud-night.jpg'
    const images = {
        day: {
            clear: clearDay.src,
            cloud: cloudDay.src,
            rain: rainy.src,
            snow: snowy.src,
        },
        night: {
            clear: clearNight.src,
            cloud: cloudNight.src,
            rain: rainy.src,
            snow: snowy.src,
        }
    }
    return images
}
const images = loadImages()
// show background for each weather condition
function showBackground(locationTime, weather) {
    let body = document.querySelector('body')
    // check if it,s day or night
    let isNight = false
    if(locationTime >= 18 || locationTime <= 5) {
        isNight = true
    }
    console.log(isNight)
    // change font colors on different backgrounds
    if (isNight === true || weather === 'Rain' || weather === 'Snow') {
        body.style.color = '#dddddd'
    } else {
        body.style.color = '#222222'
    }
    if(isNight === false) {
        return weather === 'Clear' ? images.day.clear : 
        weather === 'Clouds'? images.day.cloud :
        weather === 'Rain' ? images.day.rain:
        weather === 'Snow' ? images.day.snow: images.day.clear
    } else if (isNight === true) {
        return weather === 'Clear' ? images.night.clear : 
        weather === 'Clouds'? images.night.cloud :
        weather === 'Rain' ? images.night.rain:
        weather === 'Snow' ? images.night.snow: images.night.clear
    }
}
// get data from input and fetch the data
async function getLocation(){
    let firstRun = false;
    if(document.querySelector('body').classList.contains('first-run')){
        firstRun = true
    }
    let search = new Promise((resolve, reject) => {
        document.querySelector(".button").addEventListener('click', () => {
            let seacrhInput = document.querySelector(".search")
            
            seacrhInput.value === '' ? reject('!valid') :
            seacrhInput.value.length <= 2 ? reject('!valid') :
            resolve(seacrhInput.value) 
        })
    })
    try {
        let cityName;
        if(firstRun === true) {
            cityName = 'tehran'
        }
        else if(firstRun === false) {
            cityName = await search
        }
        let apiRespond = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=4b8ff3976c38129b270f58272253a7e5&units=metric`, {mode:"cors"})
        let cleanData = await apiRespond.json()
        if(cleanData.cod === '404') {
            return '404'
        }
        console.log(cleanData)
        document.querySelector('body').classList.remove('first-run')
        return cleanData
        
    }
    catch(err) {
        if(err === '!valid') {
            return 'Please insert a valid City Name'
        }
        return 'ERROR'
    }
}
// show the result on the page
async function showResults() {
    const weatherBox = document.querySelector('.weather')
    const cityNameBox = document.querySelector('.city-name')
    const tempBox = document.querySelector('.temp')
    const feelsLikeBox = document.querySelector('.like')
    const windBox = document.querySelector('.wind')
    const humidityBox = document.querySelector('.humidity')
    const errorBox = document.querySelector('.error-message')
    const searchBox = document.querySelector('.search')
    const bodyBox = document.querySelector('body')
    let timeZone
    let UTC_time
    let locationTime
    let timeNow = new Date()
    let weatherResult = await getLocation()
    if (weatherResult === '404') {
        searchBox.classList.add('focus')
        errorBox.textContent = 'City not found'
        return showResults()
    } else if(weatherResult === 'ERROR') {
        searchBox.classList.add('focus')
        errorBox.textContent = 'Something went wrong !'
        return showResults()
    } else if(weatherResult.cod !== 200) {
        searchBox.classList.add('focus')
        errorBox.textContent = weatherResult;
        console.log('me')
        return showResults()
    } else {
        if(searchBox.classList.contains('focus')){
            searchBox.classList.remove('focus')
        }
        errorBox.textContent = ''
        searchBox.value = ''
        cityNameBox.textContent = `${weatherResult.name}, ${weatherResult.sys.country}`
        weatherBox.textContent = weatherResult.weather[0].main
        tempBox.innerHTML = `${Math.floor(weatherResult.main.temp)} <span class="unit-container"><span class="degree">o</span><span class="unit">C</span></span>`
        feelsLikeBox.innerHTML = `${Math.floor(weatherResult.main.feels_like)}<span class="unit-container"><span class="degree" id="degree">o</span><span class="unit">C</span></span>`
        windBox.textContent = `${Math.floor((weatherResult.wind.speed))}MPH`
        humidityBox.textContent = `${weatherResult.main.humidity}%`
        timeZone = ((weatherResult.timezone / 60) / 60)
        UTC_time = timeNow.getUTCHours()
        locationTime = UTC_time + timeZone
        bodyBox.style.backgroundImage = `url(${showBackground(locationTime, weatherResult.weather[0].main)})`
        if(document.querySelector('.main-loading-container')){
            document.querySelector('.main-loading-container').remove()
        }
        console.log(bodyBox)
        console.log(showBackground(locationTime, weatherResult.weather[0].main))
        console.log(timeZone)
        console.log(UTC_time)
        return showResults()
    }
}
showResults()