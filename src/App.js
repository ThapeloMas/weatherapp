import { useState, useEffect } from "react";
import Search from "./components/search/Search";
import CurrentWeather from "./components/current-weather/Current-weather";
import Forecast from "./components/forecast/Forecast";
import { WEATHER_API_URL, WEATHER_API_KEY } from "./Api";
import "./App.css";

function App() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [searchedCities, setSearchedCities] = useState([]);
  const [locationWeather, setLocationWeather] = useState(null);

  useEffect(() => {
    getCurrentLocationWeather();
  }, []);

  const getCurrentLocationWeather = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;

        fetch(
          `${WEATHER_API_URL}/weather?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=metric`
        )
          .then((response) => response.json())
          .then((data) => {
            setLocationWeather(data);
          })
          .catch(console.log);
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };

  const handleOnSearchChange = (searchData) => {
    const [lat, lon] = searchData.value.split(" ");

    const currentWeatherFetch = fetch(
      `${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    );
    const forecastFetch = fetch(
      `${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    );

    Promise.all([currentWeatherFetch, forecastFetch])
      .then(async (response) => {
        const weatherResponse = await response[0].json();
        const forecastResponse = await response[1].json();

        const cityWeather = {
          city: searchData.label,
          currentWeather: weatherResponse,
          forecast: forecastResponse,
        };

        setCurrentWeather({ city: searchData.label, ...weatherResponse });
        setForecast({ city: searchData.label, ...forecastResponse });
        setSearchedCities((prevCities) => [...prevCities, cityWeather]);
      })
      .catch(console.log);
  };

  return (
    <div className="containers">
      <div className="current-location-weathers">
        {locationWeather && (
          <div>
            <h2 >Current Location</h2>
            <CurrentWeather data={locationWeather} />
          </div>
        )}
      </div>
      <br></br>
      <Search onSearchChange={handleOnSearchChange} />
      <br></br>
      <button className="btn" onClick={() => setSearchedCities([])}>Clear Search</button>
      {searchedCities.map((city, index) => (
        <div key={index}>
          <h2>{city.city}</h2>
          <CurrentWeather data={city.currentWeather} />
          <Forecast data={city.forecast} />
        </div>
      ))}
    </div>
  );
}

export default App;
