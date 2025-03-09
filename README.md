# MCP Server Starter Template

A ready-to-use template for quickly setting up your own MCP (Model Context Protocol) server with documentation tools and extensible architecture.

## What is MCP?

The Model Context Protocol (MCP) is a protocol for extending AI capabilities through local servers. This setup tool provides a quick way to bootstrap an MCP server with common tools and configurations. For more information about MCP itself, please visit the official documentation.

## What is This Template?

This repository provides a complete, ready-to-use MCP server template that connects AI capabilities (like Claude) with local documentation tools. It's designed to be:

- **Immediately usable** - Clone, install, and run with minimal setup
- **Easily extensible** - Add your own tools and capabilities
- **Well documented** - Clear instructions for customization

## Features Out of the Box

### Documentation Tools
Access documentation directly through Claude for:
- React
- OpenAI API
- AWS Services
- TypeScript
- Express
- Vercel
- Supabase

### Ready-to-Use Architecture
- Complete MCP server implementation
- Properly structured tool organization
- Configuration system

## Why You'll Love It

**The MCP server acts as your personal development assistant by providing**:
- **Instant Documentation Access**: Get documentation for React, AWS, TypeScript, Express, Vercel, and Supabase without endless Googling
- **AI-Powered Help**: Leverage AI capabilities to generate documentation and solve development challenges
- **Workflow Automation**: Simplify project setup and track your development progress
- **Local Control**: Everything runs on your machine (port 3000) for privacy and speed

## Perfect For New Developers

If you're new to development, this tool helps overcome the "documentation overload" problem. Instead of bouncing between dozens of tabs and sites, you can access what you need through a single interface that integrates with VS Code.

## Quick Start

See the [Implementation Guide](./implementation-guide-mcp.md) for step-by-step instructions to get up and running in minutes.

Basic steps:
```bash
# 1. Clone the repository
git clone https://github.com/mgesteban/mcp-server-starter

# 2. Install dependencies
cd mcp-server-starter
npm install

# 3. Start the server
npm start
```

## Documentation

This template includes comprehensive documentation to help you get started and make the most of your MCP server:

- [Implementation Guide](./implementation-guide-mcp.md) - Simple step-by-step setup instructions
- [Custom Tools Guide](./CUSTOM_TOOLS_GUIDE.md) - Detailed instructions for creating your own MCP tools

Check the `.env.example` file for environment variable configuration options.

## How It Works

This template provides an MCP server that runs locally on your machine. When connected to VS Code with the Claude extension, it enables Claude to:

1. Access documentation for various technologies
2. Use the documentation to help with your development tasks
3. Provide code examples and explanations based on official documentation

## Customizing Your Server

This template includes a calculator tool example (`src/tools/calculatorTool.js`) that demonstrates how to create a basic MCP tool with input validation and error handling.

To add your own tools to the server:

1. Create new tool files in the `src/tools` directory
2. Register your tools in `src/tools/index.js`
3. Update configuration in `src/config/settings.js`

See the [Custom Tools Guide](./CUSTOM_TOOLS_GUIDE.md) for detailed instructions and best practices.

## Contributing

If you improve this template or add useful tools, please consider submitting a pull request to benefit the community.

## License

MIT License - See LICENSE file for details.
