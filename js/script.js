const allAnimations = document.querySelectorAll('.weather-animation');

function animationControl(weatherStatus) {
    switch (weatherStatus) {
        case 'Clear':
            sunny();
            break;
        case 'Thunderstorm':
            rainy();
            break;
        case 'Rain':
            rainy();
            break;
        case 'Snow':
            snowy();
            break;
        case 'Clouds':
            cloudly();
            break;
        default:
            cloudly();
    }
}

// sunny animation

function sunny() {
    allAnimations.forEach(animation => {
        if (animation.matches('.weather-animation--active')) {
            animation.classList.remove('weather-animation--active');
        }

        if (animation.matches('.sunny')) {
            animation.classList.add('weather-animation--active');
        }
    });
}

// rainy animation

function rainy() {
    allAnimations.forEach(animation => {
        if (animation.matches('.weather-animation--active')) {
            animation.classList.remove('weather-animation--active');
        }

        if (animation.matches('.rainy')) {
            animation.classList.add('weather-animation--active');
        }
    });

    var canvas1 = document.getElementById('canvas1');
    var canvas2 = document.getElementById('canvas2');
    var canvas3 = document.getElementById('canvas3');
    var ctx1 = canvas1.getContext('2d');
    var ctx2 = canvas2.getContext('2d');
    var ctx3 = canvas3.getContext('2d');

    var rainthroughnum = 500;
    var speedRainTrough = 15;
    var RainTrough = [];

    var rainnum = 500;
    var rain = [];

    var lightning = [];
    var lightTimeCurrent = 0;
    var lightTimeTotal = 0;

    var w = canvas1.width = canvas2.width = canvas3.width = window.innerWidth;
    var h = canvas1.height = canvas2.height = canvas3.height = window.innerHeight;
    window.addEventListener('resize', function () {
        w = canvas1.width = canvas2.width = canvas3.width = window.innerWidth;
        h = canvas1.height = canvas2.height = canvas3.height = window.innerHeight;
    });

    function random(min, max) {
        return Math.random() * (max - min + 1) + min;
    }

    function clearcanvas1() {
        ctx1.clearRect(0, 0, w, h);
    }

    function clearcanvas2() {
        ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
    }

    function clearCanvas3() {
        ctx3.globalCompositeOperation = 'destination-out';
        ctx3.fillStyle = 'rgba(0,0,0,' + random(1, 30) / 100 + ')';
        ctx3.fillRect(0, 0, w, h);
        ctx3.globalCompositeOperation = 'source-over';
    };

    function createRainTrough() {
        for (var i = 0; i < rainthroughnum; i++) {
            RainTrough[i] = {
                x: random(0, w),
                y: random(0, h),
                length: Math.floor(random(1, 830)),
                opacity: Math.random() * 0.2,
                xs: random(-2, 2),
                ys: random(10, 20)
            };
        }
    }

    function createRain() {
        for (var i = 0; i < rainnum; i++) {
            rain[i] = {
                x: Math.random() * w,
                y: Math.random() * h,
                l: Math.random() * 1,
                xs: -4 + Math.random() * 4 + 2,
                ys: Math.random() * 10 + 10
            };
        }
    }

    function createLightning() {
        var x = random(100, w - 100);
        var y = random(0, h / 4);

        var createCount = random(1, 3);
        for (var i = 0; i < createCount; i++) {
            single = {
                x: x,
                y: y,
                xRange: random(5, 30),
                yRange: random(10, 25),
                path: [{
                    x: x,
                    y: y
                }],
                pathLimit: random(40, 55)
            };
            lightning.push(single);
        }
    };

    function drawRainTrough(i) {
        ctx1.beginPath();
        var grd = ctx1.createLinearGradient(0, RainTrough[i].y, 0, RainTrough[i].y + RainTrough[i].length);
        grd.addColorStop(0, "rgba(255,255,255,0)");
        grd.addColorStop(1, "rgba(255,255,255," + RainTrough[i].opacity + ")");

        ctx1.fillStyle = grd;
        ctx1.fillRect(RainTrough[i].x, RainTrough[i].y, 1, RainTrough[i].length);
        ctx1.fill();
    }

    function drawRain(i) {
        ctx2.beginPath();
        ctx2.moveTo(rain[i].x, rain[i].y);
        ctx2.lineTo(rain[i].x + rain[i].l * rain[i].xs, rain[i].y + rain[i].l * rain[i].ys);
        ctx2.strokeStyle = 'rgba(174,194,224,0.5)';
        ctx2.lineWidth = 1;
        ctx2.lineCap = 'round';
        ctx2.stroke();
    }

    function drawLightning() {
        for (var i = 0; i < lightning.length; i++) {
            var light = lightning[i];

            light.path.push({
                x: light.path[light.path.length - 1].x + (random(0, light.xRange) - (light.xRange / 2)),
                y: light.path[light.path.length - 1].y + (random(0, light.yRange))
            });

            if (light.path.length > light.pathLimit) {
                lightning.splice(i, 1);
            }

            ctx3.strokeStyle = 'rgba(255, 255, 255, .1)';
            ctx3.lineWidth = 3;
            if (random(0, 15) === 0) {
                ctx3.lineWidth = 6;
            }
            if (random(0, 30) === 0) {
                ctx3.lineWidth = 8;
            }

            ctx3.beginPath();
            ctx3.moveTo(light.x, light.y);
            for (var pc = 0; pc < light.path.length; pc++) {
                ctx3.lineTo(light.path[pc].x, light.path[pc].y);
            }
            if (Math.floor(random(0, 30)) === 1) { //to fos apo piso
                ctx3.fillStyle = 'rgba(255, 255, 255, ' + random(1, 3) / 100 + ')';
                ctx3.fillRect(0, 0, w, h);
            }
            ctx3.lineJoin = 'miter';
            ctx3.stroke();
        }
    };

    function animateRainTrough() {
        clearcanvas1();
        for (var i = 0; i < rainthroughnum; i++) {
            if (RainTrough[i].y >= h) {
                RainTrough[i].y = h - RainTrough[i].y - RainTrough[i].length * 5;
            } else {
                RainTrough[i].y += speedRainTrough;
            }
            drawRainTrough(i);
        }
    }

    function animateRain() {
        clearcanvas2();
        for (var i = 0; i < rainnum; i++) {
            rain[i].x += rain[i].xs;
            rain[i].y += rain[i].ys;
            if (rain[i].x > w || rain[i].y > h) {
                rain[i].x = Math.random() * w;
                rain[i].y = -20;
            }
            drawRain(i);
        }
    }

    function animateLightning() {
        clearCanvas3();
        lightTimeCurrent++;
        if (lightTimeCurrent >= lightTimeTotal) {
            createLightning();
            lightTimeCurrent = 0;
            lightTimeTotal = 200;  //rand(100, 200)
        }
        drawLightning();
    }

    function init() {
        createRainTrough();
        createRain();
        window.addEventListener('resize', createRainTrough);
    }
    init();

    function animloop() {
        animateRainTrough();
        animateRain();
        animateLightning();
        requestAnimationFrame(animloop);
    }
    animloop();
}

