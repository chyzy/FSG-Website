# FSG-Website — strona Flight Sim Geeks

Statyczna strona HTML publikowana przez GitHub Pages. Bez generatora i bez kroku
budowania: to, co leży w korzeniu repozytorium, jest serwowane 1:1.

## Jak to jest publikowane

Push do `main` uruchamia [.github/workflows/pages.yml](.github/workflows/pages.yml)
(oficjalny wzorzec `actions/deploy-pages`), który wysyła całą zawartość repo na
GitHub Pages. Stan wdrożenia widać w zakładce Actions.

Jednorazowa konfiguracja po pierwszym pushu:
**Settings → Pages → Build and deployment → Source: „GitHub Actions"** — bez tego
workflow kończy się błędem o niewłączonych Pages.

Adres do czasu podpięcia domeny: `https://chyzy.github.io/FSG-Website/`.

## Zasady pisania strony (zanim powstanie)

- **Odnośniki i zasoby wyłącznie relatywne** (`./style.css`, nie `/style.css`) —
  strona żyje pod podścieżką `/FSG-Website/`, absolutne ścieżki się wywrócą.
  Po podpięciu domeny relatywne dalej działają, więc nic nie trzeba zmieniać.
- `index.html` i `404.html` to **placeholdery** do weryfikacji potoku publikacji.
  Mają `<meta name="robots" content="noindex">`, żeby wersja robocza nie weszła
  do indeksu wyszukiwarek — **usunąć ten meta przy publikacji właściwej strony**.
- `404.html` w korzeniu to konwencja Pages — serwowany przy nieistniejących adresach.
- `.nojekyll` wyłącza przetwarzanie Jekyll. Przy publikacji przez Actions jest bez
  znaczenia, ale gdyby ktoś przestawił źródło na „Deploy from a branch", chroni
  pliki i katalogi zaczynające się od `_`.

## Podgląd lokalny

Do prostych zmian wystarczy otworzyć `index.html` w przeglądarce. Gdy potrzebny
prawdziwy serwer (ścieżki, strona 404):

```bash
npx serve .
```

## Domena własna (później)

Settings → Pages → Custom domain (np. `flightsimgeeks.com`) + rekordy DNS
u rejestratora (A na adresy GitHub Pages albo CNAME `www` → `chyzy.github.io`),
na końcu „Enforce HTTPS". Przy publikacji przez Actions plik `CNAME` w repo nie
jest potrzebny — domenę pamięta konfiguracja Pages. Po podpięciu domeny strona
schodzi z podścieżki na korzeń, ale relatywne odnośniki działają w obu układach.
