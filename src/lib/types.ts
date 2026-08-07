export type Tour = {
  id: string;
  slug: string;
  title: string;
  destination: string;
  country: string;
  category: string;
  summary: string;
  description: string;
  price: number;
  duration_days: number;
  rating: number;
  image: string;
  featured: boolean;
};

export type Booking = {
  id?: string;
  tour_slug: string;
  tour_title: string;
  full_name: string;
  email: string;
  phone: string;
  travelers: number;
  travel_date: string;
  message?: string;
  created_at?: string;
};

export type BookingInput = Omit<Booking, "id" | "created_at">;
