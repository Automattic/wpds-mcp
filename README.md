# WordPress Design System MCP Server

An [MCP (Model Context Protocol)](https://modelcontextprotocol.io/) server that provides AI assistants with access to WordPress Design System guidance and component information.

## What is this?

This project aggregates design system guidance from the WordPress Design System, making it accessible to AI coding assistants. Currently it provides component information, with plans to expand as the project evolves.

## Getting Started

**Prerequisites:**

- [Node.js](https://nodejs.org/) (v24+)
- pnpm (install using `npm install -g pnpm`)

```bash
# Install dependencies
pnpm install

# Test with the MCP Inspector (recommended for getting started)
pnpm inspect

# Run the server directly
pnpm dev
```

### Using the Inspector

The [MCP Inspector](https://modelcontextprotocol.io/docs/tools/inspector) provides a visual interface to test the server's tools without needing to configure an AI assistant. It's the easiest way to verify everything works and see what data is available.

### Connecting to AI Assistants

Once tested, the server runs on `http://localhost:3945/mcp` and can be connected to AI assistants like Claude Desktop or Cursor.

## License

Licensed under GNU General Public License v2 (or later).
