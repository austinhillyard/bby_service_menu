export type ServiceItem = {
  id: string;
  name: string;
  price: number;
  duration: number; // in minutes
};

export type Section = {
  id: string;
  title: string;
  items: ServiceItem[];
};
