#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { docsTools } from './tools/docsTools.js';
import dotenv from 'dotenv';
import config from './config/settings.js';
import { setupTools } from './tools/index.js';

dotenv.config();

const server = new Server(
  {
    name: config.server.name,
    version: config.server.version
  },
  {
      capabilities: {
        resources: {},
        tools: {
          list_tools: {
            inputSchema: {
              type: "object",
              properties: {},
              required: []
            }
          },
          get_docs: {
            inputSchema: {
              type: "object",
              properties: {
                type: {
                  type: "string",
                  description: "Type of documentation to retrieve (react, openai, aws, typescript, express, vercel, or supabase)",
                  enum: ["react", "openai", "aws", "typescript", "express", "vercel", "supabase"]
                },
                path: {
                  type: "string",
                  description: "Path to specific documentation section"
                }
              },
              required: ["type"]
            }
          },
          calculate: {
            inputSchema: {
              type: "object",
              properties: {
                operation: {
                  type: "string",
                  description: "The mathematical operation to perform",
                  enum: ["add", "subtract", "multiply", "divide"]
                },
                a: {
                  type: "number",
                  description: "First operand"
                },
                b: {
                  type: "number",
                  description: "Second operand"
                }
              },
              required: ["operation", "a", "b"]
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
  console.log(`MCP Server running on port ${config.port}`);
}).catch(console.error);

// Handle cleanup
process.on('SIGINT', async () => {
  await server.close();
  process.exit(0);
});
