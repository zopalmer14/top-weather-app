
const API_KEY = '18b87672859544c29ea225822242003';

// list of weather statistics
// - temperature, feels like
// - sunrise, sunset, chance of rain, humidity, wind
// - visibility, UV index
async function getWeatherData(location) {
    const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${location}`);
    return response.json();
}

async function getForecastData(location) {
    const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${location}`);
    return response.json();
}

function testAPI() {
    const default_location = 'Pittsburgh';
    /* getWeatherData(default_location)
        .then(function(weather_data) {
            // use the location data to update the city info display
            const location_data = weather_data.location;
            updateLocalityDisplay(location_data);

            // use the current weather data to update the right side of the weather display
            const curr_weather = weather_data.current;
            updateWeatherDisplay(curr_weather);
        })
        .catch(function(err) {
            console.log(err);
        }); */

    getForecastData(default_location)
        .then(function(forecast_data) {
            //debug
            console.log(forecast_data);

            // use the location data to update the city info display
            const location_data = forecast_data.location;
            updateLocalityDisplay(location_data);

            // use the current weather data to update the weather display
            const curr_weather = forecast_data.current;
            updateWeatherGrid(curr_weather);
            updateWeatherOverview(curr_weather);
            
            // use the hourly forecast data to update the hourly forecast at the bottom of the page
            const hourly_forecast = forecast_data.forecast.forecastday[0].hour;
            const curr_time = curr_weather.last_updated;
            updateHourlyDisplay(hourly_forecast, curr_time);
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
    city_heading.textContent = `${location_data.name}, ${location_data.country}`

    // create div to hold the local date and time
    const date_time_container = document.createElement('div');
    date_time_container.textContent = location_data.localtime;

    // append both to the city_info container
    city_info.appendChild(city_heading);
    city_info.appendChild(date_time_container);
}

function updateWeatherGrid(current_weather) {
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
            // create a container div 
            const info_item = document.createElement('div');
            info_item.classList.add('info-item');

            // create a heading for the property name
            const api_prop = document.createElement('h2');
            api_prop.textContent = prop;

            // create a div to hold the data value
            const api_data = document.createElement('div');
            api_data.textContent = current_weather[prop];

            // append the heading and data to the info item
            info_item.appendChild(api_prop);
            info_item.appendChild(api_data);

            // append the info item to the info grid
            info_grid.appendChild(info_item);
        }
    }
}

function updateWeatherOverview(current_weather) {
    // DOM references 
    const info_overview = document.querySelector('.info-overview');

    // create the display
    createOverview(info_overview, current_weather);

    // create an img to display the weather condition icon
    /* const weather_img = document.createElement('img');
    weather_img.src = current_weather.condition.icon; */

    // append all of them to the info overview
    //info_overview.appendChild(weather_img);
}

// helper function to make weather overview display
function createOverview(overview_container, weather_data) {
    // create a h1 to display the current temperature
    const curr_temp = document.createElement('h2');
    curr_temp.textContent = weather_data.temp_f;

    // create a h2 to state the weather condition
    const weather_condition = document.createElement('h3');
    weather_condition.textContent = weather_data.condition.text;

    // create a h3 to hold the feels like
    const feels_like_temp = document.createElement('h3');
    feels_like_temp.textContent = weather_data.feelslike_f;

    // append all of them to the overview container
    overview_container.appendChild(curr_temp);
    overview_container.appendChild(weather_condition);
    overview_container.appendChild(feels_like_temp);
}

function updateHourlyDisplay(hourly_forecast, curr_time) {
    // DOM references 
    const hourly_display = document.querySelector('.hourly-display');

    console.log(hourly_forecast);
    console.log(curr_time);

    // filter the hourly fore_cast to show the seven entries after the current time
    const filtered_forecast = hourly_forecast.filter((hour_info) => hour_info.time > curr_time);
    console.log(filtered_forecast);
    const num_hours_to_display = Math.min(7, filtered_forecast.length);

    // iterate the forecast hours
    for (let i = 0; i < num_hours_to_display; i++) {
        const hour_info = filtered_forecast[i];

        // create a container to hold the hourly weather overview
        const hourly_overview = document.createElement('div');

        // create a h2 to display the time/hour and append to the overview
        const time_info = document.createElement('h1');
        time_info.textContent = hour_info.time.split(' ')[1];
        hourly_overview.appendChild(time_info);

        // add the content and append the hourly overview to the display
        createOverview(hourly_overview, hour_info);
        hourly_display.appendChild(hourly_overview);
    }
}

testAPI();