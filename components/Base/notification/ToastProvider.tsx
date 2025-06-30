'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import NotifyItem from "./NotifyItem";
import { setNotifyHandler } from "./notify-controllers";
import { NotifyProps } from "@/types/notification";

interface Toast extends NotifyProps {
  _id: symbol;
}

type Position =
  | "top-right"
  | "top-center"
  | "top-left"
  | "bottom-right"
  | "bottom-center"
  | "bottom-left";

interface ToastContextType {
  show: (option: NotifyProps) => { close: () => void; update: (opt: Partial<NotifyProps>) => void };
  remove: (id: symbol) => void;
  update: (id: symbol, opt: Partial<NotifyProps>) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({
  children,
  position = "top-right",
}: {
  children: ReactNode;
  position?: Position;
}) => {
  const [items, setItems] = useState<Toast[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const show = (option: NotifyProps) => {
    const _id = Symbol("ToastID");
    setItems((prev) => [...prev, { ...option, _id }]);

    if (option.duration && option.duration > 0) {
      setTimeout(() => remove(_id), option.duration);
    }

    return {
      close: () => remove(_id),
      update: (opt: Partial<NotifyProps>) => update(_id, opt),
    };
  };

  const remove = (id: symbol) => {
    setItems((prev) => prev.filter((i) => i._id !== id));
  };

  const update = (id: symbol, opt: Partial<NotifyProps>) => {
    setItems((prev) =>
      prev.map((i) => (i._id === id ? { ...i, ...opt } : i))
    );
  };

  useEffect(() => {
    setNotifyHandler(show);
  }, [show]);

  const getContainerPosition = () => {
    const pos: Record<string, string> = {
      "top-right": "top-8 right-8 items-end flex-col-reverse",
      "top-center": "top-8 left-1/2 -translate-x-1/2 items-center flex-col-reverse",
      "top-left": "top-8 left-8 items-start flex-col-reverse",
      "bottom-right": "bottom-8 right-8 items-end flex-col",
      "bottom-center": "bottom-8 left-1/2 -translate-x-1/2 items-center flex-col",
      "bottom-left": "bottom-8 left-8 items-start flex-col",
    };
    return pos[position] || pos["top-right"];
  };

  return (
    <ToastContext.Provider value={{ show, remove, update }}>
      {children}
      {isMounted &&
        createPortal(
          <div
            className={`fixed z-[9999] flex gap-2 ${getContainerPosition()}`}
          >
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item._id.toString()}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.15 }}
                >
                  <NotifyItem
                    {...item} 
                    onClose={() => remove(item._id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
};
