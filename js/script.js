// modal--------------------------------------------

const modalWrapper = document.querySelector('.modal');
const modalQuestion = document.querySelector('.modal__inner--question');
const modalSearch = document.querySelector('.modal__inner--search');
const openModalButton = document.querySelector('.new-country-button');

modalWrapper.addEventListener('click', (e) => {
    const target = e.target;

    if (target.matches('.modal__button--yes') || target.matches('.modal__close')) {
        modalWrapper.classList.add('modal--disable');
    }

    if (target.matches('.modal__button--no')) {
        modalQuestion.classList.add('modal__inner--disable');
        modalSearch.classList.remove('modal__inner--disable');
    }
});

openModalButton.addEventListener('click', () => {
    modalWrapper.classList.remove('modal--disable');
    modalQuestion.classList.add('modal__inner--disable');
    modalSearch.classList.remove('modal__inner--disable');
});

// set weather---------------------------------------------------------

const param = {
    url: 'https://api.openweathermap.org/data/2.5/forecast',
    appid: 'ff4384d9d6ad00be68b96672b35cd33c',
};

function getLocation() {
    // get location of country
    fetch("https://ipinfo.io/json?token=1757608293c75d").then(
        (response) => response.json()
    ).then(getWeather)
        .then(addCityName);
}

function addCityName(dataLoc) {
    const cityArray = document.querySelectorAll('.city');
    const cityName = dataLoc.city;

    cityArray.forEach(city => {
        city.textContent = cityName;
    });
}

function getWeather(dataLoc) {
    const cityName = dataLoc.city;
    const countryName = dataLoc.country;

    console.log(dataLoc);

    fetch(`${param.url}?q=${cityName},${countryName.toLowerCase()}&units=metric&APPID=${param.appid}`)
        .then(weather => {
            return weather.json();
        }).then(showWeather);

    return dataLoc;
}

function showWeather(data) {
    console.log(data);

    animationControl(data.list['0'].weather['0'].main);

    const city = document.querySelector('.weather-screen__city');
    const temperature = document.querySelector('.weather-screen__temperature');
    const caption = document.querySelector('.weather-screen__caption');
    const icon = document.querySelector('.weather__icon img');
    const realFeel = document.querySelector('#real-feel');
    const humidity = document.querySelector('#humidity');
    const wind = document.querySelector('#wind');
    const pressure = document.querySelector('#pressure');

    // future list
    const futureWeather = document.querySelectorAll('.weather-future__item');

    if (data.city) {
        city.textContent = data.city.name;
        temperature.innerHTML = Math.round(data.list['0'].main.temp) + '&#xb0; C';
        caption.textContent = data.list['0'].weather['0']['main'];

        // listsub info
        realFeel.innerHTML = Math.round(data.list['0'].main.feels_like) + '&#xb0; C';
        humidity.textContent = data.list['0'].main.humidity + '%';
        wind.textContent = data.list['0'].wind.speed;
        pressure.textContent = data.list['0'].main.pressure + 'hPa';

        // feed future weather

        for (let i = 0; i < futureWeather.length; i++) {
            const hourse = futureWeather[i].querySelector('.weather-small__hourse');
            const icon = futureWeather[i].querySelector('.weather-small__icon');
            const temperature = futureWeather[i].querySelector('.weather-small__temperature');

            // get future time
            const time = data.list[i].dt_txt;

            hourse.textContent = time.slice(-8, -3);
            icon.innerHTML = `<div class="small-${data.list[i].weather['0'].main.toLowerCase()}"></div>`;
            temperature.innerHTML = Math.round(data.list[i].main.temp) + '&#xb0; C';
        }


    } else {
        errorSwitcher = 0;
        alert('Incorrect city, try again');
    }

}

getLocation();