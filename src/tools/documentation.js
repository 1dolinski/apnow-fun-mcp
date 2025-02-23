import axios from 'axios';

const REACT_DOCS_BASE_URL = 'https://api.github.com/repos/reactjs/react.dev/contents/src/content';
const OPENAI_DOCS_BASE_URL = 'https://api.openai.com';
const AWS_DOCS_BASE_URL = 'https://docs.aws.amazon.com';
const TS_DOCS_BASE_URL = 'https://www.typescriptlang.org/docs';
const EXPRESS_DOCS_BASE_URL = 'https://expressjs.com';

async function fetchReactDocs(path = '') {
  try {
    const response = await axios.get(`${REACT_DOCS_BASE_URL}${path}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch React documentation: ${error.message}`);
  }
}

async function fetchOpenAIDocs(path = '') {
  try {
    // Map common paths to their documentation URLs
    const pathMap = {
      'overview': 'https://platform.openai.com/docs/api-reference/introduction',
      'whisper': 'https://platform.openai.com/docs/api-reference/audio/createTranscription',
      'audio': 'https://platform.openai.com/docs/api-reference/audio',
      'assistants': 'https://platform.openai.com/docs/api-reference/assistants',
      'models': 'https://platform.openai.com/docs/api-reference/models',
      'chat': 'https://platform.openai.com/docs/api-reference/chat'
    };

    // Return API endpoint information and documentation URL
    const docPath = pathMap[path.toLowerCase()] || pathMap['overview'];
    const apiPath = path.toLowerCase() === 'whisper' ? '/v1/audio/transcriptions' :
                   path.toLowerCase() === 'assistants' ? '/v1/assistants' :
                   path.toLowerCase() === 'models' ? '/v1/models' :
                   path.toLowerCase() === 'chat' ? '/v1/chat/completions' :
                   '/v1';

    return {
      documentationUrl: docPath,
      apiEndpoint: `${OPENAI_DOCS_BASE_URL}${apiPath}`,
      apiVersion: 'v1',
      requiredHeaders: {
        'Authorization': 'Bearer $OPENAI_API_KEY',
        'Content-Type': 'multipart/form-data' // for audio/transcriptions
      },
      parameters: path.toLowerCase() === 'whisper' ? {
        file: '(Required) The audio file to transcribe',
        model: '(Required) ID of the model to use (e.g., "whisper-1")',
        language: '(Optional) The language of the input audio',
        prompt: '(Optional) An optional text to guide the model\'s style',
        response_format: '(Optional) The format of the transcript output (json or text)',
        temperature: '(Optional) The sampling temperature between 0 and 1'
      } : {}
    };
  } catch (error) {
    throw new Error(`Failed to fetch OpenAI documentation: ${error.message}`);
  }
}

async function fetchTypeScriptDocs(path = '') {
  try {
    // Map common paths to their documentation URLs
    const pathMap = {
      'overview': '/handbook/intro',
      'interfaces': '/handbook/interfaces',
      'types': '/handbook/basic-types',
      'classes': '/handbook/classes',
      'functions': '/handbook/functions',
      'generics': '/handbook/generics',
      'enums': '/handbook/enums',
      'decorators': '/handbook/decorators',
      'utility-types': '/handbook/utility-types',
      'declaration-files': '/handbook/declaration-files',
      'jsx': '/handbook/jsx',
      'modules': '/handbook/modules',
      'namespaces': '/handbook/namespaces',
      'type-compatibility': '/handbook/type-compatibility',
      'type-inference': '/handbook/type-inference',
      'type-manipulation': '/handbook/type-manipulation',
      'symbols': '/handbook/symbols',
      'iterators-generators': '/handbook/iterators-generators',
      'module-resolution': '/handbook/module-resolution',
      'namespaces-modules': '/handbook/namespaces-modules',
      'declaration-merging': '/handbook/declaration-merging',
      'mixins': '/handbook/mixins',
      'triple-slash-directives': '/handbook/triple-slash-directives',
      'type-checking-javascript': '/handbook/type-checking-javascript',
      'utility-types': '/handbook/utility-types',
      'advanced-types': '/handbook/advanced-types'
    };

    const docPath = pathMap[path.toLowerCase()] || pathMap['overview'];
    return {
      documentationUrl: `${TS_DOCS_BASE_URL}${docPath}`,
      sections: Object.keys(pathMap).map(key => ({
        name: key,
        url: `${TS_DOCS_BASE_URL}${pathMap[key]}`
      }))
    };
  } catch (error) {
    throw new Error(`Failed to fetch TypeScript documentation: ${error.message}`);
  }
}

