import { randomUUID } from 'crypto';
import { createMcpExpressApp } from '@modelcontextprotocol/sdk/server/express.js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { isInitializeRequest } from '@modelcontextprotocol/sdk/types.js';
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

// Store transports by session ID (required for GET /mcp to find the right transport)
const transports: Record<string, StreamableHTTPServerTransport> = {};

app.use(
  cors({
    origin: true,
    exposedHeaders: ['mcp-session-id'],
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'mcp-session-id'],
  })
);

// POST /mcp - Handle client messages
app.post('/mcp', async (req, res) => {
  const sessionId = req.headers['mcp-session-id'] as string | undefined;
  let transport: StreamableHTTPServerTransport;

  if (sessionId && transports[sessionId]) {
    // Existing session - reuse transport
    transport = transports[sessionId];
  } else if (!sessionId && isInitializeRequest(req.body)) {
    // New session - create and store transport
    transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => randomUUID(),
      onsessioninitialized: (sid) => {
        transports[sid] = transport;
      },
    });
    await server.connect(transport);
  } else {
    res.status(400).json({ jsonrpc: '2.0', error: { code: -32000, message: 'Bad request' }, id: null });
    return;
  }

  await transport.handleRequest(req, res, req.body);
});

// GET /mcp - SSE stream (required by Cursor for server→client notifications)
app.get('/mcp', async (req, res) => {
  const sessionId = req.headers['mcp-session-id'] as string | undefined;
  if (!sessionId || !transports[sessionId]) {
    res.status(404).json({ jsonrpc: '2.0', error: { code: -32000, message: 'Session not found' }, id: null });
    return;
  }
  await transports[sessionId].handleRequest(req, res);
});

// DELETE /mcp - Session cleanup (optional but recommended)
app.delete('/mcp', async (req, res) => {
  const sessionId = req.headers['mcp-session-id'] as string | undefined;
  if (sessionId && transports[sessionId]) {
    await transports[sessionId].handleRequest(req, res);
    delete transports[sessionId];
  } else {
    res.status(404).json({ jsonrpc: '2.0', error: { code: -32000, message: 'Session not found' }, id: null });
  }
});

app.listen(3945);
console.log('Server is running on port 3945');
