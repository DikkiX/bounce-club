"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, X } from "lucide-react";
import { PageTitle } from "@/components/figma/ui";
import { GalleryMediaFrame } from "@/components/GalleryMediaFrame";
import { useLocale } from "@/components/LocaleProvider";
import { fmtEventDate } from "@/lib/format";
import { albumCoverSrc, type GalleryAlbum, type GalleryMediaItem } from "@/lib/gallery";
import { brand, barlow } from "@/lib/brand";

type LightboxState = {
  album: GalleryAlbum;
  index: number;
};

export function GalleryClient({ albums }: { albums: GalleryAlbum[] }) {
  const { t } = useLocale();
  const [selectedAlbum, setSelectedAlbum] = useState<GalleryAlbum | null>(null);
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);
  const [navVisible, setNavVisible] = useState(false);
  const navTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showNav = useCallback(() => {
    setNavVisible(true);
    if (navTimer.current) clearTimeout(navTimer.current);
    navTimer.current = setTimeout(() => setNavVisible(false), 2200);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightbox(null);
    setNavVisible(false);
  }, []);

  const goPrev = useCallback(() => {
    setLightbox((lb) => {
      if (!lb) return null;
      const len = lb.album.media.length;
      return { ...lb, index: (lb.index - 1 + len) % len };
    });
    showNav();
  }, [showNav]);

  const goNext = useCallback(() => {
    setLightbox((lb) => {
      if (!lb) return null;
      const len = lb.album.media.length;
      return { ...lb, index: (lb.index + 1) % len };
    });
    showNav();
  }, [showNav]);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, closeLightbox, goPrev, goNext]);

  useEffect(() => {
    return () => {
      if (navTimer.current) clearTimeout(navTimer.current);
    };
  }, []);

  const currentMedia = useMemo<GalleryMediaItem | null>(() => {
    if (!lightbox) return null;
    return lightbox.album.media[lightbox.index] ?? null;
  }, [lightbox]);

  function openLightbox(album: GalleryAlbum, index: number) {
    setLightbox({ album, index });
    showNav();
  }

  if (selectedAlbum) {
    const mediaCount = selectedAlbum.media.length;
    return (
      <div className="fade-up mx-auto max-w-6xl px-6 pb-20 pt-28">
        <button
          type="button"
          onClick={() => setSelectedAlbum(null)}
          className="mb-6 flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] transition-colors hover:opacity-80"
          style={{ fontFamily: barlow, color: brand.gold }}
        >
          <ArrowLeft size={16} />
          {t.gallery.back}
        </button>

        <div className="mb-8">
          <PageTitle>{selectedAlbum.title}</PageTitle>
          <p className="mt-2 text-sm tracking-[0.12em]" style={{ color: brand.gold, fontFamily: barlow }}>
            {fmtEventDate(selectedAlbum.date)} · {mediaCount} {mediaCount === 1 ? t.gallery.item : t.gallery.items}
          </p>
          {selectedAlbum.description ? (
            <p className="mt-3 max-w-2xl text-sm leading-relaxed" style={{ color: brand.muted }}>
              {selectedAlbum.description}
            </p>
          ) : null}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {selectedAlbum.media.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className="group relative overflow-hidden rounded-xl"
              style={{ paddingTop: "75%", background: "#0A0B0C", border: `1px solid ${brand.goldMuted}` }}
              onClick={() => openLightbox(selectedAlbum, index)}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = brand.gold)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = brand.goldMuted)}
            >
              <div className="absolute inset-0 overflow-hidden">
                <GalleryMediaFrame
                  src={item.src}
                  type={item.type}
                  crop={item.crop}
                  className="h-full w-full opacity-80 transition-all duration-300 group-hover:scale-105 group-hover:opacity-100"
                  videoProps={{ autoPlay: true, muted: true, loop: true, playsInline: true }}
                />
              </div>
              {item.type === "video" ? (
                <span
                  className="absolute left-3 top-3 rounded px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.12em]"
                  style={{ background: brand.gold, color: brand.bg, fontFamily: barlow }}
                >
                  {t.gallery.video}
                </span>
              ) : null}
            </button>
          ))}
        </div>

        {mediaCount === 0 && (
          <p className="py-12 text-center text-sm" style={{ color: brand.muted }}>
            {t.gallery.noMedia}
          </p>
        )}

        {lightbox && currentMedia && (
          <LightboxOverlay
            album={lightbox.album}
            index={lightbox.index}
            media={currentMedia}
            navVisible={navVisible}
            onClose={closeLightbox}
            onPrev={goPrev}
            onNext={goNext}
            onMouseActivity={showNav}
            t={t.gallery}
          />
        )}
      </div>
    );
  }

  return (
    <div className="fade-up mx-auto max-w-6xl px-6 pb-20 pt-28">
      <PageTitle>{t.gallery.title}</PageTitle>
      <p className="mb-8 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: brand.muted }}>
        {t.gallery.subtitle}
      </p>

      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
        {albums.map((album) => {
          const cover = albumCoverSrc(album);
          const count = album.media.length;
          return (
            <button
              key={album.id}
              type="button"
              className="group relative cursor-pointer overflow-hidden rounded-xl text-left"
              style={{ paddingTop: "75%", background: "#0A0B0C", border: `1px solid ${brand.goldMuted}` }}
              onClick={() => setSelectedAlbum(album)}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = brand.gold)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = brand.goldMuted)}
            >
              {cover ? (
                <div className="absolute inset-0 overflow-hidden">
                  <GalleryMediaFrame
                    src={cover}
                    type={album.media[0]?.type ?? "image"}
                    crop={album.media[0]?.crop}
                    className="h-full w-full opacity-70 transition-all duration-300 group-hover:scale-105 group-hover:opacity-40"
                    videoProps={{ autoPlay: true, muted: true, loop: true, playsInline: true }}
                  />
                </div>
              ) : (
                <div className="absolute inset-0" style={{ background: "#111" }} />
              )}
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <p className="px-6 text-center text-lg font-black uppercase leading-tight" style={{ fontFamily: barlow }}>
                  {album.title}
                </p>
                <p className="mt-1 text-xs tracking-[0.1em]" style={{ color: brand.gold, fontFamily: barlow }}>
                  {fmtEventDate(album.date)}
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.14em]" style={{ color: "#fff" }}>
                  {count} {count === 1 ? t.gallery.item : t.gallery.items}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {albums.length === 0 && (
        <p className="py-16 text-center" style={{ color: brand.muted }}>
          {t.gallery.empty}
        </p>
      )}
    </div>
  );
}

