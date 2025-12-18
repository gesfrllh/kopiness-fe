import React, { ReactNode } from "react";

export interface ModalSectionProps {
  children: ReactNode;
}

export const ModalHeader = ({ children }: ModalSectionProps) => {
  return (
    <div className="boder-b px-6 py-4">{children}</div>
  )
}

export const ModalBody = ({ children }: ModalSectionProps) => {
  return (
    <div className="px-6 py-4">{children}</div>
  )
}

export const ModalFooter = ({ children }: ModalSectionProps) => {
  return (
    <div className="border-t px-6 py-4 flex justify-end gap-3">
      {children}
    </div>
  )
}