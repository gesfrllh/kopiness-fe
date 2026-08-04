import React from "react";
import clsx from "clsx";

interface CTAProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  variant?: "gradient" | "dark" | "light";
  rightSlot?: React.ReactNode;
  leftSlot?: React.ReactNode;
  className?: string;
}

const sizeMap = {
  sm: {
    wrap: "px-5 py-4",
    title: "text-lg",
    subtitle: "text-sm",
  },
  md: {
    wrap: "px-5 py-5 sm:px-7 sm:py-6",
    title: "text-2xl sm:text-3xl",
    subtitle: "text-sm sm:text-base",
  },
  lg: {
    wrap: "px-6 py-7 sm:px-9 sm:py-8",
    title: "text-4xl",
    subtitle: "text-base sm:text-lg",
  },
};

const variantMap = {
  gradient:
    "cta-gradient text-white border-[#D9A985]/30",
  dark: "bg-[#29201B] text-white border-[#4B3930]",
  light: "bg-white bg-[var(--surface)] text-[var(--ink)] border-[var(--line)]",
};

const CTA: React.FC<CTAProps> = ({
  title,
  subtitle,
  icon,
  size = "md",
  variant = "gradient",
  leftSlot,
  rightSlot,
  className = "",
}) => {
  const style = sizeMap[size];

  return (
    <div className={`w-full ${className}`}>
      <section
        className={clsx(
          "relative isolate overflow-hidden rounded-[22px] border shadow-[0_14px_32px_rgba(75,45,25,0.10)]",
          variantMap[variant],
          style.wrap,
        )}
      >
        {(variant === "gradient" || variant === "dark") && (
          <>
            <div className="pointer-events-none absolute inset-0 opacity-30 cta-grain" />
            <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full border border-white/15" />
            <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full border border-white/10" />
            <div className="pointer-events-none absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-[#F2C89A] via-[#D68B58] to-transparent opacity-80" />
            <div className="pointer-events-none absolute bottom-5 right-6 hidden text-[86px] leading-none text-white/[0.07] sm:block" aria-hidden="true">
              K
            </div>
          </>
        )}

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            {leftSlot && <div className="shrink-0">{leftSlot}</div>}
            {icon && (
              <div
                className={clsx(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border",
                  variant === "light"
                    ? "border-[var(--line)] bg-[var(--surface-muted)] text-[#9A5B35]"
                    : "border-white/15 bg-white/10 text-[#F5D4B5]",
                )}
              >
                {icon}
              </div>
            )}

            <div className="min-w-0">
              <h1 className={clsx("font-bold tracking-[-0.035em]", style.title)}>
                {title}
              </h1>

              {subtitle && (
                <p className={clsx(
                  "mt-1.5 max-w-2xl leading-relaxed",
                  style.subtitle,
                  variant === "light" ? "text-[var(--muted)]" : "text-white/70",
                )}>
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {rightSlot && <div className="flex shrink-0 items-center sm:justify-end">{rightSlot}</div>}
        </div>
      </section>
    </div>
  );
};

export default CTA;
