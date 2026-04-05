import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateGoogleCalendarUrl, downloadIcsFile } from '../../utils/calendar';

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
    description: string; // HTML string
  };
}

interface EventModalProps {
  event: Event | null;
  onClose: () => void;
  lang: 'en' | 'ja';
}

export default function EventModal({ event, onClose, lang }: EventModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (event) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [event, onClose]);

  const handleAddToGoogle = () => {
    if (!event) return;
    const url = generateGoogleCalendarUrl({
      title: event.data.title,
      description: event.data.description, // Will be stripped of HTML in utility
      location: event.data.location,
      startDate: new Date(event.data.date),
      endDate: event.data.endTime ? new Date(event.data.endTime) : undefined,
    });
    window.open(url, '_blank');
  };

  const handleDownloadIcs = () => {
    if (!event) return;
    downloadIcsFile({
      title: event.data.title,
      description: event.data.description,
      location: event.data.location,
      startDate: new Date(event.data.date),
      endDate: event.data.endTime ? new Date(event.data.endTime) : undefined,
    });
  };

  const formatDate = (date: Date, endTime?: Date | null) => {
    const start = new Date(date);
    const end = endTime ? new Date(endTime) : null;
    const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', timeZone: 'UTC' };
    const startStr = start.toLocaleDateString(lang === 'ja' ? 'ja-JP' : undefined, opts);
    
    if (end) {
      const endStr = end.toLocaleDateString(lang === 'ja' ? 'ja-JP' : undefined, opts);
      if (startStr !== endStr) {
        return `${startStr} - ${endStr}`;
      }
    }
    return startStr;
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString(lang === 'ja' ? 'ja-JP' : undefined, { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <AnimatePresence>
      {event && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-3xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white z-10 bg-white/50 dark:bg-black/50 rounded-full transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>

            {event.data.coverImage && (
              <div className="h-64 w-full relative">
                <img 
                  src={event.data.coverImage} 
                  alt={event.data.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
            )}

            <div className="p-8 md:p-10">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="flex items-center gap-3 text-primary font-bold uppercase tracking-wider text-sm">
                  <span className="bg-primary/10 px-2 py-1 rounded">
                    {formatDate(event.data.date, event.data.endTime)}
                  </span>
                  <span>
                    {formatTime(event.data.date)}
                    {event.data.endTime && ` - ${formatTime(event.data.endTime)}`}
                  </span>
                </div>
                
                {/* Calendar Buttons */}
                {!event.data.isPast && ( 
                   <div className="flex gap-2 sm:mr-12">
                      <button 
                        onClick={handleAddToGoogle}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 transition-colors flex items-center gap-1"
                      >
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                        Google
                      </button>
                      <button 
                        onClick={handleDownloadIcs}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 transition-colors flex items-center gap-1"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        iCal
                      </button>
                   </div>
                )}
              </div>

              <h2 id="modal-title" className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{event.data.title}</h2>
              
              <div className="space-y-2 mb-8">
                <div className="flex items-center text-gray-500 dark:text-gray-400">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  {event.data.location}
                </div>
                {event.data.fee && (
                  <div className="flex items-center text-gray-500 dark:text-gray-400">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    {event.data.fee}
                  </div>
                )}
              </div>

              <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: event.data.description }} />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}