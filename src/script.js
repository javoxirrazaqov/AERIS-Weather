const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");
const loading = document.getElementById("loading");
const errorBox = document.getElementById("error");
const weather = document.getElementById("weather");

const city = document.getElementById("city");
const country = document.getElementById("country");
const date = document.getElementById("date");

const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");
const weatherIcon = document.getElementById("weatherIcon");

const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const feels = document.getElementById("feels");

const forecast = document.getElementById("forecast");

const themeBtn = document.getElementById("themeBtn");
const languageButtons = document.querySelectorAll(".lang");


/* =====================================
   TRANSLATIONS
===================================== */

const translations = {

    uz: {
        search: "QIDIRISH",
        placeholder: "Shahar nomini kiriting...",
        loading: "OB-HAVO YUKLANMOQDA...",
        useLocation: "JOYLASHUVIM",
locationLoading: "JOYLASHUV ANIQLANMOQDA...",
locationError: "Joylashuvingizni aniqlab bo'lmadi.",
        location: "JOYLASHUV",
        humidity: "NAMLIK",
        wind: "SHAMOL",
        feels: "HIS QILINISHI",
        forecast: "KEYINGI KUNLAR",
        footer: "AERIS © 2026 | MR.PRINCE",
        notFound: "Shahar topilmadi.",
        error: "Ob-havo ma'lumotlarini olishda xatolik yuz berdi.",
        clear: "Ochiq osmon",
        mainlyClear: "Asosan ochiq",
        partlyCloudy: "Qisman bulutli",
        cloudy: "Bulutli",
        fog: "Tuman",
        drizzle: "Mayda yomg'ir",
        rain: "Yomg'ir",
        snow: "Qor",
        storm: "Momaqaldiroq",
        searchNoteTitle: "Eslatma!",
        searchNoteText: "Shaharlarni inglizcha nomi bilan qidiring. Masalan: Parij emas Paris, Braziliya emas Brazil.",
        hourlyLabel: "SOATLIK OB-HAVO",
        hourlyTitle: "SOATLIK OB-HAVO",
        scrollHint: "SURING →",
        now: "HOZIR",
    },

    en: {
        search: "SEARCH",
        placeholder: "Enter city name...",
        loading: "LOADING WEATHER...",
        useLocation: "MY LOCATION",
locationLoading: "DETECTING LOCATION...",
locationError: "Could not detect your location.",
        location: "LOCATION",
        humidity: "HUMIDITY",
        wind: "WIND",
        feels: "FEELS LIKE",
        forecast: "NEXT DAYS",
        footer: "AERIS © 2026 | MR.PRINCE",
        notFound: "City not found.",
        error: "Failed to get weather data.",
        clear: "Clear sky",
        mainlyClear: "Mainly clear",
        partlyCloudy: "Partly cloudy",
        cloudy: "Cloudy",
        fog: "Fog",
        drizzle: "Drizzle",
        rain: "Rain",
        snow: "Snow",
        storm: "Thunderstorm",
        searchNoteTitle: "Tip!",
        searchNoteText: "You can search for any city around the world. Try Madrid, Paris or Tokyo.",
        hourlyLabel: "HOURLY WEATHER",
        hourlyTitle: "HOURLY WEATHER",
        scrollHint: "SWIPE →",
        now: "NOW",
    },

    ru: {
        search: "ПОИСК",
        placeholder: "Введите название города...",
        loading: "ЗАГРУЗКА ПОГОДЫ...",
        useLocation: "МОЯ ГЕОЛОКАЦИЯ",
locationLoading: "ОПРЕДЕЛЕНИЕ МЕСТОПОЛОЖЕНИЯ...",
locationError: "Не удалось определить местоположение.",
        location: "МЕСТОПОЛОЖЕНИЕ",
        humidity: "ВЛАЖНОСТЬ",
        wind: "ВЕТЕР",
        feels: "ОЩУЩАЕТСЯ",
        forecast: "СЛЕДУЮЩИЕ ДНИ",
        footer: "AERIS © 2026 | MR.PRINCE",
        notFound: "Город не найден.",
        error: "Не удалось получить данные о погоде.",
        clear: "Ясное небо",
        mainlyClear: "Преимущественно ясно",
        partlyCloudy: "Переменная облачность",
        cloudy: "Облачно",
        fog: "Туман",
        drizzle: "Морось",
        rain: "Дождь",
        snow: "Снег",
        storm: "Гроза",
        searchNoteTitle: "Примечание!",
        searchNoteText: "Ищите города по их английскому названию. Например: Paris, а не Париж.",
        hourlyLabel: "ПОЧАСОВАЯ ПОГОДА",
        scrollHint: "ЛИСТАЙТЕ →",
        now: "СЕЙЧАС",
    }
};


