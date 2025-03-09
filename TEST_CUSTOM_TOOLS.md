# Testing Custom MCP Tools

This guide will help you test the custom tools we've implemented in the MCP server, specifically the weather data tool.

## Testing the Weather Tool

### Step 1: Get a Weather API Key

1. Go to [WeatherAPI.com](https://www.weatherapi.com/)
2. Sign up for a free account
3. After signing in, go to your Dashboard
4. Copy your API key

### Step 2: Configure the Environment

1. Create a `.env` file in the root directory if it doesn't exist already
2. Add your Weather API key to the file:
   ```
   WEATHER_API_KEY=your_api_key_here
   ```

### Step 3: Start the MCP Server

1. Open a terminal in the project directory
2. Run the server:
   ```bash
   npm start
   ```
3. You should see a message indicating the server is running on port 3000

### Step 4: Configure VS Code for MCP

1. Follow the steps in VSCODE_SETUP.md to configure VS Code with your MCP server
2. Make sure to include the WEATHER_API_KEY in the environment variables:
   ```json
   {
     "cline.mcpSettings": {
       "mcpServers": {
         "boardbreeze": {
           "command": "node",
           "args": ["path/to/mcp-server-starter/src/server.js"],
           "env": {
             "CLINE_SECRET": "your_secret_here",
             "WEATHER_API_KEY": "your_weather_api_key_here",
             "REACT_API_KEY": "your_react_api_key_here",
             "OPENAI_API_KEY": "your_openai_api_key_here",
             ...
           },
           "disabled": false,
           "autoApprove": []
         }
       }
     }
   }
   ```

### Step 5: Test the Weather Tool with Cline

1. Open Cline in VS Code
2. Ask Cline something like:
   - "What's the weather in San Francisco?"
   - "Tell me the current weather in Tokyo."
   - "Check the weather in London with imperial units."

3. Cline should use the get_weather tool to fetch and display current weather information for the requested location

## Example Output

When using the weather tool, you should see a response like:

```json
{
  "location": "San Francisco, United States of America",
  "temperature": "15.8°C",
  "condition": "Partly cloudy",
  "humidity": "71%",
  "wind": "14.8 kph",
  "feels_like": "14.4°C",
  "updated": "2025-03-09 07:30",
  "icon_url": "https://cdn.weatherapi.com/weather/64x64/day/116.png"
}
```

## Troubleshooting

If the weather tool isn't working:

1. Check the server console for error messages
2. Verify your API key is correct in the .env file
3. Make sure the WEATHER_API_KEY is properly set in your VS Code MCP settings
4. Confirm the server is running and connected to Cline

## Creating Your Own Tests

To test other custom tools:

1. Create a tool following the pattern in the CUSTOM_TOOLS_GUIDE.md
2. Register it in src/tools/index.js
3. Enable it in src/config/settings.js
4. Configure any necessary API keys in .env
5. Restart the MCP server
6. Test with Cline by asking relevant questions that would trigger the tool
