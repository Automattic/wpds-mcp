import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export function register(server: McpServer) {
  server.registerTool(
    'start_design_system_task',
    {
      title: 'Start Design System Task',
      description:
        'REQUIRED FIRST STEP for any WordPress Design System work. Returns a Skills document that you MUST follow step-by-step.',
    },
    async () => {
      const instructions = [
        '## IMPORTANT: Skills Document Available',
        '',
        'A **Skills document** is available at `wpds://skills` that contains structured procedures you must follow.',
        '',
        '### What is a Skills document?',
        '',
        'A Skills document is NOT just informational markdown. It is a **procedural guide** with:',
        '- **When to use**: Conditions that determine if this skill applies to your task',
        '- **Inputs required**: Information you must gather before proceeding',
        '- **Procedure**: Step-by-step instructions you MUST follow in order',
        '- **Verification**: How to confirm the task was completed correctly',
        '- **Failure modes**: Common issues and how to debug them',
        '',
        '### Instructions',
        '',
        '1. Read the `wpds://skills` resource now',
        '2. Check the "When to use" section to confirm this skill applies',
        '3. Gather all "Inputs required"',
        '4. Follow the "Procedure" steps sequentially',
        '5. Complete "Verification" before considering the task done',
        '',
        'Fetch the resource `wpds://skills` to begin.',
      ].join('\n');

      return {
        content: [{ type: 'text', text: instructions }],
      };
    },
  );
}