/* =====================================
   CURRENT LANGUAGE
===================================== */

let currentLanguage =
    localStorage.getItem("aeris-language") || "uz";


let lastLocation = null;
let lastWeatherData = null;


/* =====================================
   CHANGE LANGUAGE
===================================== */

function changeLanguage(language) {

    currentLanguage = language;

    const data = translations[language];

    document.documentElement.lang = language;


    document.querySelectorAll("[data-i18n]")
        .forEach(element => {

            const key = element.dataset.i18n;

            if (data[key]) {
                element.textContent = data[key];
            }

        });


    document.querySelectorAll("[data-placeholder]")
        .forEach(element => {

            const key = element.dataset.placeholder;

            if (data[key]) {
                element.placeholder = data[key];
            }

        });


    languageButtons.forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.lang === language
        );

        if (button.dataset.lang === language) {

            button.classList.remove(
                "bg-transparent",
                "text-[#8490a8]"
            );

            button.classList.add(
                "bg-[#72d9ff]",
                "text-[#06101d]"
            );

        } else {

            button.classList.remove(
                "bg-[#72d9ff]",
                "text-[#06101d]"
            );

            button.classList.add(
                "bg-transparent",
                "text-[#8490a8]"
            );

        }

    });


    localStorage.setItem(
        "aeris-language",
        language
    );


    if (lastLocation && lastWeatherData) {

        displayWeather(
            lastLocation,
            lastWeatherData
        );

    }

}


/* =====================================
   LANGUAGE EVENTS
===================================== */

languageButtons.forEach(button => {

    button.addEventListener("click", () => {

        changeLanguage(
            button.dataset.lang
        );

    });

});


/* =====================================
   THEME
===================================== */

let savedTheme =
    localStorage.getItem("aeris-theme") || "dark";


function applyTheme(theme) {

    document.body.classList.toggle(
        "light",
        theme === "light"
    );


    themeBtn.textContent =
        theme === "light"
            ? "🌙"
            : "☀️";


    localStorage.setItem(
        "aeris-theme",
        theme
    );

}


themeBtn.addEventListener("click", () => {

    const newTheme =
        document.body.classList.contains("light")
            ? "dark"
            : "light";

    applyTheme(newTheme);

});


applyTheme(savedTheme);


/* =====================================
   WEATHER CODES
===================================== */

function getWeatherInfo(code) {

    const t = translations[currentLanguage];


    if (code === 0) {

        return {
            text: t.clear,
            icon: "☀️"
        };

    }


    if (code === 1) {

        return {
            text: t.mainlyClear,
            icon: "🌤️"
        };

    }


    if (code === 2) {

        return {
            text: t.partlyCloudy,
            icon: "⛅"
        };

    }


    if (code === 3) {

        return {
            text: t.cloudy,
            icon: "☁️"
        };

    }


    if (code === 45 || code === 48) {

        return {
            text: t.fog,
            icon: "🌫️"
        };

    }


    if (code >= 51 && code <= 57) {

        return {
            text: t.drizzle,
            icon: "🌦️"
        };

    }


    if (code >= 61 && code <= 67) {

        return {
            text: t.rain,
            icon: "🌧️"
        };

    }


    if (code >= 71 && code <= 77) {

        return {
            text: t.snow,
            icon: "❄️"
        };

    }


    if (code >= 80 && code <= 82) {

        return {
            text: t.rain,
            icon: "🌧️"
        };

    }


    if (code >= 95) {

        return {
            text: t.storm,
            icon: "⛈️"
        };

    }


    return {
        text: t.cloudy,
        icon: "🌡️"
    };

}


/* =====================================
   GET LOCATION
===================================== */

async function getLocation(cityName) {

    const url =
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`;


    const response =
        await fetch(url);


    if (!response.ok) {
        throw new Error();
    }


    const data =
        await response.json();


    if (!data.results || !data.results.length) {
        throw new Error("NOT_FOUND");
    }


    return data.results[0];

}


/* =====================================
   GET WEATHER
===================================== */

async function getWeather(latitude, longitude) {

    const url =
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
        `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m` +
        `&hourly=temperature_2m,weather_code` +
        `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
        `&timezone=auto&forecast_days=7`;


    const response =
        await fetch(url);


    if (!response.ok) {
        throw new Error();
    }


    return await response.json();

}


/* =====================================
   SEARCH
===================================== */

