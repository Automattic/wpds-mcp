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
        'A **Skills document** is available at `wpds://skills` that contains structured procedures you must read now and follow.',
        '',
        'Fetch the resource `wpds://skills` to begin.',
      ].join('\n');

      return {
        content: [{ type: 'text', text: instructions }],
      };
    },
  );
}
