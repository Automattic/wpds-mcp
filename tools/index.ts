import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { register as designSystemGuidance } from './design-system-guidance.ts';

const TOOLS: Array<(server: McpServer) => void> = [designSystemGuidance];

export function registerAll(server: McpServer) {
  for (const register of TOOLS) {
    register(server);
  }
}
