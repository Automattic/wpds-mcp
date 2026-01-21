import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { getComponents } from '../lib/wpds.ts';

export function register(server: McpServer) {
  server.registerTool(
    'get_components',
    {
      title: 'Get Components',
      description:
        'Get a list of all available WordPress Design System components with their package names and descriptions.',
    },
    async () => {
      const components = await getComponents();

      const markdown = [
        '# WordPress Design System Components',
        '',
        '> For detailed documentation on any component, use the `get_component_details` tool with the component name.',
        '> Example: `get_component_details({ name: "Button" })`',
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
        content: [{ type: 'text', text: markdown }],
      };
    },
  );
}