// cloudly animation

function cloudly() {
    allAnimations.forEach(animation => {
        if (animation.matches('.weather-animation--active')) {
            animation.classList.remove('weather-animation--active');
        }

        if (animation.matches('.cloudly')) {
            animation.classList.add('weather-animation--active');
        }
    });
}

//snowy animation

function snowy() {
    allAnimations.forEach(animation => {
        if (animation.matches('.weather-animation--active')) {
            animation.classList.remove('weather-animation--active');
        }

        if (animation.matches('.snowy')) {
            animation.classList.add('weather-animation--active');
        }
    });

    const flake = document.querySelector(".flake");
    const container = document.querySelector(".snowy");

    function createFlake() {
        const clone = flake.cloneNode(true);
        clone.style.paddingLeft = Math.random() * 10 + "px"; // creating left padding
        clone.style.animationDuration = Math.random() * 5 + 3 + "s"; // animation duration between 3-5
        clone.style.opacity = Math.random() * 1;
        container.append(clone); // adding clone flake to container
    }
    const s = setInterval(createFlake, 100); // to create more flakes decrease 100

    setTimeout(() => {
        clearInterval(s);
    }, 3000);
}

//-----------------------------------------------------------------------
//getCountry

const countryList = {
    "AF": "Afghanistan",
    "AL": "Albania",
    "DZ": "Algeria",
    "AS": "American Samoa",
    "AD": "Andorra",
    "AO": "Angola",
    "AI": "Anguilla",
    "AQ": "Antarctica",
    "AG": "Antigua and Barbuda",
    "AR": "Argentina",
    "AM": "Armenia",
    "AW": "Aruba",
    "AU": "Australia",
    "AT": "Austria",
    "AZ": "Azerbaijan",
    "BS": "Bahamas (the)",
    "BH": "Bahrain",
    "BD": "Bangladesh",
    "BB": "Barbados",
    "BY": "Belarus",
    "BE": "Belgium",
    "BZ": "Belize",
    "BJ": "Benin",
    "BM": "Bermuda",
    "BT": "Bhutan",
    "BO": "Bolivia (Plurinational State of)",
    "BQ": "Bonaire, Sint Eustatius and Saba",
    "BA": "Bosnia and Herzegovina",
    "BW": "Botswana",
    "BV": "Bouvet Island",
    "BR": "Brazil",
    "IO": "British Indian Ocean Territory (the)",
    "BN": "Brunei Darussalam",
    "BG": "Bulgaria",
    "BF": "Burkina Faso",
    "BI": "Burundi",
    "CV": "Cabo Verde",
    "KH": "Cambodia",
    "CM": "Cameroon",
    "CA": "Canada",
    "KY": "Cayman Islands (the)",
    "CF": "Central African Republic (the)",
    "TD": "Chad",
    "CL": "Chile",
    "CN": "China",
    "CX": "Christmas Island",
    "CC": "Cocos (Keeling) Islands (the)",
    "CO": "Colombia",
    "KM": "Comoros (the)",
    "CD": "Congo (the Democratic Republic of the)",
    "CG": "Congo (the)",
    "CK": "Cook Islands (the)",
    "CR": "Costa Rica",
    "HR": "Croatia",
    "CU": "Cuba",
    "CW": "Curaçao",
    "CY": "Cyprus",
    "CZ": "Czechia",
    "CI": "Côte d'Ivoire",
    "DK": "Denmark",
    "DJ": "Djibouti",
    "DM": "Dominica",
    "DO": "Dominican Republic (the)",
    "EC": "Ecuador",
    "EG": "Egypt",
    "SV": "El Salvador",
    "GQ": "Equatorial Guinea",
    "ER": "Eritrea",
    "EE": "Estonia",
    "SZ": "Eswatini",
    "ET": "Ethiopia",
    "FK": "Falkland Islands (the) [Malvinas]",
    "FO": "Faroe Islands (the)",
    "FJ": "Fiji",
    "FI": "Finland",
    "FR": "France",
    "GF": "French Guiana",
    "PF": "French Polynesia",
    "TF": "French Southern Territories (the)",
    "GA": "Gabon",
    "GM": "Gambia (the)",
    "GE": "Georgia",
    "DE": "Germany",
    "GH": "Ghana",
    "GI": "Gibraltar",
    "GR": "Greece",
    "GL": "Greenland",
    "GD": "Grenada",
    "GP": "Guadeloupe",
    "GU": "Guam",
    "GT": "Guatemala",
    "GG": "Guernsey",
    "GN": "Guinea",
    "GW": "Guinea-Bissau",
    "GY": "Guyana",
    "HT": "Haiti",
    "HM": "Heard Island and McDonald Islands",
    "VA": "Holy See (the)",
    "HN": "Honduras",
    "HK": "Hong Kong",
    "HU": "Hungary",
    "IS": "Iceland",
    "IN": "India",
    "ID": "Indonesia",
    "IR": "Iran (Islamic Republic of)",
    "IQ": "Iraq",
    "IE": "Ireland",
    "IM": "Isle of Man",
    "IL": "Israel",
    "IT": "Italy",
    "JM": "Jamaica",
    "JP": "Japan",
    "JE": "Jersey",
    "JO": "Jordan",
    "KZ": "Kazakhstan",
    "KE": "Kenya",
    "KI": "Kiribati",
    "KP": "Korea (the Democratic People's Republic of)",
    "KR": "Korea (the Republic of)",
    "KW": "Kuwait",
    "KG": "Kyrgyzstan",
    "LA": "Lao People's Democratic Republic (the)",
    "LV": "Latvia",
    "LB": "Lebanon",
    "LS": "Lesotho",
    "LR": "Liberia",
    "LY": "Libya",
    "LI": "Liechtenstein",
    "LT": "Lithuania",
    "LU": "Luxembourg",
    "MO": "Macao",
    "MG": "Madagascar",
    "MW": "Malawi",
    "MY": "Malaysia",
    "MV": "Maldives",
    "ML": "Mali",
    "MT": "Malta",
    "MH": "Marshall Islands (the)",
    "MQ": "Martinique",
    "MR": "Mauritania",
    "MU": "Mauritius",
    "YT": "Mayotte",
    "MX": "Mexico",
    "FM": "Micronesia (Federated States of)",
    "MD": "Moldova (the Republic of)",
    "MC": "Monaco",
    "MN": "Mongolia",
    "ME": "Montenegro",
    "MS": "Montserrat",
    "MA": "Morocco",
    "MZ": "Mozambique",
    "MM": "Myanmar",
    "NA": "Namibia",
    "NR": "Nauru",
    "NP": "Nepal",
    "NL": "Netherlands (the)",
    "NC": "New Caledonia",
    "NZ": "New Zealand",
    "NI": "Nicaragua",
    "NE": "Niger (the)",
    "NG": "Nigeria",
    "NU": "Niue",
    "NF": "Norfolk Island",
    "MP": "Northern Mariana Islands (the)",
    "NO": "Norway",
    "OM": "Oman",
    "PK": "Pakistan",
    "PW": "Palau",
    "PS": "Palestine, State of",
    "PA": "Panama",
    "PG": "Papua New Guinea",
    "PY": "Paraguay",
    "PE": "Peru",
    "PH": "Philippines (the)",
    "PN": "Pitcairn",
    "PL": "Poland",
    "PT": "Portugal",
    "PR": "Puerto Rico",
    "QA": "Qatar",
    "MK": "Republic of North Macedonia",
    "RO": "Romania",
    "RU": "Russian Federation (the)",
    "RW": "Rwanda",
    "RE": "Réunion",
    "BL": "Saint Barthélemy",
    "SH": "Saint Helena, Ascension and Tristan da Cunha",
    "KN": "Saint Kitts and Nevis",
    "LC": "Saint Lucia",
    "MF": "Saint Martin (French part)",
    "PM": "Saint Pierre and Miquelon",
    "VC": "Saint Vincent and the Grenadines",
    "WS": "Samoa",
    "SM": "San Marino",
    "ST": "Sao Tome and Principe",
    "SA": "Saudi Arabia",
    "SN": "Senegal",
    "RS": "Serbia",
    "SC": "Seychelles",
    "SL": "Sierra Leone",
    "SG": "Singapore",
    "SX": "Sint Maarten (Dutch part)",
    "SK": "Slovakia",
    "SI": "Slovenia",
    "SB": "Solomon Islands",
    "SO": "Somalia",
    "ZA": "South Africa",
    "GS": "South Georgia and the South Sandwich Islands",
    "SS": "South Sudan",
    "ES": "Spain",
    "LK": "Sri Lanka",
    "SD": "Sudan (the)",
    "SR": "Suriname",
    "SJ": "Svalbard and Jan Mayen",
    "SE": "Sweden",
    "CH": "Switzerland",
    "SY": "Syrian Arab Republic",
    "TW": "Taiwan",
    "TJ": "Tajikistan",
    "TZ": "Tanzania, United Republic of",
    "TH": "Thailand",
    "TL": "Timor-Leste",
    "TG": "Togo",
    "TK": "Tokelau",
    "TO": "Tonga",
    "TT": "Trinidad and Tobago",
    "TN": "Tunisia",
    "TR": "Turkey",
    "TM": "Turkmenistan",
    "TC": "Turks and Caicos Islands (the)",
    "TV": "Tuvalu",
    "UG": "Uganda",
    "UA": "Ukraine",
    "AE": "United Arab Emirates (the)",
    "GB": "United Kingdom of Great Britain and Northern Ireland (the GB)",
    "UM": "United States Minor Outlying Islands (the)",
    "US": "United States of America (the USA)",
    "UY": "Uruguay",
    "UZ": "Uzbekistan",
    "VU": "Vanuatu",
    "VE": "Venezuela (Bolivarian Republic of)",
    "VN": "Viet Nam",
    "VG": "Virgin Islands (British)",
    "VI": "Virgin Islands (U.S.)",
    "WF": "Wallis and Futuna",
    "EH": "Western Sahara",
    "YE": "Yemen",
    "ZM": "Zambia",
    "ZW": "Zimbabwe",
    "AX": "Åland Islands"
};
const inputCountry = document.querySelector('.modal__input--country');
const inputCity = document.querySelector('.modal__input--city');
const helperList = document.querySelector('.modal__list');
const confirmButton = document.querySelector('.modal__button--confirm');
const closeModalButtons = document.querySelectorAll('.modal__close');

