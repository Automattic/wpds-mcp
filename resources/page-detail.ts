import {
  McpServer,
  ResourceTemplate,
} from '@modelcontextprotocol/sdk/server/mcp.js';

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
 * Get the site URL from environment variable or use a default
 */
function getSiteUrl(): string {
  return 'https://system.automattic.design/';
}

/**
 * Fetches a single page by slug from a WordPress site via the REST API
 */
async function fetchWordPressPageBySlug(
  siteUrl: string,
  slug: string,
): Promise<WordPressPage | null> {
  const baseUrl = siteUrl.replace(/\/$/, '');
  const apiUrl = `${baseUrl}/wp-json/wp/v2/pages?slug=${encodeURIComponent(slug)}&status=publish`;

  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch page from ${siteUrl}: ${response.status} ${response.statusText}`,
    );
  }

  const pages: WordPressPage[] = await response.json();

  if (pages.length === 0) {
    return null;
  }

  return pages[0];
}

export function register(server: McpServer) {
  const template = new ResourceTemplate('wpds://pages/{slug}', {
    list: undefined,
  });

  server.registerResource(
    'page-detail',
    template,
    {
      description:
        'Detailed information for a WordPress page including full content, metadata, and links',
      mimeType: 'text/markdown',
    },
    async (uri, variables) => {
      const pageSlug = Array.isArray(variables.slug)
        ? variables.slug[0]
        : variables.slug;
      const siteUrl = getSiteUrl();
      const page = await fetchWordPressPageBySlug(siteUrl, pageSlug);

      if (!page) {
        return {
          contents: [
            {
              uri: uri.href,
              mimeType: 'text/markdown',
              text: `# Page Not Found\n\nNo page with slug "${pageSlug}" was found in the WordPress site.`,
            },
          ],
        };
      }

      const sections: string[] = [
        `# ${page.title.rendered}`,
        '',
        `**ID:** ${page.id}`,
        `**Slug:** \`${page.slug}\``,
        `**Link:** ${page.link}`,
        `**Date:** ${new Date(page.date).toLocaleDateString()}`,
        `**Last Modified:** ${new Date(page.modified).toLocaleDateString()}`,
      ];

      if (page.template) {
        sections.push(`**Template:** \`${page.template}\``);
      }

      if (page.menu_order > 0) {
        sections.push(`**Menu Order:** ${page.menu_order}`);
      }

      if (page.excerpt?.rendered) {
        const excerpt = page.excerpt.rendered.replace(/<[^>]*>/g, '').trim();
        if (excerpt) {
          sections.push('', '## Excerpt', '', excerpt);
        }
      }

      if (page.content?.rendered) {
        sections.push('', '## Content', '');
        // Clean up HTML content - remove script and style tags, but preserve structure
        let content = page.content.rendered
          .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
          .trim();

        if (content) {
          sections.push(content);
        }
      }

      sections.push('', '## Metadata', '');
      sections.push(`**Status:** ${page.status}`);
      sections.push(`**Type:** ${page.type}`);
      sections.push(`**Author ID:** ${page.author}`);
      sections.push(`**Comment Status:** ${page.comment_status}`);
      sections.push(`**Ping Status:** ${page.ping_status}`);

      if (page.parent > 0) {
        sections.push(`**Parent ID:** ${page.parent}`);
      }

      if (page.featured_media > 0) {
        sections.push(`**Featured Media ID:** ${page.featured_media}`);
      }

      return {
        contents: [
          {
            uri: uri.href,
            mimeType: 'text/markdown',
            text: sections.join('\n'),
          },
        ],
      };
    },
  );
}
