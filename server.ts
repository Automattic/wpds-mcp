import { randomUUID } from 'crypto';
import { createMcpExpressApp } from '@modelcontextprotocol/sdk/server/express.js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { isInitializeRequest } from '@modelcontextprotocol/sdk/types.js';
import cors from 'cors';
import { registerAll as registerTools } from './tools/index.ts';

// Parse CLI arguments
const args = process.argv.slice(2);
const useStdio = args.includes('--stdio');
const useHttp = args.includes('--http') || !useStdio; // Default to HTTP if neither flag is specified

const server = new McpServer({
  name: 'WPDS',
  version: '1.0.0',
  description:
    'A Model Context Protocol server for the WordPress Design System',
});

registerTools(server);

if (useStdio) {
  // Use stdio transport
  const transport = new StdioServerTransport();
  await server.connect(transport);
} else if (useHttp) {
  // Use HTTP transport with Express
  const app = createMcpExpressApp();

  // Store transports by session ID (required for GET /mcp to find the right transport)
  const transports: Record<string, StreamableHTTPServerTransport> = {};

  app.use(
    cors({
      origin: true,
      exposedHeaders: ['mcp-session-id'],
      methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
      allowedHeaders: [
        'Content-Type',
        'mcp-session-id',
        'mcp-protocol-version',
      ],
    }),
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
      res.status(400).json({
        jsonrpc: '2.0',
        error: { code: -32000, message: 'Bad request' },
        id: null,
      });
      return;
    }

    await transport.handleRequest(req, res, req.body);
  });

  // GET /mcp - SSE stream (required by Cursor for server→client notifications)
  app.get('/mcp', async (req, res) => {
    const sessionId = req.headers['mcp-session-id'] as string | undefined;
    if (!sessionId || !transports[sessionId]) {
      res.status(404).json({
        jsonrpc: '2.0',
        error: { code: -32000, message: 'Session not found' },
        id: null,
      });
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
      res.status(404).json({
        jsonrpc: '2.0',
        error: { code: -32000, message: 'Session not found' },
        id: null,
      });
    }
  });

  const port = 3945;
  app.listen(port);
  console.log(`Server is running on port ${port} (HTTP transport)`);
}
