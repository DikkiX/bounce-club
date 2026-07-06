import { useState } from "react";
import {
  Menu, X, Instagram, Music2, ChevronLeft, ChevronRight,
  Edit2, Trash2, Plus, Calendar, Users, Image as ImageIcon,
  Settings, Upload, Play,
} from "lucide-react";

// ─── Brand tokens ──────────────────────────────────────────────────────────────
const G  = "#FDC763";
const GH = "#FFD283";
const GM = "rgba(253,199,99,0.18)";
const BG = "#181A1D";
const CARD_BG = "#1E2126";
const GLASS   = "rgba(255,255,255,0.04)";
const MUTED   = "rgba(255,255,255,0.58)";

// ─── Global styles ─────────────────────────────────────────────────────────────
const CSS = `
  @keyframes vinylSpin { to { transform: rotate(360deg); } }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .fade-up { animation: fadeUp 0.45s ease both; }
  ::-webkit-scrollbar { display: none; }
  * { scrollbar-width: none; }
  input:focus, textarea:focus { box-shadow: 0 0 0 2px rgba(253,199,99,0.35) !important; }
`;

// ─── Helpers ───────────────────────────────────────────────────────────────────
const img = (id: string, w: number, h: number) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format&q=80`;

// ─── Data ──────────────────────────────────────────────────────────────────────
type Page = "home" | "events" | "djs" | "gallery" | "admin";

const EVENTS = [
  {
    id: 1, date: "SAT 19 JUL 2026", title: "BOUNCE × KETTAMA",
    artists: "KETTAMA b2b DYED SOUNDOROM", time: "22:00 – 06:00",
    desc: "Berlin–Dublin–Amsterdam axis. Warehouse techno meets peak-time house in a three-hour b2b nobody saw coming.",
    imgId: "1470229722913-7c0e2dbbafd3", featured: true, status: "On sale",
  },
  {
    id: 2, date: "SAT 26 JUL 2026", title: "BOUNCE RESIDENTS",
    artists: "MARCO D. / SENNA K. / YAEL B.", time: "23:00 – 05:00",
    desc: "The house we built. All three residents back to back to back. Entry free before midnight.",
    imgId: "1514525253161-7a46d19cd819", featured: false, status: "On sale",
  },
  {
    id: 3, date: "FRI 1 AUG 2026", title: "BOUNCE × TSHA",
    artists: "TSHA + SPECIAL GUEST", time: "22:00 – 06:00",
    desc: "London's finest headlines an intimate night ahead of her summer tour close-out.",
    imgId: "1493225457124-a3eb161ffa5f", featured: false, status: "On sale",
  },
  {
    id: 4, date: "SAT 9 AUG 2026", title: "CLOSING SUMMER 2026",
    artists: "TBA", time: "22:00 – 07:00",
    desc: "Season close. Details to follow. You know the energy.",
    imgId: "1501386761578-ecd87f6b4b2e", featured: false, status: "Coming soon",
  },
  {
    id: 5, date: "SAT 14 JUN 2026", title: "BOUNCE × OBJEKT",
    artists: "OBJEKT b2b MARCO D.", time: "23:00 – 06:00",
    desc: "Rotterdam brought the weather, Amsterdam brought the crowd. Archive night.",
    imgId: "1429962714451-bb934ecdc4ec", featured: false, status: "Past",
  },
  {
    id: 6, date: "SAT 7 JUN 2026", title: "BOUNCE × BLAWAN",
    artists: "BLAWAN", time: "23:00 – 05:00",
    desc: "Industrial UK sound. One DJ, three hours, zero compromises.",
    imgId: "1504680177321-2e6a879d1460", featured: false, status: "Past",
  },
];

const DJS = [
  { id: 1, name: "MARCO D.", genre: "HOUSE · DISCO", bio: "Amsterdam native. Fifteen years behind the decks, half of them in this room. Warm, groove-forward, unapologetically soulful.", imgId: "1507003211169-0a1dd7228f2d", resident: true },
  { id: 2, name: "SENNA K.", genre: "TECHNO · INDUSTRIAL", bio: "Rotterdam grit meets Amsterdam polish. Senna's sets run long for a reason — she earns every peak.", imgId: "1494790108377-be9c29b29330", resident: true },
  { id: 3, name: "YAEL B.", genre: "UK GARAGE · UKG", bio: "South London to South Amsterdam. Yael brought garage to Bounce and Bounce never looked back.", imgId: "1539571696357-5a69c17a67c6", resident: true },
  { id: 4, name: "KETTAMA", genre: "TECHNO · HOUSE", bio: "Dublin born, Berlin made. Plays the long game — 3h minimum, no setlist, no safety net.", imgId: "1506794778202-cad84cf45f1d", resident: false },
  { id: 5, name: "TSHA", genre: "MELODIC HOUSE", bio: "London's most in-demand: euphoric, emotional, always right on time. Peak-hour specialist.", imgId: "1438761681033-6461ffad8d80", resident: false },
  { id: 6, name: "OBJEKT", genre: "TECHNO · CLUB", bio: "Berlin via Rotterdam. Floor science, executed without ego. Techno with a sense of humour.", imgId: "1500648767791-00dcc994a43e", resident: false },
];

const ALBUMS = [
  { id: 1, title: "Night 01 — March 2026",      date: "15 MAR 2026", imgId: "1571266028243-d220c6a7f0a6", count: 48 },
  { id: 2, title: "Residents Night — April",     date: "5 APR 2026",  imgId: "1429962714451-bb934ecdc4ec", count: 62 },
  { id: 3, title: "Bounce × Kettama",            date: "26 APR 2026", imgId: "1470229722913-7c0e2dbbafd3", count: 37 },
  { id: 4, title: "May Bank Holiday",            date: "3 MAY 2026",  imgId: "1504680177321-2e6a879d1460", count: 55 },
  { id: 5, title: "Bounce × Blawan",             date: "7 JUN 2026",  imgId: "1514525253161-7a46d19cd819", count: 29 },
  { id: 6, title: "Bounce × Objekt",             date: "14 JUN 2026", imgId: "1493225457124-a3eb161ffa5f", count: 41 },
];

// ─── DJ Turntable ──────────────────────────────────────────────────────────────
function DJDeck({ spinning = true, size = 400 }: { spinning?: boolean; size?: number }) {
  // vinyl center and radius in a 400×400 coordinate space, then scaled
  const NATURAL = 400;
  const scale   = size / NATURAL;
  const vcx = 188 * scale;
  const vcy = 222 * scale;
  const vr  = 138 * scale;

  return (
    <div className="relative select-none" style={{ width: size, height: size }}>
      {/* Ambient glow beneath deck */}
      <div
        className="absolute pointer-events-none"
        style={{
          inset: 0,
          background: `radial-gradient(ellipse ${vr * 2.2}px ${vr * 1.3}px at ${vcx}px ${vcy + 55 * scale}px, rgba(253,199,99,0.14) 0%, transparent 70%)`,
        }}
      />

      {/* Static deck body */}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${NATURAL} ${NATURAL}`}
        className="absolute inset-0"
        style={{ filter: "drop-shadow(0 24px 48px rgba(0,0,0,0.7))" }}
      >
        {/* Casing */}
        <rect x="8" y="8" width="384" height="384" rx="18" fill="#0B0C0E" />
        <rect x="8" y="8" width="384" height="384" rx="18" stroke={G} strokeWidth="0.6" strokeOpacity="0.22" />

        {/* Top accent line */}
        <line x1="18" y1="36" x2="382" y2="36" stroke={G} strokeWidth="0.4" strokeOpacity="0.14" />
        {/* Bottom accent line */}
        <line x1="18" y1="364" x2="382" y2="364" stroke={G} strokeWidth="0.4" strokeOpacity="0.14" />

        {/* Platter surround */}
        <circle cx="188" cy="222" r="153" fill="#111315" stroke={G} strokeWidth="0.9" strokeOpacity="0.28" />

        {/* Tonearm base */}
        <circle cx="348" cy="82" r="16" fill="#181A1D" stroke={G} strokeWidth="1" strokeOpacity="0.55" />
        <circle cx="348" cy="82" r="6"  fill={G} fillOpacity="0.28" />

        {/* Tonearm shaft */}
        <line x1="348" y1="82" x2="260" y2="158" stroke="#A07830" strokeWidth="2.8" strokeLinecap="round" />
        {/* Tonearm head shell */}
        <line x1="260" y1="158" x2="250" y2="178" stroke="#A07830" strokeWidth="2.2" strokeLinecap="round" />
        {/* Cartridge */}
        <rect x="238" y="176" width="20" height="9" rx="2" fill={G} fillOpacity="0.42" />

        {/* Pitch fader track */}
        <rect x="364" y="100" width="18" height="172" rx="4" fill="#080909" stroke={G} strokeWidth="0.5" strokeOpacity="0.18" />
        {/* Pitch fader knob */}
        <rect x="364" y="171" width="18" height="28" rx="3" fill={CARD_BG} stroke={G} strokeWidth="0.5" strokeOpacity="0.4" />

        {/* Cue / play buttons */}
        <circle cx="364" cy="302" r="9" fill="#14161A" stroke={G} strokeWidth="0.5" strokeOpacity="0.3" />
        <circle cx="364" cy="328" r="9" fill={G} fillOpacity="0.08" stroke={G} strokeWidth="0.5" strokeOpacity="0.5" />
        <circle cx="364" cy="354" r="9" fill="#14161A" stroke={G} strokeWidth="0.5" strokeOpacity="0.3" />
      </svg>

      {/* Rotating vinyl — absolutely positioned over platter */}
      <div
        style={{
          position: "absolute",
          left: vcx - vr,
          top:  vcy - vr,
          width:  vr * 2,
          height: vr * 2,
          animation: spinning ? "vinylSpin 3.2s linear infinite" : "none",
        }}
      >
        <svg width={vr * 2} height={vr * 2} viewBox={`0 0 ${vr * 2} ${vr * 2}`}>
          {/* Record body */}
          <circle cx={vr} cy={vr} r={vr} fill="#070809" />
          {/* Groove rings */}
          {Array.from({ length: 18 }, (_, i) => vr - 6 - i * 7).filter(r => r > 38).map((r, i) => (
            <circle key={i} cx={vr} cy={vr} r={r} fill="none" stroke="rgba(255,255,255,0.032)" strokeWidth="0.9" />
          ))}
          {/* Label */}
          <circle cx={vr} cy={vr} r="38" fill="#181A1D" stroke={G} strokeWidth="0.5" strokeOpacity="0.38" />
          {/* Spindle */}
          <circle cx={vr} cy={vr} r="5" fill={G} fillOpacity="0.42" />
          {/* Label text */}
          <text
            x={vr} y={vr + 4}
            textAnchor="middle"
            fill={G}
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

