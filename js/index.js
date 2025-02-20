document.addEventListener("DOMContentLoaded", () => {
  const AQI_API_KEY = "705cdb3875464cc7a11192820252002"; // Your AQI API key
  let typingTimer;
  const typingDelay = 800;

  // Fetch AQI data by city name
  const fetchAQI = async (query) => {
      if (!query) return;

      try {
          const response = await fetch(
              `https://api.weatherapi.com/v1/current.json?key=${AQI_API_KEY}&q=${query}&aqi=yes`
          );
          const data = await response.json();

          if (!data || !data.location || !data.current.air_quality) {
              throw new Error("City not found");
          }

          const { name: cityName } = data.location;
          const { pm2_5, pm10, co, so2, no2, o3 } = data.current.air_quality;
          const aqi = pm2_5; // Using PM2.5 as AQI (Adjust if needed)

          const aqiStatus = getAirQualityStatus(aqi);
          updateAirPollutionData({
              cityName,
              aqi,
              aqiStatus,
              pm10,
              pm25: pm2_5,
              co,
              so2,
              no2,
              o3,
          });
      } catch (error) {
          console.error("Error fetching AQI data:", error);
      }
  };

  // Fetch AQI using Geolocation
  const fetchAQIByLocation = async (latitude, longitude) => {
      try {
          const response = await fetch(
              `https://api.weatherapi.com/v1/current.json?key=${AQI_API_KEY}&q=${latitude},${longitude}&aqi=yes`
          );
          const data = await response.json();

          if (!data || !data.location || !data.current.air_quality) {
              throw new Error("Location data unavailable");
          }

          const { name: cityName } = data.location;
          const { pm2_5, pm10, co, so2, no2, o3 } = data.current.air_quality;
          const aqi = pm2_5; 

          const aqiStatus = getAirQualityStatus(aqi);
          updateAirPollutionData({
              cityName,
              aqi,
              aqiStatus,
              pm10,
              pm25: pm2_5,
              co,
              so2,
              no2,
              o3,
          });

      } catch (error) {
          console.error("Error fetching AQI data by location:", error);
          fetchAQI("New York");
      }
  };

  // Get Air Quality Status
  const getAirQualityStatus = (aqi) => {
      if (aqi <= 50) return "Good";
      if (aqi <= 100) return "Moderate";
      if (aqi <= 150) return "Unhealthy for Sensitive Groups";
      if (aqi <= 200) return "Unhealthy";
      if (aqi <= 300) return "Very Unhealthy";
      return "Hazardous";
  };

  // Update UI with AQI Data
  const updateAirPollutionData = ({ cityName, aqi, aqiStatus, pm10, pm25, co, so2, no2, o3 }) => {
    document.getElementById("aqicity").textContent = cityName;
    document.getElementById("aqi-value").textContent = aqi;
    document.getElementById("air-quality-status").textContent = aqiStatus;

    document.getElementById("pm25-value").textContent = pm25.toFixed(1) + " µg/m³";
    document.getElementById("pm").textContent = pm25.toFixed(1) + " µg/m³";
    document.getElementById("pm10-value").textContent = pm10.toFixed(1) + " µg/m³";
    document.getElementById("pm10").textContent = pm10.toFixed(1) + " µg/m³";
    document.getElementById("co-value").textContent = co.toFixed(1) + " ppb";
    document.getElementById("so2-value").textContent = so2.toFixed(1) + " ppb";
    document.getElementById("no2-value").textContent = no2.toFixed(1) + " ppb";
    document.getElementById("o3-value").textContent = o3.toFixed(1) + " ppb";

    const aqiValueElement = document.getElementById("aqi-value");
    const background = document.getElementById("air-quality");
    const statusBox = document.getElementById("Statusbox");
    const statusTextElement = document.getElementById("air-quality-status");
    const dynamicImgContainer = document.getElementById("dynamicimg");

    // Remove previous classes
    ["text-green-800", "text-yellow-800", "text-orange-800", "text-red-800", "text-purple-800", "text-rose-800"].forEach(cls => {
        aqiValueElement.classList.remove(cls);
        statusTextElement.classList.remove(cls);
    });

    ["bg-green-300", "bg-yellow-300", "bg-orange-300", "bg-red-300", "bg-purple-300", "bg-rose-300"].forEach(cls => {
        statusBox.classList.remove(cls);
    });

    let backgroundColor, statusBoxColor, textColor, imageSrc;

    if (aqi <= 50) {
        textColor = "text-green-800";
        backgroundColor = "#E3F4D7";
        statusBoxColor = "bg-green-300";
        imageSrc = "./imgs/boy-img/good-aqi-level.svg";
    } else if (aqi <= 100) {
        textColor = "text-yellow-800";
        backgroundColor = "#FAF1C8";
        statusBoxColor = "bg-yellow-300";
        imageSrc = "./imgs/boy-img/moderate-aqi-level.svg";
    } else if (aqi <= 150) {
        textColor = "text-orange-800";
        backgroundColor = "#FCE0D1";
        statusBoxColor = "bg-orange-300";
        imageSrc = "./imgs/boy-img/unhealthy-sensitive.svg";
    } else if (aqi <= 200) {
        textColor = "text-red-800";
        backgroundColor = "#F8D4D4";
        statusBoxColor = "bg-red-300";
        imageSrc = "./imgs/boy-img/unhealthy.svg";
    } else if (aqi <= 300) {
        textColor = "text-purple-800";
        backgroundColor = "#E7D3E9";
        statusBoxColor = "bg-purple-300";
        imageSrc = "./imgs/boy-img/very-unhealthy.svg";
    } else {
        textColor = "text-rose-800";
        backgroundColor = "#F4C4C4";
        statusBoxColor = "bg-rose-300";
        imageSrc = "./imgs/boy-img/hazardous.svg";
    }

    // Apply styles
    aqiValueElement.classList.add(textColor);
    statusTextElement.classList.add(textColor);
    background.style.background = backgroundColor;
    statusBox.classList.add(statusBoxColor);

    // **Fix: Dynamically update image using innerHTML**
    dynamicImgContainer.innerHTML = `<img src="${imageSrc}" alt="AQI Level" class="mt-6 h-48">`;
};


  // Detect User Location
  const detectUserLocation = () => {
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
              (position) => {
                  fetchAQIByLocation(position.coords.latitude, position.coords.longitude);
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

  // Search Input Event
  const searchInput = document.getElementById("search");
  searchInput.addEventListener("input", () => {
      clearTimeout(typingTimer);
      const searchValue = searchInput.value.trim();
      if (searchValue.length > 2) {
          typingTimer = setTimeout(() => fetchAQI(searchValue), typingDelay);
      }
  });

  // Initialize
  detectUserLocation();
});
pm