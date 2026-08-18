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

- [ ] remove `<meta name="robots" content="noindex">` from **both** pages,
- [x] ~~replace the "Download FSG SimBridge" button with the real release address~~ — done
      2026-08-17: it points at
      `https://github.com/chyzy/FSG-SimBridge/releases/latest/download/FSG-SimBridge-Setup.exe`
      (file renamed 2026-08-18, previously `FsgSimBridge-win-Setup.exe`).
      That path always resolves to the newest release, so it never needs changing again — but
      the **file name must match what `build-release.ps1` produces**, and the link stays broken
      until the first release published under the new name,
- [ ] **remove the "unknown publisher" callout** from step 01 of `setup/index.html` once the
      installer is code-signed — it only exists because SmartScreen blocks unsigned builds,
- [x] ~~verify the step 01 copy against the final installer (firewall, Community
      package, "nothing to configure")~~ — done 2026-08-17: the page was audited
      against the shipping installer and rewritten (firewall prompt is now a UAC
      window, tray icon, autostart, self-updating, uninstall via Settings → Apps),
- [ ] the Google Play links use the final `applicationId` — check after publishing,
      and enable the App Store badges once iOS ships,
- [x] ~~when attaching the domain: update `og:url`/`og:image`/`canonical` and the
      href in `404.html`~~ — done 2026-08-14,
- [ ] **privacy policy** at `/privacy/` — Google Play requires its address in both
      app listings (and the Data safety form refers to it),
- [x] ~~align the `StartupPanel.tsx` UI copy with the troubleshooting section of the site~~ —
      done 2026-08-17: both now say the bridge restores the module by itself and the simulator
      needs one restart. Neither tells the user to re-run the installer, because that advice
      leads straight into the "existing application directory" error,
- [ ] "iOS versions are planned but not available yet" in `setup/index.html`
      contradicts the decision to ship iOS in v1 — decide before launch,
- [ ] the "about two minutes" promise in the hero is the only number on the site
      nobody measured; measure it or soften it.

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
