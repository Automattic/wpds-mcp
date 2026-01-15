import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { getComponents } from '../lib/wpds.ts';

export function register(server: McpServer) {
  server.registerTool(
    'list_components',
    {
      title: 'List Components',
      description: 'List available components in the WordPress Design System',
      inputSchema: z.object({}),
    },
    async () => {
      const components = await getComponents();
      const text = components
        .map(({ name, description }) => `- **${name}**: ${description}`)
        .join('\n');

      return {
        content: [{ type: 'text', text }],
        structuredContent: { components },
      };
    }
  );
}
