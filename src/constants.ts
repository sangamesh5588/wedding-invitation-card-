import { InvitationData } from "./types";

export const INVITATION_DATA: InvitationData = {
  groom: "Hemanth. M (Nikhil)",
  bride: "Priyanka. T. M",
  weddingDate: "2026-04-26T10:00:00",
  heroImage: "/ring.png",
  welcome: {
    title: "A Warm Welcome",
    content: "With the blessings of\nSmt. GIRIJA & Sri. MAHADEV. N\nand\nSmt. ROOPA. E & Late Sri. MOHAN. T.N.,\n\nWe cordially invite you to witness\nthe union of Hemanth and Priyanka.\n\nYour presence and blessings are\nthe greatest gifts we could receive\nas we begin this new chapter together.",
    image: "/gb.png"
  },
  venueImage: "/venue.png",
  events: [
    {
      title: "Reception",
      date: "April 25, 2026",
      time: "6:30 PM onwards",
      venue: "Bhagirathi Convention Hall, Harihar",
      locationUrl: "https://maps.google.com/?q=Bhagirathi+Convention+Hall+Harihar",
      description: "Join us for an evening of celebration and dinner."
    },
    {
      title: "Muhurtham",
      date: "April 26, 2026",
      time: "10:00 AM to 10:35 AM",
      venue: "Bhagirathi Convention Hall, Harihar",
      locationUrl: "https://maps.google.com/?q=Bhagirathi+Convention+Hall+Harihar",
      description: "The auspicious ceremony where we tie the knot."
    },
    {
      title: "Reception",
      date: "April 26, 2026",
      time: "12:00 PM onwards",
      venue: "Bhagirathi Convention Hall, Harihar",
      locationUrl: "https://maps.google.com/?q=Bhagirathi+Convention+Hall+Harihar",
      description: "A celebratory lunch following the wedding ceremony."
    }
  ],
  rsvpUrl: "https://forms.gle/example"
};
