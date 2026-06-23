# Mercantile Office Systems — Demo Site

Static demo (POC) for **EPSON Printers & Acer Laptops**. Runs entirely on mock data so it can be shown to the customer before connecting Supabase.

---

## How to host on GitHub Pages (free, ~3 minutes)

1. Create a new repository on GitHub (e.g. `mercantile-demo`).
2. Upload **all files in this folder**, keeping the structure intact:
   ```
   index.html
   .nojekyll
   src/css/...
   src/js/...
   src/images/...
   ```
3. In the repo, go to **Settings → Pages**.
4. Under **Source**, choose **Deploy from a branch** → branch `main` → folder `/ (root)` → **Save**.
5. Wait ~1 minute. Your live demo URL appears at the top of that page:
   ```
   https://<your-username>.github.io/mercantile-demo/
   ```

That link is shareable with the customer immediately. No build step required.

---

## Run locally (optional)

Any static server works. For example:

```bash
# Python (built in on most machines)
python3 -m http.server 8000
# then open http://localhost:8000
```

Or with the included Vite setup:

```bash
npm install
npm run dev
```

> Note: opening `index.html` directly with `file://` will **not** work because the
> JavaScript uses ES modules. Always serve it over `http://` (the steps above do this).

---

## Switching to Supabase later

All data flows through one file: `src/js/api.js`.

1. Open `src/js/api.js`.
2. Change the top line:
   ```js
   const USE_MOCK_DATA = true;   // change to false
   ```
3. Uncomment the Supabase query blocks in each function and add your Supabase client.

The rest of the site (`main.js`, HTML, CSS) needs **no changes** — it only talks to `api.js`.

---

## What was fixed in this version

- Converted all absolute paths (`/src/...`) to relative paths so it works under a GitHub Pages subpath.
- Removed a redundant second `<script>` tag (`api.js` is imported by `main.js`).
- Added auto-generated SVG placeholders for every missing image (products, news, sliders, logos, showroom) so nothing shows as broken.
- Added the missing logo files (`logo.svg`, `logo-white.svg`).
- Internal page links (Products, About, etc.) show a friendly "coming soon" note instead of 404-ing, since this demo is the homepage only.

## File map

| File | Purpose |
|------|---------|
| `index.html` | Homepage (entry point) |
| `src/js/api.js` | **Mock/Supabase toggle** lives here |
| `src/js/main.js` | Renders slider, products, news, footer |
| `src/js/mock-data.js` | All EPSON/Acer demo data |
| `src/js/placeholders.js` | Generates SVG placeholders for missing images |
| `src/css/style.css` | Main styles |
| `src/css/responsive.css` | Mobile styles |
