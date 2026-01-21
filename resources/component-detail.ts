import {
  McpServer,
  ResourceTemplate,
} from '@modelcontextprotocol/sdk/server/mcp.js';
import { getComponentDetail } from '../lib/wpds.ts';

export function register(server: McpServer) {
  const template = new ResourceTemplate('wpds://components/{name}', {
    list: undefined,
  });

  server.registerResource(
    'component-detail',
    template,
    {
      description:
        'Detailed documentation for a WordPress Design System component including props, usage examples, and import statements',
      mimeType: 'text/markdown',
    },
    async (uri, variables) => {
      const componentName = Array.isArray(variables.name)
        ? variables.name[0]
        : variables.name;
      const component = await getComponentDetail(componentName);

      if (!component) {
        return {
          contents: [
            {
              uri: uri.href,
              mimeType: 'text/markdown',
              text: `# Component Not Found\n\nNo component named "${componentName}" was found in the WordPress Design System.`,
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
          '```'
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
            ''
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

      return {
        contents: [
          {
            uri: uri.href,
            mimeType: 'text/markdown',
            text: sections.join('\n'),
          },
        ],
      };
    }
  );
}
