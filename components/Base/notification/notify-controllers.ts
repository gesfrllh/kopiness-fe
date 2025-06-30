import { NotifyProps } from "@/types/notification";

let _show: ((opt: NotifyProps) => void) | undefined;

export function setNotifyHandler(showFn: (opt: NotifyProps) => void) {
  _show = showFn;
}

export function showNotify(opt: NotifyProps) {
  if (_show) _show(opt);
  else console.warn("Notify system not ready yet");
}
