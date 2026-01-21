import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

// TODO: Update this URL to point to the correct skills file location
const SKILLS_URL =
  'https://raw.githubusercontent.com/Automattic/agent-skills/refs/heads/trunk/skills/wp-abilities-api/SKILL.md';

const SKILLS_PREAMBLE = `
<!-- SKILLS DOCUMENT - FOLLOW THESE INSTRUCTIONS -->
<!--
This is a SKILLS DOCUMENT, not regular documentation.

HOW TO USE THIS DOCUMENT:
1. This document contains PROCEDURES you must follow step-by-step
2. Read the "When to use" section to confirm this skill applies to your task
3. Gather all items listed in "Inputs required" before starting
4. Execute each step in the "Procedure" section IN ORDER
5. Do not skip steps or improvise unless the document explicitly allows it
6. Complete all "Verification" checks before considering the task done
7. If something fails, consult "Failure modes / debugging" before asking for help

DOCUMENT STRUCTURE:
- Frontmatter (YAML): metadata about the skill (name, description, compatibility)
- When to use: conditions that trigger this skill
- Inputs required: prerequisites you must have
- Procedure: numbered steps to follow sequentially
- Verification: how to confirm success
- Failure modes: common problems and solutions
- Escalation: when and how to seek help
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
      // To support linked resources, consider:
      // - Adding a separate tool like `get_skill_reference` to fetch them on demand
      // - Pre-processing to concatenate all referenced content
      // - Registering referenced files as MCP resources

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
