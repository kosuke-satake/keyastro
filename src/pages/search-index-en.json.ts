import { getCollection } from 'astro:content';

export const prerender = true;

export async function GET() {
  const postsEN = await getCollection('postsEN');

  const allPosts = postsEN.map(p => ({ 
    title: p.data.title,
    slug: p.slug,
    lang: 'en',
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
