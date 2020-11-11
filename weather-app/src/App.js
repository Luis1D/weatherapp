import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// CELSIUS TO FAHRENHEIT:
// Multiply by 9, then divide by 5, then add 32

function App() {
  const [city, setCity] = useState('Sacramento');
  const [data, setData] = useState()
  const [currentTemp, setCurrentTemp] = useState();
  const [fahrenheit, setFahrenheit] = useState();
  const [convertedDeg, setConvertedDeg] = useState(false)
  const [statsPannel, setsStatsPannel] = useState(false)
  const [forecastApi, setForecastApi] = useState("");
  const [astro, setAstro] = useState();

  // HANDELS SIDE EFFECTS
  useEffect(() => {
    fetchCityData();
  },[])

// GRABS WEATHER DATA
  const fetchCityData = () => {
    axios.get(`http://api.weatherstack.com/forecast?&access_key=266632d46722dd6fcc72d0ad1c6339f2&query=${city}`)
      .then(res => {
        const cityData = res.data;
        setCurrentTemp(cityData.current.temperature)
        setData(cityData);
        const forecast = cityData.forecast;
        const astroData = forecast[Object.keys(forecast)[0]].astro;
        setAstro(astroData);
      })
      .catch(err => {
        console.log("ERROR: ",err);
      })
  }
// GRABS WEATHER NEWS DATA
  const fetchWeatherNews = () => {
    if(data) {
      axios.get(`https://api.weather.gov/points/${data.location.lat},${data.location.lon}`)
      .then(res => {
        const data = res.data.properties.forecast;
        setForecastApi(data);
        console.log("RESPONSE: ", res);
      })
      .catch(err => {
        console.log("ERROR: ", err);
      })
    }
  }

// CONVERTS FAHRENHEIT TO CELCIUS
  const celsiusToFahrenheit = () => {
    const converted = currentTemp * 9 / 5 + 32;
    setFahrenheit(
      converted
    )
    setConvertedDeg(
      !convertedDeg
    )
  }

// DISPLAYS WEATHER STATS
  const showWeatherStats = () => {
    setsStatsPannel(
      !statsPannel
    )
  }

// FORM
  const handleChange = e => {
    setCity(
      e.target.value
    );
  }
  const handleSubmit = e => {
    e.preventDefault();
    fetchCityData();
  }

  return (
    <div className="App">
      <div className="header">
        <h1 className="title">Weather Forecast</h1>
      </div>
      <form onSubmit={ handleSubmit }>
        <input 
          type="text"
          placeholder="City.."
          onChange={ handleChange }
        />
      </form>
      <div className="card-container">
      {
        data ? 
        <div>

          <div className="container" onClick={ () => showWeatherStats() }>
          <div className="city-info">
            <h2 className="location">{ data.location.name }, { data.location.region }</h2> 
            <div className="flex">
              <h3 className="weather-description"> { data.current.weather_descriptions[0] }</h3>
            </div>
          </div>
          <div className="right-side-container">
            <div className="temp" onClick={ () => celsiusToFahrenheit() }>
                { convertedDeg ? fahrenheit + " F" : currentTemp + " C" }
            </div>
          </div>
          </div>

          <div className="stats-container-active">
            
            {/* GENERAL INFO */}
            <h3>OVERVIEW</h3>
            <ul>
              <li><span className="list-item">Feels like:</span> { data.current.feelslike }c</li>
              <li><span className="list-item">Humidity:</span> { data.current.humidity }%</li>
              <li><span className="list-item">Chance of rain:</span> { data.current.precip }%</li>
              <li><span className="list-item">UV Index:</span> { data.current.uv_index }</li>
              <li><span className="list-item">Wind Speed:</span> { data.current.wind_speed }</li>
              <li><span className="list-item">Wind Direction:</span> { data.current.wind_dir }</li>
            </ul>

            <div className="astro-stats-container">
              <h3>Astro</h3>
              {
                astro ?
                <ul>
                  <li><span className="list-item">Sunrise:</span> { astro.sunrise }</li>
                  <li><span className="list-item">Sunset:</span> { astro.sunset }</li>
                  <li><span className="list-item">Moonrise:</span> { astro.moonrise }</li>
                  <li><span className="list-item">Moonset:</span> { astro.moonset }</li>
                  <li><span className="list-item">Moon Phase:</span> { astro.moon_phase }</li>
                  <li><span className="list-item">Moon Illumination:</span> { astro.moon_illumination }</li>
                </ul> : null

              }
            </div>


          </div>
        </div>
        : <img src={require("./loading.svg")} alt="loading" className="loading-icon" />
      }
      </div>
    </div>
  );
}

export default App;