'use client'

import { useEffect, useMemo } from "react";
import { Icon } from "@iconify/react";
import { NotifyProps } from "@/types/notification";
import './notify.scss'

interface Props extends NotifyProps {
  onClose?: () => void;
}

export default function NotifyItem({
  type = "success",
  title = "",
  text = '',
  duration = 2000,
  dismissable = true,
  icon,
  onClose,
}: Props) {
  const classNames = useMemo(() => {
    console.log(type)
    return ["notify-item", type ? `notify-item--${type}` : ""].join(" ");
  }, [type]);

  useEffect(() => {
    if (duration && duration > 0) {
      const timer = setTimeout(() => {
        if (onClose) onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const renderIcon = () => {
    if (icon) return typeof icon === "string" ? <Icon icon={icon} /> : icon;
    if (type === "success") return <Icon icon="fa6-solid:circle-check" />;
    if (type === "info") return <Icon icon="fa6-solid:circle-info" />;
    if (type === "error") return <Icon icon="fa6-solid:circle-xmark" />;
    if (type === "warning") return <Icon icon="fa6-solid:triangle-exclamation" />;
    return <Icon icon="fa6-solid:info-circle" />;
  };

  return (
    <div className={classNames}>
      <div className="notify-item__header">
        <span className="notify-item__header__icon">{renderIcon()}</span>
        <div className="flex gap-2">
          {title && <span className="notify-item__header__title">{title}:</span>}  {text && <span className="notify-item__header__desc">{text}</span>} 
        </div>
        {dismissable && (
          <span className="notify-item__header__close" onClick={onClose}>
            <Icon icon="fa6-solid:xmark" />
          </span>
        )}
      </div>
    </div>
  );
}