// ─── Nav ───────────────────────────────────────────────────────────────────────
function Nav({
  page, navigate, menuOpen, setMenuOpen,
}: {
  page: Page;
  navigate: (p: Page) => void;
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;
}) {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5"
      style={{
        background: "rgba(24,26,29,0.9)",
        backdropFilter: "blur(18px)",
        borderBottom: `1px solid ${GM}`,
      }}
    >
      <button
        onClick={() => navigate("home")}
        className="text-white font-black text-sm tracking-widest"
        style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.22em" }}
      >
        BOUNCE CLUB
      </button>
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        style={{ color: menuOpen ? GH : G, transition: "color 0.2s" }}
        aria-label="Toggle menu"
      >
        {menuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>
    </nav>
  );
}

// ─── Fullscreen menu ───────────────────────────────────────────────────────────
function FullscreenMenu({ navigate }: { navigate: (p: Page) => void }) {
  const links: { label: string; page: Page }[] = [
    { label: "HOME",    page: "home" },
    { label: "EVENTS",  page: "events" },
    { label: "LINE-UP", page: "djs" },
    { label: "GALLERY", page: "gallery" },
    { label: "ADMIN",   page: "admin" },
  ];

  return (
    <div
      className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-6"
      style={{ background: "rgba(24,26,29,0.97)", backdropFilter: "blur(24px)" }}
    >
      {links.map(({ label, page }, i) => (
        <button
          key={page}
          onClick={() => navigate(page)}
          className="font-black uppercase leading-none transition-colors"
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: "clamp(2.5rem, 8vw, 5.5rem)",
            letterSpacing: "0.1em",
            color: "rgba(255,255,255,0.9)",
            animationDelay: `${i * 55}ms`,
          }}
          onMouseEnter={e => (e.currentTarget.style.color = G)}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.9)")}
        >
          {label}
        </button>
      ))}
      <div className="flex gap-6 mt-8">
        <a href="#" onClick={e => e.preventDefault()} style={{ color: G }}><Instagram size={20} /></a>
        <a href="#" onClick={e => e.preventDefault()} style={{ color: G }}><Music2 size={20} /></a>
      </div>
    </div>
  );
}

