# FSG-Website — the FlightSimGeeks site (flightsimgeeks.com)

A static HTML site published through GitHub Pages. No generator and no build step:
whatever sits in the repository root is served as-is.

## Layout

| Path | What it is |
|------|------------|
| `index.html` | home page: hero, measured numbers, how it works, features, aircraft, PFD/MFD products, FAQ |
| `setup/index.html` | setup guide — **this address is compiled into the mobile app** (`BRIDGE_SETUP_URL` in `client/src/config/product.ts` of the FSG-G1000 repo). The `/setup` path has to keep working for years (shortened from `/fsg-bridge/setup` on 2026-08-16). |
| `fsg-bridge/setup/index.html` | redirect stub pointing at `/setup/` — the old address is baked into pre-release builds of the app; delete once those are gone |
| `assets/site.css` | the only stylesheet; palette taken from the app (logo yellow `#ffc61a`, background `#0b0d10`, MFD magenta `#f531e0`) |
| `assets/img/icon-*.svg` | app icons converted 1:1 from the Android vector drawables (`client/android/app/src/*/res/drawable/`) — fix them there, fix them here |
| `assets/img/app-*.webp` | screenshots of the **live** app (see below: how to refresh them) |
| `assets/img/og-image.jpg` | 1200×630 crop for link cards (Discord, forums) |
| `404.html` | inline styles — Pages serves it from any path, so it must not depend on relative paths |
| `robots.txt` | everything crawlable; points at the sitemap. Deliberately does **not** `Disallow` the 404 page or the redirect stub — a crawler honours `noindex` only on pages it is allowed to fetch |
| `sitemap.xml` | the three indexable pages. Bump `lastmod` when a page's content changes |

## How it is published

**Push to `main` = publish.** GitHub Pages serves the branch contents directly
(Settings → Pages → Source: **Deploy from a branch**, `main` / `/ (root)`),
with no workflow and no build step.

That is why `.nojekyll` is **required** here, not decorative: in this mode Pages
runs the content through Jekyll, which skips files and directories starting with
an underscore.

A GitHub Actions version (`actions/deploy-pages`) existed up to commit `c895b8f`
and is still in the git history — worth going back to once there is a build step
to run: substituting the bridge release URL from GitHub Releases, a dead-link
checker (the setup page is linked from inside the app binary!), or image
optimisation. Migrating means adding a workflow file and changing the source in
Settings.

Address: **https://flightsimgeeks.com** (domain attached 2026-08-14, Let's Encrypt
certificate issued automatically by Pages, "Enforce HTTPS" to be ticked in Settings).
The old address `https://chyzy.github.io/FSG-Website/` still works and redirects.

## Rules

- **Links and assets are relative only** (`./`, `../`). The site lived under the
  `/FSG-Website/` subpath before the custom domain, and that old address still
  redirects — relative paths are what make both layouts work. Exception: `og:url`,
  `og:image` and `canonical` in `<head>` must be absolute.
- **Terminology follows the app's UI**: "FSG SimBridge" (the program),
  `fsg-simbridge` (the process), "FSG-Bridge package" in the "Community folder"
  (the module), "FSG G1000 PFD" / "FSG G1000 MFD" (the apps), always the full
  "Microsoft Flight Simulator 2024".
- **Measured numbers only.** Sources: the README and `docs/` of the FSG-G1000 repo.
  The site went through a fact-by-fact review on 2026-08-13; do not add promises
  that nobody measured.
- **The two navigation breakpoints are computed, not round.** Below `760px` the nav bar
  scrolls horizontally with the CTA pinned right; below `430px` the wordmark drops and only
  the mark remains. Both numbers come from the widest bar on the site — the setup guide's
  (brand 171 + gap 28 + links 499 + container padding). **Add or rename a nav link and they
  have to be recomputed**, otherwise the CTA starts getting clipped again.
- **Write for the user, not for us.** No file names, process names, registry keys
  or command-line switches on the page — those belong in the FSG-G1000 docs. The
  four numbered steps carry only what the reader has to *do*; everything else is
  reference material below the "You're good to go" card.

## App screenshots — how to refresh them

The screenshots come from the live app connected to the simulator (C172, MSFS 2024):

1. run the bridge in dev mode with both panels:
   `dotnet run --project server/src/fsg-simbridge -- --Popout:Panels:mfd:Enabled=true`
   (in the FSG-G1000 repo; client built with `cd client && npm run build && npm run build:mfd`),
