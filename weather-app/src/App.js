import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// CELSIUS TO FAHRENHEIT:
// Multiply by 9, then divide by 5, then add 32

function App() {
  const [city, setCity] = useState('San Francisco');
  const [data, setData] = useState()
  const [currentTemp, setCurrentTemp] = useState();
  const [fahrenheit, setFahrenheit] = useState();
  const [convertedDeg, setConvertedDeg] = useState(false)
  const [statsPannel, setsStatsPannel] = useState(false)

// HANDELS SIDE EFFECTS
  useEffect(() => {
    fetchCityData();
    fetchWeatherNews();
  },[])

// GRABS WEATHER DATA
  const fetchCityData = () => {
    axios.get(`http://api.weatherstack.com/forecast?&access_key=266632d46722dd6fcc72d0ad1c6339f2&query=${city}`)
      .then(res => {
        const cityData = res.data;
        setCurrentTemp(cityData.current.temperature)
        setData(cityData);
        console.log("CITY DATA: ", cityData);
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
    fetchWeatherNews();
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
              <h3><span className="list-item">Status:</span> { data.current.weather_descriptions[0] }</h3>
              {console.log("INNER-HTML: ",currentTemp)}
            </div>
          </div>
          <div className="right-side-container">
            <button className="temp" onClick={ () => celsiusToFahrenheit() }>
                { convertedDeg ? fahrenheit + " F" : currentTemp + " C" }
            </button>
            <img src={ data.current.weather_icons[0] } className="image" alt="weather icon" />
          </div>
          </div>

          <div className={ statsPannel ? "stats-container-active" : "stats-container" }>
            <ul>
              <li><span className="list-item">Country:</span> { data.location.country }</li>
              <li><span className="list-item">lat:</span> { data.location.lat }</li>
              <li><span className="list-item">lon:</span> { data.location.lon }</li>
              <li><span className="list-item">Time:</span> { data.location.localtime }</li>
              <hr/>
              <li><span className="list-item">Feels like:</span> { data.current.feelslike }c</li>
              <li><span className="list-item">Humidity:</span> { data.current.humidity }%</li>
              <li><span className="list-item">Chance of rain:</span> { data.current.precip }%</li>
              <li><span className="list-item">UV Index:</span> { data.current.uv_index }</li>
              <li><span className="list-item">Wind Speed:</span> { data.current.wind_speed }</li>
              <li><span className="list-item">Wind Direction:</span> { data.current.wind_dir }</li>
            </ul>
          </div>
        </div>
        : <img src={require("./loading.svg")} alt="loading" className="loading-icon" />
      }
      </div>
    </div>
  );
}

export default App;