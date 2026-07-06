import { EventsClient } from "@/components/EventsClient";
import { getEvents } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const events = await getEvents();
  return <EventsClient events={events} serverNow={new Date().toISOString()} />;
}
