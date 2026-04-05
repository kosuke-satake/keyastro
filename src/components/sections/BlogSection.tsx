import { ScrollReveal } from '../ui/ScrollReveal';

interface BlogPost {
  slug: string;
  title: string;
  date: Date; // mapped as date in index.astro
  image?: string | null; // mapped as image
  summary: string;
}

interface BlogSectionProps {
  posts: BlogPost[];
  title?: string;
  subtitle?: string;
  lang: 'en' | 'ja';
}

export default function BlogSection({ posts, title = "Blog", subtitle = "Reports on our activities and student life.", lang }: BlogSectionProps) {
  if (posts.length === 0) return null;

  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <ScrollReveal width="100%">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-semibold text-gray-900 dark:text-white tracking-tight mb-4">{title}</h2>
            <p className="text-xl text-gray-500 dark:text-gray-400 font-light">{subtitle}</p>
          </div>
        </ScrollReveal>

        <div className="grid gap-8 md:grid-cols-3 items-stretch">
          {posts.map((post, index) => (
            <ScrollReveal key={post.slug} delay={index * 0.1} className="h-full" width="100%">
              <a href={`/${lang}/blog/${post.slug}`} className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
                
                {/* Visual Header - Fixed Height Match */}
                <div className="h-56 w-full relative flex-shrink-0 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <img 
                    src={post.image || '/images/placeholder.svg'} 
                    alt={post.title} 
                    loading="lazy"
                    decoding="async"
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${!post.image ? 'opacity-50 p-8 object-contain' : ''}`}
                  />
                </div>

                <div className="p-8 flex flex-col flex-1">
                  <p className="text-sm font-medium text-primary mb-3">
                    {new Date(post.date).toLocaleDateString(lang === 'ja' ? 'ja-JP' : undefined, { dateStyle: 'medium' })}
                  </p>
                  
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed mb-4 flex-1">
                    {post.summary}
                  </p>

                  <span className="inline-flex items-center text-sm font-medium text-primary mt-auto">
                    {lang === 'ja' ? '続きを読む' : 'Read Article'} →
                  </span>
                </div>
              </a>
            </ScrollReveal>
          ))}
        </div>
        
        <div className="mt-16 text-center">
           <a href={`/${lang}/blog`} className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-primary hover:bg-primary-hover transition-colors shadow-lg hover:shadow-primary/30">
              {lang === 'ja' ? 'すべての記事を読む' : 'Read all posts'}
            </a>
        </div>
      </div>
    </section>
  );
}
