import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

const TOKENS_MD_URL =
  'https://raw.githubusercontent.com/WordPress/gutenberg/refs/heads/trunk/packages/theme/docs/tokens.md';

export function register(server: McpServer) {
  server.registerTool(
    'get_design_tokens',
    {
      title: 'Get Design Tokens',
      description:
        'Get the WordPress Design System design tokens reference (colors, spacing, typography, elevation, etc.).',
    },
    async () => {
      const response = await fetch(TOKENS_MD_URL);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch design tokens: ${response.status} ${response.statusText}`,
        );
      }
      const text = await response.text();

      return {
        content: [{ type: 'text', text }],
      };
    },
  );
}
