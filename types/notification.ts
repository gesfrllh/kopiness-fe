import { JSX } from "react";


export interface NotifyProps {
  type?: "success" | "error" | "warning" | "info";
  title?: string;
  text?: string;
  duration?: number;
  dismissable?: boolean;
  icon?: string | JSX.Element;
  onClose?: () => void;
}
