import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { register as componentDetail } from './component-detail.ts';
import { register as components } from './components.ts';
import { register as designTokens } from './design-tokens.ts';
import { register as pageDetail } from './page-detail.ts';
import { register as pages } from './pages.ts';
import { register as skills } from './skills.ts';

const RESOURCES: Array<(server: McpServer) => void> = [
  components,
  designTokens,
  componentDetail,
  pageDetail,
  pages,
  skills,
];

export function registerAll(server: McpServer) {
  for (const register of RESOURCES) {
    register(server);
  }
}
