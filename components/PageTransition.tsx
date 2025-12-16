"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function PageTransitionBlock({ children }: { children: React.ReactNode }) {
  const [displayChildren, setDisplayChildren] = useState(children);
  const [showBlock, setShowBlock] = useState(false);
  
  const pathname = usePathname();

  useEffect(() => {
    setShowBlock(true);

    const changePageTimer = setTimeout(() => {
      setDisplayChildren(children);
    }, 600); 

    const hideBlockTimer = setTimeout(() => {
      setShowBlock(false);
    }, 1200);

    return () => {
      clearTimeout(changePageTimer);
      clearTimeout(hideBlockTimer);
    };
  }, [pathname, children]);

  return (
    <>
      <AnimatePresence>
        {showBlock && (
          <motion.div
            key="transition-block"
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "-100%" }}
            transition={{
              duration: 0.6,
              ease: [0.85, 0, 0.15, 1],
            }}
            className="fixed inset-0 z-[9999] bg-black pointer-events-none"
          />
        )}
      </AnimatePresence>

      {displayChildren}
    </>
  );
}
