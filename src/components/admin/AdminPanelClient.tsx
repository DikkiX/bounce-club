"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Edit2, Film, Image as ImageIcon, LogOut, Plus, Search, Trash2, Users, X } from "lucide-react";
import { GalleryAlbumEditor } from "@/components/admin/GalleryAlbumEditor";
import { brand, barlow } from "@/lib/brand";
import { albumCoverSrc, type GalleryMediaItem } from "@/lib/gallery";

type Tab = "events" | "djs" | "gallery" | "media";

type LocalFile = {
  src: string;
  type: "image" | "video";
  title: string;
  filename?: string;
  moodTag?: string;
  photoCredit?: string;
  hidden?: boolean;
};

function headers() {
  return {
    Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
    "Content-Type": "application/json",
  };
}

function stripMeta(obj: Record<string, unknown>) {
  const next = { ...obj };
  delete next.id;
  delete next._id;
  delete next.__v;
  return next;
}

function formatDateInput(value: unknown) {
  const raw = String(value ?? "");
  if (!raw) return "";
  return raw.includes("T") ? raw.slice(0, 10) : raw.slice(0, 10);
}

const navItems: { id: Tab; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
  { id: "events", label: "Events", icon: Calendar },
  { id: "djs", label: "DJs", icon: Users },
  { id: "gallery", label: "Gallery", icon: ImageIcon },
  { id: "media", label: "Hero Videos", icon: Film },
];

