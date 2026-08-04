'use client'

import { ModalProps } from "@/types";
import clsx from "clsx";
import React, { useEffect } from "react";
import { createPortal } from "react-dom";

const sizeMap = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-3xl',
  xl: 'max-w-5xl'
}

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  description,
  size = "md",
  closeOnOverlayClick = true,
  closeOnEsc = true,
  children,
  footer,
  className,
}) => {
  useEffect(() => {
    if (!onClose) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    }

    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [closeOnEsc, onClose])

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={closeOnOverlayClick ? onClose : undefined}
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        className={clsx(
          "relative z-10 w-full rounded-2xl bg-colors-var shadow-xl",
          "animate-in fade-in zoom-in-95 duration-200",
          sizeMap[size],
          className
        )}
      >
        {/* Header */}
        {(title || description) && (
          <div className="border-b px-6 py-4">
            {title && (
              <h2 className="text-lg font-semibold">{title}</h2>
            )}
            {description && (
              <p className="mt-1 text-sm text-[var(--muted)]">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Body */}
        <div className="px-6 py-4">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="border-t border-var px-6 py-4 flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
