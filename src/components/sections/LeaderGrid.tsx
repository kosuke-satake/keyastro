import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SocialIcon } from '../ui/Icons';

interface Leader {
  slug: string;
  data: {
    avatar?: string | null;
    linkedin?: string | null;
    instagram?: string | null;
    facebook?: string | null;
    website?: string | null;
    github?: string | null;
    twitter?: string | null;
    name: string;
    role: string;
    category: string;
    joinedDate: Date;
    leftDate?: Date | null;
    bioHtml: string;
    tenure: string;
  };
}

interface LeaderGridProps {
  activeMembers: Leader[];
  alumni: Leader[];
  advisors: Leader[];
  titles: {
    active: string;
    alumni: string;
    advisor: string;
  };
}

export default function LeaderGrid({ activeMembers, alumni, advisors, titles }: LeaderGridProps) {
  const [selectedLeader, setSelectedLeader] = useState<Leader | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedLeader(null);
    };
    if (selectedLeader) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedLeader]);

  const LeaderCard = ({ leader }: { leader: Leader }) => (
    <div 
      onClick={() => setSelectedLeader(leader)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setSelectedLeader(leader);
        }
      }}
      className="space-y-4 text-center group cursor-pointer w-full max-w-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-2xl p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
    >
      <div className="relative w-32 h-32 sm:w-48 sm:h-48 mx-auto rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg group-hover:scale-105 transition-transform">
        {leader.data.avatar ? (
          <img className="object-cover w-full h-full" src={leader.data.avatar} alt={leader.data.name} />
        ) : (
          <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500 text-5xl font-bold">
            {leader.data.name.charAt(0)}
          </div>
        )}
      </div>
      <div className="space-y-1">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">{leader.data.name}</h3>
        <p className="text-primary font-medium text-base">{leader.data.role}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">{leader.data.tenure}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-20">
      {/* Active Members */}
      {activeMembers.length > 0 && (
        <section>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">{titles.active}</h2>
          <div className="grid gap-y-12 gap-x-4 sm:gap-x-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center">
            {activeMembers.map((leader) => (
              <LeaderCard key={leader.slug} leader={leader} />
            ))}
          </div>
        </section>
      )}

      {/* Advisors */}
      {advisors.length > 0 && (
        <section>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center border-t border-gray-200 dark:border-gray-800 pt-16">{titles.advisor}</h2>
          <div className="grid gap-y-12 gap-x-4 sm:gap-x-8 grid-cols-2 md:grid-cols-3 justify-items-center">
            {advisors.map((leader) => (
              <LeaderCard key={leader.slug} leader={leader} />
            ))}
          </div>
        </section>
      )}

      {/* Alumni */}
      {alumni.length > 0 && (
        <section>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center border-t border-gray-200 dark:border-gray-800 pt-16">{titles.alumni}</h2>
          <div className="grid gap-y-10 gap-x-4 sm:gap-x-8 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 justify-items-center">
            {alumni.map((leader) => (
              <LeaderCard key={leader.slug} leader={leader} />
            ))}
          </div>
        </section>
      )}

      {/* Modal */}
      <AnimatePresence>
        {selectedLeader && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLeader(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-leader-name"
            >
              <button 
                onClick={() => setSelectedLeader(null)}
                className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white z-10 bg-white/50 dark:bg-black/50 rounded-full transition-colors"
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>

              <div className="p-8 md:p-12 flex flex-col items-center">
                 <div className="relative w-56 h-56 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-xl mb-6">
                  {selectedLeader.data.avatar ? (
                    <img className="object-cover w-full h-full" src={selectedLeader.data.avatar} alt={selectedLeader.data.name} />
                  ) : (
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500 text-6xl font-bold">
                      {selectedLeader.data.name.charAt(0)}
                    </div>
                  )}
                </div>
                
                <h3 id="modal-leader-name" className="text-4xl font-bold text-gray-900 dark:text-white mb-2 text-center">{selectedLeader.data.name}</h3>
                <p className="text-primary font-medium text-xl mb-4 text-center">{selectedLeader.data.role}</p>
                <span className="text-sm font-mono bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full mb-8">
                  {selectedLeader.data.tenure}
                </span>

                {/* Socials */}
                <div className="flex gap-4 justify-center mb-8 flex-wrap">
                   {selectedLeader.data.website && (
                    <a href={selectedLeader.data.website} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-green-100 hover:text-green-600 transition-colors">
                      <SocialIcon name="globe" className="w-6 h-6" />
                    </a>
                  )}
                  {selectedLeader.data.linkedin && (
                    <a href={selectedLeader.data.linkedin} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-blue-100 hover:text-blue-600 transition-colors">
                      <SocialIcon name="linkedin" className="w-6 h-6" />
                    </a>
                  )}
                  {selectedLeader.data.instagram && (
                    <a href={selectedLeader.data.instagram} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-pink-100 hover:text-pink-600 transition-colors">
                      <SocialIcon name="instagram" className="w-6 h-6" />
                    </a>
                  )}
                  {selectedLeader.data.facebook && (
                    <a href={selectedLeader.data.facebook} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-blue-100 hover:text-blue-700 transition-colors">
                      <SocialIcon name="facebook" className="w-6 h-6" />
                    </a>
                  )}
                  {selectedLeader.data.github && (
                    <a href={selectedLeader.data.github} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-black dark:hover:text-white transition-colors">
                      <SocialIcon name="github" className="w-6 h-6" />
                    </a>
                  )}
                  {selectedLeader.data.twitter && (
                    <a href={selectedLeader.data.twitter} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900 hover:text-blue-400 transition-colors">
                      <SocialIcon name="twitter" className="w-6 h-6" />
                    </a>
                  )}
                </div>

                <div className="prose prose-lg prose-blue dark:prose-invert max-w-none text-gray-600 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: selectedLeader.data.bioHtml }} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}