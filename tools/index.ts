import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { register as listComponents } from './list-components.ts';

const TOOLS = [listComponents];

export function registerAll(server: McpServer) {
  for (const register of TOOLS) {
    register(server);
  }
}
