import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function register(server: McpServer) {
  server.registerTool(
    'start_design_system_task',
    {
      title: 'Design System Guidance',
      description:
        'REQUIRED FIRST STEP Provides workflow guidance and component recommendations for WordPress Design System work. Use this tool for any design system-related tasks.',
      inputSchema: z.object({
        query: z
          .string()
          .optional()
          .describe(
            'Optional specific query or topic to search for in the guidance document. If not provided, returns all guidance.'
          ),
      }),
    },
    async (args) => {
      try {
        // Read the guidance markdown file
        const guidancePath = join(
          __dirname,
          '..',
          'guidance',
          'design-system-workflow.md'
        );
        const guidanceContent = await readFile(guidancePath, 'utf-8');

        // If a query is provided, filter relevant sections
        let responseText = guidanceContent;

        if (args.query) {
          const queryLower = args.query.toLowerCase();
          const lines = guidanceContent.split('\n');
          const relevantSections: string[] = [];
          let currentSection: string[] = [];
          let inRelevantSection = false;

          for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const lineLower = line.toLowerCase();

            // Check if this line contains the query
            if (lineLower.includes(queryLower)) {
              // Include heading and content
              inRelevantSection = true;
              // Include previous heading if exists
              if (i > 0 && lines[i - 1].startsWith('#')) {
                currentSection.push(lines[i - 1]);
              }
              currentSection.push(line);

              // Include following lines until next heading
              for (let j = i + 1; j < lines.length; j++) {
                if (lines[j].startsWith('#') && lines[j].match(/^#+\s/)) {
                  break;
                }
                currentSection.push(lines[j]);
              }

              relevantSections.push(currentSection.join('\n'));
              currentSection = [];
              inRelevantSection = false;
            }
          }

          if (relevantSections.length > 0) {
            responseText =
              `## Guidance related to: "${args.query}"\n\n` +
              relevantSections.join('\n\n---\n\n');
          } else {
            responseText =
              `## No specific matches found for "${args.query}"\n\n` +
              'Here is the complete guidance document:\n\n' +
              guidanceContent;
          }
        }

        return {
          content: [{ type: 'text', text: responseText }],
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        return {
          content: [
            {
              type: 'text',
              text: `Error reading design system guidance: ${errorMessage}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}
