import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Preloader({ onComplete }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Lock scrolling while preloader is active
    document.body.style.overflow = 'hidden';
    
    // Unmount sequence after animation
    const timer = setTimeout(() => {
      setIsVisible(false);
      document.body.style.overflow = '';
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 1000); // Wait for exit animation
    }, 2800);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = '';
    };
  }, [onComplete]);

  // Framer Motion variants
  const containerVariants = {
    hidden: { opacity: 1 },
    visible: { opacity: 1 },
    exit: { 
      y: '-100vh', 
      transition: { duration: 1, ease: [0.76, 0, 0.24, 1] } 
    }
  };

  const textContainer = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.4 }
    },
    exit: {
      opacity: 0,
      y: -50,
      transition: { duration: 0.5, ease: 'easeInOut' }
    }
  };

  const letter = {
    hidden: { opacity: 0, y: 50, rotateX: -90 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const title = "LOOKME";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="preloader"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#050505] text-white"
        >
          {/* Subtle Aurora effect behind text */}
          <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--primary)]/10 blur-[80px]" />
          
          {/* Film grain texture */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />

          <motion.div 
            variants={textContainer}
            className="flex perspective-[1000px] relative z-10"
          >
            {title.split('').map((char, index) => (
              <motion.span
                key={index}
                variants={letter}
                className={`font-heading text-6xl tracking-[0.15em] sm:text-8xl md:text-9xl ${char === 'M' || char === 'E' ? 'text-[var(--primary)]' : 'text-white'}`}
              >
                {char}
              </motion.span>
            ))}
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 1.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            exit={{ opacity: 0 }}
            className="absolute bottom-16 h-px w-48 bg-white/20"
          >
            <motion.div 
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.5, duration: 1.3, ease: 'linear' }}
              className="h-full w-full bg-[var(--primary)]"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
