![APINow.fun MCP Server Banner](https://sdmntprsouthcentralus.oaiusercontent.com/files/00000000-d464-61f7-89b7-ed5bb5e202c7/raw?se=2025-04-17T17%3A31%3A20Z&sp=r&sv=2024-08-04&sr=b&scid=6c38cecf-cb43-522c-be65-a52d050ee621&skoid=dfdaf859-26f6-4fed-affc-1befb5ac1ac2&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-04-16T21%3A27%3A12Z&ske=2025-04-17T21%3A27%3A12Z&sks=b&skv=2024-08-04&sig=b6X/JcDsjoYAPHXizNo6T5pHoY26087UlKqZejWZ34U%3D)

# APINow.fun MCP Server

## TL;DR

This server allows you to dynamically search and execute [APINow.fun](https://apinow.fun) endpoints with a wallet of your choice using Claude Desktop, Cursor, VS Code, or any popular MCP Client.

1.  **Clone & Install:**
    ```bash
    git clone https://github.com/1dolinski/apnow-fun-mcp.git # Or your fork
    cd apnow-fun-mcp
    npm install
    ```

2.  **Configure MCP Client:** Add this to your client's MCP settings (e.g., `~/.cursor/mcp.json`):

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
    *Remember to update the `args` path and set your `APINOW_WALLET_PKEY`!*

---

## Features

*   **ApiNow Search:** Search for ApiNow endpoints using natural language queries.
*   **ApiNow Execute:** Execute specific ApiNow endpoints, passing necessary data and handling authentication.
*   **Extensible:** Easy addition of custom tools.

## Start

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