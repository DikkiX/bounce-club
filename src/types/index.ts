export type EventItem = {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  artists?: string[];
  image?: string;
  ticketUrl?: string;
  featured?: boolean;
};
