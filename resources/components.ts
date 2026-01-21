import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { getComponents } from '../lib/wpds.ts';

export function register(server: McpServer) {
  server.registerResource(
    'components',
    'wpds://components',
    {
      description:
        'Index of available components. For detailed docs, fetch wpds://components/{name}',
      mimeType: 'text/markdown',
    },
    async () => {
      const components = await getComponents();

      const markdown = [
        '# WordPress Design System Components',
        '',
        '> For detailed documentation on any component, fetch `wpds://components/{component-name}`',
        '> Example: `wpds://components/Button`',
        '',
        'Available components listed below. Import using: `import { ComponentName } from "package-name";`',
        '',
        ...components.map(({ name, description, packageName }) => {
          const lines = [`## ${name}`, '', `**Package:** \`${packageName}\``];
          if (description) {
            lines.push('', description);
          }
          return lines.join('\n');
        }),
      ].join('\n');

      return {
        contents: [
          {
            uri: 'wpds://components',
            mimeType: 'text/markdown',
            text: markdown,
          },
        ],
      };
    },
  );
}
