import { motion, useInView, useAnimation, type Variants } from 'framer-motion';
import { useRef, useEffect } from 'react';

type AnimationType = 'fade-up' | 'zoom-in' | 'slide-left' | 'slide-right' | 'blur-in';

interface AdvancedRevealProps {
  children: React.ReactNode;
  width?: 'fit-content' | '100%';
  delay?: number;
  duration?: number;
  className?: string;
  type?: AnimationType;
  viewportMargin?: string;
}

const variantsMap: Record<AnimationType, Variants> = {
  'fade-up': {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 }
  },
  'zoom-in': {
    hidden: { opacity: 0, scale: 0.90 },
    visible: { opacity: 1, scale: 1 }
  },
  'slide-left': {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 }
  },
  'slide-right': {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 }
  },
  'blur-in': {
    hidden: { opacity: 0, filter: 'blur(10px)' },
    visible: { opacity: 1, filter: 'blur(0px)' }
  }
};

export const AdvancedReveal = ({ 
  children, 
  width = 'fit-content', 
  delay = 0, 
  duration = 0.6,
  className = "",
  type = 'fade-up',
  viewportMargin = "-50px"
}: AdvancedRevealProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: viewportMargin as any });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return (
    <div ref={ref} style={{ position: 'relative', width }} className={className}>
      <motion.div
        variants={variantsMap[type]}
        initial="hidden"
        animate={controls}
        transition={{ 
          duration: duration, 
          ease: [0.22, 1, 0.36, 1], // Custom "Apple-like" ease
          delay: delay 
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};
