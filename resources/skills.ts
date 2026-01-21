import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

// TODO: Update this URL to point to the correct skills file location
const SKILLS_URL =
  'https://raw.githubusercontent.com/Automattic/agent-skills/refs/heads/trunk/skills/wp-abilities-api/SKILL.md';

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
-->

`.trimStart();

export function register(server: McpServer) {
  server.registerResource(
    'skills',
    'wpds://skills',
    {
      description:
        'SKILLS DOCUMENT: Structured procedural guide for WordPress Design System tasks. Contains step-by-step procedures that must be followed in order.',
      mimeType: 'text/markdown',
    },
    async () => {
      // TODO: This implementation fetches only the main skills file.
      // It does NOT automatically follow or fetch linked local resources
      // (e.g., references/*.md, scripts, assets) mentioned in the document.
      // In the long terms, we should consider expecting users to install actions
      // independently from the MCP.

      const response = await fetch(SKILLS_URL);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch skills: ${response.status} ${response.statusText}`,
        );
      }
      const skillsContent = await response.text();

      // Prepend the preamble to help LLMs understand this is a Skills document
      const fullContent = SKILLS_PREAMBLE + skillsContent;

      return {
        contents: [
          {
            uri: 'wpds://skills',
            mimeType: 'text/markdown',
            text: fullContent,
          },
        ],
      };
    },
  );
}
