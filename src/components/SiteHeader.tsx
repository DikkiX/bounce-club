"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Music2, X } from "lucide-react";
import { IconInstagram } from "@/components/figma/icons";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useLocale } from "@/components/LocaleProvider";
import { brand, barlow } from "@/lib/brand";
import { site } from "@/lib/site";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { t } = useLocale();

  const links = [
    { href: "/", label: t.nav.home },
    { href: "/events", label: t.nav.events },
    { href: "/lineup", label: t.nav.lineup },
    { href: "/gallery", label: t.nav.gallery },
    { href: "/admin", label: t.nav.admin },
  ];

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <nav
        className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-8 py-5"
        style={{
          background: isHome ? "transparent" : "rgba(24,26,29,0.9)",
          backdropFilter: isHome ? "none" : "blur(18px)",
          borderBottom: isHome ? "none" : `1px solid ${brand.goldMuted}`,
        }}
      >
        <Link
          href="/"
          className="text-sm font-black tracking-[0.22em] text-white"
          style={{ fontFamily: barlow }}
        >
          BOUNCE CLUB
        </Link>
        <div className="flex items-center gap-4">
          <LanguageToggle compact />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            style={{ color: open ? brand.goldHover : brand.gold }}
            aria-label="Menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {open && (
        <div
          className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-6"
          style={{ background: "rgba(24,26,29,0.97)", backdropFilter: "blur(24px)" }}
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="font-black uppercase leading-none transition-colors"
              style={{
                fontFamily: barlow,
                fontSize: "clamp(2.5rem, 8vw, 5.5rem)",
                letterSpacing: "0.1em",
                color: pathname === link.href ? brand.gold : "rgba(255,255,255,0.9)",
              }}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-4">
            <LanguageToggle />
          </div>
          <div className="mt-8 flex gap-6">
            <a href={site.instagramUrl} target="_blank" rel="noreferrer" style={{ color: brand.gold }}>
              <IconInstagram size={20} />
            </a>
            <a href={site.ticketsUrl} target="_blank" rel="noreferrer" style={{ color: brand.gold }}>
              <Music2 size={20} />
            </a>
          </div>
        </div>
      )}
    </>
  );
}
