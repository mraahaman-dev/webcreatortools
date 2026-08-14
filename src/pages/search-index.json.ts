import toolsData from '../data/tools.json';
import { getCollection } from 'astro:content';

export async function GET() {
  const toolEntries = toolsData.map((tool: any) => ({
    title: tool.title,
    description: tool.description,
    href: `/${tool.category}/${tool.slug}/`,
    type: 'tool',
    badgeColor: tool.badgeColor,
    iconPath: tool.iconPath,
  }));

  const guides = await getCollection('guides');
  const guideEntries = guides.map((guide) => ({
    title: guide.data.title,
    description: guide.data.description ?? '',
    href: `/guides/${guide.id}/`,
    type: 'guide',
    badgeColor: 'indigo',
    iconPath: 'M4 19.5A2.5 2.5 0 016.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z',
  }));

  const index = [...toolEntries, ...guideEntries];

  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json' },
  });
}