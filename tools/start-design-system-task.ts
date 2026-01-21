import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

const SKILLS_URL =
  'https://raw.githubusercontent.com/Automattic/agent-skills/refs/heads/trunk/skills/wpds/SKILL.md';

const SKILLS_PREAMBLE = `
<!-- SKILLS DOCUMENT - FOLLOW THESE INSTRUCTIONS -->
<!--
This is a SKILLS DOCUMENT, not regular documentation.

HOW TO USE THIS DOCUMENT:
1. This document contains rules you must follow step-by-step
2. Make sure all the points in the "Prerequisites" sections are satisfied.
3. Read the "When to use" section to confirm this skill applies to your task.
4. Follow all the points from the "Rules" section
5. Do not skip steps or improvise unless the document explicitly allows it
6. Follow the "Output" section in order to format the reply to the task

IMPORTANT - TOOL USAGE (overrides resource references below):
When this document mentions fetching resources like wpds://..., use these tools instead:
- For component list: use the \`get_components\` tool
- For component details: use the \`get_component_details\` tool with the component name
- For design tokens: use the \`get_design_tokens\` tool
- For reference site pages: use the \`get_pages\` tool
-->

`.trimStart();

export function register(server: McpServer) {
  server.registerTool(
    'start_design_system_task',
    {
      title: 'Start Design System Task',
      description:
        'REQUIRED FIRST STEP for any WordPress Design System work. Returns a Skills document that you MUST follow step-by-step.',
    },
    async () => {
      const response = await fetch(SKILLS_URL);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch skills: ${response.status} ${response.statusText}`,
        );
      }
      const skillsContent = await response.text();
      const fullContent = SKILLS_PREAMBLE + skillsContent;

      return {
        content: [{ type: 'text', text: fullContent }],
      };
    },
  );
}
