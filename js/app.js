

document.addEventListener("DOMContentLoaded", () => {
    const API_KEY = "2fbaf4d7fa9846f08dc33008252601";
  
    const fetchWeather = async (query) => {
      try {
        const raw = await fetch(
          `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${query}&aqi=yes`
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
          `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${query}&days=1&aqi=no&alerts=no`
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
    const API_KEY = "2fbaf4d7fa9846f08dc33008252601";
  
    // Fetch and display 7-day forecast
    const fetch7DayForecast = async (query) => {
      try {
        const response = await fetch(
          `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${query}&days=7&aqi=no&alerts=no`
        );
        const data = await response.json();
  
        // Extract the forecast data
        const { forecast: { forecastday } } = data;
  
        // Update UI for 7-day forecast
        update7DayForecast(forecastday);
      } catch (error) {
        console.error("Error fetching 7-day forecast:", error);
      }
    };
  
    const update7DayForecast = (forecastData) => {
      const forecastContainer = document.querySelector(".flex.flex-col.gap-4.text-white");
  
      // Clear previous forecast data
      forecastContainer.innerHTML = "";
  
      // Iterate over forecast data and populate UI
      forecastData.forEach((day) => {
        const { date, day: { condition: { text: weather, icon }, maxtemp_c, mintemp_c } } = day;
  
        // Create forecast item
        const forecastItem = document.createElement("div");
        forecastItem.classList.add("flex", "justify-between", "items-center");
  
        forecastItem.innerHTML = `
          <p class="text-sm">${new Date(date).toLocaleDateString("en-US", {
            weekday: "short",
          })}</p>
          <div class="flex items-center gap-2">
            <img src="https:${icon}" alt="${weather}" class="w-6 h-6">
            <span class="font-bold">${weather}</span>
          </div>
          <p class="text-sm">${Math.round(maxtemp_c)}°/${Math.round(mintemp_c)}°</p>
        `;
  
        forecastContainer.appendChild(forecastItem);
      });
    };
  
    // Reuse detectUserLocation to call fetch7DayForecast
    const detectUserLocationForForecast = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const query = `${latitude},${longitude}`; // Use latitude and longitude for API
            fetch7DayForecast(query);
          },
          (error) => {
            console.error("Error getting location for forecast:", error.message);
            // Show default city forecast if location permission denied
            fetch7DayForecast("New York");
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
        // Show default city forecast if geolocation is unavailable
        fetch7DayForecast("New York");
      }
    };
  
    // Detect user location and fetch 7-day forecast on page load 
    detectUserLocationForForecast();
  });
  
  
 

  