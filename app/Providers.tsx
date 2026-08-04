'use client'

import { ThemeProvider } from "@/context/theme-context";
import { ToastProvider } from "@/components/Base/notification/ToastProvider";
import ResponsiveInit from "./ResponsiveInit";
import ChatRealtimeInit from './ChatRealtimeInit';

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <ToastProvider position="top-right">
        <ResponsiveInit />
        <ChatRealtimeInit />
        {children}
      </ToastProvider>
    </ThemeProvider>
  );
}
