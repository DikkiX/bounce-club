import { LineupClient } from "@/components/LineupClient";
import { getDjs } from "@/lib/data";

export default async function LineupPage() {
  const djs = await getDjs();
  return <LineupClient djs={djs} />;
}
