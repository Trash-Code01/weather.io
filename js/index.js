
document.addEventListener("DOMContentLoaded", () => {
    const AQI_API_KEY = "3edbb90b09d443daaeea7dd1643e3d11"; // Your AQI API key
    let typingTimer; // Timer for debounce
    const typingDelay = 800; // Delay in milliseconds (0.8 sec)
  
    // Fetch AQI data by city name
    const fetchAQI = async (query) => {
      if (!query) return; // Prevent empty search requests
  
      try {
        const response = await fetch(
          `https://api.weatherbit.io/v2.0/current/airquality?city=${query}&key=${AQI_API_KEY}`
        );
        const data = await response.json();
  
        if (!data || !data.data || data.data.length === 0) {
          throw new Error("City not found");
        }
  
        // Destructure relevant data
        const {
          aqi, pm10, pm25, co, so2, no2, o3, city_name, // City Name
        } = data.data[0];
  
        // Determine AQI status
        const aqiStatus = getAirQualityStatus(aqi);
  
        // Update UI with all data
        updateAirPollutionData({
          cityName: city_name,
          aqi,
          aqiStatus, // Send AQI status to update UI
          pm10,
          pm25,
          co,
          so2,
          no2,
          o3,
        });
      } catch (error) {
        console.error("Error fetching AQI data:", error);
      }
    };
  
    const fetchAQIByLocation = async (latitude, longitude) => {
      try {
        const response = await fetch(
          `https://api.weatherbit.io/v2.0/current/airquality?lat=${latitude}&lon=${longitude}&key=${AQI_API_KEY}`
        );
        const data = await response.json();
    
        if (!data || !data.data || data.data.length === 0) {
          throw new Error("Location data unavailable");
        }
    
        // Extract city name from the root-level object
        const cityName = data.city_name || "Unknown City"; 
    
        // Extract AQI-related data from data.data[0]
        const {
          aqi, pm10, pm25, co, so2, no2, o3,
        } = data.data[0]; 
    
        const aqiStatus = getAirQualityStatus(aqi);
    
        // Update UI with all data
        updateAirPollutionData({
          cityName,
          aqi,
          aqiStatus,
          pm10,
          pm25,
          co,
          so2,
          no2,
          o3,
        });
    
      } catch (error) {
        console.error("Error fetching AQI data by location:", error);
        fetchAQI("New York"); // Default to New York if geolocation fails
      }
    };
    // Get Air Quality Status based on AQI value
    const getAirQualityStatus = (aqi) => {
      if (aqi <= 50) return "Good";
      if (aqi <= 100) return "Moderate";
      if (aqi <= 150) return "Unhealthy for Sensitive Groups";
      if (aqi <= 200) return "Unhealthy";
      if (aqi <= 300) return "Very Unhealthy";
      return "Hazardous";
    };
  
    // Update Air Pollution Data in UI
    const updateAirPollutionData = ({
      cityName,
      aqi,
      aqiStatus,
      pm10,
      pm25,
      co,
      so2,
      no2,
      o3,
    }) => {
      document.getElementById("aqicity").textContent =cityName;
      document.getElementById("aqi-value").textContent = aqi;
      document.getElementById("air-quality-status").textContent = aqiStatus;
     
      document.getElementById("pm25-value").textContent = pm25.toFixed(1) + " µg/m³";
      document.getElementById("pm10-value").textContent = pm10.toFixed(1) + " µg/m³";
      document.getElementById("PM10").textContent = pm10.toFixed(1) + " µg/m³";
      document.getElementById("co-value").textContent = co.toFixed(1) + " ppb";
      document.getElementById("so2-value").textContent = so2.toFixed(1) + " ppb";
      document.getElementById("no2-value").textContent = no2.toFixed(1) + " ppb";
      document.getElementById("o3-value").textContent = o3.toFixed(1) + " ppb";
      document.getElementById("pm").textContent = pm25.toFixed(1);

    // // Apply background color
    // background.style.background = backgroundColor;
    const aqiValueElement = document.getElementById("aqi-value");
    const background = document.getElementById("air-quality");
    const statusBox = document.getElementById("Statusbox");
    const statusTextElement = document.getElementById("air-quality-status");
    const boyImg=document.getElementById("dynamicimg");

    // Remove previous classes
    aqiValueElement.classList.remove(
        "text-green-800",
        "text-yellow-800",
        "text-orange-800",
        "text-red-800",
        "text-purple-800",
        "text-rose-800"
    );

    statusTextElement.classList.remove(
        "text-green-800",
        "text-yellow-800",
        "text-orange-800",
        "text-red-800",
        "text-purple-800",
        "text-rose-800"
    );

    statusBox.classList.remove(
        "bg-green-300",
        "bg-yellow-300",
        "bg-orange-300",
        "bg-red-300",
        "bg-purple-300",
        "bg-rose-300"
    );

    let backgroundColor = "#E3F4D7"; // Light Green
    let statusBoxColor = "bg-green-300";
    let statusText = "Good";
    let textColor = "text-green-800";

    if (aqi <= 50) {
        textColor = "text-green-800";
        backgroundColor = "#E3F4D7"; 
        statusBoxColor = "bg-green-300"; 
        statusText = "Good";
    } else if (aqi <= 100) {
        textColor = "text-yellow-800";
        backgroundColor = "#FAF1C8"; 
        statusBoxColor = "bg-yellow-300"; 
        statusText = "Moderate";
    } else if (aqi <= 150) {
        textColor = "text-orange-800";
        backgroundColor = "#FCE0D1"; 
        statusBoxColor = "bg-orange-300"; 
        statusText = "Unhealthy for Sensitive Groups";
    } else if (aqi <= 200) {
        textColor = "text-red-800";
        backgroundColor = "#F8D4D4"; 
        statusBoxColor = "bg-red-300"; 
        statusText = "Unhealthy";
    } else if (aqi <= 300) {
        textColor = "text-purple-800";
        backgroundColor = "#E7D3E9"; 
        statusBoxColor = "bg-purple-300"; 
        statusText = "Very Unhealthy";
    } else {
        textColor = "text-rose-800";
        backgroundColor = "#F4C4C4"; 
        statusBoxColor = "bg-rose-300"; 
        statusText = "Hazardous";
    }

//  changing Image acc to aqi level 

if (aqi >= 1 && aqi <= 60) {
    boyImg.innerHTML = `
        <img id="boy-img" src="./imgs/boy-img/good-aqi-level.svg" alt="Character" class="mt-6 h-48">
    `;
} else if (aqi >= 80 && aqi <= 240) {
    boyImg.innerHTML = `
        <img id="boy-img" src="./imgs/boy-img/moderate-aqi-level.svg" alt="Character" class="mt-6 h-48">
    `;
} else if (aqi >= 260 && aqi <= 400) {
    boyImg.innerHTML = `
        <img id="boy-img" src="./imgs/boy-img/hazardous-aqi-level.svg" alt="Character" class="mt-6 h-48">
    `;
} else {
    boyImg.innerHTML = `
    <img id="boy-img" src="./imgs/boy-img/moderate-aqi-level.svg" alt="Character" class="mt-6 h-48">
`;
}


    // Apply styles
    aqiValueElement.classList.add(textColor);
    statusTextElement.classList.add(textColor);
    background.style.background = backgroundColor;
    statusBox.classList.add(statusBoxColor);
    statusTextElement.textContent = statusText;
}
    // Detect User Location & Fetch AQI
    const detectUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            fetchAQIByLocation(latitude, longitude);
          },
          (error) => {
            console.error("Error getting location:", error.message);
            fetchAQI("New York");
          }
        );
      } else {
        console.error("Geolocation not supported.");
        fetchAQI("New York");
      }
    };
  
    // Automatically Fetch AQI While Typing (No Need to Press Enter)
    const searchInput = document.getElementById("search");
    searchInput.addEventListener("input", () => {
      clearTimeout(typingTimer);
      const searchValue = searchInput.value.trim();
      if (searchValue.length > 2) { // Fetch only if input is 3+ characters
        typingTimer = setTimeout(() => fetchAQI(searchValue), typingDelay);
      }
    });

    
  
    // Initialize on Page Load
    detectUserLocation();
  });
  