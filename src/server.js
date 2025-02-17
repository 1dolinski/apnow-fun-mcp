#!/usr/bin/env node
import express from 'express';
import { WebSocketServer } from 'ws';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { registerTools } from './tools/index.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(cors());
app.use(express.json());

// Store connected clients
const clients = new Set();

// WebSocket connection handler
wss.on('connection', (ws) => {
  clients.add(ws);
  console.log('Client connected');

  ws.on('message', async (message) => {
    try {
      const { type, payload } = JSON.parse(message);
      const tools = registerTools();
      
      if (type === 'TOOL_REQUEST') {
        const { toolName, params } = payload;
        const tool = tools.get(toolName);
        
        if (tool) {
          const result = await tool(params);
          ws.send(JSON.stringify({
            type: 'TOOL_RESPONSE',
            payload: result
          }));
        } else {
          ws.send(JSON.stringify({
            type: 'ERROR',
            payload: `Tool ${toolName} not found`
          }));
        }
      }
    } catch (error) {
      ws.send(JSON.stringify({
        type: 'ERROR',
        payload: error.message
      }));
    }
  });

  ws.on('close', () => {
    clients.delete(ws);
    console.log('Client disconnected');
  });
});

// HTTP endpoints
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', connectedClients: clients.size });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`MCP Server running on port ${PORT}`);
});
