# APINow.fun MCP Server

This repository provides a Model Context Protocol (MCP) server specifically designed to interact with the APINow.fun platform. It allows AI MCP Clients (like Claude Desktop, Cursor, VS Code) to search and execute APINow.fun endpoints.

## Features

*   **ApiNow Search:** Search for ApiNow endpoints using natural language queries.
*   **ApiNow Execute:** Execute specific ApiNow endpoints, passing necessary data and handling authentication.
*   **Extensible:** Easy addition of custom tools.

## Quick Start

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/1dolinski/apnow-fun-mcp.git # Replace with your repo URL
    cd apnow-fun-mcp
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure your MCP Client (e.g., Cursor):**
    You need to configure your MCP client (like Cursor) to connect to this server. Add the following configuration to your client's MCP settings (e.g., `~/.cursor/mcp.json`):

    ```json
    {
      "mcpServers": {
        "apinow-fun-mcp": {
          "command": "node",
          // Make sure this path points to YOUR cloned repository location
          "args": ["/path/to/your/clone/src/server.js"],
          "env": {
            // Replace with your actual ApiNow Wallet Private Key
            "APINOW_WALLET_PKEY": "YOUR_APINOW_WALLET_PRIVATE_KEY"
          },
          "disabled": false,
          "autoApprove": []
        }
      }
    }
    ```

    **Important:**
    *   Update the `args` path to the correct location of `server.js` in your cloned repository.
    *   Replace `"YOUR_APINOW_WALLET_PRIVATE_KEY"` in the `env` section with your actual ApiNow wallet private key. **Keep this key secure and do not commit it directly into your repository if it's public.** Consider using environment variable managers or secrets management tools.

4.  **Start the server:**
    ```bash
    npm start
    ```

    The server will run locally (usually on port 3000, check the console output). Your MCP client should now be able to connect and use the ApiNow tools.

## Available Tools

This server provides the following tools accessible via MCP:

*   `apinow_search`: Searches APINow.fun endpoints.
*   `apinow_execute`: Executes APINow.fun endpoints.

## Community & Support

[![Join us on Telegram](https://img.shields.io/badge/Join%20us%20on-Telegram-blue.svg)](https://t.me/+owjactcDFTo3Yzg5)
[![Follow us on X](https://img.shields.io/badge/Follow%20us%20on-X-black.svg)](https://x.com/apinowfun)
[![Visit our Website](https://img.shields.io/badge/Visit%20our-Website-green.svg)](https://apinow.fun)

Join our [Telegram group](https://t.me/+owjactcDFTo3Yzg5) for discussions, help, and updates!

For issues, please open a GitHub issue. For other inquiries, you can reach out on Telegram or X.

We are built on **Base**! [![Base logo](https://raw.githubusercontent.com/base-org/brand-kit/main/logo/symbol/Base_Symbol_Blue.svg)](https://base.org) 

## Contributors

*   [1dolinski](https://x.com/1dolinski)

Want to contribute? Please open an issue or pull request!

## Sponsors

Become a sponsor and get your logo shown here! (Contact details/link)

## License

MIT License (or choose another appropriate license)

This project extended [mcp-server-starter](https://github.com/mgesteban/mcp-server-starter) template by mgesteban.