async function fetchExpressDocs(path = '') {
  try {
    // Map common paths to their documentation URLs
    const pathMap = {
      'overview': '/en/guide/routing.html',
      'routing': '/en/guide/routing.html',
      'middleware': '/en/guide/using-middleware.html',
      'error-handling': '/en/guide/error-handling.html',
      'database': '/en/guide/database-integration.html',
      'api-reference': '/en/4x/api.html'
    };

    const docPath = pathMap[path.toLowerCase()] || pathMap['overview'];
    return {
      documentationUrl: `${EXPRESS_DOCS_BASE_URL}${docPath}`,
      sections: Object.entries(pathMap).map(([key, value]) => ({
        name: key,
        url: `${EXPRESS_DOCS_BASE_URL}${value}`
      }))
    };
  } catch (error) {
    throw new Error(`Failed to fetch Express documentation: ${error.message}`);
  }
}

async function fetchAWSDocs(path = '') {
  try {
    // Map common paths to their full URLs
    const pathMap = {
      // General AWS Services
      'overview': '/',
      'getting-started': '/getting-started',
      's3': '/s3',
      'lambda': '/lambda',
      'api-gateway': '/api-gateway',
      'eventbridge': '/eventbridge',
      'sqs': '/sqs',
      'rds': '/rds',
      'postgresql': '/rds/postgresql',
      
      // Specific to BoardBreeze needs
      'audio-processing': '/lambda/audio-processing',
      'websockets': '/api-gateway/websockets',
      'file-upload': '/s3/file-upload',
      'presigned-urls': '/s3/presigned-urls',
      'event-processing': '/eventbridge/processing',
      'dead-letter-queues': '/sqs/dead-letter-queues',
      'database': '/rds/database',
      
      // SDK and Tools
      'sdk-js': '/sdk-for-javascript',
      'cli': '/cli',
      'iam': '/iam',
      'security': '/security'
    };

    const fullPath = pathMap[path] || path || '/';
    const response = await axios.get(`${AWS_DOCS_BASE_URL}${fullPath}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch AWS documentation: ${error.message}`);
  }
}

export const documentationTool = {
  name: 'get_docs',
  description: 'Retrieves React, OpenAI, AWS, TypeScript, or Express documentation',
  inputSchema: {
    type: 'object',
    properties: {
      type: {
        type: 'string',
        description: 'Type of documentation to retrieve (react, openai, aws, typescript, or express)',
        enum: ['react', 'openai', 'aws', 'typescript', 'express']
      },
      path: {
        type: 'string',
        description: 'Path to specific documentation section'
      }
    },
    required: ['type']
  },
  handler: async (args) => {
    const { type, path } = args;
    
    switch (type.toLowerCase()) {
      case 'react':
        return await fetchReactDocs(path || '');
      case 'openai':
        return await fetchOpenAIDocs(path || '');
      case 'aws':
        return await fetchAWSDocs(path || '');
      case 'typescript':
        return await fetchTypeScriptDocs(path || '');
      case 'express':
        return await fetchExpressDocs(path || '');
      default:
        throw new Error('Invalid documentation type. Must be "react", "openai", "aws", "typescript", or "express"');
    }
  }
};
