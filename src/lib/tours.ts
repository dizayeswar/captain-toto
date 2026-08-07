import { getSupabase } from "./supabase";
import type { Tour } from "./types";

/**
 * Sample tours used as a fallback so the site looks complete before Supabase
 * is connected (or if a query fails). Once the `tours` table has rows, the
 * real data is used instead. Keep these slugs in sync with supabase/seed.sql.
 */
export const SAMPLE_TOURS: Tour[] = [
  {
    id: "1",
    slug: "santorini-blue-escape",
    title: "Santorini Blue Escape",
    destination: "Santorini",
    country: "Greece",
    category: "Beach",
    summary: "Whitewashed cliffs, blue domes, and unforgettable Aegean sunsets.",
    description:
      "Spend five dreamy days on the island of Santorini. Wander the caldera villages of Oia and Fira, sail to the volcanic hot springs, taste local Assyrtiko wine, and watch the world's most famous sunset from your private terrace.",
    price: 1290,
    duration_days: 5,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80",
    featured: true,
  },
  {
    id: "2",
    slug: "kyoto-cultural-journey",
    title: "Kyoto Cultural Journey",
    destination: "Kyoto",
    country: "Japan",
    category: "Cultural",
    summary: "Ancient temples, bamboo forests, and timeless tea ceremonies.",
    description:
      "Discover the heart of old Japan across seven days in Kyoto. Explore the golden Kinkaku-ji, stroll the Arashiyama bamboo grove, join a traditional tea ceremony, and stay in an authentic ryokan with kaiseki dining.",
    price: 2150,
    duration_days: 7,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
    featured: true,
  },
  {
    id: "3",
    slug: "swiss-alps-adventure",
    title: "Swiss Alps Adventure",
    destination: "Interlaken",
    country: "Switzerland",
    category: "Adventure",
    summary: "Cable cars, glacier hikes, and storybook mountain villages.",
    description:
      "An action-packed six days in the Swiss Alps. Ride the Jungfrau railway to the Top of Europe, paraglide over Interlaken, hike alpine trails, and unwind beside crystal-clear lakes surrounded by snow-capped peaks.",
    price: 1980,
    duration_days: 6,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=1200&q=80",
    featured: true,
  },
  {
    id: "4",
    slug: "dubai-city-of-gold",
    title: "Dubai City of Gold",
    destination: "Dubai",
    country: "UAE",
    category: "City",
    summary: "Skyscrapers, desert safaris, and luxury shopping.",
    description:
      "Four glittering days in Dubai. Ascend the Burj Khalifa, ride 4x4s across golden dunes, cruise the marina at night, and shop the world's largest malls before relaxing on Jumeirah Beach.",
    price: 1150,
    duration_days: 4,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
    featured: false,
  },
  {
    id: "5",
    slug: "bali-tropical-paradise",
    title: "Bali Tropical Paradise",
    destination: "Bali",
    country: "Indonesia",
    category: "Beach",
    summary: "Rice terraces, temples, and golden beaches.",
    description:
      "Eight relaxing days across the island of the gods. Explore Ubud's rice terraces, visit sacred water temples, chase waterfalls in the jungle, and end each day with sunset on Bali's famous beaches.",
    price: 1420,
    duration_days: 8,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
    featured: false,
  },
  {
    id: "6",
    slug: "iceland-northern-lights",
    title: "Iceland Northern Lights",
    destination: "Reykjavik",
    country: "Iceland",
    category: "Adventure",
    summary: "Waterfalls, black-sand beaches, and the aurora borealis.",
    description:
      "Five magical days chasing the Northern Lights. Soak in the Blue Lagoon, drive the Golden Circle, marvel at thundering waterfalls, and hunt the aurora across Iceland's otherworldly winter landscapes.",
    price: 1760,
    duration_days: 5,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1531168556467-80aace0d0144?auto=format&fit=crop&w=1200&q=80",
    featured: false,
  },
];

export const CATEGORIES = ["Beach", "Adventure", "Cultural", "City"] as const;

/** Fetch all tours from Supabase, falling back to sample data. */
export async function getAllTours(): Promise<Tour[]> {
  const supabase = getSupabase();
  if (!supabase) return SAMPLE_TOURS;

  const { data, error } = await supabase
    .from("tours")
    .select("*")
    .order("featured", { ascending: false })
    .order("rating", { ascending: false });

  if (error || !data || data.length === 0) return SAMPLE_TOURS;
  return data as Tour[];
}

/** Fetch featured tours (for the home page). */
export async function getFeaturedTours(): Promise<Tour[]> {
  const tours = await getAllTours();
  const featured = tours.filter((t) => t.featured);
  return featured.length > 0 ? featured : tours.slice(0, 3);
}

/** Fetch a single tour by slug. */
export async function getTourBySlug(slug: string): Promise<Tour | null> {
  const supabase = getSupabase();
  if (!supabase) {
    return SAMPLE_TOURS.find((t) => t.slug === slug) ?? null;
  }

  const { data, error } = await supabase
    .from("tours")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    return SAMPLE_TOURS.find((t) => t.slug === slug) ?? null;
  }
  return data as Tour;
}
