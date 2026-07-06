import { GalleryClient } from "@/components/GalleryClient";
import { getAlbums } from "@/lib/data";

export default async function GalleryPage() {
  const albums = await getAlbums();
  return <GalleryClient albums={albums} />;
}
