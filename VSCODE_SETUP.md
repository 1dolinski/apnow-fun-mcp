# VS Code Configuration Guide for MCP Server

This guide will help you configure VS Code to work with your MCP server and Claude, providing detailed instructions for setup and troubleshooting.

## Prerequisites

- VS Code installed on your machine
- Claude extension for VS Code installed
- MCP server running locally (following the steps in [Implementation Guide](./implementation-guide-mcp.md))

## Configuring VS Code for MCP

### Step 1: Install the Claude Extension

1. Open VS Code
2. Click on the Extensions icon in the left sidebar (or press `Ctrl+Shift+X`)
3. Search for "Claude"
4. Find the official Claude extension by Anthropic and click "Install"

### Step 2: Configure Claude Settings

#### For VS Code Claude Extension:

1. Open VS Code Settings:
   - Windows/Linux: File > Preferences > Settings
   - macOS: Code > Preferences > Settings
   
2. Search for "Claude" in the settings search bar

3. Find "Claude: MCP Settings" (or navigate to the Claude extension settings)

4. Click on "Edit in settings.json"

5. Add your MCP server configuration in the `mcpServers` section:

```json
{
  "claude.mcpSettings": {
    "mcpServers": {
      "mcp-server-starter": {
        "command": "node",
        "args": ["path/to/mcp-server-starter/src/server.js"],
        "env": {
          "OPENAI_API_KEY": "your_openai_api_key_here"
        },
        "disabled": false,
        "autoApprove": []
      }
    }
  }
}
```

**Important:** Replace `"path/to/mcp-server-starter"` with the actual path to your MCP server directory.

### Step 3: Test the Configuration

1. Restart VS Code to apply the changes
2. Open the Claude extension panel
3. Type a query that would use the MCP tools, like "What are the key concepts in React?"

## Troubleshooting

### Common Issues and Solutions

#### MCP Server Not Connecting

**Symptoms:**
- Claude says it can't find the MCP server
- MCP tools don't appear in Claude's capabilities

**Solutions:**
1. Verify the server is running
2. Check that the path in the settings.json is correct
3. Make sure the "disabled" property is set to false
4. Restart VS Code

#### Permission Issues

**Symptoms:**
- "Permission denied" errors in the console
- Server fails to start

**Solutions:**
1. Make sure the server.js file is executable (`chmod +x src/server.js` on macOS/Linux)
2. Check that you have the necessary permissions to run Node.js

#### API Key Issues

**Symptoms:**
- Documentation tools return authorization errors
- Server logs show API key errors

**Solutions:**
1. Verify your API key is correctly set in the .env file
2. Check the environment variables in VS Code settings
3. Restart the MCP server

## Viewing MCP Server Logs

To view logs from your MCP server:

1. Open a terminal in VS Code (Terminal > New Terminal)
2. Navigate to your MCP server directory
3. Run `npm start`
4. The terminal will display logs from the MCP server

## Advanced Configuration

### Configuring Multiple MCP Servers

You can configure multiple MCP servers to run simultaneously:

```json
{
  "claude.mcpSettings": {
    "mcpServers": {
      "mcp-server-starter": {
        "command": "node",
        "args": ["path/to/mcp-server-starter/src/server.js"],
        "disabled": false,
        "autoApprove": []
      },
      "weather-server": {
        "command": "node",
        "args": ["path/to/weather-server/dist/index.js"],
        "env": {
          "WEATHER_API_KEY": "your_weather_api_key"
        },
        "disabled": false,
        "autoApprove": []
      }
    }
  }
}
```

### Automatically Approving Specific Tools

You can configure certain tools to run without requiring explicit approval:

```json
{
  "claude.mcpSettings": {
    "mcpServers": {
      "mcp-server-starter": {
        "command": "node",
        "args": ["path/to/mcp-server-starter/src/server.js"],
        "disabled": false,
        "autoApprove": ["list_tools", "get_docs", "calculate"]
      }
    }
  }
}
```

## Differences Between VS Code and Claude Desktop App

If you're using the Claude desktop app instead of VS Code:

1. The MCP settings file is located at:
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
   - **Linux**: `~/.config/Claude/claude_desktop_config.json`

2. The structure of the settings file is the same, with a top-level `mcpServers` object.

3. You'll need to restart the Claude desktop app after making changes to the configuration.
