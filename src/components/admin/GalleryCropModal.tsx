"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { brand, barlow } from "@/lib/brand";
import { FULL_CROP, normalizeCrop, type GalleryCrop } from "@/lib/gallery";

type Rect = { x: number; y: number; w: number; h: number };

type LoadedSource = {
  source: CanvasImageSource;
  width: number;
  height: number;
};

type Props = {
  src: string;
  type: "image" | "video";
  crop?: GalleryCrop;
  onSave: (crop: GalleryCrop) => void;
  onClose: () => void;
};

const MIN_SIZE = 32;

export function GalleryCropModal({ src, type, crop, onSave, onClose }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loadedRef = useRef<LoadedSource | null>(null);
  const [imageRect, setImageRect] = useState<Rect | null>(null);
  const [cropRect, setCropRect] = useState<Rect | null>(null);
  const [canvasSize, setCanvasSize] = useState({ w: 860, h: 540 });
  const [drag, setDrag] = useState<{
    mode: "move" | "nw" | "ne" | "sw" | "se";
    startX: number;
    startY: number;
    start: Rect;
  } | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  const renderFrame = useCallback(
    (ctx: CanvasRenderingContext2D, loaded: LoadedSource, imgRect: Rect, cropR: Rect, cw: number, ch: number) => {
      ctx.clearRect(0, 0, cw, ch);
      ctx.fillStyle = "#0A0B0C";
      ctx.fillRect(0, 0, cw, ch);

      ctx.drawImage(loaded.source, imgRect.x, imgRect.y, imgRect.w, imgRect.h);

      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.fillRect(0, 0, cw, cropR.y);
      ctx.fillRect(0, cropR.y + cropR.h, cw, ch - cropR.y - cropR.h);
      ctx.fillRect(0, cropR.y, cropR.x, cropR.h);
      ctx.fillRect(cropR.x + cropR.w, cropR.y, cw - cropR.x - cropR.w, cropR.h);

      ctx.strokeStyle = brand.gold;
      ctx.lineWidth = 2;
      ctx.strokeRect(cropR.x, cropR.y, cropR.w, cropR.h);

      const handle = 10;
      ctx.fillStyle = brand.gold;
      for (const [hx, hy] of [
        [cropR.x, cropR.y],
        [cropR.x + cropR.w, cropR.y],
        [cropR.x, cropR.y + cropR.h],
        [cropR.x + cropR.w, cropR.y + cropR.h],
      ]) {
        ctx.fillRect(hx - handle / 2, hy - handle / 2, handle, handle);
      }

      ctx.strokeStyle = "rgba(253,199,99,0.3)";
      ctx.setLineDash([5, 4]);
      ctx.strokeRect(imgRect.x, imgRect.y, imgRect.w, imgRect.h);
      ctx.setLineDash([]);
    },
    [],
  );

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    loadedRef.current = null;

    async function init() {
      const cw = Math.min(window.innerWidth - 80, 900);
      const ch = Math.min(window.innerHeight * 0.62, 580);
      setCanvasSize({ w: cw, h: ch });

      const loaded = await loadSource(src, type);
      if (cancelled) return;

      if (!loaded || loaded.width < 1 || loaded.height < 1) {
        setStatus("error");
        return;
      }

      loadedRef.current = loaded;

      const scale = Math.min(cw / loaded.width, ch / loaded.height);
      const dw = loaded.width * scale;
      const dh = loaded.height * scale;
      const ix = (cw - dw) / 2;
      const iy = (ch - dh) / 2;
      const imgR: Rect = { x: ix, y: iy, w: dw, h: dh };

      const normalized = normalizeCrop(crop);
      const cropR: Rect = {
        x: ix + (normalized.x / 100) * dw,
        y: iy + (normalized.y / 100) * dh,
        w: (normalized.width / 100) * dw,
        h: (normalized.height / 100) * dh,
      };

      setImageRect(imgR);
      setCropRect(cropR);
      setStatus("ready");
    }

    init();
    return () => {
      cancelled = true;
    };
  }, [src, type, crop]);

  useEffect(() => {
    if (status !== "ready" || !imageRect || !cropRect || !loadedRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = canvasSize.w;
    canvas.height = canvasSize.h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    renderFrame(ctx, loadedRef.current, imageRect, cropRect, canvasSize.w, canvasSize.h);
  }, [status, imageRect, cropRect, canvasSize, renderFrame]);

  function canvasPoint(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }

  function clampCrop(next: Rect, img: Rect): Rect {
    let { x, y, w, h } = next;
    w = Math.max(MIN_SIZE, w);
    h = Math.max(MIN_SIZE, h);
    x = Math.max(img.x, Math.min(x, img.x + img.w - w));
    y = Math.max(img.y, Math.min(y, img.y + img.h - h));
    w = Math.min(w, img.x + img.w - x);
    h = Math.min(h, img.y + img.h - y);
    return { x, y, w, h };
  }

  function hitHandle(px: number, py: number, r: Rect): "nw" | "ne" | "sw" | "se" | "move" | null {
    const t = 16;
    if (Math.hypot(px - r.x, py - r.y) < t) return "nw";
    if (Math.hypot(px - (r.x + r.w), py - r.y) < t) return "ne";
    if (Math.hypot(px - r.x, py - (r.y + r.h)) < t) return "sw";
    if (Math.hypot(px - (r.x + r.w), py - (r.y + r.h)) < t) return "se";
    if (px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h) return "move";
    return null;
  }

  function onPointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!cropRect || !imageRect || status !== "ready") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { x: px, y: py } = canvasPoint(e);
    const mode = hitHandle(px, py, cropRect);
    if (!mode) return;
    canvas.setPointerCapture(e.pointerId);
    setDrag({ mode, startX: px, startY: py, start: cropRect });
  }

  function onPointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drag || !imageRect) return;
    const { x: px, y: py } = canvasPoint(e);
    const dx = px - drag.startX;
    const dy = py - drag.startY;
    const s = drag.start;
    let next: Rect;

    if (drag.mode === "move") {
      next = { x: s.x + dx, y: s.y + dy, w: s.w, h: s.h };
    } else if (drag.mode === "nw") {
      next = { x: s.x + dx, y: s.y + dy, w: s.w - dx, h: s.h - dy };
    } else if (drag.mode === "ne") {
      next = { x: s.x, y: s.y + dy, w: s.w + dx, h: s.h - dy };
    } else if (drag.mode === "sw") {
      next = { x: s.x + dx, y: s.y, w: s.w - dx, h: s.h + dy };
    } else {
      next = { x: s.x, y: s.y, w: s.w + dx, h: s.h + dy };
    }

    setCropRect(clampCrop(next, imageRect));
  }

  function onPointerUp(e: React.PointerEvent<HTMLCanvasElement>) {
    canvasRef.current?.releasePointerCapture(e.pointerId);
    setDrag(null);
  }

  function handleSave() {
    if (!cropRect || !imageRect) return;
    onSave({
      x: Math.round(((cropRect.x - imageRect.x) / imageRect.w) * 1000) / 10,
      y: Math.round(((cropRect.y - imageRect.y) / imageRect.h) * 1000) / 10,
      width: Math.round((cropRect.w / imageRect.w) * 1000) / 10,
      height: Math.round((cropRect.h / imageRect.h) * 1000) / 10,
    });
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ background: "rgba(8,9,10,0.92)", backdropFilter: "blur(10px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl rounded-2xl p-5"
        style={{ background: brand.card, border: `1px solid ${brand.goldMuted}` }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h4 className="text-xl font-black uppercase" style={{ fontFamily: barlow }}>
              Crop {type === "video" ? "video" : "photo"}
            </h4>
            <p className="mt-1 text-xs" style={{ color: brand.muted }}>
              Drag corners to resize · drag inside to move · dark area is hidden
            </p>
          </div>
          <button type="button" onClick={onClose} style={{ color: brand.gold }}>
            <X size={22} />
          </button>
        </div>

        <div className="flex min-h-[200px] items-center justify-center">
          {status === "loading" && (
            <p className="py-20 text-sm" style={{ color: brand.muted }}>
              Loading preview…
            </p>
          )}
          {status === "error" && (
            <p className="py-20 text-sm" style={{ color: "#ff8a8a" }}>
              Could not load media. Check the file path: {src}
            </p>
          )}
          <canvas
            ref={canvasRef}
            width={canvasSize.w}
            height={canvasSize.h}
            className="max-w-full cursor-crosshair rounded-lg"
            style={{
              border: `1px solid ${brand.goldMuted}`,
              touchAction: "none",
              display: status === "ready" ? "block" : "none",
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
          />
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => imageRect && setCropRect({ ...imageRect })}
            disabled={status !== "ready"}
            className="px-4 py-2 text-[11px] font-black uppercase tracking-[0.14em] disabled:opacity-40"
            style={{ fontFamily: barlow, border: `1px solid ${brand.gold}`, color: brand.gold, borderRadius: 4 }}
          >
            Reset crop
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={status !== "ready"}
            className="px-6 py-2 text-[11px] font-black uppercase tracking-[0.14em] disabled:opacity-50"
            style={{ fontFamily: barlow, background: brand.gold, color: brand.bg, borderRadius: 4 }}
          >
            Apply crop
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-[11px] font-black uppercase tracking-[0.14em]"
            style={{ fontFamily: barlow, color: brand.muted }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

async function loadSource(src: string, type: "image" | "video"): Promise<LoadedSource | null> {
  if (type === "image") {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve({ source: img, width: img.naturalWidth, height: img.naturalHeight });
      img.onerror = () => resolve(null);
      img.src = src;
    });
  }

  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";

    const done = () => {
      if (video.videoWidth > 0) {
        resolve({ source: video, width: video.videoWidth, height: video.videoHeight });
      } else {
        resolve(null);
      }
    };

    video.onloadeddata = () => {
      video.currentTime = Math.min(0.25, (video.duration || 1) * 0.05);
    };
    video.onseeked = done;
    video.onerror = () => resolve(null);
    video.src = src;
    video.load();
  });
}

export function defaultCropForNewItem(): GalleryCrop {
  return FULL_CROP;
}
