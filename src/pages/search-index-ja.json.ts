import { getCollection } from 'astro:content';

export const prerender = true;

export async function GET() {
  const postsJA = await getCollection('postsJA');

  const allPosts = postsJA.map(p => ({ 
    title: p.data.title,
    slug: p.slug,
    lang: 'ja',
    summary: p.data.summary,
    tags: p.data.tags || [],
    date: p.data.publishedDate
  }));

  return new Response(JSON.stringify(allPosts), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
