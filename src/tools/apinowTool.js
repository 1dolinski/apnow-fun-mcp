import apiNow from 'apinow-sdk';
// import dotenv from 'dotenv';

// dotenv.config();

const APINOW_WALLET_PKEY = process.env.APINOW_WALLET_PKEY;
const BASE_MAINNET_RPC = 'https://mainnet.base.org'; // Use the official Base RPC
const APINOW_SEARCH_ENDPOINT = 'https://apinow.fun/api/endpoints/apinowfun/endpoint-search';

// if (!APINOW_WALLET_PKEY) {
//     console.warn('WARNING: APINOW_WALLET_PKEY environment variable not set. ApiNow tools will not function.');
// }

// --- apinow_search Tool --- 

export const apinowSearchTool = {
    name: 'apinow_search',
    description: 'Searches ApiNow endpoints using natural language.',
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
        },
        required: ['query'],
    },
    handler: async (args) => {
        if (!APINOW_WALLET_PKEY) {
            throw new Error('ApiNow wallet private key (APINOW_WALLET_PKEY) is not configured.');
        }
        try {
            console.error(`Executing apinow_search with query: ${args.query}`);
            // TODO: Add cost estimation if possible before execution
            const response = await apiNow.infoBuyResponse(
                APINOW_SEARCH_ENDPOINT,
                APINOW_WALLET_PKEY,
                BASE_MAINNET_RPC, // Hardcode Base Mainnet RPC
                {
                    method: 'POST',
                    data: {
                        query: args.query,
                        limit: args.limit,
                        minScore: args.minScore
                    },
                }
            );

            // Assuming response structure { data: ..., txHash: ..., txHashUrl: ... }
            const { data, txHash, txHashUrl } = response;
            // const txHashUrl = txHash ? `https://basescan.org/tx/${txHash}` : null; // Removed construction

            console.error(`apinow_search successful. Tx: ${txHashUrl || txHash || 'N/A'}`); // Log URL or Hash

            return {
                success: true,
                data: data, // The actual API response data
                txHash: txHash,
                txHashUrl: txHashUrl // Use directly from response
            };

        } catch (error) {
            console.error('Error executing apinow_search:', error);
            // Ensure error propagates correctly, potentially with more context
            const errorMessage = error.message || (typeof error === 'string' ? error : JSON.stringify(error));
            throw new Error(`ApiNow search failed: ${errorMessage}`);
        }
    },
};

// --- apinow_execute Tool --- 

export const apinowExecuteTool = {
    name: 'apinow_execute',
    description: 'Executes a specific ApiNow endpoint by URL or by namespace/name, paying the required fee.',
    inputSchema: {
        type: 'object',
        properties: {
            endpointUrl: {
                type: 'string',
                description: 'Optional. The full URL of the ApiNow endpoint to execute (e.g., https://apinow.fun/api/endpoints/namespace/endpointName). If provided, namespace and endpointName are ignored.',
                pattern: '^https://apinow\\.fun/api/endpoints/[^/]+/[^/]+$',
            },
            namespace: {
                type: 'string',
                description: 'The namespace of the ApiNow endpoint. Required if endpointUrl is not provided.',
            },
            endpointName: {
                type: 'string',
                description: 'The name of the ApiNow endpoint. Required if endpointUrl is not provided.',
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
            fastMode: {
                type: 'boolean',
                description: 'Optional. If true, waits less time before querying the response (default: false).'
            }
        },
    },
    handler: async (args) => {
        if (!APINOW_WALLET_PKEY) {
            throw new Error('ApiNow wallet private key (APINOW_WALLET_PKEY) is not configured.');
        }

        let endpointUrl;
        if (args.endpointUrl) {
            const urlRegex = /^https:\/\/apinow\.fun\/api\/endpoints\/[^\/]+\/[^\/]+$/;
            if (!urlRegex.test(args.endpointUrl)) {
                throw new Error(`Invalid endpointUrl format: ${args.endpointUrl}. Must match https://apinow.fun/api/endpoints/namespace/endpointName`);
            }
            endpointUrl = args.endpointUrl;
            console.error(`Executing apinow_execute using provided endpointUrl: ${endpointUrl}`);
        } else if (args.namespace && args.endpointName) {
            endpointUrl = `https://apinow.fun/api/endpoints/${args.namespace}/${args.endpointName}`;
            console.error(`Executing apinow_execute by constructing URL: ${endpointUrl} (namespace: ${args.namespace}, name: ${args.endpointName})`);
        } else {
            throw new Error('ApiNow execution requires either endpointUrl OR both namespace and endpointName.');
        }

        try {
            console.error(`Executing apinow_execute for ${endpointUrl}`);
             // TODO: Add cost estimation if possible before execution
            const response = await apiNow.infoBuyResponse(
                endpointUrl,
                APINOW_WALLET_PKEY,
                BASE_MAINNET_RPC, // Hardcode Base Mainnet RPC
                {
                    method: args.method,
                    data: args.data,
                    fastMode: args.fastMode
                }
            );

            // Assuming response structure { data: ..., txHash: ..., txHashUrl: ... }
            const { data, txHash, txHashUrl } = response;
            // const txHashUrl = txHash ? `https://basescan.org/tx/${txHash}` : null; // Removed construction

            console.error(`apinow_execute successful for ${endpointUrl}. Tx: ${txHashUrl || txHash || 'N/A'}`); // Log URL or Hash

            return {
                success: true,
                data: data, // The actual API response data
                txHash: txHash,
                txHashUrl: txHashUrl // Use directly from response
            };
        } catch (error) {
            console.error(`Error executing apinow_execute for ${endpointUrl}:`, error);
            // Ensure error propagates correctly, potentially with more context
            const errorMessage = error.message || (typeof error === 'string' ? error : JSON.stringify(error));
            throw new Error(`ApiNow execution failed for ${endpointUrl}: ${errorMessage}`);
        }
    },
}; 