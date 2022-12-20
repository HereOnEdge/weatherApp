async function getWeather(city){
    let Api_key = '4b8ff3976c38129b270f58272253a7e5';
    let city_name = "tehran"
} 
// get data from input and fetch the data
async function getLocation(){
    let search = new Promise((resolve, reject) => {
        document.querySelector(".button").addEventListener('click', () => {
            let seacrhInput = document.querySelector(".search")
            
            seacrhInput.value === '' ? reject('!valid') :
            seacrhInput.value.length <= 2 ? reject('!valid') :
            resolve(seacrhInput.value) 
        })
    })
    try {
        let cityName = await search
        let apiRespond = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=4b8ff3976c38129b270f58272253a7e5&units=metric`, {mode:"cors"})
        let cleanData = await apiRespond.json()
        if(cleanData.cod === '404') {
            return '404'
        }
        console.log(cleanData)
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
    const bodyBox = document.querySelector('body')
    let weatherResult = await getLocation()
    if (weatherResult === '404') {
        errorBox.textContent = 'City not found'
        return showResults()
    } else if(weatherResult === 'ERROR') {
        errorBox.textContent = 'Something went wrong !'
        return showResults()
    } else if(weatherResult.cod !== 200) {
        errorBox.textContent = weatherResult;
        console.log('me')
        return showResults()
    } else {
        cityNameBox.textContent = weatherResult.name
        weatherBox.textContent = weatherResult.weather[0].main
        tempBox.textContent = Math.floor(weatherResult.main.temp)
        feelsLikeBox.textContent = Math.floor(weatherResult.main.feels_like)
        windBox.textContent = `${Math.floor((weatherResult.wind.speed * 3.6))}km/h`
        humidityBox.textContent = `${weatherResult.main.humidity}%`
        return showResults()
    }
}
showResults()