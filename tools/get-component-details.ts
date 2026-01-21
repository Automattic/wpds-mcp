import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { getComponentDetail } from '../lib/wpds.ts';

export function register(server: McpServer) {
  server.registerTool(
    'get_component_details',
    {
      title: 'Get Component Details',
      description:
        'Get detailed documentation for a WordPress Design System component including props, usage examples, and import statements.',
      inputSchema: {
        name: z
          .string()
          .describe('The component name (e.g., "Button", "Modal")'),
      },
    },
    async ({ name }) => {
      const component = await getComponentDetail(name);

      if (!component) {
        return {
          content: [
            {
              type: 'text',
              text: `No component named "${name}" was found in the WordPress Design System.`,
            },
          ],
        };
      }

      const sections: string[] = [
        `# ${component.name}`,
        '',
        `**Package:** \`${component.packageName}\``,
      ];

      if (component.description) {
        sections.push('', '## Description', '', component.description);
      }

      if (component.importStatement) {
        sections.push(
          '',
          '## Import',
          '',
          '```js',
          component.importStatement,
          '```',
        );
      }

      // Filter out deprecated props - they shouldn't be used
      const props = component.props.filter((p) => !p.deprecated);

      if (props.length > 0) {
        sections.push('', '## Props', '');
        for (const prop of props) {
          const requiredBadge = prop.required ? ' **(required)**' : '';
          const defaultNote = prop.defaultValue
            ? ` (default: \`${prop.defaultValue}\`)`
            : '';
          sections.push(
            `### \`${prop.name}\`: \`${prop.type}\`${requiredBadge}${defaultNote}`,
            '',
          );
          if (prop.description) {
            // Clean up description - remove @default annotations since we show them above
            const cleanDesc = prop.description
              .replace(/@default\s+[^\n]+/gi, '')
              .trim();
            if (cleanDesc) {
              sections.push(cleanDesc, '');
            }
          }
        }
      }

      if (component.stories.length > 0) {
        sections.push('', '## Examples', '');
        for (const story of component.stories) {
          sections.push(`### ${story.name}`);
          if (story.snippet) {
            sections.push('', '```jsx', story.snippet, '```');
          }
          sections.push('');
        }
      }

      const markdown = sections.join('\n');

      return {
        content: [{ type: 'text', text: markdown }],
      };
    },
  );
}
