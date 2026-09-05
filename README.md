# FSG-Website — the FlightSimGeeks site (flightsimgeeks.com)

A static HTML site published through GitHub Pages. No generator and no build step:
whatever sits in the repository root is served as-is.

## Layout

| Path | What it is |
|------|------------|
| `index.html` | home page: hero, measured numbers, how it works, features, aircraft, PFD/MFD products, FAQ |
| `setup/index.html` | setup guide — **this address is compiled into the mobile app** (`BRIDGE_SETUP_URL` in `client/src/config/product.ts` of the FSG-G1000 repo). The `/setup` path has to keep working for years (shortened from `/fsg-bridge/setup` on 2026-08-16). |
| `support/index.html` | support page: the two channels (Discord first, `support@flightsimgeeks.com` second), what to try first, what to put in the message, purchases/refunds |
| `fsg-bridge/setup/index.html` | redirect stub pointing at `/setup/` — the old address is baked into pre-release builds of the app; delete once those are gone |
| `assets/site.css` | the only stylesheet; palette taken from the app (logo yellow `#ffc61a`, background `#0b0d10`, MFD magenta `#f531e0`) |
| `assets/img/icon-*.svg` | app icons converted 1:1 from the Android vector drawables (`client/android/app/src/*/res/drawable/`) — fix them there, fix them here |
| `assets/img/app-*.webp` | screenshots of the **live** app (see below: how to refresh them) |
| `assets/img/og-image.jpg` | 1200×630 crop for link cards (Discord, forums) |
| `404.html` | inline styles — Pages serves it from any path, so it must not depend on relative paths |
| `robots.txt` | everything crawlable; points at the sitemap. Deliberately does **not** `Disallow` the 404 page or the redirect stub — a crawler honours `noindex` only on pages it is allowed to fetch |
| `sitemap.xml` | the four indexable pages. Bump `lastmod` when a page's content changes |

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
  (the module), "FSG G1000 PFD" / "FSG G1000 MFD" (the apps). Simulators are the full
  "Microsoft Flight Simulator 2024" / "Microsoft Flight Simulator 2020" on first mention,
  "MSFS 2024" / "MSFS 2020" after that. **Both simulators are supported (since 2026-09-02)**
  — never write "2024 only". The one real difference to keep straight: the FSG-Bridge
  package goes into the Community folder of MSFS 2024 only; on MSFS 2020 there is no module
  and the knobs run on the simulator's own cockpit controls (FSG-G1000 repo,
  `docs/installer.md` §7a–7b).
- **Platforms: Android 7 or later, iOS is iPad only** (`minSdkVersion = 24`;
  `TARGETED_DEVICE_FAMILY = 2` with landscape-only orientations and `UIRequiresFullScreen`) —
  **never write that iPhone is supported.** Source: `docs/store-apps.md`
  ("iOS product decisions") in the FSG-G1000 repo. The Android build carries no screen-size
  restriction, so it installs on phones and the checklist in `setup/index.html` still says
  "tablet or phone" — but there is no phone layout (both attempts were rejected on
  2026-08-20), so **do not promote phones anywhere else on the site** until that is decided.
- **Measured numbers only.** Sources: the README and `docs/` of the FSG-G1000 repo.
  The site went through a fact-by-fact review on 2026-08-13; do not add promises
  that nobody measured.
- **The two navigation breakpoints are computed, not round.** Below `760px` the nav bar
  scrolls horizontally with the CTA pinned right; below `430px` the wordmark drops and only
  the mark remains. Both numbers come from the widest bar on the site — the setup guide's
  (brand 171 + gap 28 + links 499 + container padding). **Add or rename a nav link and they
  have to be recomputed**, otherwise the CTA starts getting clipped again. Measured again in the
  browser on 2026-08-31, after "Support" joined the home and privacy bars: home links 476,
  support 374, privacy 247 — all still under the setup guide's 499.7, so the widest bar did not
  move and both thresholds stand.
