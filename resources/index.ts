import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { register as components } from './components.ts';
import { register as designTokens } from './design-tokens.ts';

const RESOURCES: Array<(server: McpServer) => void> = [components, designTokens];

export function registerAll(server: McpServer) {
  for (const register of RESOURCES) {
    register(server);
  }
}
