import { GalleryClient } from "@/components/GalleryClient";
import { getAlbums } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const albums = await getAlbums();
  return <GalleryClient albums={albums} />;
}
