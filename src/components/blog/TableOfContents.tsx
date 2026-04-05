import { useState, useEffect } from 'react';

interface Heading {
  depth: number;
  slug: string;
  text: string;
}

interface TOCProps {
  headings: Heading[];
  lang?: 'en' | 'ja';
}

export default function TableOfContents({ headings, lang = 'en' }: TOCProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -66% 0px' }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.slug);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="sticky top-32 hidden lg:block">
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 pl-4">
        {lang === 'ja' ? '目次' : 'On this page'}
      </h3>
      <ul className="space-y-3 border-l border-gray-200 dark:border-gray-800">
        {headings.map((heading) => (
          <li key={heading.slug} className={`${heading.depth === 3 ? 'ml-4' : ''}`}>
            <a
              href={`#${heading.slug}`}
              className={`block pl-4 py-1 text-sm transition-all duration-200 border-l-2 -ml-[1px] rounded-r-md ${
                activeId === heading.slug
                  ? 'border-primary text-primary font-medium bg-primary/5'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50'
              }`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(heading.slug)?.scrollIntoView({
                  behavior: 'smooth'
                });
                setActiveId(heading.slug);
              }}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}