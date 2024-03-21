
const API_KEY = '18b87672859544c29ea225822242003';

// list of weather statistics
// - temperature, feels like
// - sunrise, sunset, chance of rain, humidity, wind
// - visibility, UV index
async function getWeatherData(location) {
    const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${location}`);
    return response.json();
}

function testAPI() {
    const default_location = 'Pittsburgh';
    getWeatherData(default_location)
        .then(function(weather_data) {
            // use the location data to update the left side display
            const location_data = weather_data.location;
            updateLocalityDisplay(location_data);

            // use the current weather data to update the right side display
            const curr_weather = weather_data.current;
            updateWeatherDisplay(curr_weather);
        })
        .catch(function(err) {
            console.log(err);
        });
}

function updateLocalityDisplay(location_data) {
    // DOM references
    const city_info = document.querySelector('.city-info');

    // create a heading with the city, region, and country
    const city_heading = document.createElement('h1');
    city_heading.textContent = `${location_data.name}, ${location_data.region}, ${location_data.country}`

    // create div to hold the local date and time
    const date_time_container = document.createElement('div');
    date_time_container.textContent = location_data.localtime;

    // append both to the city_info container
    city_info.appendChild(city_heading);
    city_info.appendChild(date_time_container);
}

function updateWeatherDisplay(current_weather) {
    // DOM references 
    const info_grid = document.querySelector('.info-grid');

    const invalid_props = [
        'last_updated_epoch', 'last_updated', 'temp_c', 'is_day', 'condition',
        'wind_kph', 'wind_degree', 'pressure_mb', 'precip_mm', 'cloud',
        'feelslike_c', 'vis_km', 'gust_kph', 'gust_mph'
    ];

    // create a info item for each property contained within the current weather object
    for (const prop in current_weather) {
        // exclude those properties not containing weather info
        if (!invalid_props.includes(prop)) {
            // create a div to display the info for each weather property
            const weather_info = document.createElement('div');
            weather_info.classList.add('info-item');
            weather_info.textContent = `${prop}: ${current_weather[prop]}`;

            // append the weather info item to the info grid
            info_grid.appendChild(weather_info);
        }
    }
}

testAPI();