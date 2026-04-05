import { useState } from 'react';
import { ScrollReveal } from '../ui/ScrollReveal';
import EventModal from '../events/EventModal';

interface EventItem {
  slug: string;
  title: string;
  date: Date;
  endTime?: Date | null;
  location: string;
  fee?: string | null;
  image?: string | null;
  description: string;
  isPast: boolean;
}

interface UpcomingEventsProps {
  events: EventItem[];
  title?: string;
  subtitle?: string;
  lang: 'en' | 'ja';
}

export default function UpcomingEvents({ events, title = "Upcoming Events", subtitle = "Join us", lang }: UpcomingEventsProps) {
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

  if (events.length === 0) return null;

  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900 transition-colors duration-300 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-30 dark:opacity-10">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary rounded-full blur-3xl -translate-x-1/2"></div>
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl translate-x-1/2"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <ScrollReveal width="100%">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-semibold text-gray-900 dark:text-white tracking-tight mb-4">{title}</h2>
            <p className="text-xl text-gray-500 dark:text-gray-400 font-light">{subtitle}</p>
          </div>
        </ScrollReveal>

        <div className="grid gap-8 md:grid-cols-3 items-stretch">
          {events.map((event, index) => (
            <ScrollReveal key={index} delay={index * 0.1} className="h-full" width="100%">
              <div 
                onClick={() => setSelectedEvent({
                  slug: event.slug,
                  data: {
                    title: event.title,
                    date: event.date,
                    endTime: event.endTime,
                    location: event.location,
                    fee: event.fee,
                    coverImage: event.image,
                    isPast: event.isPast,
                    description: event.description
                  }
                })}
                className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group cursor-pointer"
              >
                
                {/* Visual Header - Fixed Height */}
                <div className="h-56 w-full relative flex-shrink-0 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  {event.image ? (
                    <img 
                      src={event.image} 
                      alt={event.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    />
                  ) : (
                    <div className="w-full h-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <svg className="w-16 h-16 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    </div>
                  )}
                </div>

                <div className="p-8 flex flex-col flex-1">
                  <div className="mb-3">
                    <p className="text-sm font-bold text-primary uppercase tracking-wide">
                      {(() => {
                        const start = new Date(event.date);
                        const end = event.endTime ? new Date(event.endTime) : null;
                        const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
                        const startStr = start.toLocaleDateString(lang === 'ja' ? 'ja-JP' : undefined, opts);
                        
                        if (end) {
                           const endStr = end.toLocaleDateString(lang === 'ja' ? 'ja-JP' : undefined, opts);
                           if (startStr !== endStr) {
                             return `${startStr} - ${endStr}`;
                           }
                        }
                        return startStr;
                      })()}
                    </p>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-primary transition-colors line-clamp-2">
                    {event.title}
                  </h3>
                  
                  <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 w-full">
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                      <span className="line-clamp-1">{event.location}</span>
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <div className="mt-16 text-center">
          <a href={`/${lang}/events`} className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-primary hover:bg-primary-hover transition-colors shadow-lg hover:shadow-primary/30">
            {lang === 'ja' ? 'すべてのイベントを見る' : 'View All Events'}
          </a>
        </div>
      </div>

      <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} lang={lang} />
    </section>
  );
}