inputCountry.oninput = () => {
    getCountryList();
};

function getCountryList() {
    const countryArr = Object.values(countryList);
    const inputValue = inputCountry.value.toLowerCase();

    helperList.innerHTML = '';

    const selectedCountrys = countryArr.filter(country => {
        return country.toLowerCase().includes(inputValue);
    });

    selectedCountrys.forEach(country => {
        helperList.innerHTML += `<li class="modal__item"><button class="modal__item-button">${country}</button></li>`;
    });

    if (inputValue.length < 1) helperList.innerHTML = '';
}

// show could we close the modal window or not (if country name is incorrect)
let switcher = 0;

helperList.addEventListener('click', (e) => {
    const target = e.target;

    if (target.matches('.modal__item-button')) {
        inputCountry.value = target.textContent;
    }

    helperList.innerHTML = '';
    inputCountry.closest('.modal__label').classList.remove('modal__label--incorrect');

    switcher = 1;
});

confirmButton.addEventListener('click', () => {
    if (switcher) {
        const dataLoc = {

        };

        for (let country in countryList) {
            if (inputCountry.value.toLowerCase() === countryList[country].toLowerCase()) {
                dataLoc['country'] = country;
                dataLoc['city'] = inputCity.value;

                if (!localStorage.getItem('location')) {
                    localStorage.setItem('location', JSON.stringify({ 'city': inputCity.value, 'country': country }));
                }

            }
        }

        getWeather(dataLoc);

        modalWrapper.classList.add('modal--disable');
    } else {
        inputCountry.closest('.modal__label').classList.add('modal__label--incorrect');
    }
});

