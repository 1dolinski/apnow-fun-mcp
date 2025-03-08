# Creating Custom MCP Tools Guide

This guide will help you create and add your own custom tools to the MCP server template.

## Understanding MCP Tools

An MCP tool consists of:
1. **A name** - Unique identifier for the tool
2. **A description** - Explains what the tool does
3. **An input schema** - Defines what parameters the tool accepts
4. **A handler function** - Contains the logic that executes when the tool is called

## Creating a New Tool - Step by Step

### Step 1: Create a New Tool File

Create a new file in the `src/tools` directory. For example, `myCustomTool.js`:

```javascript
// Example of a weather tool that fetches weather data
import axios from 'axios';

// Define your tool
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
      // You would use your actual API key in a .env file
      const API_KEY = process.env.WEATHER_API_KEY;
      const response = await axios.get(`https://api.weatherapi.com/v1/current.json`, {
        params: {
          key: API_KEY,
          q: location,
          units: units
        }
      });
      
      return {
        location: response.data.location.name,
        temperature: response.data.current.temp_c,
        condition: response.data.current.condition.text,
        humidity: response.data.current.humidity,
        wind: response.data.current.wind_kph
      };
    } catch (error) {
      throw new Error(`Weather API error: ${error.message}`);
    }
  }
};
```

### Step 2: Register Your Tool

Add your tool to the tools collection in `src/tools/index.js`:

```javascript
import { weatherTool } from './myCustomTool.js';

// Add this line to the tools Map initialization
tools.set(weatherTool.name, weatherTool);
```

### Step 3: Update Configuration (Optional)

If you want to explicitly enable your tool, update `src/config/settings.js`:

```javascript
const config = {
  // ... existing configuration
  tools: {
    baseDir: './tools',
    enabled: ['list_tools', 'get_docs', 'get_weather'] // Add your new tool
  }
};
```

### Step 4: Restart the Server

Restart your MCP server for the changes to take effect:

```bash
npm start
```

## Different Types of Tools You Can Create

### API Integration Tools
Connect to external APIs to fetch data, like weather, stocks, news, or any other service.

### Local File System Tools
Create tools that interact with files on the local system (within permitted boundaries).

### Data Processing Tools
Build tools that transform, analyze, or process data in various formats.

### Development Utilities
Create helpful utilities for specific development tasks like:
- Code formatters
- Documentation generators
- Project scaffolding tools
- Testing utilities

## Best Practices

1. **Error Handling**: Always include proper error handling in your tools
2. **Input Validation**: Use the input schema to validate all inputs
3. **Environment Variables**: Store sensitive information like API keys in environment variables
4. **Documentation**: Document what your tool does and how to use it
5. **Modular Design**: Keep each tool focused on a single responsibility

## Example: Database Documentation Tool

```javascript
export const databaseDocTool = {
  name: 'get_database_docs',
  description: 'Retrieves documentation for popular databases',
  inputSchema: {
    type: 'object',
    properties: {
      database: {
        type: 'string',
        description: 'Database type',
        enum: ['mysql', 'postgresql', 'mongodb', 'redis']
      },
      topic: {
        type: 'string',
        description: 'Specific topic to search for'
      }
    },
    required: ['database']
  },
  handler: async (args) => {
    const { database, topic } = args;
    
    // Define documentation base URLs
    const docsUrls = {
      mysql: 'https://dev.mysql.com/doc/',
      postgresql: 'https://www.postgresql.org/docs/current/',
      mongodb: 'https://docs.mongodb.com/',
      redis: 'https://redis.io/documentation'
    };
    
    // Return relevant documentation information
    return {
      documentationUrl: docsUrls[database],
      searchTopic: topic || 'general',
      // Other relevant information...
    };
  }
};
```

## Debugging Your Tools

To debug your tools:

1. Add console.log statements in your handler function
2. Check the server console output when the tool is called
3. Return detailed error information in the tool response

Remember that the MCP server runs in a separate process, so any logs or errors will appear in the terminal where you started the server, not in VS Code itself.
