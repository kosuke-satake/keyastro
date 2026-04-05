import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Fuse from 'fuse.js';

interface SearchResult {
  title: string;
  slug: string;
  lang: 'en' | 'ja';
  summary: string;
  tags: string[];
  date: string;
}

// Global cache to prevent re-fetching on every mount
const searchIndexCache: Record<string, SearchResult[]> = {};
const fetchPromises: Record<string, Promise<SearchResult[]>> = {};

export default function BlogSearch({ lang = 'en' }: { lang?: 'en' | 'ja' }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const fuseRef = useRef<Fuse<SearchResult> | null>(null);

  // Fetch index once on mount
  useEffect(() => {
    const initSearch = async () => {
      try {
        let data = searchIndexCache[lang];

        if (!data) {
          if (!fetchPromises[lang]) {
            fetchPromises[lang] = fetch(`/search-index-${lang}.json`).then(res => res.json());
          }
          data = await fetchPromises[lang];
          searchIndexCache[lang] = data;
        }

        if (data) {
          // Initialize Fuse
          fuseRef.current = new Fuse(data, {
            keys: ['title', 'summary', 'tags'],
            threshold: 0.3, // 0.0 = perfect match, 1.0 = match anything
            includeScore: true
          });
        }
      } catch (error) {
        console.error("Failed to load search index:", error);
      }
    };

    initSearch();
  }, [lang]);

  // Handle Search
  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      setSelectedIndex(-1);
      return;
    }

    if (fuseRef.current) {
      const fuseResults = fuseRef.current.search(query);
      const filtered = fuseResults.map(result => result.item).slice(0, 5);
      setResults(filtered);
      setSelectedIndex(-1); // Reset selection on new results
      setIsOpen(true);
    }
  }, [query]);

  // Keyboard Navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % results.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          window.location.href = `/${lang}/blog/${results[selectedIndex].slug}`;
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  return (
    <div ref={wrapperRef} className="relative z-50">
      <div className="relative">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={lang === 'ja' ? '記事を検索...' : 'Search articles...'} 
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all shadow-sm"
        />
        <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        
        {query && (
          <button 
            onClick={() => { setQuery(''); setResults([]); setIsOpen(false); }}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden"
          >
            <ul className="divide-y divide-gray-100 dark:divide-gray-700">
              {results.map((post, index) => (
                <li key={post.slug}>
                  <a 
                    href={`/${lang}/blog/${post.slug}`} 
                    className={`block p-4 transition-colors ${index === selectedIndex ? 'bg-gray-100 dark:bg-gray-700' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}
                  >
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1">{post.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{post.summary}</p>
                    <div className="mt-2 flex gap-2">
                      {post.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">{tag}</span>
                      ))}
                    </div>
                  </a>
                </li>
              ))}
            </ul>
            <div className="bg-gray-50 dark:bg-gray-900 p-2 text-center text-xs text-gray-400 border-t border-gray-100 dark:border-gray-800">
              Showing top {results.length} results
            </div>
          </motion.div>
        )}
        
        {isOpen && query && results.length === 0 && (
           <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 p-4 text-center text-gray-500"
          >
            No results found.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}