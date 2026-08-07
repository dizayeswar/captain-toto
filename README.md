# Captain Toto ✈

A modern travel-agency website: browse tours, view details, and request bookings.
Built with **Next.js + Tailwind CSS + Supabase**.

> New here? Read **[GUIDE.md](GUIDE.md)** — a complete, beginner-friendly, step-by-step
> walkthrough from zero to a live website (Supabase, GitHub, and Vercel included).

---

## Tech stack

| Layer      | Technology                        | Where it runs        |
| ---------- | --------------------------------- | -------------------- |
| Frontend   | Next.js 16 (App Router) + React   | Vercel               |
| Styling    | Tailwind CSS v4                   | —                    |
| Database   | Supabase (PostgreSQL)             | Supabase cloud       |
| Hosting    | Vercel (free)                     | Vercel               |
| Source     | GitHub                            | GitHub               |

---

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:3000

The site works immediately with built-in **sample tours**. To use your own data,
connect Supabase (see [GUIDE.md](GUIDE.md) → *Connect Supabase*).

---

## Environment variables

Copy `.env.example` to `.env.local` and fill in your Supabase values:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

---

## Project structure

```
src/
  app/
    page.tsx              Home page
    tours/page.tsx        Tours listing (search + filter)
    tours/[slug]/page.tsx Tour detail + booking form
    about/page.tsx        About page
    contact/page.tsx      Contact page
    api/bookings/route.ts Saves bookings to Supabase
  components/             Navbar, Footer, TourCard, BookingForm, ToursExplorer
  lib/
    supabase.ts           Supabase client
    tours.ts              Data access (+ sample fallback)
    types.ts              TypeScript types
supabase/
  schema.sql             Tables + security policies
  seed.sql               Sample tour data
```

---

Built for learning and easy extension. See [GUIDE.md](GUIDE.md) for everything else.
