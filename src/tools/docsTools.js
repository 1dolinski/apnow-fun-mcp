import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';
import { execAsync } from './utils.js';

export const docsTools = new Map([
  // OpenAI Documentation Tool
  ['openaiDocs', async (params) => {
    const { topic, category = 'general' } = params;
    const OPENAI_COOKBOOK_BASE = 'https://raw.githubusercontent.com/openai/openai-cookbook/main';
    
    try {
      // First, fetch the cookbook structure
      const response = await fetch(`${OPENAI_COOKBOOK_BASE}/README.md`);
      const content = await response.text();
      
      // Parse the content for relevant sections
      const sections = content.split('\n#').filter(section => 
        section.toLowerCase().includes(topic?.toLowerCase() || '')
      );

      return {
        matches: sections.map(section => {
          const lines = section.split('\n');
          const title = lines[0].trim();
          const content = lines.slice(1).join('\n').trim();
          return { title, content };
        }),
        source: 'OpenAI Cookbook',
        category
      };
    } catch (error) {
      throw new Error(`OpenAI docs fetch failed: ${error.message}`);
    }
  }],

  // Vite Documentation Tool
  ['viteDocs', async (params) => {
    const { topic, version = 'latest' } = params;
    const VITE_DOCS_BASE = 'https://raw.githubusercontent.com/vitejs/vite/main/docs/config';
    
    try {
      const response = await fetch(`${VITE_DOCS_BASE}/README.md`);
      const content = await response.text();
      
      return {
        content,
        version,
        topic,
        source: 'Vite Documentation'
      };
    } catch (error) {
      throw new Error(`Vite docs fetch failed: ${error.message}`);
    }
  }],

  // Project Setup Helper
  ['projectSetup', async (params) => {
    const { 
      template = 'vanilla',
      useOpenAI = true,
      useTypeScript = true,
      directory = '.'
    } = params;
    
    try {
      // Initialize Vite project
      await execAsync(`npm create vite@latest ${directory} -- --template ${template}`);
      
      // Change to project directory
      process.chdir(directory);
      
      // Install base dependencies
      await execAsync('npm install');
      
      // Install OpenAI if requested
      if (useOpenAI) {
        await execAsync('npm install openai');
      }
      
      // Add TypeScript if requested
      if (useTypeScript && !template.includes('typescript')) {
        await execAsync('npm install -D typescript @types/node');
        
        // Create tsconfig.json if it doesn't exist
        const tsConfig = {
          compilerOptions: {
            target: "ESNext",
            useDefineForClassFields: true,
            lib: ["DOM", "DOM.Iterable", "ESNext"],
            allowJs: false,
            skipLibCheck: true,
            esModuleInterop: true,
            allowSyntheticDefaultImports: true,
            strict: true,
            forceConsistentCasingInFileNames: true,
            module: "ESNext",
            moduleResolution: "Node",
            resolveJsonModule: true,
            isolatedModules: true,
            noEmit: true,
            jsx: "react-jsx"
          },
          include: ["src"],
          references: [{ path: "./tsconfig.node.json" }]
        };
        
        await fs.writeFile('tsconfig.json', JSON.stringify(tsConfig, null, 2));
      }
      
      return {
        success: true,
        projectDirectory: directory,
        template,
        features: {
          openai: useOpenAI,
          typescript: useTypeScript
        }
      };
    } catch (error) {
      throw new Error(`Project setup failed: ${error.message}`);
    }
  }],

  // OpenAI Integration Helper
  ['setupOpenAI', async (params) => {
    const { directory = '.' } = params;
    
    try {
      // Create OpenAI configuration
      const openaiConfig = `
// src/config/openai.ts
import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  // Customize additional options here
});

// Example usage function
export async function createCompletion(prompt: string) {
  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
    });
    
    return completion.choices[0].message;
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
}
`;

      const configDir = path.join(directory, 'src', 'config');
      await fs.mkdir(configDir, { recursive: true });
      await fs.writeFile(path.join(configDir, 'openai.ts'), openaiConfig);
      
      // Create .env template
      const envTemplate = `
OPENAI_API_KEY=your_api_key_here
VITE_OPENAI_API_KEY=\${OPENAI_API_KEY}
`;
      
      await fs.writeFile(path.join(directory, '.env.template'), envTemplate);
      
      // Update .gitignore
      const gitignoreUpdate = `
# OpenAI
.env
.env.local
`;
      
      await fs.appendFile(path.join(directory, '.gitignore'), gitignoreUpdate);
      
      return {
        success: true,
        files: {
          config: 'src/config/openai.ts',
          envTemplate: '.env.template',
          gitignore: '.gitignore (updated)'
        }
      };
    } catch (error) {
      throw new Error(`OpenAI setup failed: ${error.message}`);
    }
  }],

  // Development Workflow Helper
  ['devWorkflow', async (params) => {
    const { directory = '.' } = params;
    
    try {
      // Create script to combine Vite and OpenAI development
      const packageJson = JSON.parse(await fs.readFile(path.join(directory, 'package.json'), 'utf-8'));
      
      // Add custom scripts
      packageJson.scripts = {
        ...packageJson.scripts,
        "dev:api": "node server/api.js",
        "dev:all": "concurrently \"npm run dev\" \"npm run dev:api\"",
        "type-check": "tsc --noEmit",
        "lint": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
        "format": "prettier --write \"src/**/*.{ts,tsx,css,md}\""
      };
      
      // Add development dependencies
      await execAsync('npm install -D concurrently prettier eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin');
      
      // Write updated package.json
      await fs.writeFile(
        path.join(directory, 'package.json'),
        JSON.stringify(packageJson, null, 2)
      );
      
      // Create API server template
      const apiServer = `
// server/api.js
import express from 'express';
import cors from 'cors';
import { openai } from '../src/config/openai.js';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.API_PORT || 3001;

app.post('/api/completion', async (req, res) => {
  try {
    const { prompt } = req.body;
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
    });
    
    res.json({ success: true, data: completion.choices[0].message });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(\`API server running on port \${PORT}\`);
});
`;
      
      // Create server directory and API file
      await fs.mkdir(path.join(directory, 'server'), { recursive: true });
      await fs.writeFile(path.join(directory, 'server', 'api.js'), apiServer);
      
      return {
        success: true,
        updates: {
          scripts: Object.keys(packageJson.scripts),
          newFiles: ['server/api.js']
        }
      };
    } catch (error) {
      throw new Error(`Development workflow setup failed: ${error.message}`);
    }
  }]
]);