function LightboxOverlay({
  album,
  index,
  media,
  navVisible,
  onClose,
  onPrev,
  onNext,
  onMouseActivity,
  t,
}: {
  album: GalleryAlbum;
  index: number;
  media: GalleryMediaItem;
  navVisible: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onMouseActivity: () => void;
  t: {
    video: string;
    photoCredit: string;
  };
}) {
  const total = album.media.length;
  const credit = media.photoCredit || album.photoCredit;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(8,9,10,0.94)", backdropFilter: "blur(12px)" }}
      onClick={onClose}
      onMouseMove={onMouseActivity}
    >
      {total > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous"
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full p-3 transition-opacity duration-300 md:left-8"
            style={{
              border: `1px solid ${brand.goldMuted}`,
              color: brand.gold,
              background: "rgba(24,26,29,0.85)",
              opacity: navVisible ? 1 : 0,
              pointerEvents: navVisible ? "auto" : "none",
            }}
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
          >
            <ChevronLeft size={28} />
          </button>
          <button
            type="button"
            aria-label="Next"
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full p-3 transition-opacity duration-300 md:right-8"
            style={{
              border: `1px solid ${brand.goldMuted}`,
              color: brand.gold,
              background: "rgba(24,26,29,0.85)",
              opacity: navVisible ? 1 : 0,
              pointerEvents: navVisible ? "auto" : "none",
            }}
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
          >
            <ChevronRight size={28} />
          </button>
        </>
      )}

      <div className="relative w-full max-w-5xl px-6" onClick={(e) => e.stopPropagation()}>
        <div className="overflow-hidden rounded-xl" style={{ border: `1px solid ${brand.goldMuted}` }}>
          {media.type === "video" ? (
            <video src={media.src} controls autoPlay playsInline className="max-h-[75vh] w-full bg-black" />
          ) : (
            <div className="flex max-h-[75vh] items-center justify-center bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={media.src} alt="" className="max-h-[75vh] w-full object-contain" />
            </div>
          )}
        </div>

        <div className="mt-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-lg font-black uppercase leading-none" style={{ fontFamily: barlow }}>
              {album.title}
            </p>
            <p className="mt-1 text-sm tracking-[0.1em]" style={{ color: brand.gold, fontFamily: barlow }}>
              {fmtEventDate(album.date)} · {index + 1} / {total}
            </p>
            {credit ? (
              <p className="mt-1 text-xs uppercase tracking-[0.12em]" style={{ color: brand.muted }}>
                {t.photoCredit}: {credit}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <button
        type="button"
        className="absolute right-6 top-24 transition-opacity duration-300"
        style={{ color: brand.gold, opacity: navVisible ? 1 : 0.5 }}
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <X size={26} />
      </button>
    </div>
  );
}
