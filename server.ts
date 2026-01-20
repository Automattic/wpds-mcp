import { createMcpExpressApp } from '@modelcontextprotocol/sdk/server/express.js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import cors from 'cors';
import { registerAll as registerResources } from './resources/index.ts';
import { registerAll as registerTools } from './tools/index.ts';

const app = createMcpExpressApp();
const server = new McpServer({
  name: 'WPDS',
  version: '1.0.0',
});

registerResources(server);
registerTools(server);

app.use(
  cors({
    origin: 'http://localhost:6274',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'mcp-protocol-version'],
  })
);

app.post('/mcp', async (req, res) => {
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });
  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
});

app.listen(3945);
console.log('Server is running on port 3945');
