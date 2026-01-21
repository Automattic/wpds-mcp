import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export function register(server: McpServer) {
  server.registerTool(
    'start_design_system_task',
    {
      title: 'Start Design System Task',
      description: 'REQUIRED FIRST STEP for any WordPress Design System work.',
    },
    async () => {
      const instructions = [
        '## IMPORTANT: Skills Document Available',
        '',
        'For the best results, make sure you have installed the WPDS skills for your agent.',
      ].join('\n');

      return {
        content: [{ type: 'text', text: instructions }],
      };
    },
  );
}
