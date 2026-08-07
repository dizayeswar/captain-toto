-- Captain Toto — seed data
-- Run AFTER schema.sql. Safe to re-run (upserts by slug).

insert into public.tours
  (slug, title, destination, country, category, summary, description, price, duration_days, rating, image, featured)
values
  ('santorini-blue-escape', 'Santorini Blue Escape', 'Santorini', 'Greece', 'Beach',
   'Whitewashed cliffs, blue domes, and unforgettable Aegean sunsets.',
   'Spend five dreamy days on the island of Santorini. Wander the caldera villages of Oia and Fira, sail to the volcanic hot springs, taste local Assyrtiko wine, and watch the world''s most famous sunset from your private terrace.',
   1290, 5, 4.9,
   'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80', true),

  ('kyoto-cultural-journey', 'Kyoto Cultural Journey', 'Kyoto', 'Japan', 'Cultural',
   'Ancient temples, bamboo forests, and timeless tea ceremonies.',
   'Discover the heart of old Japan across seven days in Kyoto. Explore the golden Kinkaku-ji, stroll the Arashiyama bamboo grove, join a traditional tea ceremony, and stay in an authentic ryokan with kaiseki dining.',
   2150, 7, 4.8,
   'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80', true),

  ('swiss-alps-adventure', 'Swiss Alps Adventure', 'Interlaken', 'Switzerland', 'Adventure',
   'Cable cars, glacier hikes, and storybook mountain villages.',
   'An action-packed six days in the Swiss Alps. Ride the Jungfrau railway to the Top of Europe, paraglide over Interlaken, hike alpine trails, and unwind beside crystal-clear lakes surrounded by snow-capped peaks.',
   1980, 6, 4.9,
   'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=1200&q=80', true),

  ('dubai-city-of-gold', 'Dubai City of Gold', 'Dubai', 'UAE', 'City',
   'Skyscrapers, desert safaris, and luxury shopping.',
   'Four glittering days in Dubai. Ascend the Burj Khalifa, ride 4x4s across golden dunes, cruise the marina at night, and shop the world''s largest malls before relaxing on Jumeirah Beach.',
   1150, 4, 4.7,
   'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80', false),

  ('bali-tropical-paradise', 'Bali Tropical Paradise', 'Bali', 'Indonesia', 'Beach',
   'Rice terraces, temples, and golden beaches.',
   'Eight relaxing days across the island of the gods. Explore Ubud''s rice terraces, visit sacred water temples, chase waterfalls in the jungle, and end each day with sunset on Bali''s famous beaches.',
   1420, 8, 4.8,
   'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80', false),

  ('iceland-northern-lights', 'Iceland Northern Lights', 'Reykjavik', 'Iceland', 'Adventure',
   'Waterfalls, black-sand beaches, and the aurora borealis.',
   'Five magical days chasing the Northern Lights. Soak in the Blue Lagoon, drive the Golden Circle, marvel at thundering waterfalls, and hunt the aurora across Iceland''s otherworldly winter landscapes.',
   1760, 5, 4.9,
   'https://images.unsplash.com/photo-1531168556467-80aace0d0144?auto=format&fit=crop&w=1200&q=80', false)

on conflict (slug) do update set
  title = excluded.title,
  destination = excluded.destination,
  country = excluded.country,
  category = excluded.category,
  summary = excluded.summary,
  description = excluded.description,
  price = excluded.price,
  duration_days = excluded.duration_days,
  rating = excluded.rating,
  image = excluded.image,
  featured = excluded.featured;
