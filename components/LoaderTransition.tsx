"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoaderTransition({ onFinish }: { onFinish?: () => void }) {
  const [showLogo, setShowLogo] = useState(true);
  const [showBlock, setShowBlock] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setShowLogo(false);
      setShowBlock(true);
    }, 1000);

    const timer2 = setTimeout(() => {
      setShowBlock(false);
    }, 2000);

    const timer3 = setTimeout(() => {
      setFinished(true);
      onFinish?.();
    }, 2500); 

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  if (finished) return null;

  return (
    <>
      <AnimatePresence mode="wait">
        {showLogo && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[9999] bg-white flex items-center justify-center"
          >
            <div className="text-4xl font-bold">Kopiness</div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {showBlock && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{
              duration: 0.7,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="fixed inset-0 z-[9998] bg-black"
          />
        )}
      </AnimatePresence>
    </>
  );
}
