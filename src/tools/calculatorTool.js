/**
 * A simple calculator tool example for MCP
 * This demonstrates how to create a basic tool with input validation and error handling
 */

import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';

export const calculatorTool = {
  name: 'calculate',
  description: 'Performs basic arithmetic calculations',
  inputSchema: {
    type: 'object',
    properties: {
      operation: {
        type: 'string',
        description: 'The mathematical operation to perform',
        enum: ['add', 'subtract', 'multiply', 'divide']
      },
      a: {
        type: 'number',
        description: 'First operand'
      },
      b: {
        type: 'number',
        description: 'Second operand'
      }
    },
    required: ['operation', 'a', 'b']
  },
  handler: async (args) => {
    const { operation, a, b } = args;
    
    try {
      let result;
      
      switch (operation) {
        case 'add':
          result = a + b;
          break;
        case 'subtract':
          result = a - b;
          break;
        case 'multiply':
          result = a * b;
          break;
        case 'divide':
          if (b === 0) {
            throw new Error('Division by zero is not allowed');
          }
          result = a / b;
          break;
        default:
          throw new Error(`Unknown operation: ${operation}`);
      }
      
      // Return a detailed response
      return {
        operation: operation,
        a: a,
        b: b,
        result: result,
        expression: `${a} ${getOperationSymbol(operation)} ${b} = ${result}`
      };
    } catch (error) {
      throw new McpError(
        ErrorCode.InternalError,
        `Calculation error: ${error.message}`
      );
    }
  }
};

/**
 * Helper function to get the mathematical symbol for an operation
 */
function getOperationSymbol(operation) {
  switch (operation) {
    case 'add': return '+';
    case 'subtract': return '-';
    case 'multiply': return '*';
    case 'divide': return '/';
    default: return '?';
  }
}
