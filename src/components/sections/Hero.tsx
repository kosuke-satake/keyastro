import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useEffect } from 'react';
import ParticleBackground from '../ui/ParticleBackground';
import AuroraBackground from '../ui/AuroraBackground';
import Button from '../ui/Button';

interface HeroProps {
  data: {
    heroSubtitle: string;
    heroTitle: string;
    heroTypewriterWords: string[];
    heroDescription: string;
    ctaJoin: string;
    ctaLearn: string;
  };
  lang: 'en' | 'ja';
}

function Typewriter({ text }: { text: string }) {
  const [displayText, setDisplayText] = useState('');
  
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (displayText.length < text.length) {
      timeout = setTimeout(() => {
        setDisplayText(text.slice(0, displayText.length + 1));
      }, 100);
    }

    return () => clearTimeout(timeout);
  }, [displayText, text]);

  // Reset when text prop changes (parent cycle)
  useEffect(() => {
    setDisplayText('');
  }, [text]);

  return <span>{displayText}</span>;
}

export default function Hero({ data, lang }: HeroProps) {
  const [index, setIndex] = useState(0);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 200]);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % data.heroTypewriterWords.length);
    }, 4000); // Cycle every 4s
    return () => clearInterval(timer);
  }, [data.heroTypewriterWords]);

  return (
    <div className="relative overflow-hidden bg-[#000000] text-white min-h-screen flex flex-col items-center justify-center">
      
      {/* 1. Canvas Particle Background */}
      <div className="absolute inset-0 z-0">
        {/* Light Mode: Aurora */}
        <div className="block dark:hidden w-full h-full">
          <AuroraBackground />
        </div>
        
        {/* Dark Mode: Particles */}
        <div className="hidden dark:block w-full h-full">
          <ParticleBackground />
        </div>
      </div>
      
      {/* Overlay gradient for text readability (adaptive) */}
      <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent dark:from-black dark:via-transparent dark:to-black/40 pointer-events-none z-0"></div>

      {/* Floating Orbs for Depth (Dark Mode Enhanced) */}
      <motion.div 
        animate={{ 
          y: [0, -20, 0],
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/30 rounded-full blur-[100px] pointer-events-none hidden dark:block"
      />
      <motion.div 
        animate={{ 
          y: [0, 30, 0],
          opacity: [0.2, 0.5, 0.2],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] pointer-events-none hidden dark:block"
      />

      <motion.div style={{ y }} className="relative z-10 max-w-7xl w-full mx-auto px-6 flex flex-col items-center text-center pt-20 sm:pt-0">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="block text-primary text-sm sm:text-base font-semibold tracking-widest uppercase mb-4 sm:mb-6 drop-shadow-sm">
            {data.heroSubtitle}
          </span>
          
          <h1 className="text-4xl sm:text-7xl lg:text-9xl font-bold tracking-tight text-gray-900 dark:text-white mb-6 sm:mb-8 leading-tight drop-shadow-sm dark:drop-shadow-2xl">
             {data.heroTitle}
             <span className="block text-2xl sm:text-5xl lg:text-6xl mt-2 sm:mt-4 font-medium font-mono min-h-[1.2em] text-gray-500 dark:text-gray-300">
               <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-gray-100 dark:to-gray-400">
                 <Typewriter text={data.heroTypewriterWords[index]} />
               </span>
               <span className="animate-pulse text-primary ml-1">|</span>
             </span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4 sm:mt-6 max-w-2xl text-base sm:text-xl text-gray-600 dark:text-gray-300 font-light leading-relaxed drop-shadow-sm dark:drop-shadow-md whitespace-pre-line px-4 sm:px-0"
        >
          {data.heroDescription}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center gap-4 sm:gap-5 justify-center w-full sm:w-auto px-6 sm:px-0"
        >
           <Button
            as="a"
            href={`/${lang}/join`}
            size="lg"
            className="shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1"
          >
            {data.ctaJoin}
          </Button>
          
          <button
             onClick={() => document.getElementById('vision')?.scrollIntoView({ behavior: 'smooth' })}
             className="w-14 h-14 flex items-center justify-center rounded-full bg-white/50 border border-gray-200 text-gray-600 hover:bg-white dark:bg-white/10 dark:border-white/20 dark:text-white dark:hover:bg-white/20 backdrop-blur-md hover:scale-110 transition-all duration-300 shadow-sm"
             aria-label={data.ctaLearn}
          >
            <svg className="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