2. load a flight and wait for the popouts to come up (`/api/status`),
3. capture with playwright-core + the system Edge (viewport 1280×800,
   deviceScaleFactor 2) from `http://localhost:5100/pfd/` and `/mfd/`, then convert
   canvas→WebP q0.85. The scripts live in the Claude session history; to recreate
   them: `shot.js` + `convert.js`.

⚠ Since 2026-08-16 the bridge **no longer serves the client**, so
`http://localhost:5100/pfd/` returns 404. New screenshots have to come from the
vite dev server (`cd client && npm run dev`) or from the native app on a tablet.

## Checklist before going public

Still open:

- [ ] **the Google Play links 404** — verified again 2026-08-20 for both
      `com.flightsimgeeks.g1000.pfd` and `…mfd`. Four links wait on publication:
      two in `index.html`, two in `setup/index.html`. Confirm the final `applicationId`
      at the same time,
- [ ] **remove the "unknown publisher" callout** from step 01 of `setup/index.html` once the
      installer is code-signed — it only exists because SmartScreen blocks unsigned builds,
- [ ] **iOS says two different things.** The privacy policy now covers iOS (Apple as merchant
      of record, the local-network permission, App Privacy labels), but five places still tell
      the reader iOS does not exist: the two `is-soon` App Store badges and the FAQ entry in
      `index.html`, and the fineprint plus the "Android tablet or phone" checklist item in
      `setup/index.html`. One decision, five edits,
- [ ] the "about two minutes" promise is the only number on the site nobody measured;
      measure it or soften it. Four places: the hero button in `index.html`, and the `<h1>`
      lead, `description` and `og:description` in `setup/index.html`,
- [ ] no price anywhere on the site, although the copy says "buy only what your panel needs".

Done:

- [x] ~~remove `<meta name="robots" content="noindex">`~~ — done 2026-08-20 on all three
      indexable pages. It **stays** in `404.html` and in the `/fsg-bridge/setup/` stub, where
      it is intentional,
- [x] ~~replace the "Download FSG SimBridge" button with the real release address~~ — done
      2026-08-17, and the link is live: release **0.9.4** (19.08.2026) ships
      `FSG-SimBridge-Setup.exe`, 126 613 109 B ≈ 120.7 MB, so the "about 120 MB" on the page
      is accurate. `/releases/latest/download/` always resolves to the newest release, so the
      address never needs changing — but the **file name must keep matching what
      `build-release.ps1` produces**,
- [x] ~~verify the step 01 copy against the final installer (firewall, Community
      package, "nothing to configure")~~ — done 2026-08-17: the page was audited
      against the shipping installer and rewritten (firewall prompt is now a UAC
      window, tray icon, autostart, self-updating, uninstall via Settings → Apps),
- [x] ~~when attaching the domain: update `og:url`/`og:image`/`canonical` and the
      href in `404.html`~~ — done 2026-08-14. Verified 2026-08-20: `http→https`,
      `www→apex` and `chyzy.github.io/FSG-Website/*` all 301 onto the canonical address,
      so "Enforce HTTPS" is on,
- [x] ~~**privacy policy** at `/privacy/`~~ — live since 2026-08-14; rewritten 2026-08-20 to
      cover iOS as well. Google Play and the App Store both want this address in the listing,
- [x] ~~align the `StartupPanel.tsx` UI copy with the troubleshooting section of the site~~ —
      done 2026-08-17: both now say the bridge restores the module by itself and the simulator
      needs one restart. Neither tells the user to re-run the installer, because that advice
      leads straight into the "existing application directory" error,
- [x] ~~decide the support channel~~ — e-mail only (`contact@flightsimgeeks.com`), no Discord
      at launch. The address appears in the footer of every page, in the setup guide and in the
      privacy policy — changing it means all three,
- [x] ~~link cards and indexing~~ — done 2026-08-20: `robots.txt` + `sitemap.xml`,
      `og:site_name`, `og:image:width/height`, `og:image:alt` and `twitter:card` on all three
      pages, a full `og:` set on `/privacy/` (it is the address pasted into store listings),
      and a home-page `<title>` that names the product instead of just the brand.

## Local preview

```bash
npx serve . -l 5173
```

(Opening `index.html` straight from disk also works for simple edits.)

## Custom domain (reference)

Settings → Pages → Custom domain (`flightsimgeeks.com`) + DNS records at the
registrar, then "Enforce HTTPS" at the end. When publishing through Actions the
`CNAME` file in the repo is not needed — Pages remembers the domain in its own
configuration. Relative links work in both layouts without changes.
