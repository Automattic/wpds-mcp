import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

interface WordPressPage {
  id: number;
  date: string;
  date_gmt: string;
  guid: {
    rendered: string;
  };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  parent: number;
  menu_order: number;
  comment_status: string;
  ping_status: string;
  template: string;
  meta: Record<string, unknown>;
  _links: Record<string, unknown>;
}

/**
 * Fetches all public pages from a WordPress site via the REST API
 * Handles pagination to ensure all pages are retrieved
 */
async function fetchWordPressPages(siteUrl: string): Promise<WordPressPage[]> {
  // Ensure the URL doesn't end with a slash
  const baseUrl = siteUrl.replace(/\/$/, '');
  const allPages: WordPressPage[] = [];
  let page = 1;
  const perPage = 100;
  let hasMore = true;

  while (hasMore) {
    const apiUrl = `${baseUrl}/wp-json/wp/v2/pages?per_page=${perPage}&page=${page}&status=publish`;

    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(
        `Failed to fetch pages from ${siteUrl}: ${response.status} ${response.statusText}`
      );
    }

    const pages: WordPressPage[] = await response.json();
    allPages.push(...pages);

    // Check if there are more pages
    const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '1', 10);
    hasMore = page < totalPages;
    page++;
  }

  return allPages;
}

/**
 * Get the site URL from environment variable or use a default
 */
function getSiteUrl(): string {
  return 'https://system.automattic.design/';
}

export function register(server: McpServer) {
  server.registerResource(
    'pages',
    'wpds://pages',
    {
      description:
        'All public pages from the WP.org news site fetched via the REST API.',
      mimeType: 'text/markdown',
    },
    async () => {
      const siteUrl = getSiteUrl();
      const pages = await fetchWordPressPages(siteUrl);

      const markdown = [
        `# WordPress Pages from ${siteUrl}`,
        '',
        `Found ${pages.length} public page(s).`,
        '',
        ...pages.map((page) => {
          const lines = [
            `## ${page.title.rendered}`,
            '',
            `**ID:** ${page.id}`,
            `**Slug:** \`${page.slug}\``,
            `**Link:** ${page.link}`,
            `**Date:** ${new Date(page.date).toLocaleDateString()}`,
          ];

          if (page.excerpt?.rendered) {
            const excerpt = page.excerpt.rendered
              .replace(/<[^>]*>/g, '')
              .trim();
            if (excerpt) {
              lines.push('', `**Excerpt:** ${excerpt}`);
            }
          }

          if (page.content?.rendered) {
            // Strip HTML tags and limit content preview
            const content = page.content.rendered
              .replace(/<[^>]*>/g, '')
              .trim()
              .substring(0, 500);
            if (content) {
              lines.push('', `**Content Preview:** ${content}${content.length === 500 ? '...' : ''}`);
            }
          }

          lines.push('', '---');
          return lines.join('\n');
        }),
      ].join('\n');

      return {
        contents: [
          {
            uri: 'wpds://pages',
            mimeType: 'text/markdown',
            text: markdown,
          },
        ],
      };
    }
  );
}
