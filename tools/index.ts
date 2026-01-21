import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { register as startDesignSystemTask } from './start-design-system-task.ts';
import { register as getComponents } from './get-components.ts';
import { register as getComponentDetails } from './get-component-details.ts';
import { register as getDesignTokens } from './get-design-tokens.ts';
import { register as getPages } from './get-pages.ts';

const TOOLS: Array<(server: McpServer) => void> = [
  startDesignSystemTask,
  getComponents,
  getComponentDetails,
  getDesignTokens,
  getPages,
];

export function registerAll(server: McpServer) {
  for (const register of TOOLS) {
    register(server);
  }
}
