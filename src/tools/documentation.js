import axios from 'axios';

const REACT_DOCS_BASE_URL = 'https://api.github.com/repos/reactjs/react.dev/contents/src/content';
const OPENAI_DOCS_BASE_URL = 'https://api.openai.com';
const AWS_DOCS_BASE_URL = 'https://docs.aws.amazon.com';
const TS_DOCS_BASE_URL = 'https://www.typescriptlang.org/docs';
const EXPRESS_DOCS_BASE_URL = 'https://expressjs.com';
const VERCEL_DOCS_BASE_URL = 'https://vercel.com/docs';

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
      'security': '/security',
      
      // AWS Amplify Documentation
      'amplify': '/amplify',
      'amplify-hosting': '/amplify/hosting',
      'amplify-build-settings': '/amplify/build-settings',
      'amplify-environment-variables': '/amplify/environment-variables',
      'amplify-custom-domains': '/amplify/custom-domains',
      'amplify-nextjs': '/amplify/nextjs',
      'amplify-deploy': '/amplify/deploy',
      'amplify-troubleshooting': '/amplify/troubleshooting',
      'amplify-ssr': '/amplify/ssr',
      'amplify-404-errors': '/amplify/troubleshooting/404-errors',
      'amplify-build-errors': '/amplify/troubleshooting/build-errors',
      'amplify-env-vars': '/amplify/environment-variables',
      'amplify-rewrites': '/amplify/rewrites-redirects',
      'amplify-monorepo': '/amplify/monorepo-deployment'
    };

    // Special handling for Amplify documentation
    if (path && path.toLowerCase().startsWith('amplify')) {
      return {
        documentationUrl: `https://docs.amplify.aws/${path.replace('amplify-', '')}`,
        sections: Object.entries(pathMap)
          .filter(([key]) => key.startsWith('amplify'))
          .map(([key, value]) => ({
            name: key,
            url: `https://docs.amplify.aws${value.replace('/amplify', '')}`
          })),
        content: {
          title: `AWS Amplify Documentation - ${path.replace('amplify-', '').replace(/-/g, ' ')}`,
          description: "AWS Amplify is a set of tools and services that enables mobile and front-end web developers to build secure, scalable full stack applications.",
          commonIssues: path.includes('404-errors') ? [
            "Missing environment variables in Amplify console",
            "Build errors preventing successful deployment",
            "Incorrect output directory configuration",
            "Missing or incorrect rewrites/redirects",
            "Issues with Next.js SSR configuration",
            "Monorepo configuration issues"
          ] : [],
          solutions: path.includes('404-errors') ? [
            "Check build logs for errors",
            "Verify environment variables are correctly set in Amplify console",
            "Ensure build output directory matches Amplify configuration",
            "Check Next.js configuration for proper output settings",
            "Verify rewrites and redirects are properly configured",
            "For monorepos, ensure proper base directory and build settings"
          ] : []
        }
      };
    }

    const fullPath = pathMap[path] || path || '/';
    const response = await axios.get(`${AWS_DOCS_BASE_URL}${fullPath}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch AWS documentation: ${error.message}`);
  }
}

async function fetchVercelDocs(path = '') {
  try {
    // Map common paths to their documentation URLs
    const pathMap = {
      'overview': '',
      'getting-started': '/getting-started',
      'deployments': '/deployments',
      'cli': '/cli',
      'git': '/git',
      'projects': '/projects',
      'storage': '/storage',
      'edge-network': '/edge-network',
      'functions': '/functions',
      'serverless-functions': '/functions/serverless-functions',
      'edge-functions': '/functions/edge-functions',
      'build-output-api': '/build-output-api',
      'monorepos': '/monorepos',
      'environment-variables': '/environment-variables',
      'webhooks': '/webhooks',
      'security': '/security',
      'frameworks': '/frameworks',
      'nextjs': '/frameworks/nextjs',
      'react': '/frameworks/react',
      'svelte': '/frameworks/svelte',
      'nuxt': '/frameworks/nuxt',
      'vue': '/frameworks/vue',
      'astro': '/frameworks/astro',
      'performance': '/limits/performance',
      'analytics': '/analytics',
      'troubleshooting': '/troubleshooting'
    };

    const docPath = pathMap[path.toLowerCase()] || path || '';
    const fullUrl = `${VERCEL_DOCS_BASE_URL}${docPath}`;

    return {
      documentationUrl: fullUrl,
      sections: Object.entries(pathMap).map(([key, value]) => ({
        name: key,
        url: `${VERCEL_DOCS_BASE_URL}${value}`
      })),
      content: {
        title: `Vercel Documentation${path ? ` - ${path.replace(/-/g, ' ')}` : ''}`,
        description: "Vercel is the platform for frontend developers, providing the speed and reliability innovators need to create at the moment of inspiration.",
        sections: [
          "Deployments - How to deploy projects to Vercel",
          "Functions - Serverless and Edge Functions on Vercel",
          "Git Integration - Connect with GitHub, GitLab, and Bitbucket",
          "Environment Variables - Secure environment configuration",
          "CLI - The Vercel command-line interface",
          "Frameworks - Optimized support for popular frameworks",
          "Storage - Persistence solutions for Vercel apps"
        ]
      }
    };
  } catch (error) {
    throw new Error(`Failed to fetch Vercel documentation: ${error.message}`);
  }
}

export const documentationTool = {
  name: 'get_docs',
  description: 'Retrieves React, OpenAI, AWS, TypeScript, Express, or Vercel documentation',
  inputSchema: {
    type: 'object',
    properties: {
      type: {
        type: 'string',
        description: 'Type of documentation to retrieve (react, openai, aws, typescript, express, or vercel)',
        enum: ['react', 'openai', 'aws', 'typescript', 'express', 'vercel']
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
      case 'vercel':
        return await fetchVercelDocs(path || '');
      default:
        throw new Error('Invalid documentation type. Must be "react", "openai", "aws", "typescript", "express", or "vercel"');
    }
  }
};
