import rss from '@astrojs/rss';
import { getCollection, getEntry } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('postsEN');
  
  // Fetch Global Settings for dynamic metadata
  const global = await getEntry('global', 'en');
  const siteTitle = global?.data?.siteTitle || 'KeyAstro Blog';
  const siteDesc = global?.data?.siteDescription || 'Astro + Keystatic Template - Latest updates and stories.';

  return rss({
    title: siteTitle,
    description: siteDesc,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.publishedDate,
      description: post.data.summary,
      link: `/en/blog/${post.slug}/`,
    })),
    customData: `<language>en-us</language>`,
  });
}