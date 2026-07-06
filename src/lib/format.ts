export function fmtEventDate(date: string) {
  return new Date(date)
    .toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" })
    .toUpperCase()
    .replace(/,/g, "");
}
