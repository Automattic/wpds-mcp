> [!IMPORTANT]
> This repository has been archived. Consider using the [`@wordpress/design-system-mcp` package](https://github.com/WordPress/gutenberg/tree/trunk/packages/design-system-mcp) instead.

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

# Run the server directly (defaults to HTTP transport)
pnpm dev

# Run with stdio transport
pnpm dev -- --stdio

# Run with HTTP transport explicitly
pnpm dev -- --http
```

### Transport Modes

The server supports two transport modes:

- **HTTP transport** (default): Runs an Express server on `http://localhost:3945/mcp`. Suitable for web-based clients like Cursor.
- **stdio transport**: Uses standard input/output. Suitable for local MCP clients like Claude Desktop.

Select the transport mode using CLI arguments:

- `--http` - Use HTTP transport (default)
- `--stdio` - Use stdio transport

### Using the Inspector

The [MCP Inspector](https://modelcontextprotocol.io/docs/tools/inspector) provides a visual interface to test the server's tools without needing to configure an AI assistant. It's the easiest way to verify everything works and see what data is available.

### Connecting to AI Assistants

**Claude Desktop (stdio transport):**

Add to your Claude Desktop configuration file (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "wpds": {
      "command": "node",
      "args": ["/path/to/wpds-mcp/server.ts", "--stdio"]
    }
  }
}
```

Replace `/path/to/wpds-mcp/server.ts` with the absolute path to this server file.

**Cursor or other HTTP clients:**

The server runs on `http://localhost:3945/mcp` by default when using HTTP transport. Configure your client to connect to this endpoint.

## License

Licensed under GNU General Public License v2 (or later).
