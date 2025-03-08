const config = {
  port: 3000,
  secret: process.env.CLINE_SECRET,
  server: {
    name: 'boardbreeze-mcp',
    version: '1.0.0'
  },
  tools: {
    baseDir: './tools',
    enabled: ['list_tools', 'get_react_docs']
  }
};

export default config;
