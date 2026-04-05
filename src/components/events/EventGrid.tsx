import { useState, useMemo } from 'react';
import EventModal from './EventModal';
import Fuse from 'fuse.js';

interface Event {
  slug: string;
  data: {
    title: string;
    date: Date;
    endTime?: Date | null;
    location: string;
    fee?: string | null;
    coverImage?: string | null;
    isPast: boolean;
    description: string;
  };
}

interface EventGridProps {
  events: Event[];
  lang: 'en' | 'ja';
}

const formatDateRange = (date: Date, endTime?: Date | null, lang?: 'en' | 'ja') => {
  const start = new Date(date);
  const end = endTime ? new Date(endTime) : null;
  const opts: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  const startStr = start.toLocaleDateString(lang === 'ja' ? 'ja-JP' : undefined, opts);
  
  if (end) {
    const endStr = end.toLocaleDateString(lang === 'ja' ? 'ja-JP' : undefined, opts);
    if (startStr !== endStr) {
      return `${startStr} - ${endStr}`;
    }
  }
  return startStr;
};

export default function EventGrid({ events, lang }: EventGridProps) {
  const [query, setQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>('all');

  // Initialize Fuse
  const fuse = useMemo(() => new Fuse(events, {
    keys: ['data.title', 'data.location'],
    threshold: 0.3,
  }), [events]);

  const filteredEvents = useMemo(() => {
    let filtered = events;

    // Search Filter
    if (query.trim()) {
      filtered = fuse.search(query).map(result => result.item);
    }

    // Archive Filter
    if (selectedYear !== 'all') {
      filtered = filtered.filter(e => e.data.date.getFullYear().toString() === selectedYear);
    }

    return filtered;
  }, [events, query, selectedYear, fuse]);

  // Grouping
  const now = new Date();
  const upcoming = filteredEvents
    .filter(e => !e.data.isPast && e.data.date >= now)
    .sort((a, b) => a.data.date.getTime() - b.data.date.getTime());
  
  const past = filteredEvents
    .filter(e => e.data.isPast || e.data.date < now)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  // Archive Years
  const years = [...new Set(events.map(e => e.data.date.getFullYear()))].sort((a, b) => b - a);

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-8 md:mb-12 items-center">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <input 
            type="text" 
            placeholder={lang === 'ja' ? 'イベントを検索...' : 'Search events...'} 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none shadow-sm"
          />
          <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>

        {/* Archive Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar">
          <button
            onClick={() => setSelectedYear('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedYear === 'all' ? 'bg-primary text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          >
            {lang === 'ja' ? 'すべて' : 'All'}
          </button>
          {years.map(year => (
            <button
              key={year}
              onClick={() => setSelectedYear(year.toString())}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedYear === year.toString() ? 'bg-primary text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-16 md:space-y-24">
        {/* Upcoming */}
        {upcoming.length > 0 && (
          <section>
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{lang === 'ja' ? '今後のイベント' : 'Upcoming Events'}</h2>
              <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700"></div>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((event) => (
                <div 
                  key={event.slug} 
                  onClick={() => setSelectedEvent(event)} 
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedEvent(event);
                    }
                  }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group flex flex-col focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  {event.data.coverImage && (
                    <div className="h-48 overflow-hidden">
                      <img src={event.data.coverImage} alt={event.data.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                  )}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-3 text-primary font-semibold text-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      {formatDateRange(event.data.date, event.data.endTime, lang)}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">{event.data.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 flex items-center">
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                      {event.data.location}
                    </p>
                    <span className="mt-auto text-primary text-sm font-medium">{lang === 'ja' ? '詳細を見る' : 'View Details'} →</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Past */}
        {past.length > 0 && (
          <section>
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{lang === 'ja' ? '過去のイベント' : 'Past Events'}</h2>
              <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700"></div>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
              {past.map((event) => (
                <div 
                  key={event.slug} 
                  onClick={() => setSelectedEvent(event)} 
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedEvent(event);
                    }
                  }}
                  className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-sm hover:shadow-xl transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  {event.data.coverImage ? (
                    <img src={event.data.coverImage} alt={event.data.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600">
                      <span className="text-4xl opacity-50">📅</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-5">
                    <span className="text-xs font-bold text-gray-400 mb-1">
                      {formatDateRange(event.data.date, event.data.endTime, lang)}
                    </span>
                    <h3 className="text-sm font-bold text-white leading-tight line-clamp-2">
                      {event.data.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {upcoming.length === 0 && past.length === 0 && (
           <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400 text-lg">{lang === 'ja' ? 'イベントが見つかりませんでした．' : 'No events found.'}</p>
          </div>
        )}
      </div>

      <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} lang={lang} />
    </div>
  );
}
