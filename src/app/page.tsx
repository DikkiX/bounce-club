import { HomeContent } from "@/components/HomeContent";
import { getAlbums, getDjs, getEvents, getNextEvent } from "@/lib/data";
import { getHeroBackgroundMedia } from "@/lib/localGallery";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [events, djs, albums, heroMedia] = await Promise.all([
    getEvents(),
    getDjs(),
    getAlbums(),
    getHeroBackgroundMedia(),
  ]);

  return (
    <HomeContent
      nextEvent={getNextEvent(events)}
      residents={djs.slice(0, 3)}
      albums={albums}
      heroMedia={heroMedia}
    />
  );
}
