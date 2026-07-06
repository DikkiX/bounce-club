"use client";

import Link from "next/link";
import { Music2 } from "lucide-react";
import { IconInstagram } from "@/components/figma/icons";
import { DJDeck } from "@/components/figma/DJDeck";
import { BtnOutline, Pill, SectionLabel } from "@/components/figma/ui";
import { useLocale } from "@/components/LocaleProvider";
import { fmtEventDate } from "@/lib/format";
import { brand, barlow } from "@/lib/brand";
import { albumCoverSrc, type GalleryAlbum } from "@/lib/gallery";
import type { LocalMedia } from "@/lib/localGallery";
import { site } from "@/lib/site";

type Props = {
  nextEvent: {
    id: string;
    title: string;
    date: string;
    time: string;
    description: string;
    artists?: string[];
    image?: string;
    ticketUrl?: string;
  } | null;
  residents: { id: string; name: string; genre: string; image: string }[];
  albums: GalleryAlbum[];
  heroMedia: LocalMedia | null;
};

export function HomeContent({ nextEvent, residents, albums, heroMedia }: Props) {
  const { t } = useLocale();

  return (
    <div className="relative pt-20">
      {heroMedia?.type === "video" ? (
        <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          <video
            src={heroMedia.src}
            className="absolute left-1/2 top-1/2 min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 object-cover opacity-25"
            autoPlay
            muted
            loop
            playsInline
          />
          <div
            className="absolute inset-0"
            style={{ background: "radial-gradient(circle at center, rgba(24,26,29,0.45), rgba(24,26,29,0.92))" }}
          />
        </div>
      ) : null}

      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-20 text-center">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center">
          <p className="mb-6 text-xs tracking-[0.35em]" style={{ color: brand.gold, fontFamily: barlow }}>
            {t.hero.tag}
          </p>
          <h1
            className="mb-2 font-black uppercase leading-none"
            style={{ fontFamily: barlow, fontSize: "clamp(3.5rem, 9vw, 7.5rem)", letterSpacing: "0.06em" }}
          >
            {t.hero.title1}
            <br />
            <span style={{ color: brand.gold }}>{t.hero.title2}</span>
          </h1>
          <p className="mb-10 text-sm tracking-[0.08em]" style={{ color: brand.muted }}>
            {t.hero.sub}
          </p>
          <div className="mx-auto flex justify-center">
            <DJDeck size={380} />
          </div>
          <p className="mt-8 text-xs tracking-[0.28em]" style={{ color: brand.muted, fontFamily: barlow }}>
            {t.hero.spin}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/events"
              className="inline-block px-10 py-3 text-sm font-black uppercase tracking-[0.2em] transition-colors"
              style={{ fontFamily: barlow, background: brand.gold, color: brand.bg, borderRadius: 4 }}
            >
              {t.hero.viewEvents}
            </Link>
            <a
              href={site.ticketsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-block px-10 py-3 text-sm font-black uppercase tracking-[0.2em] transition-colors"
              style={{ fontFamily: barlow, border: `1px solid ${brand.gold}`, color: brand.gold, borderRadius: 4 }}
            >
              {t.hero.getTickets}
            </a>
          </div>
        </div>
      </section>

      <section
        className="relative z-10 mx-auto grid max-w-6xl gap-12 px-6 pb-24"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}
      >
        <div>
          <SectionLabel>{t.home.nextEvent}</SectionLabel>
          {nextEvent ? (
            <div className="overflow-hidden rounded-2xl" style={{ background: brand.card, border: `1px solid ${brand.goldMuted}` }}>
              <div className="relative bg-[#0A0B0C]" style={{ paddingTop: "58%" }}>
                {nextEvent.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={nextEvent.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-65" />
                )}
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(24,26,29,0.92) 0%, transparent 55%)" }} />
                <div className="absolute left-4 top-4">
                  <span
                    className="rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.12em]"
                    style={{ background: brand.gold, color: brand.bg, fontFamily: barlow }}
                  >
                    {fmtEventDate(nextEvent.date)}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="mb-1 text-2xl font-black uppercase leading-tight" style={{ fontFamily: barlow }}>
                  {nextEvent.title}
                </h3>
                {nextEvent.artists?.length ? (
                  <p className="mb-1 text-sm tracking-[0.08em]" style={{ color: brand.gold, fontFamily: barlow }}>
                    {nextEvent.artists.join(" / ")}
                  </p>
                ) : null}
                <p className="mb-4 text-xs" style={{ color: brand.muted }}>
                  {nextEvent.time}
                </p>
                <p className="mb-6 text-sm leading-relaxed" style={{ color: brand.muted }}>
                  {nextEvent.description}
                </p>
                {nextEvent.ticketUrl ? (
                  <a
                    href={nextEvent.ticketUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block px-6 py-2.5 text-sm font-black uppercase tracking-[0.18em] transition-colors"
                    style={{ fontFamily: barlow, border: `1px solid ${brand.gold}`, color: brand.gold, borderRadius: 4 }}
                  >
                    {t.home.buyNow}
                  </a>
                ) : (
                  <BtnOutline>{t.home.getTickets}</BtnOutline>
                )}
              </div>
            </div>
          ) : (
            <p style={{ color: brand.muted }}>{t.home.noEvents}</p>
          )}
        </div>

        <div>
          <SectionLabel>{t.home.onDecks}</SectionLabel>
          <div className="flex flex-col gap-3">
            {residents.map((dj) => (
              <div
                key={dj.id}
                className="flex items-center gap-4 rounded-xl p-4 transition-all duration-200"
                style={{ background: brand.glass, border: `1px solid ${brand.goldMuted}`, cursor: "pointer" }}
              >
                <div
                  className="shrink-0 overflow-hidden rounded-full"
                  style={{ width: 52, height: 52, background: "#0A0B0C", border: `1.5px solid ${brand.goldMuted}` }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={dj.image} alt={dj.name} className="h-full w-full object-cover grayscale-[55%]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="mb-0.5 text-sm font-black uppercase leading-none" style={{ fontFamily: barlow }}>
                    {dj.name}
                  </p>
                  <p className="text-xs tracking-[0.08em]" style={{ color: brand.gold, fontFamily: barlow }}>
                    {dj.genre}
                  </p>
                </div>
                <Pill>{t.home.resident}</Pill>
              </div>
            ))}
            {residents.length === 0 && <p style={{ color: brand.muted }}>{t.home.noDjs}</p>}
          </div>
          <Link
            href="/lineup"
            className="mt-5 inline-block text-xs uppercase tracking-[0.2em] transition-colors"
            style={{ color: brand.gold, fontFamily: barlow }}
          >
            {t.home.fullLineup}
          </Link>
        </div>
      </section>

      <section className="relative z-10 px-6 pb-24">
        <div className="mx-auto max-w-6xl">
          <SectionLabel>{t.home.fromFloor}</SectionLabel>
          <div className="scroll-strip flex gap-4 overflow-x-auto pb-2">
            {albums.map((album) => (
              <Link
                key={album.id}
                href="/gallery"
                className="relative shrink-0 overflow-hidden rounded-xl transition-colors hover:opacity-95"
                style={{ width: 220, height: 220, background: "#0A0B0C", border: `1px solid ${brand.goldMuted}` }}
              >
                {albumCoverSrc(album) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={albumCoverSrc(album)} alt="" className="h-full w-full object-cover opacity-60" />
                ) : (
                  <div className="h-full w-full" style={{ background: "#111" }} />
                )}
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%)" }} />
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-xs font-black uppercase leading-snug" style={{ fontFamily: barlow }}>
                    {album.title}
                  </p>
                  <p className="mt-0.5 text-xs" style={{ color: brand.gold, fontFamily: barlow }}>
                    {fmtEventDate(String(album.date))}
                  </p>
                </div>
              </Link>
            ))}
            {albums.length === 0 && <p style={{ color: brand.muted }}>{t.home.noGallery}</p>}
          </div>
        </div>
      </section>

      <footer className="relative z-10 px-6 py-10" style={{ borderTop: `1px solid ${brand.goldMuted}` }}>
        <div
          className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-xs md:flex-row"
          style={{ color: brand.muted }}
        >
          <span className="font-black uppercase tracking-[0.22em] text-white" style={{ fontFamily: barlow }}>
            BOUNCE CLUB
          </span>
          <span>{t.footer.tagline}</span>
          <div className="flex gap-4">
            <a href={site.instagramUrl} target="_blank" rel="noreferrer" style={{ color: brand.gold }}>
              <IconInstagram size={17} />
            </a>
            <a href={site.ticketsUrl} target="_blank" rel="noreferrer" style={{ color: brand.gold }}>
              <Music2 size={17} />
            </a>
          </div>
          <span>© {new Date().getFullYear()} Bounce Club Amsterdam</span>
        </div>
      </footer>
    </div>
  );
}
