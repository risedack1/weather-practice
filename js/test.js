customSelect('#my-select');

const param = {
    url: 'https://api.openweathermap.org/data/2.5/forecast',
    appid: 'ff4384d9d6ad00be68b96672b35cd33c',
}

function getWeather() {
    const cityId = document.querySelector('#my-select').value;
    const locArray = cityId.split(',');

    fetch(`${param.url}?lat=${locArray[0]}&lon=${locArray[1]}&units=metric&APPID=${param.appid}`)
        .then(weather => {
            return weather.json();
        }).then(showWeather);
}

function showWeather(data) {
    console.log(data);

    const sity = document.querySelector('.weather-screen__sity');
    const temperature = document.querySelector('.weather-screen__temperature');
    const caption = document.querySelector('.weather-screen__caption');
    const icon = document.querySelector('.weather__icon img');
    const realFeel = document.querySelector('#real-feel')
    const humidity = document.querySelector('#humidity')
    const wind = document.querySelector('#wind')
    const pressure = document.querySelector('#pressure')

    // future list
    const futureWeather = document.querySelectorAll('.weather-future__item');

    sity.textContent = data.city.name;
    temperature.innerHTML = Math.round(data.list['0'].main.temp) + '&#xb0; C';
    caption.textContent = data.list['0'].weather['0']['main'];
    icon.setAttribute('src', `img/${data.list['0'].weather['0']['main'].toLowerCase()}.svg`);

    // future listsub info
    realFeel.innerHTML = Math.round(data.list['0'].main.feels_like) + '&#xb0; C';
    humidity.textContent = data.list['0'].main.humidity + '%';
    wind.textContent = data.list['0'].wind.speed;
    pressure.textContent = data.list['0'].main.pressure + 'hPa';

    // feed future weather

    for (let i = 0; i < futureWeather.length; i++) {
        const hourse = futureWeather[i].querySelector('.weather-small__hourse');
        const icon = futureWeather[i].querySelector('.weather-small__icon img');
        const temperature = futureWeather[i].querySelector('.weather-small__temperature');

        // get future time
        const time = data.list[i].dt_txt;

        hourse.textContent = time.slice(-8, -3);
        icon.setAttribute('src', `http://openweathermap.org/img/wn/${data.list[i].weather['0'].icon}@2x.png`);
        temperature.innerHTML = Math.round(data.list[i].main.temp) + '&#xb0; C';
    }

}

getWeather();
document.querySelector('#my-select').onchange = getWeather;