"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function PageTransitionBlock({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [showBlock, setShowBlock] = useState(false);

  useEffect(() => {
    // 1. Mulai animasi block masuk (bottom → center)
    setShowBlock(true);

    // 2. Setelah 0.6s block sudah FULL menutup layar -> ganti halaman
    const changePageTimer = setTimeout(() => {
      setDisplayChildren(children);
    }, 600); // harus sama durasi animate masuk

    // 3. Setelah 1.2s block keluar dari layar
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
      {/* Transisi Block */}
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

      {/* Konten Page */}
      {displayChildren}
    </>
  );
}