async function searchWeather() {

    const cityName =
        cityInput.value.trim();


    if (!cityName) {

        cityInput.focus();

        return;

    }


    loading.classList.remove("hidden");

    weather.classList.add("hidden");

    errorBox.textContent = "";


    try {

        const location =
            await getLocation(cityName);


        const data =
            await getWeather(
                location.latitude,
                location.longitude
            );


        lastLocation = location;

        lastWeatherData = data;


        displayWeather(
            location,
            data
        );


    } catch (error) {

        const t =
            translations[currentLanguage];


        errorBox.textContent =
            error.message === "NOT_FOUND"
                ? t.notFound
                : t.error;


    } finally {

        loading.classList.add("hidden");

    }

}

function useMyLocation() {

    if (!navigator.geolocation) {

        errorBox.textContent =
            translations[currentLanguage].locationError;

        return;
    }

    loading.classList.remove("hidden");
    weather.classList.add("hidden");
    errorBox.textContent = "";

    const oldText =
        locationBtn.querySelector("[data-i18n]");

    oldText.textContent =
        translations[currentLanguage].locationLoading;


    navigator.geolocation.getCurrentPosition(

        async position => {

            try {

                cityInput.value = "";

                const latitude =
                    position.coords.latitude;

                const longitude =
                    position.coords.longitude;


                // Ob-havoni olish
                const data =
                    await getWeather(
                        latitude,
                        longitude
                    );


                // Koordinatalardan shahar nomini olish
                const locationResponse =
                    await fetch(
                        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
                    );


                if (!locationResponse.ok) {
                    throw new Error("Location lookup failed");
                }


                const locationData =
                    await locationResponse.json();


                const location = {

                    name:
                        locationData.city ||
                        locationData.locality ||
                        locationData.principalSubdivision ||
                        "My Location",

                    country:
                        locationData.countryName ||
                        "",

                    latitude,
                    longitude

                };


                lastLocation =
                    location;

                lastWeatherData =
                    data;


                displayWeather(
                    location,
                    data
                );


            } catch (error) {

                console.error(
                    "LOCATION ERROR:",
                    error
                );

                errorBox.textContent =
                    translations[currentLanguage].error;

            } finally {

                loading.classList.add("hidden");

                oldText.textContent =
                    translations[currentLanguage].useLocation;

            }

        },


        error => {

            console.error(
                "GEOLOCATION ERROR:",
                error
            );

            loading.classList.add("hidden");

            errorBox.textContent =
                translations[currentLanguage].locationError;

            oldText.textContent =
                translations[currentLanguage].useLocation;

        },


        {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 300000
        }

    );

}

/* =====================================
   DISPLAY WEATHER
===================================== */

function displayWeather(location, data) {

    const current = data.current;
    const daily = data.daily;
    displayHourlyWeather(data);
    currentTimezone = data.timezone;
    currentClockCity = location.name;

updateLiveClock();

    setWeatherBackground(
        current.weather_code
    );


    city.textContent =
        location.name;


    country.textContent =
        location.country || "";


    const today =
        new Date(current.time);


    const days = {

        uz: [
            "Yakshanba",
            "Dushanba",
            "Seshanba",
            "Chorshanba",
            "Payshanba",
            "Juma",
            "Shanba"
        ],

        en: [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
        ],

        ru: [
            "Воскресенье",
            "Понедельник",
            "Вторник",
            "Среда",
            "Четверг",
            "Пятница",
            "Суббота"
        ]

    };


    const dayName =
        days[currentLanguage][today.getDay()];


    date.textContent =
        `${today.getMonth() + 1}/${today.getDate()}, ${dayName}`;


    temperature.textContent =
        Math.round(current.temperature_2m);


    feels.textContent =
        `${Math.round(current.apparent_temperature)}°C`;


    humidity.textContent =
        `${current.relative_humidity_2m}%`;


    wind.textContent =
        `${Math.round(current.wind_speed_10m)} km/h`;


    const info =
        getWeatherInfo(
            current.weather_code
        );


    weatherIcon.textContent =
        info.icon;


    condition.textContent =
        info.text;


    forecast.innerHTML = "";


    daily.time.forEach(
        (day, index) => {

            const info =
                getWeatherInfo(
                    daily.weather_code[index]
                );


            const dateObject =
                new Date(`${day}T12:00:00`);


            const forecastDay =
                days[currentLanguage][dateObject.getDay()];


            const item =
                document.createElement("div");


            item.className =
                "forecast-item";


            item.classList.add(
                "min-w-0",
                "rounded-[14px]",
                "border",
                "border-white/[.09]",
                "bg-white/[.02]",
                "p-[17px_10px]",
                "text-center",
                "transition-all",
                "duration-300",
                "hover:-translate-y-[5px]",
                "hover:border-[#72d9ff]/30",
                "hover:bg-[#72d9ff]/[.045]",
                "hover:shadow-[0_15px_30px_rgba(0,0,0,.2)]",
                "max-[700px]:min-w-[90px]",
                "max-[500px]:min-w-[85px]"
            );


            item.innerHTML = `

                <div
                    class="
                        forecast-day
                        text-[9px]
                        text-[#8490a8]
                    "
                >
                    ${forecastDay}
                </div>

                <div
                    class="
                        forecast-icon
                        my-[10px]
                        text-[25px]
                    "
                >
                    ${info.icon}
                </div>

                <div
                    class="
                        forecast-temp
                        text-sm
                        font-bold
                    "
                >
                    ${Math.round(
                        daily.temperature_2m_max[index]
                    )}°
                </div>

            `;


            forecast.appendChild(item);

        }
    );


    weather.classList.remove("hidden");

}


