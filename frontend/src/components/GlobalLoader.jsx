import { useEffect, useState } from 'react';
import { useIsFetching } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';

export default function GlobalLoader() {
  const isFetching = useIsFetching();
  const [show, setShow] = useState(false);

  useEffect(() => {
    let timeout;
    if (isFetching > 0) {
      timeout = setTimeout(() => setShow(true), 1000);
    } else {
      setShow(false);
    }
    return () => clearTimeout(timeout);
  }, [isFetching]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[var(--surface)] backdrop-blur-md"
        >
          <div className="relative flex flex-col items-center">
            <motion.h1 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="font-heading text-4xl tracking-widest text-[var(--dark)] sm:text-5xl"
            >
              LOOKME
            </motion.h1>
            
            <div className="mt-8 h-[1px] w-48 overflow-hidden bg-black/10 sm:w-64">
              <motion.div
                className="h-full bg-[var(--primary)]"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: 'easeInOut',
                }}
              />
            </div>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mt-6 text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--gray)]"
            >
              Chargement de la collection
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
