

document.addEventListener("DOMContentLoaded", () => {
    const API_KEY = "2fbaf4d7fa9846f08dc33008252601";
  
    const fetchWeather = async (query) => {
      try {
        const raw = await fetch(
          `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${query}&aqi=yes`
        );
        const data = await raw.json();
  
        const {
          location: { name: cityName, country },
          current: {
            temp_c: temperature,
            condition: { text: weather, icon },
            wind_kph,
            uv,
            precip_mm,
          },
        } = data;
  
        updateWeatherData(cityName, country, temperature, weather, icon);
        updateAirConditions(wind_kph, uv, precip_mm);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };
  
    const fetchTodayForecast = async (query) => {
      try {
        const raw = await fetch(
          `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${query}&days=1&aqi=no&alerts=no`
        );
        const data = await raw.json();
        const { forecast: { forecastday } } = data;
  
        const todayHours = forecastday[0].hour;
        updateTodayForecast(todayHours);
      } catch (error) {
        console.error("Error fetching today's forecast:", error);
      }
    };
  
    const updateWeatherData = (cityName, country, temperature, weather, icon) => {
      document.getElementById("city-name").textContent = `${cityName}, ${country}`;
      document.getElementById("current-temp").textContent = `${temperature}°C`;
      document.getElementById("rain-chance").textContent = `Current Weather: ${weather}`;
  
      const iconElement = document.getElementById("current-icon");
      iconElement.style.backgroundImage = `url(${icon})`;
      iconElement.style.backgroundSize = "cover";
    };
  
    const updateTodayForecast = (hours) => {
      const forecastTimes = [
        { time: "6am", hour: 6 },
        { time: "9am", hour: 9 },
        { time: "12pm", hour: 12 },
        { time: "3pm", hour: 15 },
        { time: "6pm", hour: 18 },
        { time: "9pm", hour: 21 },
      ];
  
      forecastTimes.forEach(({ time, hour }) => {
        const hourData = hours[hour];
        const temp = `${hourData.temp_c}°C`;
        const icon = hourData.condition.icon;
  
        document.getElementById(`temp-${time}`).textContent = temp;
        document.getElementById(`icon-${time}`).src = icon;
      });
    };
  
    const updateAirConditions = (windSpeed, uvIndex, rainChance) => {
      document.getElementById("wind-speed").textContent = `${windSpeed} km/h`;
      document.getElementById("uv-index").textContent = uvIndex;
      document.getElementById("rain-chance").textContent = `${rainChance}%`;
    };
  
    const detectUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const query = `${latitude},${longitude}`;
            fetchWeather(query);
            fetchTodayForecast(query);
          },
          (error) => {
            console.error("Error getting location:", error.message);
            fetchWeather("New York");
            fetchTodayForecast("New York");
          }
        );
      } else {
        fetchWeather("New York");
        fetchTodayForecast("New York");
      }
    };
  
    const searchInput = document.getElementById("search");
    searchInput.addEventListener("input", (e) => {
      const searchValue = e.target.value.trim();
      if (searchValue) {
        fetchWeather(searchValue);
        fetchTodayForecast(searchValue);
      }
    });
  
    detectUserLocation();
  });
  
  document.addEventListener("DOMContentLoaded", () => {
    const API_KEY = "705cdb3875464cc7a11192820252002";
    
    // DOM Elements
    const forecastContainer = document.querySelector(".days-7 .flex.flex-col.gap-4");
    const hourlyContainer = document.querySelector(".grid.grid-cols-6.gap-4");

    // Fetch weather data
    async function fetchWeatherData(location) {
        try {
            const response = await fetch(
                `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${location}&days=7&aqi=no&alerts=no`
            );
            if (!response.ok) throw new Error('Weather API error');
            return await response.json();
        } catch (error) {
            console.error('Error fetching weather data:', error);
            return null;
        }
    }

    // Update 7-day forecast
    function update7DayForecast(forecastData) {
        forecastContainer.innerHTML = '';
        forecastData.forEach(day => {
            const date = new Date(day.date);
            const dayElement = document.createElement('div');
            dayElement.className = 'flex justify-between items-center';
            
            dayElement.innerHTML = `
                <p class="text-sm">${date.toLocaleDateString('en-US', { weekday: 'short' })}</p>
                <div class="flex items-center gap-2">
                    <img src="https:${day.day.condition.icon}" 
                         alt="${day.day.condition.text}" 
                         class="w-6 h-6">
                    <span class="font-bold">${day.day.condition.text}</span>
                </div>
                <p class="text-sm">${Math.round(day.day.maxtemp_c)}°/${Math.round(day.day.mintemp_c)}°</p>
            `;
            
            forecastContainer.appendChild(dayElement);
        });
    }

    // Update hourly forecast
    function updateHourlyForecast(hourlyData) {
        const timeSlots = ['6:00 AM', '9:00 AM', '12:00 PM', '3:00 PM', '6:00 PM', '9:00 PM'];
        
        hourlyData.slice(0, 6).forEach((hour, index) => {
            const timeSlot = document.querySelector(`#forecast-${timeSlots[index].replace(/[: ]/g, '').toLowerCase()}`);
            if (timeSlot) {
                timeSlot.querySelector('img').src = `https:${hour.condition.icon}`;
                timeSlot.querySelector('.text-lg').textContent = `${Math.round(hour.temp_c)}°`;
            }
        });
    }

    // Location handling
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async position => {
                    const data = await fetchWeatherData(
                        `${position.coords.latitude},${position.coords.longitude}`
                    );
                    if (data) {
                        update7DayForecast(data.forecast.forecastday);
                        updateHourlyForecast(data.forecast.forecastday[0].hour);
                    }
                },
                async error => {
                    console.log('Using default location');
                    const data = await fetchWeatherData("London");
                    if (data) {
                        update7DayForecast(data.forecast.forecastday);
                        updateHourlyForecast(data.forecast.forecastday[0].hour);
                    }
                }
            );
        } else {
            fetchWeatherData("London").then(data => {
                if (data) {
                    update7DayForecast(data.forecast.forecastday);
                    updateHourlyForecast(data.forecast.forecastday[0].hour);
                }
            });
        }
    }

    // Initial load
    getLocation();
});
  
  
 

  