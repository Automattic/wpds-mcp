import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { register as components } from './components.ts';

const RESOURCES: Array<(server: McpServer) => void> = [components];

export function registerAll(server: McpServer) {
  for (const register of RESOURCES) {
    register(server);
  }
}
