import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { register as components } from './components.ts';
import { register as designTokens } from './design-tokens.ts';
import { register as pages } from './pages.ts';

const RESOURCES: Array<(server: McpServer) => void> = [components, designTokens, pages];

export function registerAll(server: McpServer) {
  for (const register of RESOURCES) {
    register(server);
  }
}
