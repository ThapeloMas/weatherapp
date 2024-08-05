import React, { useState, useEffect } from "react";
import Search from "./components/search/Search";
import CurrentWeather from "./components/current-weather/Current-weather";
import Forecast from "./components/forecast/Forecast";
import { WEATHER_API_URL, WEATHER_API_KEY } from "./Api";
import axios from "axios";
import "./Weather.css";
import { Link } from "react-router-dom";

function Weather() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [searchedCities, setSearchedCities] = useState([]);
  const [locationWeather, setLocationWeather] = useState(null);

  useEffect(() => {
    getCurrentLocationWeather();
    fetchSavedWeather();
  }, []);

  const fetchSavedWeather = async () => {
    try {
      const response = await axios.get("http://localhost:5000/weather");
      const savedCities = response.data.map((city) => ({
        ...city,
        currentWeather: JSON.parse(city.currentWeather),
        forecast: JSON.parse(city.forecast),
      }));
      setSearchedCities(savedCities);
    } catch (error) {
      console.log(error);
    }
  };

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

        // Save to the database
        try {
          await axios.post("http://localhost:5000/weather", cityWeather);
          fetchSavedWeather();
        } catch (error) {
          console.log(error);
        }
      })
      .catch(console.log);
  };

  const handleDeleteCity = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/weather/${id}`);
      fetchSavedWeather();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="containers">
      <div className="current-location-weathers">
        {locationWeather && (
          <div>
            <p style={{ marginTop: "2vh" }}>
              Wanna Logout?{" "}
              <Link to="/Register">Logout</Link>
            </p>
            <h2>Current Location</h2>
            <CurrentWeather data={locationWeather} />
          </div>
        )}
      </div>
      <br></br>
      <Search onSearchChange={handleOnSearchChange} />
      <br></br>
      <button className="btn" onClick={() => setSearchedCities([])}>
        Clear Search
      </button>
      {searchedCities.map((city, index) => (
        <div key={index}>
          <h2>{city.city}</h2>
          <CurrentWeather data={city.currentWeather} />
          <Forecast data={city.forecast} />
          <button className="btn" onClick={() => handleDeleteCity(city.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default Weather;
