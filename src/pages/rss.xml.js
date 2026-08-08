import toolsData from '../data/tools.json';

export async function GET() {
  const siteUrl = 'https://pixelquil.com';

  const items = toolsData
    .map((tool) => {
      const url = `${siteUrl}/${tool.category}/${tool.slug}/`;
      return `
    <item>
      <title>${escapeXml(tool.title)}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <description>${escapeXml(tool.description)}</description>
    </item>`;
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Pixelquil Tools</title>
    <link>${siteUrl}</link>
    <description>Free browser-based SVG, developer, and technical SEO tools from Pixelquil.</description>
    <language>en-us</language>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}