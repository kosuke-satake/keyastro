import rss from '@astrojs/rss';
import { getCollection, getEntry } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('postsJA');

  // Fetch Global Settings for dynamic metadata
  const global = await getEntry('global', 'ja');
  const siteTitle = global?.data?.siteTitle || 'KeyAstro ブログ';
  const siteDesc = global?.data?.siteDescription || '東北大学STEM学生ネットワーク - 最新情報とストーリー．';

  return rss({
    title: siteTitle,
    description: siteDesc,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.publishedDate,
      description: post.data.summary,
      link: `/ja/blog/${post.slug}/`,
    })),
    customData: `<language>ja-jp</language>`,
  });
}