- **Two addresses, two jobs.** `support@flightsimgeeks.com` is help with the apps: it lives on
  `/support/` and in the setup guide's "Still stuck?" teaser. `contact@flightsimgeeks.com` is the
  business address — the footer of every page and the data-controller entry in the privacy
  policy. Do not merge them: the second one is in store listings and legal text.
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
   deviceScaleFactor 2), then convert canvas→WebP q0.85.

Step 3 is no longer a scratch script: it lives in the FSG-G1000 repo as
`store/capture-live.js` and writes `store/captures/live-{pfd,mfd}.webp` at 2560×1600 —
the same format as `app-*.webp` here, so its output can be copied straight over these
files when the site images are the ones being refreshed.

⚠ Since 2026-08-16 the bridge **no longer serves the client**, so
`http://localhost:5750/pfd/` returns 404. New screenshots have to come from the vite
dev servers (`.claude/launch.json` → `g1000-client` on 5174, `g1000-client-mfd` on 5175,
which is what `capture-live.js` expects) or from the native app on a tablet.

## Checklist before going public

Still open:

- [ ] **neither store link resolves yet — eight links in two files.**
      *Google Play* (four): verified again 2026-08-20 for both `com.flightsimgeeks.g1000.pfd`
      and `…mfd`; the addresses are final and start working the moment the apps go live, so
      they only wait on publication — confirm the final `applicationId` at the same time.
      *App Store* (four): the `idAPPSTORE-ID-{PFD,MFD}` placeholders **are not addresses and
      never will be** — Apple has no URL by bundle id, so each has to be replaced with the
      app's numeric ID from App Store Connect. Two of each are in `index.html`, two of each
      in `setup/index.html`,
- [ ] **remove the "unknown publisher" callout** from step 01 of `setup/index.html` once the
      installer is code-signed — it only exists because SmartScreen blocks unsigned builds,
- [ ] **the two support channels have to be alive before launch**: `support@flightsimgeeks.com`
      must actually deliver somewhere (it is on `/support/` and in the setup guide's teaser),
      and the Discord invite `sT5G3rSq7q` must be set to **never expire** with no use limit —
      a temporary invite quietly kills the channel the site calls the fastest one. Three places
      link it: `support/index.html` (nav CTA + card), `setup/index.html` (teaser),
- [ ] the "about two minutes" promise is the only number on the site nobody measured;
      measure it or soften it. Four places: the hero button in `index.html`, and the `<h1>`
      lead, `description` and `og:description` in `setup/index.html`,
- [ ] no price anywhere on the site, although the copy says "buy only what your panel needs",
- [ ] **does Android still promise phones?** The pre-flight checklist in `setup/index.html`
      says "An Android tablet or phone", while the reason the site gives for having no iPhone
      version is that the bezel needs a tablet-sized screen. Both cannot stay: either the
      checklist drops the phone, or the site explains why a phone is fine on Android and not
      on iOS. Decide together with the phone layout (rejected 2026-08-20).

Done:

- [x] ~~**iOS says two different things**~~ — done 2026-08-26: the site now presents iOS as
      shipping alongside Android, everywhere. `index.html`: the two `is-soon` App Store badges
      became real links, the products lead says "Android and iPad", and the FAQ entry answers
      "iPad yes, iPhone no" with both minimum OS versions. `setup/index.html`: the checklist item
      names both platforms, step 02 gained a second badge row for the App Store and a fineprint
      with the OS requirements instead of "iOS versions are planned", and the iPadOS
      **local-network permission** is now covered in step 03 and in the "can't find my PC"
      troubleshooting (declining it looks exactly like a network fault). One CSS rule added:
      `.badges + .badges` — four badges do not fit one row in the 820 px guide column,
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
- [x] ~~decide the support channel~~ — **changed 2026-08-31**: Discord first
      (`https://discord.gg/sT5G3rSq7q`), `support@flightsimgeeks.com` second. Everything about
      the channels lives on `/support/`; the setup guide's "Still stuck?" teaser only points
      there, so the next change of channel is one page, not three. The earlier decision
      (e-mail only, `contact@`, no Discord at launch) no longer holds,
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
