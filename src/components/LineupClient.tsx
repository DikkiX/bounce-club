"use client";

import { DjCard } from "@/components/EventsClient";
import { PageTitle } from "@/components/figma/ui";
import { useLocale } from "@/components/LocaleProvider";
import { brand } from "@/lib/brand";

export function LineupClient({ djs }: { djs: { id: string; name: string; genre: string; bio: string; image: string; social?: { instagram?: string; soundcloud?: string; spotify?: string } }[] }) {
  const { t } = useLocale();

  return (
    <div className="fade-up mx-auto max-w-6xl px-6 pb-20 pt-28">
      <div className="mb-16 text-center">
        <PageTitle center>{t.lineup.title}</PageTitle>
      </div>
      <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
        {djs.map((dj) => (
          <DjCard key={dj.id} dj={dj} />
        ))}
      </div>
      {djs.length === 0 && (
        <p className="mt-12 text-center" style={{ color: brand.muted }}>
          {t.lineup.empty}
        </p>
      )}
    </div>
  );
}
