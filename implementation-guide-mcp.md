# Simple MCP Server Setup Guide

This guide will help you quickly set up an MCP (Model Context Protocol) server that provides documentation tools for various technologies.

## Quick Start

### Step 1: Clone the Repository
```bash
git clone https://github.com/mgesteban/mcp-server-starter
cd mcp-server-starter
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Create a `.env` file in the root directory:
```
# Optional: OpenAI API Key for enhanced documentation features
OPENAI_API_KEY=your_openai_api_key
```

### Step 4: Start the MCP Server
```bash
npm start
```

### Step 5: Connect to VS Code
1. Open VS Code
2. Install the Claude extension if you haven't already
3. Configure the MCP server in VS Code:
   - Open VS Code settings
   - Navigate to Claude extension settings
   - Add the MCP server configuration:
   ```json
   {
     "mcpServers": {
       "boardbreeze": {
         "command": "node",
         "args": ["path/to/mcp-server-starter/src/server.js"],
         "disabled": false,
         "autoApprove": []
       }
     }
   }
   ```
4. Start using the MCP server with Claude in VS Code

## Available Documentation Tools

The server provides documentation tools for:
- React
- OpenAI
- AWS
- TypeScript
- Express
- Vercel
- Supabase

## Customizing Your MCP Server

To add or modify tools:
1. Edit `src/tools/documentation.js` to add new documentation sources
2. Edit `src/tools/index.js` to register new tools
3. Update `src/config/settings.js` to configure server settings

## Troubleshooting

If you encounter issues:
- Ensure all dependencies are installed
- Check that environment variables are properly set
- Verify the server is running (you should see "MCP Server running on port 3000")
- Make sure VS Code is properly configured to connect to your MCP server