closeModalButtons[1].addEventListener('click', () => {
    modalWrapper.classList.add('modal--disable');
});

// modal--------------------------------------------

const modalWrapper = document.querySelector('.modal');
const modalQuestion = document.querySelector('.modal__inner--question');
const modalSearch = document.querySelector('.modal__inner--search');
const openModalButton = document.querySelector('.new-country-button');

function openModal() {
    modalWrapper.classList.remove('modal--disable');

    modalWrapper.addEventListener('click', (e) => {
        const target = e.target;

        if (target.matches('.modal__button--yes') || target.matches('.modal__close')) {
            modalWrapper.classList.add('modal--disable');
            modalQuestion.classList.add('modal__inner--disable');
            modalSearch.classList.add('modal__inner--disable');
        }

        if (target.matches('.modal__button--no')) {
            modalQuestion.classList.add('modal__inner--disable');
            modalSearch.classList.remove('modal__inner--disable');
        }
    });
};

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
        .then(addCityName)
        .catch(() => {
            console.log('error');
        });
}

function checkStorage() {
    if (localStorage.getItem('location')) {
        const dataLoc = JSON.parse(localStorage.getItem('location'));

        getWeather(dataLoc);
    } else {
        getLocation();
        openModal();
    }
}

function addCityName(dataLoc) {
    console.log(dataLoc);
    const cityArray = document.querySelectorAll('.city');
    const cityName = dataLoc.city;

    localStorage.setItem('location', JSON.stringify({ 'city': dataLoc.city, 'country': dataLoc.country }));

    cityArray.forEach(city => {
        city.textContent = cityName;
    });
}

