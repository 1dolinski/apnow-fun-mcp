import fs from 'fs/promises';
import path from 'path';

export const projectTools = new Map([
  ['getProjectStructure', async (params) => {
    const { directory = '.' } = params;
    
    async function readDirectory(dir) {
      const items = await fs.readdir(dir, { withFileTypes: true });
      const result = [];
      
      for (const item of items) {
        if (item.name.startsWith('.')) continue;
        
        if (item.isDirectory()) {
          const children = await readDirectory(path.join(dir, item.name));
          result.push({
            name: item.name,
            type: 'directory',
            children
          });
        } else {
          result.push({
            name: item.name,
            type: 'file'
          });
        }
      }
      
      return result;
    }
    
    return await readDirectory(directory);
  }],
  
  ['readFile', async (params) => {
    const { filePath } = params;
    const content = await fs.readFile(filePath, 'utf-8');
    return { content };
  }],
  
  ['getPackageInfo', async (params) => {
    const { directory = '.' } = params;
    const packagePath = path.join(directory, 'package.json');
    
    try {
      const content = await fs.readFile(packagePath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      throw new Error('package.json not found or invalid');
    }
  }]
]);
