import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import toolsData from '../data/tools.json';

export const prerender = true;

const CATEGORY_LABELS: Record<string, string> = {
  'svg-tools': 'SVG Tools',
  'developer-tools': 'Developer Tools',
  'seo-tools': 'SEO Tools',
};

export const GET: APIRoute = async () => {
  const siteUrl = 'https://pixelquil.com';
  const guides = await getCollection('guides');

  const byCategory: Record<string, any[]> = {
    'svg-tools': [],
    'developer-tools': [],
    'seo-tools': [],
  };

  for (const tool of toolsData as any[]) {
    if (byCategory[tool.category]) {
      byCategory[tool.category].push(tool);
    }
  }

  let output = `# Pixelquil

> Privacy-first, browser-based tools for SVG editing, developer utilities, and technical SEO. Every tool runs entirely client-side, nothing you upload or paste is ever sent to a server.

`;

  for (const categorySlug of Object.keys(CATEGORY_LABELS)) {
    output += `## ${CATEGORY_LABELS[categorySlug]}\n`;
    for (const tool of byCategory[categorySlug]) {
      output += `- [${tool.title}](${siteUrl}/${categorySlug}/${tool.slug}/): ${tool.description}\n`;
    }
    output += `\n`;
  }

  output += `## Guides\n`;
  for (const guide of guides) {
    const title = guide.data.title ?? guide.id;
    const description = guide.data.description ?? '';
    output += `- [${title}](${siteUrl}/guides/${guide.id}/): ${description}\n`;
  }

  output += `\n## Optional\n- [About](${siteUrl}/about/)\n- [FAQs](${siteUrl}/faqs/)\n- [Sitemap](${siteUrl}/sitemap-index.xml)\n`;

  return new Response(output, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};