/* =====================================
   EVENTS
===================================== */

searchBtn.addEventListener(
    "click",
    searchWeather
);

locationBtn.addEventListener(
    "click",
    useMyLocation
);

cityInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {
            searchWeather();
        }

    }
);


/* =====================================
   INITIALIZE
===================================== */

changeLanguage(currentLanguage);

cityInput.value = "Samarkand";

searchWeather();


/* =====================================
   DYNAMIC WEATHER BACKGROUND
===================================== */

function setWeatherBackground(code) {

    document.body.classList.remove(
        "weather-clear",
        "weather-cloudy",
        "weather-rain",
        "weather-snow",
        "weather-storm",
        "weather-fog"
    );


    removeWeatherEffect();


    if (code === 0 || code === 1) {

        document.body.classList.add(
            "weather-clear"
        );

        createSunEffect();

    }


    else if (code === 2 || code === 3) {

        document.body.classList.add(
            "weather-cloudy"
        );

        createCloudEffect();

    }


    else if (code === 45 || code === 48) {

        document.body.classList.add(
            "weather-fog"
        );

        createFogEffect();

    }


    else if (
        (code >= 51 && code <= 67) ||
        (code >= 80 && code <= 82)
    ) {

        document.body.classList.add(
            "weather-rain"
        );

        createRainEffect();

    }


    else if (code >= 71 && code <= 77) {

        document.body.classList.add(
            "weather-snow"
        );

        createSnowEffect();

    }


    else if (code >= 95) {

        document.body.classList.add(
            "weather-storm"
        );

        createRainEffect();

        createLightningEffect();

    }

}


/* =====================================
   REMOVE EFFECT
===================================== */

function removeWeatherEffect() {

    document.querySelectorAll(
        ".weather-particles, .weather-sun, .weather-clouds, .weather-fog-layer, .lightning"
    ).forEach(element => {

        element.remove();

    });

}


/* =====================================
   SUN
===================================== */

function createSunEffect() {

    const sun =
        document.createElement("div");

    sun.className =
        "weather-sun";

    document.body.appendChild(sun);

}


/* =====================================
   CLOUDS
===================================== */

function createCloudEffect() {

    const clouds =
        document.createElement("div");

    clouds.className =
        "weather-clouds";


    for (let i = 0; i < 5; i++) {

        const cloud =
            document.createElement("span");


        cloud.style.left =
            `${Math.random() * 100}%`;


        cloud.style.top =
            `${10 + Math.random() * 40}%`;


        cloud.style.animationDelay =
            `${Math.random() * 8}s`;


        clouds.appendChild(cloud);

    }


    document.body.appendChild(clouds);

}


/* =====================================
   RAIN
===================================== */

function createRainEffect() {

    const container =
        document.createElement("div");


    container.className =
        "weather-particles rain-particles";


    for (let i = 0; i < 100; i++) {

        const drop =
            document.createElement("span");


        drop.className =
            "rain-drop";


        drop.style.left =
            `${Math.random() * 100}%`;


        drop.style.animationDuration =
            `${0.5 + Math.random() * 0.7}s`;


        drop.style.animationDelay =
            `${Math.random() * 2}s`;


        drop.style.opacity =
            `${0.15 + Math.random() * 0.5}`;


        container.appendChild(drop);

    }


    document.body.appendChild(container);

}


/* =====================================
   SNOW
===================================== */

