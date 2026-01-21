import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { register as startDesignSystemTask } from './start-design-system-task.ts';

const TOOLS: Array<(server: McpServer) => void> = [startDesignSystemTask];

export function registerAll(server: McpServer) {
  for (const register of TOOLS) {
    register(server);
  }
}
