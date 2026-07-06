"use client";

import { useLocale } from "@/components/LocaleProvider";
import { brand, barlow } from "@/lib/brand";
import { Locale } from "@/lib/i18n/translations";
import { useEffect, useState } from "react";

export function LanguageToggle({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale } = useLocale();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div style={{ width: compact ? 56 : 120, height: 28 }} />;
  }

  const btn = (code: Locale, label: string) => (
    <button
      key={code}
      type="button"
      onClick={() => setLocale(code)}
      className="rounded px-2 py-1 text-[11px] font-black uppercase tracking-[0.12em] transition-colors"
      style={{
        fontFamily: barlow,
        color: locale === code ? brand.bg : brand.gold,
        background: locale === code ? brand.gold : "transparent",
        border: `1px solid ${brand.gold}`,
        opacity: locale === code ? 1 : 0.55,
      }}
    >
      {label}
    </button>
  );

  if (compact) {
    return (
      <div className="flex items-center gap-1.5">
        {btn("en", "EN")}
        {btn("nl", "NL")}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {btn("en", "🇬🇧 EN")}
      {btn("nl", "🇳🇱 NL")}
    </div>
  );
}
