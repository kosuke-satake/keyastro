import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SocialIcon } from '../ui/Icons';

interface Link {
  href: string;
  label: string;
}

interface SocialLink {
  platform: string;
  url: string;
  icon: string;
  customIcon?: string | null;
}

interface MobileNavProps {
  links: Link[];
  currentLang: 'en' | 'ja';
  switchLinkEn: string;
  switchLinkJa: string;
  social: SocialLink[];
}

const themes = ['blue', 'purple', 'green', 'orange'] as const;
type ColorTheme = typeof themes[number];

export default function MobileNav({ links, currentLang, switchLinkEn, switchLinkJa, social }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDark(document.documentElement.classList.contains('dark'));
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const toggleDarkMode = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    if (newIsDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const setColorTheme = (color: ColorTheme) => {
    themes.forEach(t => document.documentElement.classList.remove(`theme-${t}`));
    if (color !== 'blue') {
      document.documentElement.classList.add(`theme-${color}`);
    }
    localStorage.setItem('color-theme', color);
  };

  return (
    <div className="md:hidden">
      <div className="flex items-center gap-4">
        <div className="flex items-center space-x-2 text-sm font-medium">
          <a href={switchLinkEn} className={currentLang === 'en' ? 'text-primary font-bold' : 'text-gray-500 dark:text-gray-400'}>EN</a>
          <span className="text-gray-300 dark:text-gray-600">|</span>
          <a href={switchLinkJa} className={currentLang === 'ja' ? 'text-primary font-bold' : 'text-gray-500 dark:text-gray-400'}>JP</a>
        </div>
        
        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 dark:text-gray-300 hover:text-primary focus:outline-none p-1" aria-label="Toggle Menu">
          <motion.div animate={isOpen ? "open" : "closed"} initial={false}>
            {isOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </motion.div>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 absolute left-0 right-0 top-16 shadow-lg z-40"
          >
            <div className="px-4 pt-4 pb-6 space-y-2">
              {links.map((link) => (
                <motion.a key={link.href} href={link.href} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.3 }} className="block text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 px-4 py-3 rounded-xl text-base font-medium transition-colors">
                  {link.label}
                </motion.a>
              ))}

              {/* Dynamic Social Icons */}
              {social.length > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="flex gap-4 justify-center py-4 border-t border-gray-100 dark:border-gray-800 mt-2 flex-wrap">
                  {social.map((link, idx) => {
                    return (
                      <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-500 hover:text-primary transition-colors">
                        {link.customIcon ? (
                          <img src={link.customIcon} alt={link.platform} className="w-6 h-6 object-contain" />
                        ) : (
                          <SocialIcon name={link.icon} className="w-6 h-6" />
                        )}
                      </a>
                    );
                  })}
                </motion.div>
              )}

              {/* Theme Settings */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="px-4 py-6 border-t border-gray-100 dark:border-gray-800 mt-0">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Theme Settings</p>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Dark Mode</span>
                  <button onClick={toggleDarkMode} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isDark ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${isDark ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
                <div className="flex gap-4">
                   {themes.map(color => {
                      const bgClasses = { blue: 'bg-blue-600', purple: 'bg-purple-600', green: 'bg-green-600', orange: 'bg-orange-600' };
                      return (
                        <button key={color} onClick={() => setColorTheme(color)} className={`${bgClasses[color]} w-8 h-8 rounded-full hover:scale-110 active:scale-95 transition-transform`} aria-label={`Set theme to ${color}`} />
                      );
                    })}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}