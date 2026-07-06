"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp, Crop, GripVertical, Trash2 } from "lucide-react";
import { GalleryCropModal } from "@/components/admin/GalleryCropModal";
import { GalleryMediaFrame } from "@/components/GalleryMediaFrame";
import { brand, barlow } from "@/lib/brand";
import { FULL_CROP, isFullCrop, type GalleryCrop, type GalleryMediaItem } from "@/lib/gallery";

type Props = {
  media: GalleryMediaItem[];
  onChange: (media: GalleryMediaItem[]) => void;
  onUpload: (files: File[]) => Promise<{ url: string; type: "image" | "video" }[]>;
};

export function GalleryAlbumEditor({ media, onChange, onUpload }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(media[0]?.id ?? null);
  const [uploading, setUploading] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [cropTarget, setCropTarget] = useState<GalleryMediaItem | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const selected = media.find((m) => m.id === selectedId) ?? null;

  useEffect(() => {
    if (selectedId && !media.some((m) => m.id === selectedId)) {
      setSelectedId(media[0]?.id ?? null);
    }
  }, [media, selectedId]);

  const updateItem = useCallback(
    (id: string, patch: Partial<GalleryMediaItem>) => {
      onChange(media.map((m) => (m.id === id ? { ...m, ...patch } : m)));
    },
    [media, onChange],
  );

  const removeItem = useCallback(
    (id: string) => {
      const next = media.filter((m) => m.id !== id).map((m, i) => ({ ...m, order: i }));
      onChange(next);
      if (selectedId === id) setSelectedId(next[0]?.id ?? null);
    },
    [media, onChange, selectedId],
  );

  const moveItem = useCallback(
    (from: number, to: number) => {
      if (to < 0 || to >= media.length) return;
      const next = [...media];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      onChange(next.map((m, i) => ({ ...m, order: i })));
    },
    [media, onChange],
  );

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      const uploaded = await onUpload(Array.from(files));
      const start = media.length;
      const newItems: GalleryMediaItem[] = uploaded.map((u, i) => ({
        id: `new-${Date.now()}-${i}`,
        src: u.url,
        type: u.type,
        order: start + i,
        crop: FULL_CROP,
      }));
      onChange([...media, ...newItems]);
      if (!selectedId && newItems[0]) setSelectedId(newItems[0].id);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="md:col-span-2 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.16em]" style={{ color: brand.gold, fontFamily: barlow }}>
          Photos & videos ({media.length})
        </p>
        <div className="flex gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/*,video/mp4,video/webm,video/quicktime"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
            className="px-4 py-2 text-[11px] font-black uppercase tracking-[0.14em] disabled:opacity-50"
            style={{ fontFamily: barlow, background: brand.gold, color: brand.bg, borderRadius: 4 }}
          >
            {uploading ? "Uploading…" : "Add media"}
          </button>
        </div>
      </div>

      {media.length === 0 ? (
        <p
          className="rounded-xl py-10 text-center text-sm"
          style={{ color: brand.muted, border: `1px dashed ${brand.goldMuted}` }}
        >
          Upload photos and videos. Drag rows to reorder — first item is the cover.
        </p>
      ) : (
        <div className="grid gap-4 xl:grid-cols-[1fr_300px]">
          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {media.map((item, index) => (
              <div
                key={item.id}
                draggable
                onDragStart={() => setDragIndex(index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (dragIndex !== null && dragIndex !== index) moveItem(dragIndex, index);
                  setDragIndex(null);
                }}
                className="flex items-center gap-3 rounded-lg p-2 transition-colors"
                style={{
                  background: selectedId === item.id ? "rgba(253,199,99,0.08)" : brand.glass,
                  border: `1px solid ${selectedId === item.id ? brand.gold : brand.goldMuted}`,
                }}
              >
                <GripVertical size={16} style={{ color: brand.muted, cursor: "grab" }} />
                <button
                  type="button"
                  className="relative h-16 w-24 shrink-0 overflow-hidden rounded"
                  style={{ background: "#0A0B0C" }}
                  onClick={() => setSelectedId(item.id)}
                >
                  <GalleryMediaFrame
                    src={item.src}
                    type={item.type}
                    crop={item.crop}
                    className="h-full w-full"
                    videoProps={{ muted: true, playsInline: true }}
                  />
                </button>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-black uppercase" style={{ fontFamily: barlow }}>
                    {index === 0 ? "Cover · " : ""}
                    {item.type === "video" ? "Video" : "Photo"} #{index + 1}
                    {!isFullCrop(item.crop) ? " · cropped" : ""}
                  </p>
                  <p className="truncate text-[10px]" style={{ color: brand.muted }}>
                    {item.src.split("/").pop()}
                  </p>
                </div>
                <button
                  type="button"
                  title="Crop"
                  onClick={() => setCropTarget(item)}
                  className="shrink-0 rounded p-1.5"
                  style={{ border: `1px solid ${brand.goldMuted}`, color: brand.gold }}
                >
                  <Crop size={14} />
                </button>
                <div className="flex shrink-0 flex-col gap-1">
                  <button type="button" onClick={() => moveItem(index, index - 1)} disabled={index === 0} style={{ color: brand.muted }}>
                    <ChevronUp size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveItem(index, index + 1)}
                    disabled={index === media.length - 1}
                    style={{ color: brand.muted }}
                  >
                    <ChevronDown size={14} />
                  </button>
                </div>
                <button type="button" onClick={() => removeItem(item.id)} style={{ color: "rgba(255,120,120,0.8)" }}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          {selected && (
            <div className="rounded-xl p-4" style={{ background: brand.glass, border: `1px solid ${brand.goldMuted}` }}>
              <p className="mb-3 text-xs font-black uppercase tracking-[0.14em]" style={{ fontFamily: barlow, color: brand.gold }}>
                Preview
              </p>
              <div
                className="relative mb-4 overflow-hidden rounded-lg"
                style={{ paddingTop: "75%", background: "#0A0B0C", border: `1px solid ${brand.goldMuted}` }}
              >
                <GalleryMediaFrame
                  src={selected.src}
                  type={selected.type}
                  crop={selected.crop}
                  className="absolute inset-0 h-full w-full"
                  videoProps={{ muted: true, loop: true, autoPlay: true, playsInline: true }}
                />
              </div>
              <button
                type="button"
                onClick={() => setCropTarget(selected)}
                className="mb-4 flex w-full items-center justify-center gap-2 px-4 py-2.5 text-[11px] font-black uppercase tracking-[0.14em]"
                style={{ fontFamily: barlow, background: brand.gold, color: brand.bg, borderRadius: 4 }}
              >
                <Crop size={14} />
                Open crop editor
              </button>
              <input
                className="admin-input"
                placeholder="Photo credit (optional)"
                value={selected.photoCredit ?? ""}
                onChange={(e) => updateItem(selected.id, { photoCredit: e.target.value })}
              />
            </div>
          )}
        </div>
      )}

      {cropTarget && (
        <GalleryCropModal
          src={cropTarget.src}
          type={cropTarget.type}
          crop={cropTarget.crop}
          onClose={() => setCropTarget(null)}
          onSave={(crop: GalleryCrop) => {
            updateItem(cropTarget.id, { crop });
            setCropTarget(null);
          }}
        />
      )}
    </div>
  );
}
