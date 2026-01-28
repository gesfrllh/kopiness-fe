'use client'

import { ThemeProvider } from "@/context/theme-context";
import { ToastProvider } from "@/components/Base/notification/ToastProvider";
import ResponsiveInit from "./ResponsiveInit";
import ThemeToggle from "@/components/ThemeToggle";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <ToastProvider position="top-right">
        <ResponsiveInit />
        <ThemeToggle />
        {children}
      </ToastProvider>
    </ThemeProvider>
  );
}
