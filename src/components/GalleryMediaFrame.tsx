"use client";

import type { GalleryCrop } from "@/lib/gallery";
import { cropWrapperStyle, normalizeCrop } from "@/lib/gallery";

export function GalleryMediaFrame({
  src,
  type,
  crop,
  className,
  style,
  videoProps,
}: {
  src: string;
  type: "image" | "video";
  crop?: GalleryCrop;
  className?: string;
  style?: React.CSSProperties;
  videoProps?: React.VideoHTMLAttributes<HTMLVideoElement>;
}) {
  const normalized = normalizeCrop(crop);
  const { wrapper, media } = cropWrapperStyle(normalized);

  if (type === "video") {
    return (
      <div className={className} style={{ ...wrapper, ...style }}>
        <video src={src} style={media} {...videoProps} />
      </div>
    );
  }

  return (
    <div className={className} style={{ ...wrapper, ...style }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" style={media} />
    </div>
  );
}
