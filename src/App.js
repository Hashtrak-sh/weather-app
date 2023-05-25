import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WeatherApp = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const apiKey = '9b251169456146e189871807232505'; // Replace with your actual API key from weatherapi.com

  useEffect(() => {
    const timer = setTimeout(() => {
      if (city.trim().length === 0) {
        setSuggestions([]);
        return;
      }

      const fetchSuggestions = async () => {
        try {
          const response = await axios.get(
            `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${city}`
          );
          setSuggestions(response.data.map((item) => item.name));
        } catch (error) {
          setSuggestions([]);
        }
      };

      fetchSuggestions();
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [city, apiKey]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`
      );
      setWeatherData(response.data);
      setCity('');
    } catch (error) {
      setError('Failed to fetch weather data');
    }

    setLoading(false);
  };

  const handleSelectSuggestion = (suggestion) => {
    setCity(suggestion);
    setSuggestions([]);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Weather App</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setShowSuggestions(false)}
          placeholder="Enter city name"
          className="p-2 border border-gray-300 rounded mr-2"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Get Weather'}
        </button>

        {showSuggestions && (
          <ul className="mt-2 max-h-40 overflow-y-auto border border-gray-300 rounded">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                onClick={() => handleSelectSuggestion(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </form>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {weatherData && (
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-bold mb-2">Weather Information</h2>
          <p>City: {weatherData.location.name}</p>
          <p>Temperature: {weatherData.current.temp_c}°C</p>
          <p>Humidity: {weatherData.current.humidity}%</p>
        </div>
      )}
    </div>
  );
};

export default WeatherApp;
