import { ScrollReveal } from '../ui/ScrollReveal';

interface NewsItem {
  slug: string;
  title: string;
  date: Date;
  important: boolean;
}

interface NewsSectionProps {
  news: NewsItem[];
  lang: 'en' | 'ja';
}

export default function NewsSection({ news, lang }: NewsSectionProps) {
  if (news.length === 0) return null;

  return (
    <section className="py-24 bg-white dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <ScrollReveal width="100%">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <h2 className="text-4xl font-semibold text-gray-900 dark:text-white tracking-tight">
              {lang === 'ja' ? 'ニュース & お知らせ' : 'News & Announcements'}
            </h2>
            <a href={`/${lang}/news`} className="hidden md:flex items-center text-primary hover:text-primary-hover font-medium transition-colors">
              {lang === 'ja' ? '一覧を見る' : 'View all'} <span className="ml-1 text-xl">→</span>
            </a>
          </div>
        </ScrollReveal>

        <div className="grid gap-6 lg:grid-cols-2">
          {news.map((item, index) => (
            <ScrollReveal key={item.slug} delay={index * 0.1} width="100%">
              <a href={`/${lang}/news`} className="group flex flex-col sm:flex-row gap-6 p-6 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-primary/50 transition-all hover:shadow-lg">
                <div className="sm:w-24 flex-shrink-0 flex flex-col items-start">
                  <span className="text-sm font-mono text-gray-500 dark:text-gray-400">
                    {new Date(item.date).toLocaleDateString(lang === 'ja' ? 'ja-JP' : undefined, { month: 'short', day: 'numeric' })}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {new Date(item.date).getFullYear()}
                  </span>
                  {item.important && (
                    <span className="mt-2 inline-block px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-[10px] font-bold uppercase tracking-wider rounded-full">
                      {lang === 'ja' ? '重要' : 'Urgent'}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors mb-2">
                    {item.title}
                  </h3>
                  <span className="text-sm font-medium text-primary flex items-center opacity-0 group-hover:opacity-100 transition-opacity -ml-2 group-hover:ml-0 duration-300">
                    {lang === 'ja' ? '詳細' : 'Read more'} →
                  </span>
                </div>
              </a>
            </ScrollReveal>
          ))}
        </div>

        <div className="mt-12 text-center md:hidden">
           <a href={`/${lang}/news`} className="inline-flex items-center text-primary hover:text-primary-hover font-medium transition-colors">
              {lang === 'ja' ? '一覧を見る' : 'View all'} <span className="ml-1 text-xl">→</span>
            </a>
        </div>
      </div>
    </section>
  );
}