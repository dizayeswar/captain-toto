# Captain Toto — Full Step-by-Step Guide

This guide takes you from **nothing** to a **live travel-agency website** on the
internet. No prior experience assumed. Follow it top to bottom.

By the end you will have:

- The site running on your own computer
- A **Supabase** database powering tours and bookings
- Your code on **GitHub**
- The website **live on the internet** (free) via **Vercel**

---

## 0. What is this made of? (30-second overview)

| Piece        | What it does                              | Think of it as…            |
| ------------ | ----------------------------------------- | -------------------------- |
| **Next.js**  | The website itself (pages + code)         | The building               |
| **Tailwind** | The styling (colors, spacing, layout)     | The paint and furniture    |
| **Supabase** | The database (tours, bookings)            | The filing cabinet         |
| **GitHub**   | Stores your code online, tracks changes   | The safe backup            |
| **Vercel**   | Puts your site on the internet            | The landlord / web address |

You edit code on your computer → push it to **GitHub** → **Vercel** publishes it.
The site reads and writes data from **Supabase**.

---

## 1. Install the tools (one time)

You need these installed:

1. **Node.js** (v18 or newer) — https://nodejs.org (download the "LTS" version).
2. **Git** — https://git-scm.com/downloads
3. A code editor — **[Cursor](https://cursor.com)** or **[VS Code](https://code.visualstudio.com)**.

Check they work. Open a terminal (PowerShell on Windows) and run:

```powershell
node -v
git --version
```

You should see version numbers. If yes, you're ready.

---

## 2. Run the site on your computer

Open the project folder in your terminal, then:

```powershell
npm install
npm run dev
```

Open **http://localhost:3000** in your browser. 🎉

You'll see the full site working with **sample tours** — even before Supabase is
connected. Press `Ctrl + C` in the terminal to stop the server.

> **Tip:** Every time you change a file and save, the browser refreshes
> automatically.

---

## 3. Create your Supabase database

Supabase is your free online database.

1. Go to **https://supabase.com** → **Start your project** → sign in with GitHub.
2. Click **New project**.
   - **Name:** `captain-toto`
   - **Database password:** pick a strong one and **save it somewhere**.
   - **Region:** choose the one closest to your customers.
3. Wait ~2 minutes for it to be created.

### 3a. Create the tables

1. In your Supabase project, open **SQL Editor** (left sidebar) → **New query**.
2. Open the file **`supabase/schema.sql`** from this project, copy **all** of it.
3. Paste it into the SQL Editor and click **Run**.
   - This creates the `tours` and `bookings` tables and their security rules.

### 3b. Add the sample tours

1. Still in **SQL Editor** → **New query**.
2. Open **`supabase/seed.sql`**, copy all, paste, and **Run**.
3. Open **Table Editor** → you should see 6 tours in the `tours` table.

### 3c. Get your API keys

1. Go to **Project Settings** (gear icon) → **API**.
2. Copy two values:
   - **Project URL** (looks like `https://abcd1234.supabase.co`)
   - **anon public** key (a long string under "Project API keys")

### 3d. Connect them to the site

1. In the project folder, copy `.env.example` to a new file called `.env.local`.

   ```powershell
   Copy-Item .env.example .env.local
   ```

2. Open `.env.local` and paste your values:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://abcd1234.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-long-anon-key
   ```

3. Stop the dev server (`Ctrl + C`) and start it again (`npm run dev`).

Now the site reads tours from **your** Supabase, and every booking form submission
is saved into the `bookings` table. Check **Table Editor → bookings** after you
submit a test booking.

---

## 4. Add or edit tours (no coding)

Two easy ways:

- **Supabase Table Editor:** open the `tours` table → **Insert row** → fill in the
  fields (make sure `slug` is unique and lowercase, e.g. `paris-city-break`).
- **SQL:** copy a block in `supabase/seed.sql`, change the values, and run it.

For images, paste any public image URL (e.g. from [Unsplash](https://unsplash.com)).
Later you can upload photos to **Supabase Storage** and use those URLs instead.

---

## 5. Put your code on GitHub

### 5a. Create the repository

1. Go to **https://github.com** → sign in → click the **+** (top right) → **New repository**.
2. **Repository name:** `captain-toto`
3. Leave it **empty** (do **not** add a README or .gitignore — you already have them).
4. Click **Create repository**. Keep that page open — you'll need the URL.

### 5b. Push your code

In the project folder, run these commands **one time**:

```powershell
git init
git add .
git commit -m "Initial commit: Captain Toto travel site"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/captain-toto.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username. Refresh the GitHub page — your
code is there.

> **From now on**, whenever you change something:
>
> ```powershell
> git add .
> git commit -m "Describe what you changed"
> git push
> ```

---

## 6. Publish the site (Vercel)

Vercel puts your site online for free and gives it a web address.

1. Go to **https://vercel.com** → **Sign up** with GitHub.
2. Click **Add New… → Project**.
3. Find **captain-toto** in the list → **Import**.
4. Before deploying, open **Environment Variables** and add the same two from
   `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL` = your project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your anon key
5. Click **Deploy**. Wait ~1–2 minutes.

You'll get a live link like `https://captain-toto.vercel.app`. Share it! 🌍

> **Automatic updates:** every time you `git push` to GitHub, Vercel rebuilds and
> updates your live site automatically. No extra steps.

---

## 7. Make it yours (customizing)

| I want to change…      | Edit this                                                        |
| ---------------------- | --------------------------------------------------------------- |
| The agency name        | `src/components/Navbar.tsx`, `Footer.tsx`, `layout.tsx` title   |
| Colors (brand blue)    | `src/app/globals.css` → `--brand`, `--brand-dark`, `--accent`   |
| Home page hero text    | `src/app/page.tsx`                                               |
| Contact details        | `src/components/Footer.tsx`, `src/app/contact/page.tsx`         |
| Tours & prices         | Supabase `tours` table (see step 4)                             |

**Colors:** the brand color is set in one place. Change `--brand` in
`globals.css` and the whole site updates.

---

## 8. Ideas for what to build next

- **Admin login** to add/edit tours in-app (Supabase Auth + a protected page).
- **View bookings** in an admin dashboard.
- **Image uploads** to Supabase Storage.
- **Multi-language** (English / Kurdish / Arabic).
- **Payments** (Stripe) for deposits.

When you're ready for any of these, note them down and we'll add them step by step.

---

## 9. Common problems

| Problem                                   | Fix                                                                 |
| ----------------------------------------- | ------------------------------------------------------------------- |
| Site shows sample tours, not mine         | `.env.local` missing/wrong, or dev server not restarted             |
| Booking form error                        | Make sure `schema.sql` ran (bookings table + insert policy exist)   |
| Images don't load                         | Use full `https://` image URLs; `*.supabase.co` is already allowed  |
| `git push` asks for login                 | Use a GitHub Personal Access Token as the password, or GitHub CLI   |
| Vercel build fails                        | Check the two environment variables are set in Vercel               |

---

## 10. Quick command reference

```powershell
npm install        # install dependencies (first time)
npm run dev        # run locally at http://localhost:3000
npm run build      # test a production build
npm run lint       # check for code problems

git add .          # stage your changes
git commit -m "…"  # save a snapshot
git push           # send to GitHub (Vercel auto-deploys)
```

---

Made with ✈ — Captain Toto Travel.
