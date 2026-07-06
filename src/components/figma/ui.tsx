"use client";

import { brand, barlow } from "@/lib/brand";

export function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-block rounded-full px-3 py-0.5 text-[10px] tracking-[0.15em]"
      style={{ border: `1px solid ${brand.gold}`, color: brand.gold, fontFamily: barlow }}
    >
      {children}
    </span>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="mb-6 text-xs uppercase tracking-[0.3em]"
      style={{ color: brand.gold, fontFamily: barlow }}
    >
      {children}
    </p>
  );
}

export function PageTitle({ children, center }: { children: React.ReactNode; center?: boolean }) {
  return (
    <div className={`mb-10 ${center ? "text-center" : ""}`}>
      <h1
        className="mb-2 font-black uppercase leading-none"
        style={{
          fontFamily: barlow,
          fontSize: "clamp(3.5rem, 9vw, 6rem)",
          letterSpacing: "0.06em",
          color: brand.gold,
        }}
      >
        {children}
      </h1>
      <div className={center ? "mx-auto" : ""} style={{ height: 1, width: 72, background: brand.gold }} />
    </div>
  );
}

export function BtnPrimary({
  children,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-8 py-3 text-sm font-black uppercase tracking-[0.18em] transition-colors ${className}`}
      style={{ fontFamily: barlow, background: brand.gold, color: brand.bg, borderRadius: 4 }}
      onMouseEnter={(e) => (e.currentTarget.style.background = brand.goldHover)}
      onMouseLeave={(e) => (e.currentTarget.style.background = brand.gold)}
    >
      {children}
    </button>
  );
}

export function BtnOutline({
  children,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-6 py-2.5 text-sm font-black uppercase tracking-[0.18em] transition-colors ${className}`}
      style={{ fontFamily: barlow, border: `1px solid ${brand.gold}`, color: brand.gold, borderRadius: 4 }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = brand.gold;
        e.currentTarget.style.color = brand.bg;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.color = brand.gold;
      }}
    >
      {children}
    </button>
  );
}
