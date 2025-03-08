import fetch from 'node-fetch';

export const docsTools = new Map([
  ['typescript_docs', async (params) => {
    const { section = 'handbook' } = params;
    const BASE_URL = 'https://raw.githubusercontent.com/microsoft/TypeScript-Website/v2/packages/documentation/copy/en';
    
    try {
      const response = await fetch(`${BASE_URL}/${section}.md`);
      if (!response.ok) {
        throw new Error(`Failed to fetch TypeScript docs: ${response.statusText}`);
      }
      
      const content = await response.text();
      return {
        content,
        source: 'TypeScript Documentation',
        section
      };
    } catch (error) {
      throw new Error(`TypeScript docs fetch failed: ${error.message}`);
    }
  }]
]);
