import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

const TOKENS_MD_URL =
  'https://raw.githubusercontent.com/WordPress/gutenberg/refs/heads/trunk/packages/theme/docs/tokens.md';

export function register(server: McpServer) {
  server.registerResource(
    'design-tokens',
    'wpds://design-tokens',
    {
      description:
        'WordPress Design System design tokens reference (colors, spacing, typography, elevation, etc.)',
      mimeType: 'text/markdown',
    },
    async () => {
      const response = await fetch(TOKENS_MD_URL);
      const text = await response.text();

      return {
        contents: [
          {
            uri: 'wpds://design-tokens',
            mimeType: 'text/markdown',
            text,
          },
        ],
      };
    },
  );
}
