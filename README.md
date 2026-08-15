# FSG-Website — strona FlightSimGeeks (flightsimgeeks.com)

Statyczna strona HTML publikowana przez GitHub Pages. Bez generatora i bez kroku
budowania: to, co leży w korzeniu repozytorium, jest serwowane 1:1.

## Struktura

| Ścieżka | Co to |
|---------|-------|
| `index.html` | strona główna: hero, liczby z pomiarów, jak działa, features, samoloty, produkty PFD/MFD, FAQ |
| `fsg-bridge/setup/index.html` | instrukcja konfiguracji — **adres zaszyty w binarce aplikacji** (`BRIDGE_SETUP_URL` w `client/src/config/product.ts` repo FSG-G1000). Ścieżka `/fsg-bridge/setup` musi działać na lata. |
| `assets/site.css` | jedyny arkusz; paleta wzięta z aplikacji (żółć znaku `#ffc61a`, tło `#0b0d10`, magenta MFD `#f531e0`) |
| `assets/img/icon-*.svg` | ikony aplikacji przekonwertowane 1:1 z Android vector drawables (`client/android/app/src/*/res/drawable/`) — poprawka tam = poprawka tu |
| `assets/img/app-*.webp` | zrzuty **żywej** aplikacji (patrz niżej: jak odnowić) |
| `assets/img/og-image.jpg` | kadr 1200×630 do kart linków (Discord/fora) |
| `404.html` | style inline — Pages serwuje go spod dowolnej ścieżki, więc nie może zależeć od ścieżek relatywnych |

## Jak to jest publikowane

**Push na `main` = publikacja.** GitHub Pages serwuje zawartość gałęzi wprost
(Settings → Pages → Source: **Deploy from a branch**, `main` / `/ (root)`),
bez workflow i bez kroku budowania.

Dlatego `.nojekyll` jest tu **niezbędny**, a nie ozdobny: w tym trybie Pages
przepuszczają treść przez Jekyll, który pomija pliki i katalogi zaczynające się
od podkreślenia.

Wersja przez GitHub Actions (`actions/deploy-pages`) istniała do commita
`c895b8f` i jest w historii gita — warto do niej wrócić, gdy pojawi się krok
budowania: podstawianie adresu wydania mostu z GitHub Releases, sprawdzarka
martwych odnośników (strona setup jest linkowana z binarki aplikacji!) albo
optymalizacja obrazków. Migracja to dodanie pliku workflow i zmiana źródła
w Settings.

Adres: **https://flightsimgeeks.com** (domena podpięta 2026-08-14, certyfikat Let's Encrypt
wystawiony automatycznie przez Pages, „Enforce HTTPS" do zaznaczenia w Settings).
Stary adres `https://chyzy.github.io/FSG-Website/` działa dalej i przekierowuje.

## Zasady

- **Odnośniki i zasoby wyłącznie relatywne** (`./`, `../`) — strona żyje pod
  podścieżką `/FSG-Website/` do czasu domeny. Wyjątek: `og:url`, `og:image`
  i `canonical` w `<head>` muszą być absolutne.
- **Terminologia = terminologia UI aplikacji**: „FSG SimBridge" (program),
  `fsg-simbridge` (proces), „FSG-Bridge package" w „Community folder" (moduł),
  „FSG G1000 PFD"/„FSG G1000 MFD" (aplikacje), zawsze pełne „Microsoft Flight
  Simulator 2024".
- **Tylko zmierzone liczby.** Źródła: README i docs/ repo FSG-G1000. Strona
  przeszła rewizję fakt-po-fakcie 2026-08-13; nie dopisywać obietnic bez pomiaru.

## Zrzuty aplikacji — jak odnowić

Zrzuty pochodzą z żywej aplikacji podłączonej do sima (C172, MSFS 2024):

1. uruchom most w trybie dev z obydwoma panelami:
   `dotnet run --project server/src/fsg-simbridge -- --Popout:Panels:mfd:Enabled=true`
   (w repo FSG-G1000; klient zbudowany: `cd client && npm run build && npm run build:mfd`),
2. wczytaj lot w simie i poczekaj, aż popouty wstaną (`/api/status`),
3. zrzuty przez playwright-core + systemowy Edge (viewport 1280×800, deviceScaleFactor 2)
   z `http://localhost:5100/pfd/` i `/mfd/`, potem konwersja canvas→WebP q0.85.
   Skrypty siedzą w historii sesji Claude; odtworzenie: `shot.js` + `convert.js`.

## Checklista przed publicznym startem

- [ ] usunąć `<meta name="robots" content="noindex">` z **obu** stron,
- [ ] podmienić przycisk „Download FSG SimBridge" na prawdziwy adres wydania
      (span → `<a>`; szukaj `TODO` w `fsg-bridge/setup/index.html`),
- [ ] zweryfikować opis kroku 01 na finalnym instalatorze (zapora, pakiet
      Community, „nothing to configure"),
- [ ] linki Google Play są wpisane pod finalne `applicationId` — sprawdzić po
      publikacji, odblokować odznaki App Store gdy wyjdzie iOS,
- [x] ~~przy podpięciu domeny: podmienić `og:url`/`og:image`/`canonical` i href w `404.html`~~
      — zrobione 2026-08-14,
- [ ] **polityka prywatności** pod `/privacy/` — Google Play wymaga jej adresu
      w listingu obu aplikacji (i odwołuje się do niej formularz Data safety),
- [ ] ujednolicić tekst UI `StartupPanel.tsx` (porada o module — dziś
      deweloperska) z sekcją troubleshooting strony.

## Podgląd lokalny

```bash
npx serve . -l 5173
```

(Otwarcie `index.html` z dysku też działa do prostych zmian.)

## Domena własna (później)

Settings → Pages → Custom domain (`flightsimgeeks.com`) + rekordy DNS
u rejestratora, na końcu „Enforce HTTPS". Przy publikacji przez Actions plik
`CNAME` w repo nie jest potrzebny — domenę pamięta konfiguracja Pages.
Relatywne odnośniki działają w obu układach bez zmian.
