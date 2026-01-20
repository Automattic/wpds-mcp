import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

const TOOLS: Array<(server: McpServer) => void> = [];

export function registerAll(server: McpServer) {
  for (const register of TOOLS) {
    register(server);
  }
}
