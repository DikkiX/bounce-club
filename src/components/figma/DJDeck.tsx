"use client";

import { useEffect, useRef, useState } from "react";
import { brand } from "@/lib/brand";

const NATURAL = 400;
const IDLE_MS = 3200; // matches Figma vinylSpin 3.2s per rotation

export function DJDeck({ size = 380 }: { size?: number }) {
  const scale = size / NATURAL;
  const vcx = 188 * scale;
  const vcy = 222 * scale;
  const vr = 138 * scale;

  const rot = useRef(0);
  const dragging = useRef(false);
  const lastX = useRef(0);
  const lastTs = useRef(0);
  const raf = useRef(0);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const tick = (ts: number) => {
      if (!dragging.current) {
        if (lastTs.current) {
          const dt = ts - lastTs.current;
          rot.current += (360 / IDLE_MS) * dt;
        }
        lastTs.current = ts;
        setRotation(rot.current);
      } else {
        lastTs.current = ts;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  return (
    <div className="relative select-none" style={{ width: size, height: size }}>
      <div
        className="pointer-events-none absolute"
        style={{
          inset: 0,
          background: `radial-gradient(ellipse ${vr * 2.2}px ${vr * 1.3}px at ${vcx}px ${vcy + 55 * scale}px, rgba(253,199,99,0.14) 0%, transparent 70%)`,
        }}
      />

      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${NATURAL} ${NATURAL}`}
        className="absolute inset-0"
        style={{ filter: "drop-shadow(0 24px 48px rgba(0,0,0,0.7))" }}
      >
        <rect x="8" y="8" width="384" height="384" rx="18" fill="#0B0C0E" />
        <rect x="8" y="8" width="384" height="384" rx="18" stroke={brand.gold} strokeWidth="0.6" strokeOpacity="0.22" />
        <line x1="18" y1="36" x2="382" y2="36" stroke={brand.gold} strokeWidth="0.4" strokeOpacity="0.14" />
        <line x1="18" y1="364" x2="382" y2="364" stroke={brand.gold} strokeWidth="0.4" strokeOpacity="0.14" />
        <circle cx="188" cy="222" r="153" fill="#111315" stroke={brand.gold} strokeWidth="0.9" strokeOpacity="0.28" />
        <circle cx="348" cy="82" r="16" fill="#181A1D" stroke={brand.gold} strokeWidth="1" strokeOpacity="0.55" />
        <circle cx="348" cy="82" r="6" fill={brand.gold} fillOpacity="0.28" />
        <line x1="348" y1="82" x2="260" y2="158" stroke="#A07830" strokeWidth="2.8" strokeLinecap="round" />
        <line x1="260" y1="158" x2="250" y2="178" stroke="#A07830" strokeWidth="2.2" strokeLinecap="round" />
        <rect x="238" y="176" width="20" height="9" rx="2" fill={brand.gold} fillOpacity="0.42" />
        <rect x="364" y="100" width="18" height="172" rx="4" fill="#080909" stroke={brand.gold} strokeWidth="0.5" strokeOpacity="0.18" />
        <rect x="364" y="171" width="18" height="28" rx="3" fill={brand.card} stroke={brand.gold} strokeWidth="0.5" strokeOpacity="0.4" />
        <circle cx="364" cy="302" r="9" fill="#14161A" stroke={brand.gold} strokeWidth="0.5" strokeOpacity="0.3" />
        <circle cx="364" cy="328" r="9" fill={brand.gold} fillOpacity="0.08" stroke={brand.gold} strokeWidth="0.5" strokeOpacity="0.5" />
        <circle cx="364" cy="354" r="9" fill="#14161A" stroke={brand.gold} strokeWidth="0.5" strokeOpacity="0.3" />
      </svg>

      <div
        className="cursor-grab touch-none active:cursor-grabbing"
        style={{
          position: "absolute",
          left: vcx - vr,
          top: vcy - vr,
          width: vr * 2,
          height: vr * 2,
          transform: `rotate(${rotation}deg)`,
        }}
        onPointerDown={(e) => {
          dragging.current = true;
          lastX.current = e.clientX;
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (!dragging.current) return;
          const d = e.clientX - lastX.current;
          lastX.current = e.clientX;
          rot.current += d * 0.5;
          setRotation(rot.current);
        }}
        onPointerUp={() => {
          dragging.current = false;
        }}
        onPointerLeave={() => {
          dragging.current = false;
        }}
      >
        <svg width={vr * 2} height={vr * 2} viewBox={`0 0 ${vr * 2} ${vr * 2}`}>
          <circle cx={vr} cy={vr} r={vr} fill="#070809" />
          {Array.from({ length: 18 }, (_, i) => vr - 6 - i * 7)
            .filter((r) => r > 38)
            .map((r, i) => (
              <circle key={i} cx={vr} cy={vr} r={r} fill="none" stroke="rgba(255,255,255,0.032)" strokeWidth="0.9" />
            ))}
          <circle cx={vr} cy={vr} r="38" fill="#181A1D" stroke={brand.gold} strokeWidth="0.5" strokeOpacity="0.38" />
          <circle cx={vr} cy={vr} r="5" fill={brand.gold} fillOpacity="0.42" />
          <text
            x={vr}
            y={vr + 4}
            textAnchor="middle"
            fill={brand.gold}
            fontSize="8.5"
            fontFamily="Barlow Condensed, Arial, sans-serif"
            fontWeight="800"
            letterSpacing="3.5"
            fillOpacity="0.88"
          >
            BOUNCE
          </text>
        </svg>
      </div>
    </div>
  );
}