function createSnowEffect() {

    const container =
        document.createElement("div");


    container.className =
        "weather-particles snow-particles";


    for (let i = 0; i < 70; i++) {

        const snow =
            document.createElement("span");


        snow.className =
            "snow-flake";


        const size =
            3 + Math.random() * 7;


        snow.style.width =
            `${size}px`;


        snow.style.height =
            `${size}px`;


        snow.style.left =
            `${Math.random() * 100}%`;


        snow.style.animationDuration =
            `${5 + Math.random() * 8}s`;


        snow.style.animationDelay =
            `${Math.random() * 5}s`;


        snow.style.opacity =
            `${0.3 + Math.random() * 0.7}`;


        container.appendChild(snow);

    }


    document.body.appendChild(container);

}


/* =====================================
   FOG
===================================== */

function createFogEffect() {

    const fog =
        document.createElement("div");


    fog.className =
        "weather-fog-layer";


    document.body.appendChild(fog);

}


/* =====================================
   LIGHTNING
===================================== */

function createLightningEffect() {

    const lightning =
        document.createElement("div");


    lightning.className =
        "lightning";


    document.body.appendChild(lightning);

}
// ===============================
// LIVE CLOCK
// ===============================

let currentTimezone = "Asia/Samarkand";
let currentClockCity = "SAMARKAND";

function updateLiveClock() {
    const now = new Date();

    const time = new Intl.DateTimeFormat("en-GB", {
        timeZone: currentTimezone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    }).format(now);

    // Shaharning timezone bo'yicha sana
    const dateParts = new Intl.DateTimeFormat("en-GB", {
        timeZone: currentTimezone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).formatToParts(now);

    const day = dateParts.find(part => part.type === "day").value;
    const month = dateParts.find(part => part.type === "month").value;

    // Haftaning kunini timezone bo'yicha aniqlash
    const weekdayNumber = new Intl.DateTimeFormat("en-US", {
        timeZone: currentTimezone,
        weekday: "long"
    }).format(now);

    const uzDays = {
        Monday: "DUSHANBA",
        Tuesday: "SESHANBA",
        Wednesday: "CHORSHANBA",
        Thursday: "PAYSHANBA",
        Friday: "JUMA",
        Saturday: "SHANBA",
        Sunday: "YAKSHANBA"
    };

    const uzMonths = {
        "01": "YANVAR",
        "02": "FEVRAL",
        "03": "MART",
        "04": "APREL",
        "05": "MAY",
        "06": "IYUN",
        "07": "IYUL",
        "08": "AVGUST",
        "09": "SENTABR",
        "10": "OKTABR",
        "11": "NOYABR",
        "12": "DEKABR"
    };

    let date;

    if (currentLanguage === "uz") {
        date = `${day} ${uzMonths[month]}, ${uzDays[weekdayNumber]}`;
    } else {
        date = new Intl.DateTimeFormat(
            currentLanguage === "ru"
                ? "ru-RU"
                : "en-US",
            {
                timeZone: currentTimezone,
                weekday: "short",
                month: "short",
                day: "numeric"
            }
        ).format(now);
    }

    document.getElementById("liveClock").textContent = time;

    document.getElementById("clockDate").textContent =
        date.toUpperCase();

    document.getElementById("clockCity").textContent =
        currentClockCity.toUpperCase();
}

setInterval(updateLiveClock, 1000);

/* =====================================
   HOURLY WEATHER
===================================== */

function displayHourlyWeather(data) {

    const container =
        document.getElementById("hourlyWeather");

    if (!container || !data.hourly) return;

    const hourly = data.hourly;

    container.innerHTML = "";


    /* HOZIRGI SOATNI TOPISH */

    const currentTime =
        new Date(data.current.time);

    const currentHour =
        currentTime.getHours();


    let startIndex =
        hourly.time.findIndex(time => {

            const hour =
                new Date(time).getHours();

            return hour === currentHour;

        });


    if (startIndex === -1) {
        startIndex = 0;
    }


    /* 12 SOAT */

    for (
        let i = startIndex;
        i < startIndex + 12;
        i++
    ) {

        if (!hourly.time[i]) break;


        const time =
            new Date(hourly.time[i]);


        const hour =
            time
                .getHours()
                .toString()
                .padStart(2, "0");


        const temp =
            Math.round(
                hourly.temperature_2m[i]
            );


        const weatherCode =
            hourly.weather_code[i];


        const info =
            getWeatherInfo(weatherCode);


        const isNow =
            i === startIndex;


        const item =
            document.createElement("div");


        item.className =
            "hourly-item";


        item.innerHTML = `

            <div class="hourly-time">
                ${
                    isNow
                        ? translations[currentLanguage].now
                        : `${hour}:00`
                }
            </div>

            <div class="hourly-icon">
                ${info.icon}
            </div>

            <div class="hourly-temp">
                ${temp}°
            </div>

        `;


        container.appendChild(item);

    }

}