// ─── Shared: pill badge ────────────────────────────────────────────────────────
function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="text-xs px-3 py-0.5 rounded-full inline-block"
      style={{
        border: `1px solid ${G}`,
        color: G,
        fontFamily: "'Barlow Condensed', sans-serif",
        fontSize: "10px",
        letterSpacing: "0.15em",
      }}
    >
      {children}
    </span>
  );
}

// ─── Home Page ─────────────────────────────────────────────────────────────────
function HomePage({ navigate }: { navigate: (p: Page) => void }) {
  const upcoming = EVENTS.find(e => e.status !== "Past")!;

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 py-20 min-h-screen">
        <p
          className="text-xs mb-6 tracking-widest"
          style={{ color: G, fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.35em" }}
        >
          AMSTERDAM · EST. 2024
        </p>

        <h1
          className="font-black uppercase leading-none mb-2"
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: "clamp(3.5rem, 9vw, 7.5rem)",
            letterSpacing: "0.06em",
          }}
        >
          UNDERGROUND<br />
          <span style={{ color: G }}>PREMIUM</span>
        </h1>

        <p className="mb-10 text-sm" style={{ color: MUTED, letterSpacing: "0.08em" }}>
          Amsterdam's finest underground club
        </p>

        <DJDeck spinning size={380} />

        <p
          className="mt-8 text-xs tracking-widest"
          style={{ color: MUTED, fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.28em" }}
        >
          DRAG TO SPIN · NEXT EVENT SATURDAY
        </p>

        <button
          onClick={() => navigate("events")}
          className="mt-8 px-10 py-3 font-black uppercase text-sm tracking-widest transition-colors"
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            letterSpacing: "0.2em",
            background: G,
            color: BG,
            borderRadius: "4px",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = GH)}
          onMouseLeave={e => (e.currentTarget.style.background = G)}
        >
          View Events
        </button>
      </section>

      {/* Next Event + Residents */}
      <section
        className="max-w-6xl mx-auto px-6 pb-24 grid gap-12"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}
      >
        {/* Next Event */}
        <div>
          <p className="text-xs uppercase mb-6" style={{ color: G, fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.3em" }}>
            Next Event
          </p>
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: CARD_BG, border: `1px solid ${GM}` }}
          >
            <div className="relative" style={{ paddingTop: "58%", background: "#0A0B0C" }}>
              <img
                src={img(upcoming.imgId, 800, 460)}
                alt={upcoming.title}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ opacity: 0.65 }}
              />
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to top, rgba(24,26,29,0.92) 0%, transparent 55%)" }}
              />
              <div className="absolute top-4 left-4">
                <span
                  className="text-xs font-black px-3 py-1 rounded-full uppercase"
                  style={{ background: G, color: BG, fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.12em" }}
                >
                  {upcoming.date}
                </span>
              </div>
            </div>
            <div className="p-6">
              <h3
                className="text-2xl font-black uppercase mb-1 leading-tight"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                {upcoming.title}
              </h3>
              <p className="text-sm mb-1" style={{ color: G, fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.08em" }}>
                {upcoming.artists}
              </p>
              <p className="text-xs mb-4" style={{ color: MUTED }}>{upcoming.time}</p>
              <p className="text-sm mb-6 leading-relaxed" style={{ color: MUTED }}>{upcoming.desc}</p>
              <button
                className="px-6 py-2.5 text-sm font-black uppercase tracking-widest transition-colors"
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  letterSpacing: "0.18em",
                  border: `1px solid ${G}`,
                  color: G,
                  borderRadius: "4px",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = G; e.currentTarget.style.color = BG; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = G; }}
              >
                Get Tickets
              </button>
            </div>
          </div>
        </div>

        {/* Residents */}
        <div>
          <p className="text-xs uppercase mb-6" style={{ color: G, fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.3em" }}>
            On The Decks
          </p>
          <div className="flex flex-col gap-3">
            {DJS.filter(d => d.resident).map(dj => (
              <div
                key={dj.id}
                className="flex items-center gap-4 p-4 rounded-xl transition-all duration-200"
                style={{ background: GLASS, border: `1px solid ${GM}`, cursor: "pointer" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = G)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = GM)}
              >
                <div
                  className="rounded-full overflow-hidden flex-shrink-0"
                  style={{ width: 52, height: 52, background: "#0A0B0C", border: `1.5px solid ${GM}` }}
                >
                  <img
                    src={img(dj.imgId, 104, 104)}
                    alt={dj.name}
                    className="w-full h-full object-cover"
                    style={{ filter: "grayscale(55%)" }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-sm uppercase leading-none mb-0.5" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                    {dj.name}
                  </p>
                  <p className="text-xs" style={{ color: G, fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.08em" }}>
                    {dj.genre}
                  </p>
                </div>
                <Pill>RESIDENT</Pill>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate("djs")}
            className="mt-5 text-xs uppercase tracking-widest transition-colors"
            style={{ color: G, fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.2em" }}
            onMouseEnter={e => (e.currentTarget.style.color = GH)}
            onMouseLeave={e => (e.currentTarget.style.color = G)}
          >
            Full Line-up →
          </button>
        </div>
      </section>

      {/* Gallery strip */}
      <section className="pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <p
            className="text-xs uppercase mb-8"
            style={{ color: G, fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.3em" }}
          >
            From The Floor
          </p>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {ALBUMS.map(album => (
              <div
                key={album.id}
                className="flex-shrink-0 relative rounded-xl overflow-hidden"
                style={{ width: 220, height: 220, background: "#0A0B0C", border: `1px solid ${GM}`, cursor: "pointer" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = G)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = GM)}
              >
                <img
                  src={img(album.imgId, 440, 440)}
                  alt={album.title}
                  className="w-full h-full object-cover transition-opacity duration-300"
                  style={{ opacity: 0.58 }}
                />
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%)" }}
                />
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-xs font-black uppercase leading-snug" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                    {album.title}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: G, fontFamily: "'Barlow Condensed', sans-serif" }}>
                    {album.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="px-6 py-10"
        style={{ borderTop: `1px solid ${GM}` }}
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs" style={{ color: MUTED }}>
          <span className="font-black uppercase tracking-widest" style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.22em", color: "#fff" }}>
            BOUNCE CLUB
          </span>
          <span>Somewhere in Amsterdam. Members only. Respect the space.</span>
          <div className="flex gap-4">
            <a href="#" onClick={e => e.preventDefault()} style={{ color: G }}><Instagram size={17} /></a>
            <a href="#" onClick={e => e.preventDefault()} style={{ color: G }}><Music2 size={17} /></a>
          </div>
          <span>© 2026 Bounce Club Amsterdam</span>
        </div>
      </footer>
    </div>
  );
}

// ─── Event card ────────────────────────────────────────────────────────────────
function EventCard({ event }: { event: typeof EVENTS[0] }) {
  const [hov, setHov] = useState(false);

  return (
    <div
      className="rounded-2xl overflow-hidden cursor-pointer"
      style={{
        background: CARD_BG,
        border: `1px solid ${hov ? G : GM}`,
        transform: hov ? "translateY(-6px)" : "none",
        boxShadow: hov ? `0 0 28px rgba(253,199,99,0.18)` : "none",
        transition: "all 0.25s ease",
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div className="relative" style={{ paddingTop: "57%", background: "#0A0B0C" }}>
        <img
          src={img(event.imgId, 600, 342)}
          alt={event.title}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.62 }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(24,26,29,0.85) 0%, transparent 60%)" }} />
      </div>
      <div className="p-5">
        <p className="text-xs uppercase mb-1" style={{ color: G, fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.18em" }}>
          {event.date}
        </p>
        <h3 className="text-xl font-black uppercase leading-tight mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          {event.title}
        </h3>
        <p className="text-xs mb-3 line-clamp-2 leading-relaxed" style={{ color: MUTED }}>{event.desc}</p>
        <div className="flex items-center justify-between">
          <span
            className="text-xs px-2.5 py-0.5 rounded-full"
            style={{
              border: `1px solid ${event.status === "On sale" ? G : GM}`,
              color: event.status === "On sale" ? G : MUTED,
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: "10px",
              letterSpacing: "0.1em",
            }}
          >
            {event.status}
          </span>
          <button
            className="text-xs uppercase tracking-widest transition-colors"
            style={{ color: G, fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.18em" }}
          >
            Details →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Events Page ───────────────────────────────────────────────────────────────
function EventsPage() {
  const [filter, setFilter] = useState<"Upcoming" | "Past">("Upcoming");
  const featured  = EVENTS.find(e => e.featured);
  const rest = EVENTS.filter(e => {
    const isPast = e.status === "Past";
    return filter === "Upcoming" ? !isPast && !e.featured : isPast;
  });

  return (
    <div className="pt-28 pb-20 px-6 max-w-6xl mx-auto fade-up">
      {/* Title */}
      <div className="mb-10">
        <h1 className="font-black uppercase leading-none mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(3.5rem, 9vw, 6rem)", letterSpacing: "0.06em", color: G }}>
          EVENTS
        </h1>
        <div style={{ height: 1, width: 72, background: G }} />
      </div>

      {/* Filter pills */}
      <div className="flex gap-3 mb-12">
        {(["Upcoming", "Past"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-5 py-2 text-sm uppercase tracking-widest rounded-full font-black transition-colors"
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              letterSpacing: "0.15em",
              background: filter === f ? G : "transparent",
              color: filter === f ? BG : G,
              border: `1px solid ${G}`,
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Featured (upcoming only) */}
      {filter === "Upcoming" && featured && (
        <div
          className="mb-12 grid gap-0 rounded-2xl overflow-hidden"
          style={{ gridTemplateColumns: "1fr 1fr", background: CARD_BG, border: `1px solid ${GM}` }}
        >
          <div className="relative" style={{ minHeight: 340, background: "#0A0B0C" }}>
            <img
              src={img(featured.imgId, 800, 600)}
              alt={featured.title}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ opacity: 0.68 }}
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to right, transparent 60%, rgba(30,33,38,0.95))" }} />
            <div className="absolute top-5 left-5">
              <span className="text-xs font-black px-3 py-1 rounded-full uppercase" style={{ background: G, color: BG, fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.12em" }}>
                ★ Featured
              </span>
            </div>
          </div>
          <div className="p-10 flex flex-col justify-center">
            <p className="text-sm mb-2 uppercase" style={{ color: G, fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.2em" }}>
              {featured.date}
            </p>
            <h2 className="text-4xl font-black uppercase leading-tight mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              {featured.title}
            </h2>
            <p className="text-sm mb-1" style={{ color: G, fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.08em" }}>
              {featured.artists}
            </p>
            <p className="text-xs mb-4" style={{ color: MUTED }}>{featured.time}</p>
            <p className="text-sm mb-8 leading-relaxed" style={{ color: MUTED }}>{featured.desc}</p>
            <button
              className="self-start px-8 py-3 font-black uppercase text-sm tracking-widest transition-colors"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.18em", background: G, color: BG, borderRadius: "4px" }}
              onMouseEnter={e => (e.currentTarget.style.background = GH)}
              onMouseLeave={e => (e.currentTarget.style.background = G)}
            >
              Get Tickets
            </button>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
        {rest.map(event => <EventCard key={event.id} event={event} />)}
      </div>
    </div>
  );
}

// ─── DJ card ───────────────────────────────────────────────────────────────────
function DJCard({ dj }: { dj: typeof DJS[0] }) {
  const [hov, setHov] = useState(false);

  return (
    <div
      className="rounded-2xl p-6 text-center cursor-pointer"
      style={{
        background: hov ? CARD_BG : GLASS,
        border: `1px solid ${hov ? G : GM}`,
        transform: hov ? "translateY(-6px)" : "none",
        boxShadow: hov ? `0 0 28px rgba(253,199,99,0.16)` : "none",
        transition: "all 0.25s ease",
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div
        className="mx-auto mb-4 rounded-full overflow-hidden"
        style={{
          width: 112,
          height: 112,
          background: "#0A0B0C",
          border: `2px solid ${hov ? G : GM}`,
          transition: "border-color 0.25s ease",
        }}
      >
        <img
          src={img(dj.imgId, 224, 224)}
          alt={dj.name}
          className="w-full h-full object-cover"
          style={{ filter: "grayscale(50%) contrast(1.08)" }}
        />
      </div>

      {dj.resident && (
        <div className="mb-3">
          <Pill>RESIDENT</Pill>
        </div>
      )}

      <h3 className="text-2xl font-black uppercase leading-none mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.06em" }}>
        {dj.name}
      </h3>
      <p className="text-xs mb-3" style={{ color: G, fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.18em" }}>
        {dj.genre}
      </p>

      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: hov ? "80px" : "0", opacity: hov ? 1 : 0 }}
      >
        <p className="text-sm leading-relaxed mb-3" style={{ color: MUTED }}>{dj.bio}</p>
      </div>

      <div className="flex justify-center gap-4 mt-2">
        <a href="#" onClick={e => e.preventDefault()} style={{ color: G, transition: "color 0.2s" }}
           onMouseEnter={e => (e.currentTarget.style.color = GH)} onMouseLeave={e => (e.currentTarget.style.color = G)}>
          <Instagram size={15} />
        </a>
        <a href="#" onClick={e => e.preventDefault()} style={{ color: G, transition: "color 0.2s" }}
           onMouseEnter={e => (e.currentTarget.style.color = GH)} onMouseLeave={e => (e.currentTarget.style.color = G)}>
          <Music2 size={15} />
        </a>
        <a href="#" onClick={e => e.preventDefault()} style={{ color: G, transition: "color 0.2s" }}
           onMouseEnter={e => (e.currentTarget.style.color = GH)} onMouseLeave={e => (e.currentTarget.style.color = G)}>
          <Play size={15} />
        </a>
      </div>
    </div>
  );
}

// ─── DJs Page ──────────────────────────────────────────────────────────────────
function DJsPage() {
  return (
    <div className="pt-28 pb-20 px-6 max-w-6xl mx-auto fade-up">
      <div className="text-center mb-16">
        <h1 className="font-black uppercase leading-none mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(3.5rem, 9vw, 6rem)", letterSpacing: "0.06em", color: G }}>
          LINE-UP
        </h1>
        <div className="mx-auto" style={{ height: 1, width: 72, background: G }} />
      </div>
      <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
        {DJS.map(dj => <DJCard key={dj.id} dj={dj} />)}
      </div>
    </div>
  );
}

// ─── Gallery Page ──────────────────────────────────────────────────────────────
function GalleryPage() {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const prev = () => setLightbox(l => l === null ? null : (l - 1 + ALBUMS.length) % ALBUMS.length);
  const next = () => setLightbox(l => l === null ? null : (l + 1) % ALBUMS.length);

  return (
    <div className="pt-28 pb-20 px-6 max-w-6xl mx-auto fade-up">
      <div className="mb-12">
        <h1 className="font-black uppercase leading-none mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(3.5rem, 9vw, 6rem)", letterSpacing: "0.06em", color: G }}>
          GALLERY
        </h1>
        <div style={{ height: 1, width: 72, background: G }} />
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
        {ALBUMS.map((album, i) => (
          <div
            key={album.id}
            className="relative rounded-xl overflow-hidden cursor-pointer group"
            style={{ paddingTop: "75%", background: "#0A0B0C", border: `1px solid ${GM}` }}
            onClick={() => setLightbox(i)}
            onMouseEnter={e => (e.currentTarget.style.borderColor = G)}
            onMouseLeave={e => (e.currentTarget.style.borderColor = GM)}
          >
            <img
              src={img(album.imgId, 600, 450)}
              alt={album.title}
              className="absolute inset-0 w-full h-full object-cover transition-all duration-300 group-hover:opacity-40 group-hover:scale-105"
              style={{ opacity: 0.7 }}
            />
            <div
              className="absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-300 opacity-0 group-hover:opacity-100"
            >
              <p className="text-lg font-black uppercase text-center px-6 leading-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                {album.title}
              </p>
              <p className="text-xs mt-1" style={{ color: G, fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.1em" }}>
                {album.date}
              </p>
              <p className="text-xs mt-1" style={{ color: MUTED }}>{album.count} photos</p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ background: "rgba(8,9,10,0.94)", backdropFilter: "blur(12px)" }}
          onClick={() => setLightbox(null)}
        >
          <div className="relative max-w-4xl w-full" onClick={e => e.stopPropagation()}>
            <img
              src={img(ALBUMS[lightbox].imgId, 1200, 800)}
              alt={ALBUMS[lightbox].title}
              className="w-full rounded-xl"
              style={{ border: `1px solid ${GM}` }}
            />
            <div className="mt-5 flex items-center justify-between">
              <div>
                <p className="font-black uppercase text-lg leading-none" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  {ALBUMS[lightbox].title}
                </p>
                <p className="text-sm mt-1" style={{ color: G, fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.1em" }}>
                  {ALBUMS[lightbox].date} · {ALBUMS[lightbox].count} photos
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={prev}
                  className="p-2.5 rounded-full transition-colors"
                  style={{ border: `1px solid ${GM}`, color: G }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = G)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = GM)}
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={next}
                  className="p-2.5 rounded-full transition-colors"
                  style={{ border: `1px solid ${GM}`, color: G }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = G)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = GM)}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
          <button className="absolute top-6 right-6" style={{ color: G }} onClick={() => setLightbox(null)}>
            <X size={26} />
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Admin Page ────────────────────────────────────────────────────────────────
function AdminPage() {
  type AdminSection = "events" | "djs" | "gallery";
  const [section, setSection]       = useState<AdminSection>("events");
  const [editing, setEditing]       = useState<typeof EVENTS[0] | null>(null);

  const navItems: { id: AdminSection; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
    { id: "events",  label: "Events",  icon: Calendar },
    { id: "djs",     label: "DJs",     icon: Users },
    { id: "gallery", label: "Gallery", icon: ImageIcon },
  ];

  const sectionLabel = section === "events" ? "Event" : section === "djs" ? "DJ" : "Album";

  return (
    <div className="pt-16 flex min-h-screen" style={{ background: BG }}>
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 flex flex-col" style={{ background: "#12141A", borderRight: `1px solid ${GM}` }}>
        <div className="p-6" style={{ borderBottom: `1px solid ${GM}` }}>
          <p className="font-black uppercase text-xs tracking-widest" style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.22em", color: G }}>
            Bounce Admin
          </p>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-1">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setSection(id)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-left text-xs uppercase tracking-widest transition-colors"
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                letterSpacing: "0.14em",
                color: section === id ? G : MUTED,
                background: section === id ? "rgba(253,199,99,0.07)" : "transparent",
                borderLeft: section === id ? `2px solid ${G}` : "2px solid transparent",
              }}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </nav>
        <div className="p-4" style={{ borderTop: `1px solid ${GM}` }}>
          <button
            className="flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-widest w-full"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.14em", color: MUTED }}
          >
            <Settings size={15} />
            Settings
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 overflow-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-4xl font-black uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.06em" }}>
            {section === "events" ? "Events" : section === "djs" ? "DJs" : "Gallery"}
          </h2>
          <button
            className="flex items-center gap-2 px-6 py-2.5 font-black uppercase text-xs tracking-widest transition-colors"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.16em", background: G, color: BG, borderRadius: "4px" }}
            onMouseEnter={e => (e.currentTarget.style.background = GH)}
            onMouseLeave={e => (e.currentTarget.style.background = G)}
          >
            <Plus size={15} />
            New {sectionLabel}
          </button>
        </div>

        {/* Events table */}
        {section === "events" && (
          <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${GM}` }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "#12141A", borderBottom: `1px solid ${GM}` }}>
                  {["Date", "Title", "Artists", "Status", "Actions"].map(h => (
                    <th key={h} className="px-5 py-4 text-left text-xs uppercase" style={{ color: G, fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.16em" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {EVENTS.map((event, i) => (
                  <tr key={event.id} style={{ borderBottom: `1px solid ${GM}`, background: i % 2 === 0 ? GLASS : "transparent" }}>
                    <td className="px-5 py-4 text-xs font-black" style={{ color: G, fontFamily: "'Barlow Condensed', sans-serif", whiteSpace: "nowrap" }}>
                      {event.date}
                    </td>
                    <td className="px-5 py-4 text-sm font-black uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                      {event.title}
                    </td>
                    <td className="px-5 py-4 text-xs" style={{ color: MUTED }}>{event.artists}</td>
                    <td className="px-5 py-4">
                      <span
                        className="text-xs px-2.5 py-0.5 rounded-full"
                        style={{
                          border: `1px solid ${event.status === "On sale" ? G : GM}`,
                          color: event.status === "On sale" ? G : MUTED,
                          fontFamily: "'Barlow Condensed', sans-serif",
                          fontSize: "10px",
                          letterSpacing: "0.1em",
                        }}
                      >
                        {event.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-3">
                        <button onClick={() => setEditing(event)} style={{ color: G, transition: "color 0.2s" }}>
                          <Edit2 size={14} />
                        </button>
                        <button style={{ color: "rgba(255,255,255,0.25)", transition: "color 0.2s" }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* DJs list */}
        {section === "djs" && (
          <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
            {DJS.map(dj => (
              <div
                key={dj.id}
                className="flex items-center gap-4 p-4 rounded-xl"
                style={{ background: GLASS, border: `1px solid ${GM}` }}
              >
                <div className="rounded-full overflow-hidden flex-shrink-0" style={{ width: 46, height: 46, background: "#0A0B0C" }}>
                  <img src={img(dj.imgId, 92, 92)} alt={dj.name} className="w-full h-full object-cover" style={{ filter: "grayscale(40%)" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-sm uppercase leading-none" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{dj.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: G, fontFamily: "'Barlow Condensed', sans-serif" }}>{dj.genre}</p>
                </div>
                {dj.resident && <Pill>RESIDENT</Pill>}
                <div className="flex gap-2">
                  <button style={{ color: G }}><Edit2 size={14} /></button>
                  <button style={{ color: "rgba(255,255,255,0.25)" }}><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Gallery list */}
        {section === "gallery" && (
          <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
            {ALBUMS.map(album => (
              <div key={album.id} className="rounded-xl overflow-hidden" style={{ border: `1px solid ${GM}` }}>
                <div className="relative" style={{ paddingTop: "60%", background: "#0A0B0C" }}>
                  <img src={img(album.imgId, 520, 312)} alt={album.title} className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.6 }} />
                </div>
                <div className="p-4 flex items-center justify-between" style={{ background: CARD_BG }}>
                  <div>
                    <p className="text-sm font-black uppercase leading-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                      {album.title}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: MUTED }}>{album.count} photos · {album.date}</p>
                  </div>
                  <div className="flex gap-2">
                    <button style={{ color: G }}><Edit2 size={14} /></button>
                    <button style={{ color: "rgba(255,255,255,0.25)" }}><Trash2 size={14} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Edit event modal */}
      {editing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ background: "rgba(0,0,0,0.87)", backdropFilter: "blur(12px)" }}
          onClick={() => setEditing(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl p-8 max-h-[90vh] overflow-auto"
            style={{ background: CARD_BG, border: `1px solid ${GM}` }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                Edit Event
              </h3>
              <button onClick={() => setEditing(null)} style={{ color: G }}><X size={20} /></button>
            </div>

            <div className="flex flex-col gap-4">
              {[
                { label: "Title",   defaultValue: editing.title },
                { label: "Date",    defaultValue: editing.date },
                { label: "Time",    defaultValue: editing.time },
                { label: "Artists", defaultValue: editing.artists },
              ].map(field => (
                <div key={field.label}>
                  <label
                    className="block text-xs uppercase mb-1.5"
                    style={{ color: G, fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.18em" }}
                  >
                    {field.label}
                  </label>
                  <input
                    defaultValue={field.defaultValue}
                    className="w-full px-4 py-2.5 rounded-lg text-sm outline-none"
                    style={{ background: "#252830", border: `1px solid rgba(253,199,99,0.28)`, color: "#fff", fontFamily: "Inter, sans-serif" }}
                  />
                </div>
              ))}

              <div>
                <label className="block text-xs uppercase mb-1.5" style={{ color: G, fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.18em" }}>
                  Description
                </label>
                <textarea
                  defaultValue={editing.desc}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-lg text-sm outline-none resize-none"
                  style={{ background: "#252830", border: `1px solid rgba(253,199,99,0.28)`, color: "#fff", fontFamily: "Inter, sans-serif" }}
                />
              </div>

              <div>
                <label className="block text-xs uppercase mb-1.5" style={{ color: G, fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.18em" }}>
                  Event Image
                </label>
                <div
                  className="flex flex-col items-center justify-center rounded-lg p-8 cursor-pointer transition-colors"
                  style={{ border: `1px dashed rgba(253,199,99,0.3)`, background: "rgba(253,199,99,0.03)" }}
                >
                  <Upload size={22} style={{ color: G, marginBottom: 8 }} />
                  <p className="text-xs" style={{ color: MUTED }}>Drop image here or click to upload</p>
                </div>
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  className="flex-1 py-3 font-black uppercase text-xs tracking-widest transition-colors"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.18em", background: G, color: BG, borderRadius: "4px" }}
                  onMouseEnter={e => (e.currentTarget.style.background = GH)}
                  onMouseLeave={e => (e.currentTarget.style.background = G)}
                >
                  Save Event
                </button>
                <button
                  onClick={() => setEditing(null)}
                  className="flex-1 py-3 font-black uppercase text-xs tracking-widest transition-colors"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.18em", border: `1px solid ${G}`, color: G, borderRadius: "4px" }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Root ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage]         = useState<Page>("home");
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = (p: Page) => {
    setPage(p);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div style={{ background: BG, minHeight: "100vh", color: "#fff", fontFamily: "Inter, sans-serif" }}>
      <style>{CSS}</style>
      <Nav page={page} navigate={navigate} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      {menuOpen && <FullscreenMenu navigate={navigate} />}
      {page === "home"    && <HomePage    navigate={navigate} />}
      {page === "events"  && <EventsPage />}
      {page === "djs"     && <DJsPage />}
      {page === "gallery" && <GalleryPage />}
      {page === "admin"   && <AdminPage />}
    </div>
  );
}
