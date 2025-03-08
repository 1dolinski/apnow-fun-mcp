import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  McpError,
  ErrorCode
} from '@modelcontextprotocol/sdk/types.js';
import { documentationTool } from './documentation.js';
import { calculatorTool } from './calculatorTool.js';

const tools = new Map();

// Register tools
tools.set('list_tools', {
  description: 'Lists all available tools',
  inputSchema: {
    type: 'object',
    properties: {},
    required: []
  },
  handler: async () => {
    return Array.from(tools.entries()).map(([name, tool]) => ({
      name,
      description: tool.description,
      inputSchema: tool.inputSchema
    }));
  }
});

// Register documentation tool
tools.set(documentationTool.name, documentationTool);

// Register calculator tool (example)
tools.set(calculatorTool.name, calculatorTool);

export function setupTools(server) {
  // Handle tool listing
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: Array.from(tools.entries()).map(([name, tool]) => ({
      name,
      description: tool.description,
      inputSchema: tool.inputSchema
    }))
  }));

  // Handle tool execution
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const tool = tools.get(request.params.name);
    if (!tool) {
      throw new McpError(
        ErrorCode.MethodNotFound,
        `Tool '${request.params.name}' not found`
      );
    }

    try {
      const result = await tool.handler(request.params.arguments);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2)
          }
        ]
      };
    } catch (error) {
      throw new McpError(
        ErrorCode.InternalError,
        error.message
      );
    }
  });
}

export { tools };
