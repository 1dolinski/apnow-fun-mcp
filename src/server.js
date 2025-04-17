#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import dotenv from 'dotenv';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import config from './config/settings.js';
import { setupTools } from './tools/index.js';

// --- Argument Parsing & Environment Setup ---
const argv = yargs(hideBin(process.argv))
  .option('apinow-private-key', {
    alias: 'pk',
    type: 'string',
    description: 'Private key for the wallet used for ApiNow transactions',
    // Provide a default from env, allowing .env or existing env to set it
    default: process.env.APINOW_WALLET_PKEY
  })
  .option('port', {
    alias: 'p',
    type: 'number',
    description: 'Port to run the MCP server on (if applicable)',
    default: process.env.PORT || 3000 // Example default precedence: arg -> env -> 3000
  })
  // Add other options as needed
  .help()
  .alias('help', 'h')
  .parseSync(); // Use parseSync to ensure argv is populated before proceeding

// Load .env file (might contain other settings or fallbacks)
// Variables loaded here will be overridden by command-line args if provided
dotenv.config();

// Set/Override environment variables from parsed args
// yargs defaults handle precedence: command-line > env > default value
if (argv.apinowPrivateKey) {
  process.env.APINOW_WALLET_PKEY = argv.apinowPrivateKey;
  console.error('[MCP Server] Using APINOW_WALLET_PKEY from command line argument or environment.');
}

if (argv.port) {
  process.env.PORT = argv.port.toString(); // Ensure it's a string for process.env
  console.error(`[MCP Server] Using PORT from command line argument or environment: ${process.env.PORT}`);
}

// --- Check for required config (e.g., private key) ---
if (!process.env.APINOW_WALLET_PKEY) {
  console.error('[MCP Server] Error: APINOW_WALLET_PKEY is required. Provide it via --apinow-private-key argument or set it in the environment (e.g., via .env file).');
  process.exit(1); // Exit if essential config is missing
}

const server = new Server(
  {
    name: config.server.name,
    version: config.server.version
  },
  {
      capabilities: {
        resources: {},
        tools: {
          apinow_search: {
            inputSchema: {
                type: 'object',
                properties: {
                    query: {
                        type: 'string',
                        description: 'Natural language query to search for API endpoints.',
                    },
                    limit: {
                        type: 'number',
                        description: 'Maximum number of search results to return.',
                    },
                    minScore: {
                        type: 'number',
                        description: 'Minimum relevance score for results (0-1).',
                    },
                    rpcUrl: {
                        type: 'string',
                        description: 'Optional custom RPC URL for the transaction.',
                    }
                },
                required: ['query'],
            }
          },
          apinow_execute: {
            inputSchema: {
                type: 'object',
                properties: {
                    endpointUrl: {
                        type: 'string',
                        description: 'The full URL of the ApiNow endpoint to execute.',
                    },
                    method: {
                        type: 'string',
                        description: 'HTTP method for the request (GET, POST, etc.). Defaults to method specified by endpoint info, or POST.',
                        enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD']
                    },
                    data: {
                        type: 'object',
                        description: 'Optional JSON data payload for POST/PUT requests or query parameters for GET requests.',
                        additionalProperties: true, 
                    },
                    rpcUrl: {
                        type: 'string',
                        description: 'Optional custom RPC URL for the transaction.',
                    },
                    fastMode: {
                        type: 'boolean',
                        description: 'Optional. If true, waits less time before querying the response (default: false).'
                    }
                },
                required: ['endpointUrl'],
            }
          }
        }
      }
  }
);

// Set up tools
setupTools(server);

const transport = new StdioServerTransport();

server.connect(transport).then(() => {
  console.error(`MCP Server running on port ${config.port}`);
}).catch(console.error);

// Handle cleanup
process.on('SIGINT', async () => {
  await server.close();
  process.exit(0);
});
