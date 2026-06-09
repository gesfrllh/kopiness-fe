import React from "react";

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
    wrap: "py-4 px-5",
    title: "text-lg",
    subtitle: "text-sm",
  },
  md: {
    wrap: "py-6 px-7",
    title: "text-2xl",
    subtitle: "text-base",
  },
  lg: {
    wrap: "py-8 px-9",
    title: "text-4xl",
    subtitle: "text-lg",
  },
};

const variantMap = {
  gradient:
    "bg-gradient-to-r from-amber-950 via-amber-800 to-orange-700 text-white border-white/10",
  dark: "bg-zinc-900 text-white border-white/10",
  light: "bg-white text-zinc-900 border-zinc-200",
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
      <div
        className={`
          relative overflow-hidden rounded-2xl shadow-lg
          border ${variantMap[variant]}
          ${style.wrap}
        `}
      >
        {/* efek background (cuma muncul kalau gradient/dark) */}
        {(variant === "gradient" || variant === "dark") && (
          <>
            <div className="pointer-events-none absolute inset-0 opacity-25">
              <div className="absolute -top-16 -left-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
              <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-black/20 blur-2xl" />
            </div>

            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -left-1/2 top-0 h-full w-1/2 rotate-12 bg-white/10 blur-xl" />
            </div>
          </>
        )}

        <div className="relative flex items-center justify-between gap-6">
          {leftSlot && <div className="shrink-0">{leftSlot}</div>}
          <div className="flex items-center gap-3">
            {icon && (
              <div
                className={`
                  flex h-11 w-11 items-center justify-center rounded-xl
                  ${variant === "light" ? "bg-zinc-100" : "bg-white/10"}
                `}
              >
                {icon}
              </div>
            )}

            <div>
              <h1 className={`font-extrabold tracking-tight ${style.title}`}>
                {title}
              </h1>

              {subtitle && (
                <p
                  className={`
                    mt-1 ${style.subtitle}
                    ${variant === "light" ? "text-zinc-600" : "text-white/75"}
                  `}
                >
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {rightSlot && <div className="shrink-0">{rightSlot}</div>}
        </div>
      </div>
    </div>
  );
};

export default CTA;