export function AdminPanelClient() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("events");
  const [events, setEvents] = useState<Record<string, unknown>[]>([]);
  const [djs, setDjs] = useState<Record<string, unknown>[]>([]);
  const [albums, setAlbums] = useState<Record<string, unknown>[]>([]);
  const [heroVideos, setHeroVideos] = useState<LocalFile[]>([]);
  const [heroVideo, setHeroVideo] = useState("");
  const [galleryMedia, setGalleryMedia] = useState<GalleryMediaItem[]>([]);
  const [form, setForm] = useState<Record<string, string>>({});
  const [editId, setEditId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!(await fetch("/api/admin/verify", { headers: headers() })).ok) {
      router.replace("/admin");
      return;
    }
    const [ev, dj, al, mediaRes] = await Promise.all([
      fetch("/api/events").then((r) => r.json()),
      fetch("/api/djs").then((r) => r.json()),
      fetch("/api/albums").then((r) => r.json()),
      fetch("/api/admin/gallery-files", { headers: headers() }).then((r) => r.json()),
    ]);
    setEvents(ev);
    setDjs(dj);
    setAlbums(al);
    setHeroVideos((mediaRes.media ?? []).filter((m: LocalFile) => m.type === "video"));
    setHeroVideo(mediaRes.settings?.heroVideo ?? "");
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  async function upload(file: File, target: "uploads" | "gallery" = "uploads") {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("target", target);
    const res = await fetch("/api/admin/upload", {
      method: "POST",
      headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      body: fd,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Upload failed");
    return (data.url ?? data.imageUrl) as string;
  }

  const toForm = (item: Record<string, unknown>): Record<string, string> => {
    if (tab === "events") {
      return {
        title: String(item.title ?? ""),
        date: formatDateInput(item.date),
        time: String(item.time ?? ""),
        description: String(item.description ?? ""),
        image: String(item.image ?? ""),
        ticketUrl: String(item.ticketUrl ?? ""),
        featured: item.featured === true || item.featured === "true" ? "true" : "false",
        artists: Array.isArray(item.artists) ? item.artists.join(", ") : String(item.artists ?? ""),
      };
    }
    if (tab === "djs") {
      const social = (item.social ?? {}) as Record<string, string>;
      return {
        name: String(item.name ?? ""),
        genre: String(item.genre ?? ""),
        bio: String(item.bio ?? ""),
        image: String(item.image ?? ""),
        instagram: String(social.instagram ?? ""),
        soundcloud: String(social.soundcloud ?? ""),
        spotify: String(social.spotify ?? ""),
      };
    }
    if (tab === "gallery") {
      return {
        title: String(item.title ?? ""),
        date: formatDateInput(item.date),
        description: String(item.description ?? ""),
        moodTag: String(item.moodTag ?? ""),
        photoCredit: String(item.photoCredit ?? ""),
      };
    }
    return {};
  };

  function openCreate() {
    setEditId(null);
    setForm({});
    setGalleryMedia([]);
    setFormOpen(true);
    setError("");
  }

  function openEdit(item: Record<string, unknown>) {
    setEditId(String(item.id));
    setForm(toForm(item));
    if (tab === "gallery") {
      setGalleryMedia(Array.isArray(item.media) ? (item.media as GalleryMediaItem[]) : []);
    } else {
      setGalleryMedia([]);
    }
    setFormOpen(true);
    setError("");
  }

  function closeForm() {
    setFormOpen(false);
    setEditId(null);
    setForm({});
    setGalleryMedia([]);
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");

    const body: Record<string, unknown> = stripMeta({ ...form });
    const path = tab === "gallery" ? "albums" : tab;

    if (tab === "events") {
      body.date = new Date(form.date);
      body.artists = form.artists?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];
      body.featured = form.featured === "true";
    } else if (tab === "djs") {
      body.social = {
        instagram: form.instagram?.trim() ?? "",
        soundcloud: form.soundcloud?.trim() ?? "",
        spotify: form.spotify?.trim() ?? "",
      };
      delete body.instagram;
      delete body.soundcloud;
      delete body.spotify;
    } else if (tab === "gallery") {
      body.date = new Date(form.date);
      body.description = form.description?.trim() ?? "";
      body.photoCredit = form.photoCredit?.trim() ?? "";
      body.moodTag = form.moodTag?.trim() ?? "";
      body.media = galleryMedia.map((m, i) => ({ ...m, order: i }));
      body.thumbnail = galleryMedia[0]?.src ?? "";
      body.images = galleryMedia.map((m) => m.src);
    }

    const url = editId ? `/api/admin/${path}/${editId}` : `/api/admin/${path}`;
    const res = await fetch(url, { method: editId ? "PUT" : "POST", headers: headers(), body: JSON.stringify(body) });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(String(data.error ?? "Save failed"));
      return;
    }

    closeForm();
    setMessage(editId ? "Saved." : "Created.");
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this item?")) return;
    setError("");
    const path = tab === "gallery" ? "albums" : tab;
    const res = await fetch(`/api/admin/${path}/${id}`, { method: "DELETE", headers: headers() });
    if (!res.ok) {
      setError("Delete failed");
      return;
    }
    setMessage("Deleted.");
    load();
  }

  async function setHero(filename: string) {
    setError("");
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify({ heroVideo: filename }),
    });
    if (!res.ok) {
      setError("Could not set hero video");
      return;
    }
    setHeroVideo(filename);
    setMessage(`Homepage hero: ${filename}`);
  }

  function logout() {
    localStorage.removeItem("adminToken");
    router.replace("/admin");
  }

  const rawList = tab === "events" ? events : tab === "djs" ? djs : tab === "gallery" ? albums : [];
  const list = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rawList;
    return rawList.filter((item) => JSON.stringify(item).toLowerCase().includes(q));
  }, [rawList, search]);

  async function uploadMediaFiles(files: File[]) {
    const results = await Promise.all(
      files.map(async (file) => {
        const url = await upload(file);
        const type = file.type.startsWith("video/") ? "video" : "image";
        return { url, type: type as "image" | "video" };
      }),
    );
    return results;
  }

  const sectionLabel = tab === "events" ? "Event" : tab === "djs" ? "DJ" : tab === "gallery" ? "Gallery" : "Album";

  const filteredVideos = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return heroVideos;
    return heroVideos.filter((v) => v.title.toLowerCase().includes(q) || v.filename?.toLowerCase().includes(q));
  }, [heroVideos, search]);

  return (
    <div className="flex min-h-screen pt-16" style={{ background: brand.bg }}>
      <aside className="hidden w-56 shrink-0 flex-col md:flex" style={{ background: brand.sidebar, borderRight: `1px solid ${brand.goldMuted}` }}>
        <div className="p-6" style={{ borderBottom: `1px solid ${brand.goldMuted}` }}>
          <p className="text-xs font-black uppercase tracking-[0.22em]" style={{ fontFamily: barlow, color: brand.gold }}>
            Bounce Admin
          </p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-4">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setTab(id);
                closeForm();
                setSearch("");
                setError("");
                setMessage("");
              }}
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-left text-xs uppercase tracking-[0.14em] transition-colors"
              style={{
                fontFamily: barlow,
                color: tab === id ? brand.gold : brand.muted,
                background: tab === id ? "rgba(253,199,99,0.07)" : "transparent",
                borderLeft: tab === id ? `2px solid ${brand.gold}` : "2px solid transparent",
              }}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </nav>
        <div className="p-4" style={{ borderTop: `1px solid ${brand.goldMuted}` }}>
          <button type="button" onClick={logout} className="flex w-full items-center gap-3 px-4 py-3 text-xs uppercase tracking-[0.14em]" style={{ fontFamily: barlow, color: brand.muted }}>
            <LogOut size={15} />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto p-6 md:p-8">
        <div className="mb-6 flex flex-wrap gap-2 md:hidden">
          {navItems.map(({ id, label }) => (
            <button key={id} type="button" onClick={() => setTab(id)} className="rounded px-3 py-1 text-xs uppercase" style={{ color: tab === id ? brand.gold : brand.muted, border: `1px solid ${brand.goldMuted}` }}>
              {label}
            </button>
          ))}
        </div>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-4xl font-black uppercase tracking-[0.06em]" style={{ fontFamily: barlow }}>
            {tab === "events" ? "Events" : tab === "djs" ? "DJs" : tab === "gallery" ? "Event Galleries" : "Hero Videos"}
          </h2>
          {tab !== "media" && (
            <button type="button" onClick={openCreate} className="flex items-center gap-2 px-6 py-2.5 text-xs font-black uppercase tracking-[0.16em]" style={{ fontFamily: barlow, background: brand.gold, color: brand.bg, borderRadius: 4 }}>
              <Plus size={15} />
              New {sectionLabel}
            </button>
          )}
        </div>

        {(message || error) && (
          <p className="mb-4 text-sm" style={{ color: error ? "#ff8a8a" : brand.gold }}>
            {error || message}
          </p>
        )}

        <div className="relative mb-6">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: brand.muted }} />
          <input
            className="admin-input pl-11"
            placeholder={tab === "media" ? "Search videos..." : `Search ${tab}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {tab === "events" && (
          <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
            {list.map((item) => (
              <AdminCard
                key={String(item.id)}
                preview={String(item.image ?? "")}
                title={String(item.title)}
                meta={[formatDateInput(item.date), item.featured ? "★ Featured" : "Standard", item.ticketUrl ? "Tickets linked" : "No tickets"].join(" · ")}
                onEdit={() => openEdit(item)}
                onDelete={() => remove(String(item.id))}
              />
            ))}
            {list.length === 0 && <EmptyState />}
          </div>
        )}

        {tab === "djs" && (
          <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
            {list.map((item) => (
              <AdminCard
                key={String(item.id)}
                preview={String(item.image ?? "")}
                round
                title={String(item.name)}
                meta={String(item.genre)}
                onEdit={() => openEdit(item)}
                onDelete={() => remove(String(item.id))}
              />
            ))}
            {list.length === 0 && <EmptyState />}
          </div>
        )}

        {tab === "gallery" && (
          <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
            {list.map((item) => {
              const media = Array.isArray(item.media) ? (item.media as GalleryMediaItem[]) : [];
              const cover = albumCoverSrc({ id: String(item.id), title: String(item.title), date: String(item.date), media });
              return (
                <AdminCard
                  key={String(item.id)}
                  preview={cover}
                  title={String(item.title)}
                  meta={[formatDateInput(item.date), `${media.length} items`, String(item.moodTag ?? "No mood")].join(" · ")}
                  onEdit={() => openEdit(item)}
                  onDelete={() => remove(String(item.id))}
                />
              );
            })}
            {list.length === 0 && (
              <EmptyState label="No event galleries yet. Create one and upload photos/videos for that night." />
            )}
          </div>
        )}

        {tab === "media" && (
          <div className="space-y-6">
            <div className="rounded-2xl p-6" style={{ background: brand.card, border: `1px solid ${brand.goldMuted}` }}>
              <p className="mb-2 text-xs uppercase tracking-[0.16em]" style={{ color: brand.gold, fontFamily: barlow }}>
                Homepage background — videos only
              </p>
              <p className="mb-2 text-sm" style={{ color: brand.muted }}>
                Active: <span style={{ color: "#fff" }}>{heroVideo || "bounce-aftermovie-cropped.mp4"}</span>
              </p>
              <p className="text-xs" style={{ color: brand.muted }}>
                Upload a video below, then run <code>npm run gallery:process</code> to publish it.
              </p>
              <input
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                className="mt-4"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  try {
                    await upload(f, "gallery");
                    setMessage("Video uploaded — run npm run gallery:process, then refresh.");
                  } catch (err) {
                    setError(err instanceof Error ? err.message : "Upload failed");
                  }
                }}
              />
            </div>

            <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
              {filteredVideos.map((file) => (
                <div key={file.src} className="overflow-hidden rounded-xl" style={{ border: `1px solid ${file.filename === heroVideo ? brand.gold : brand.goldMuted}`, background: brand.glass }}>
                  <div className="relative bg-[#0A0B0C]" style={{ paddingTop: "56%" }}>
                    <video src={file.src} className="absolute inset-0 h-full w-full object-cover opacity-80" muted loop playsInline autoPlay />
                  </div>
                  <div className="p-4">
                    <p className="text-sm font-black uppercase" style={{ fontFamily: barlow }}>{file.title}</p>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.12em]" style={{ color: brand.gold }}>Video</p>
                    <button
                      type="button"
                      onClick={() => file.filename && setHero(file.filename)}
                      className="mt-3 px-4 py-2 text-[11px] font-black uppercase tracking-[0.14em]"
                      style={{
                        fontFamily: barlow,
                        background: file.filename === heroVideo ? brand.gold : "transparent",
                        color: file.filename === heroVideo ? brand.bg : brand.gold,
                        border: `1px solid ${brand.gold}`,
                        borderRadius: 4,
                      }}
                    >
                      {file.filename === heroVideo ? "Active hero" : "Set as hero"}
                    </button>
                  </div>
                </div>
              ))}
              {filteredVideos.length === 0 && <EmptyState label="No hero videos yet." />}
            </div>
          </div>
        )}
      </main>

      {formOpen && tab !== "media" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(8,9,10,0.88)", backdropFilter: "blur(8px)" }} onClick={closeForm}>
          <div
            className={`max-h-[92vh] w-full overflow-y-auto rounded-2xl p-6 ${tab === "gallery" ? "max-w-5xl" : "max-w-2xl"}`}
            style={{ background: brand.card, border: `1px solid ${brand.goldMuted}` }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-2xl font-black uppercase" style={{ fontFamily: barlow }}>
                {editId ? `Edit ${sectionLabel}` : `New ${sectionLabel}`}
              </h3>
              <button type="button" onClick={closeForm} style={{ color: brand.gold }}>
                <X size={22} />
              </button>
            </div>

            <form onSubmit={save} className="grid gap-4 md:grid-cols-2">
              {tab === "events" && (
                <>
                  <input className="admin-input md:col-span-2" placeholder="Title" value={form.title ?? ""} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                  <input className="admin-input" type="date" value={form.date ?? ""} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
                  <input className="admin-input" placeholder="Time (23:00 - 05:00)" value={form.time ?? ""} onChange={(e) => setForm({ ...form, time: e.target.value })} required />
                  <input className="admin-input md:col-span-2" placeholder="Artists (comma separated)" value={form.artists ?? ""} onChange={(e) => setForm({ ...form, artists: e.target.value })} />
                  <textarea className="admin-input md:col-span-2" placeholder="Description" rows={3} value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
                  <input className="admin-input" placeholder="Image URL" value={form.image ?? ""} onChange={(e) => setForm({ ...form, image: e.target.value })} />
                  <input type="file" accept="image/*" onChange={async (e) => { const f = e.target.files?.[0]; if (f) setForm({ ...form, image: await upload(f) }); }} />
                  {form.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={form.image} alt="" className="md:col-span-2 h-32 w-full rounded-lg object-cover" style={{ border: `1px solid ${brand.goldMuted}` }} />
                  )}
                  <input className="admin-input" placeholder="Bash ticket URL" value={form.ticketUrl ?? ""} onChange={(e) => setForm({ ...form, ticketUrl: e.target.value })} />
                  <div>
                    <select className="admin-input" value={form.featured ?? "false"} onChange={(e) => setForm({ ...form, featured: e.target.value })}>
                      <option value="false">Not featured</option>
                      <option value="true">Featured</option>
                    </select>
                    <p className="mt-2 text-[11px]" style={{ color: brand.muted }}>
                      Featured = big highlight block at the top of the Events page.
                    </p>
                  </div>
                </>
              )}

              {tab === "djs" && (
                <>
                  <input className="admin-input" placeholder="Name" value={form.name ?? ""} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                  <input className="admin-input" placeholder="Genre" value={form.genre ?? ""} onChange={(e) => setForm({ ...form, genre: e.target.value })} required />
                  <textarea className="admin-input md:col-span-2" placeholder="Bio" rows={3} value={form.bio ?? ""} onChange={(e) => setForm({ ...form, bio: e.target.value })} required />
                  <input className="admin-input" placeholder="Image URL" value={form.image ?? ""} onChange={(e) => setForm({ ...form, image: e.target.value })} required />
                  <input type="file" accept="image/*" onChange={async (e) => { const f = e.target.files?.[0]; if (f) setForm({ ...form, image: await upload(f) }); }} />
                  {form.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={form.image} alt="" className="md:col-span-2 mx-auto h-28 w-28 rounded-full object-cover" style={{ border: `2px solid ${brand.goldMuted}` }} />
                  )}
                  <input className="admin-input" placeholder="Instagram URL" value={form.instagram ?? ""} onChange={(e) => setForm({ ...form, instagram: e.target.value })} />
                  <input className="admin-input" placeholder="SoundCloud URL" value={form.soundcloud ?? ""} onChange={(e) => setForm({ ...form, soundcloud: e.target.value })} />
                  <input className="admin-input md:col-span-2" placeholder="Spotify URL" value={form.spotify ?? ""} onChange={(e) => setForm({ ...form, spotify: e.target.value })} />
                </>
              )}

              {tab === "gallery" && (
                <>
                  <input className="admin-input md:col-span-2" placeholder="Gallery name" value={form.title ?? ""} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                  <input className="admin-input" type="date" value={form.date ?? ""} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
                  <textarea className="admin-input md:col-span-2" placeholder="Description (optional)" rows={2} value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                  <input className="admin-input" list="mood-tag-options" placeholder="Mood tag (optional)" value={form.moodTag ?? ""} onChange={(e) => setForm({ ...form, moodTag: e.target.value })} />
                  <datalist id="mood-tag-options">
                    {["RAW", "EUPHORIC", "DARK", "SUNRISE", "WAREHOUSE", "INTIMATE"].map((m) => (
                      <option key={m} value={m} />
                    ))}
                  </datalist>
                  <input className="admin-input md:col-span-2" placeholder="Default photo credit (optional)" value={form.photoCredit ?? ""} onChange={(e) => setForm({ ...form, photoCredit: e.target.value })} />
                  <GalleryAlbumEditor media={galleryMedia} onChange={setGalleryMedia} onUpload={uploadMediaFiles} />
                </>
              )}

              <div className="flex gap-3 md:col-span-2">
                <button type="submit" className="px-6 py-2 text-xs font-black uppercase tracking-[0.16em]" style={{ fontFamily: barlow, background: brand.gold, color: brand.bg, borderRadius: 4 }}>
                  {editId ? "Save changes" : "Create"}
                </button>
                <button type="button" onClick={closeForm} className="px-6 py-2 text-xs font-black uppercase tracking-[0.16em]" style={{ fontFamily: barlow, border: `1px solid ${brand.gold}`, color: brand.gold, borderRadius: 4 }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminCard({
  preview,
  videoPreview,
  title,
  meta,
  round,
  badge,
  onEdit,
  onDelete,
}: {
  preview: string;
  videoPreview?: string;
  title: string;
  meta: string;
  round?: boolean;
  badge?: string;
  onEdit: () => void;
  onDelete?: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl" style={{ background: brand.glass, border: `1px solid ${brand.goldMuted}` }}>
      <div className="relative bg-[#0A0B0C]" style={{ paddingTop: round ? "0" : "52%", height: round ? 120 : undefined }}>
        {videoPreview ? (
          <video src={videoPreview} className="absolute inset-0 h-full w-full object-cover opacity-75" muted loop playsInline autoPlay />
        ) : preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt=""
            className={round ? "mx-auto mt-4 h-20 w-20 rounded-full object-cover" : "absolute inset-0 h-full w-full object-cover opacity-75"}
            style={round ? { border: `2px solid ${brand.goldMuted}` } : undefined}
          />
        ) : (
          <div className={round ? "mx-auto mt-4 h-20 w-20 rounded-full" : "absolute inset-0"} style={{ background: "#111", border: round ? `2px solid ${brand.goldMuted}` : undefined }} />
        )}
        {badge ? (
          <span className="absolute right-3 top-3 rounded px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.12em]" style={{ background: brand.gold, color: brand.bg, fontFamily: barlow }}>
            {badge}
          </span>
        ) : null}
      </div>
      <div className="p-4">
        <p className="text-sm font-black uppercase leading-tight" style={{ fontFamily: barlow }}>{title}</p>
        <p className="mt-1 text-[11px] leading-relaxed" style={{ color: brand.muted }}>{meta}</p>
        <div className="mt-3 flex gap-3">
          <button type="button" onClick={onEdit} className="px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em]" style={{ fontFamily: barlow, border: `1px solid ${brand.gold}`, color: brand.gold, borderRadius: 4 }}>
            <Edit2 size={12} className="inline mr-1" />
            Edit
          </button>
          {onDelete ? (
            <button type="button" onClick={onDelete} style={{ color: "rgba(255,255,255,0.3)" }}>
              <Trash2 size={14} />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ label = "Nothing here yet." }: { label?: string }) {
  return <p className="col-span-full py-12 text-center text-sm" style={{ color: brand.muted }}>{label}</p>;
}
