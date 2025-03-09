import axios from 'axios';
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';

export const weatherTool = {
  name: 'get_weather',
  description: 'Gets current weather for a specified location',
  inputSchema: {
    type: 'object',
    properties: {
      location: {
        type: 'string',
        description: 'City name or location'
      },
      units: {
        type: 'string',
        description: 'Temperature units (metric or imperial)',
        enum: ['metric', 'imperial'],
        default: 'metric'
      }
    },
    required: ['location']
  },
  handler: async (args) => {
    const { location, units = 'metric' } = args;
    
    try {
      // Using weatherapi.com as the service
      const API_KEY = process.env.WEATHER_API_KEY;
      
      if (!API_KEY) {
        throw new Error('WEATHER_API_KEY environment variable is not set');
      }
      
      const response = await axios.get(`https://api.weatherapi.com/v1/current.json`, {
        params: {
          key: API_KEY,
          q: location,
          aqi: 'no'
        }
      });
      
      // Convert units if needed
      const temp = units === 'imperial' 
        ? response.data.current.temp_f 
        : response.data.current.temp_c;
        
      const windSpeed = units === 'imperial'
        ? response.data.current.wind_mph
        : response.data.current.wind_kph;
      
      const windUnit = units === 'imperial' ? 'mph' : 'kph';
      const tempUnit = units === 'imperial' ? '°F' : '°C';
      
      return {
        location: `${response.data.location.name}, ${response.data.location.country}`,
        temperature: `${temp}${tempUnit}`,
        condition: response.data.current.condition.text,
        humidity: `${response.data.current.humidity}%`,
        wind: `${windSpeed} ${windUnit}`,
        feels_like: units === 'imperial' 
          ? `${response.data.current.feelslike_f}${tempUnit}`
          : `${response.data.current.feelslike_c}${tempUnit}`,
        updated: response.data.current.last_updated,
        icon_url: `https:${response.data.current.condition.icon}`
      };
    } catch (error) {
      if (error.response) {
        throw new McpError(
          ErrorCode.InternalError,
          `Weather API error: ${error.response.data.error?.message || error.message}`
        );
      }
      throw new McpError(
        ErrorCode.InternalError,
        `Weather API error: ${error.message}`
      );
    }
  }
};
