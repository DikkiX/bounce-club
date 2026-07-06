"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Music2, Play } from "lucide-react";
import { IconInstagram } from "@/components/figma/icons";
import { BtnPrimary, PageTitle } from "@/components/figma/ui";
import { useLocale } from "@/components/LocaleProvider";
import { fmtEventDate } from "@/lib/format";
import { brand, barlow } from "@/lib/brand";
import { site } from "@/lib/site";
import type { EventItem } from "@/types";

function EventCard({ event, now }: { event: EventItem; now: Date }) {
  const [hov, setHov] = useState(false);
  const isPast = new Date(event.date) < now;
  const status = isPast ? "Past" : "On sale";
  const { t } = useLocale();
  const statusLabel = isPast ? t.events.past : t.events.onSale;

  return (
    <div
      className="cursor-pointer overflow-hidden rounded-2xl"
      style={{
        background: brand.card,
        border: `1px solid ${hov ? brand.gold : brand.goldMuted}`,
        transform: hov ? "translateY(-6px)" : "none",
        boxShadow: hov ? "0 0 28px rgba(253,199,99,0.18)" : "none",
        transition: "all 0.25s ease",
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div className="relative bg-[#0A0B0C]" style={{ paddingTop: "57%" }}>
        {event.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={event.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" />
        )}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(24,26,29,0.85) 0%, transparent 60%)" }} />
      </div>
      <div className="p-5">
        <p className="mb-1 text-xs uppercase tracking-[0.18em]" style={{ color: brand.gold, fontFamily: barlow }}>
          {fmtEventDate(event.date)}
        </p>
        <h3 className="mb-1 text-xl font-black uppercase leading-tight" style={{ fontFamily: barlow }}>
          {event.title}
        </h3>
        <p className="mb-3 line-clamp-2 text-xs leading-relaxed" style={{ color: brand.muted }}>
          {event.description}
        </p>
        <div className="flex items-center justify-between">
          <span
            className="rounded-full px-2.5 py-0.5 text-[10px] tracking-[0.1em]"
            style={{
              border: `1px solid ${status === "On sale" ? brand.gold : brand.goldMuted}`,
              color: status === "On sale" ? brand.gold : brand.muted,
              fontFamily: barlow,
            }}
          >
            {statusLabel}
          </span>
          {event.ticketUrl ? (
            <a
              href={event.ticketUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs uppercase tracking-[0.18em]"
              style={{ color: brand.gold, fontFamily: barlow }}
            >
              {t.events.buyNow} →
            </a>
          ) : (
            <Link
              href="/events"
              className="text-xs uppercase tracking-[0.18em]"
              style={{ color: brand.gold, fontFamily: barlow }}
            >
              {t.events.details}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export function EventsClient({ events, serverNow }: { events: EventItem[]; serverNow: string }) {
  const { t } = useLocale();
  const now = useMemo(() => new Date(serverNow), [serverNow]);
  const hasUpcoming = events.some((e) => new Date(e.date) >= now);
  const [filter, setFilter] = useState<"Upcoming" | "Past">(hasUpcoming ? "Upcoming" : "Past");

  const upcoming = events.filter((e) => new Date(e.date) >= now);
  const past = events.filter((e) => new Date(e.date) < now);
  const featured = filter === "Upcoming" ? upcoming.find((e) => e.featured) ?? upcoming[0] : undefined;
  const rest =
    filter === "Upcoming"
      ? upcoming.filter((e) => e.id !== featured?.id)
      : past;

  return (
    <div className="fade-up mx-auto max-w-6xl px-6 pb-20 pt-28">
      <PageTitle>{t.events.title}</PageTitle>

      <div
        className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-xl px-5 py-4"
        style={{ border: `1px solid ${brand.goldMuted}`, background: "rgba(253,199,99,0.06)" }}
      >
        <p className="text-xs uppercase tracking-[0.18em]" style={{ color: brand.gold, fontFamily: barlow }}>
          {upcoming.length} {t.events.strip}
        </p>
        <div className="flex items-center gap-3">
          <a
            href={site.instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 text-xs font-black uppercase tracking-[0.15em]"
            style={{ border: `1px solid ${brand.gold}`, color: brand.gold, borderRadius: 999 }}
          >
            {t.events.instagram}
          </a>
          <a
            href={site.ticketsUrl}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 text-xs font-black uppercase tracking-[0.15em]"
            style={{ background: brand.gold, color: brand.bg, borderRadius: 999 }}
          >
            {t.events.tickets}
          </a>
        </div>
      </div>

      <div className="mb-12 flex gap-3">
        {(["Upcoming", "Past"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className="rounded-full px-5 py-2 text-sm font-black uppercase tracking-[0.15em] transition-colors"
            style={{
              fontFamily: barlow,
              background: filter === f ? brand.gold : "transparent",
              color: filter === f ? brand.bg : brand.gold,
              border: `1px solid ${brand.gold}`,
            }}
          >
            {f === "Upcoming" ? t.events.upcoming : t.events.past}
          </button>
        ))}
      </div>

      {filter === "Upcoming" && featured && (
        <div
          className="mb-12 grid overflow-hidden rounded-2xl md:grid-cols-2"
          style={{ background: brand.card, border: `1px solid ${brand.goldMuted}` }}
        >
          <div className="relative min-h-[340px] bg-[#0A0B0C]">
            {featured.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={featured.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70" />
            )}
            <div className="absolute inset-0" style={{ background: "linear-gradient(to right, transparent 60%, rgba(30,33,38,0.95))" }} />
            <div className="absolute left-5 top-5">
              <span
                className="rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.12em]"
                style={{ background: brand.gold, color: brand.bg, fontFamily: barlow }}
              >
                ★ {t.events.featured}
              </span>
            </div>
          </div>
          <div className="flex flex-col justify-center p-10">
            <p className="mb-2 text-sm uppercase tracking-[0.2em]" style={{ color: brand.gold, fontFamily: barlow }}>
              {fmtEventDate(featured.date)}
            </p>
            <h2 className="mb-2 text-4xl font-black uppercase leading-tight" style={{ fontFamily: barlow }}>
              {featured.title}
            </h2>
            {featured.artists?.length ? (
              <p className="mb-1 text-sm tracking-[0.08em]" style={{ color: brand.gold, fontFamily: barlow }}>
                {featured.artists.join(" / ")}
              </p>
            ) : null}
            <p className="mb-4 text-xs" style={{ color: brand.muted }}>
              {featured.time}
            </p>
            <p className="mb-8 text-sm leading-relaxed" style={{ color: brand.muted }}>
              {featured.description}
            </p>
            {featured.ticketUrl ? (
              <a
                href={featured.ticketUrl}
                target="_blank"
                rel="noreferrer"
                className="self-start px-8 py-3 text-sm font-black uppercase tracking-[0.18em] transition-colors"
                style={{ fontFamily: barlow, background: brand.gold, color: brand.bg, borderRadius: 4 }}
              >
                {t.events.buyNow}
              </a>
            ) : (
              <BtnPrimary className="self-start">{t.events.tickets}</BtnPrimary>
            )}
          </div>
        </div>
      )}

      {rest.length === 0 ? (
        <p style={{ color: brand.muted }}>{t.events.noEvents}</p>
      ) : (
        <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
          {rest.map((e) => (
            <EventCard key={e.id} event={e} now={now} />
          ))}
        </div>
      )}
    </div>
  );
}

export function DjCard({ dj }: { dj: { id: string; name: string; genre: string; bio: string; image: string; social?: { instagram?: string; soundcloud?: string; spotify?: string } } }) {
  const [hov, setHov] = useState(false);

  return (
    <div
      className="cursor-pointer rounded-2xl p-6 text-center"
      style={{
        background: hov ? brand.card : brand.glass,
        border: `1px solid ${hov ? brand.gold : brand.goldMuted}`,
        transform: hov ? "translateY(-6px)" : "none",
        boxShadow: hov ? "0 0 28px rgba(253,199,99,0.16)" : "none",
        transition: "all 0.25s ease",
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div
        className="mx-auto mb-4 overflow-hidden rounded-full"
        style={{
          width: 112,
          height: 112,
          background: "#0A0B0C",
          border: `2px solid ${hov ? brand.gold : brand.goldMuted}`,
          transition: "border-color 0.25s ease",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={dj.image} alt={dj.name} className="h-full w-full object-cover grayscale-[50%] contrast-[1.08]" />
      </div>
      <h3 className="mb-1 text-2xl font-black uppercase leading-none tracking-[0.06em]" style={{ fontFamily: barlow }}>
        {dj.name}
      </h3>
      <p className="mb-3 text-xs tracking-[0.18em]" style={{ color: brand.gold, fontFamily: barlow }}>
        {dj.genre}
      </p>
      <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: hov ? 80 : 0, opacity: hov ? 1 : 0 }}>
        <p className="mb-3 text-sm leading-relaxed" style={{ color: brand.muted }}>
          {dj.bio}
        </p>
      </div>
      <div className="mt-2 flex justify-center gap-4">
        {dj.social?.instagram && (
          <a href={dj.social.instagram} target="_blank" rel="noreferrer" style={{ color: brand.gold }}>
            <IconInstagram size={15} />
          </a>
        )}
        {dj.social?.soundcloud && (
          <a href={dj.social.soundcloud} target="_blank" rel="noreferrer" style={{ color: brand.gold }}>
            <Music2 size={15} />
          </a>
        )}
        {dj.social?.spotify && (
          <a href={dj.social.spotify} target="_blank" rel="noreferrer" style={{ color: brand.gold }}>
            <Play size={15} />
          </a>
        )}
      </div>
    </div>
  );
}
