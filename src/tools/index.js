import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  McpError,
  ErrorCode
} from '@modelcontextprotocol/sdk/types.js';
import { apinowSearchTool, apinowExecuteTool } from './apinowTool.js';

const tools = new Map();


// Register ApiNow tools
tools.set(apinowSearchTool.name, apinowSearchTool);
tools.set(apinowExecuteTool.name, apinowExecuteTool);

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
