import { Section } from "../types";

export const initialData: Section[] = [
  {
    id: "section-1",
    title: "Hair Services",
    items: [
      { id: "s-1", name: "Haircut", price: 50, duration: 30 },
      { id: "s-2", name: "Blowout", price: 35, duration: 45 },
      { id: "s-7", name: "Highlights", price: 90, duration: 90 },
    ],
  },
  {
    id: "section-2",
    title: "Facial Treatments",
    items: [
      { id: "s-3", name: "Express Facial", price: 75, duration: 30 },
      { id: "s-4", name: "Full Treatment", price: 120, duration: 60 },
    ],
  },
  {
    id: "section-3",
    title: "Nails",
    items: [
      { id: "s-5", name: "Manicure", price: 60, duration: 45 },
      { id: "s-6", name: "Pedicure", price: 80, duration: 45 },
    ],
  },
];