function getWeather(dataLoc) {
    console.log(dataLoc);
    const cityName = dataLoc.city;
    const countryName = dataLoc.country;

    fetch(`${param.url}?q=${cityName},${countryName.toLowerCase()}&units=metric&APPID=${param.appid}`)
        .then(weather => {
            return weather.json();
        }).then(showWeather)
        .catch(() => {
            modalWrapper.classList.remove('modal--disable');
            inputCity.closest('.modal__label').classList.add('modal__label--incorrect');
            console.log('error');
        });

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

        const futureWeatherWrapper = document.querySelector('.weather-future__list');

        function setWeatherOnNextDays() {
            let pastDate = new Date();

            for (let item of data.list) {
                const currentDate = new Date(item.dt_txt);

                if (currentDate > pastDate && currentDate.getHours() == '15') {
                    pastDate = currentDate;

                    console.log(currentDate);
                    futureWeatherWrapper.innerHTML += `
                    <div class="swiper-slide">
                    <div class="weather-future__item weather-small">
                    <div class="weather-small__hourse">
                        ${String(currentDate).slice(0, 3)}
                    </div>
                    <div class="weather-small__icon">
                    <div class="small-${item.weather['0'].main.toLowerCase()}"></div>
                    </div>
                    <div class="weather-small__temperature">
                        ${Math.round(item.main.temp)} &#xb0; C
                    </div>
                </div>
                </div>
                    `
                }
            }
        }

        setWeatherOnNextDays();


    } else {
        alert('Incorrect city, try again');
    }

    const swiper = new Swiper('.swiper', {
        // Optional parameters
        slidesPerView: 3,
        // centeredSlides: true,

        breakpoints: {
            // when window width is >= 320px
            576: {
                slidesPerView: 5,
            }
        }
    });
}

checkStorage();