# Presentazione interattiva — BallVisionAI

Presentazione a moduli per studiare/illustrare il progetto a colpo d'occhio. Segue il formato consolidato
delle nostre dispense scolastiche (`educational-presentation-skill`): **React via CDN, zero build, dark theme,
navigazione da tastiera + swipe, simulatori interattivi**, super-responsive (LIM → mobile).

> **Sito pubblicato**: questa cartella è la sorgente; la versione live è pubblicata via GitHub Pages dal
> repository pubblico dedicato **`ballvision-slides`** → <https://thomascasali.github.io/ballvision-slides/>.

## Come aprirla in locale

- **Subito**: apri `index.html` in un browser (Chrome/Edge). Serve internet (React/Babel via CDN).
- **Server locale** (consigliato per i link relativi tra moduli):
  ```
  python -m http.server 4321 --directory docs/presentazione
  ```
  poi vai su <http://localhost:4321>.

## Struttura

| File | Modulo | Contenuto |
|------|--------|-----------|
| `index.html` | Dashboard | Panoramica + card dei moduli |
| `modulo1.html` | Il problema e l'obiettivo | Cosa fa, perché, lo stato dell'arte |
| `modulo2.html` | La pipeline di analisi | 6 stadi · **esploratore interattivo** · SVG · toggle regime |
| `modulo3.html` | Architettura e tecnologie | PWA/cloud/GPU · **esploratore tecnologie** |
| `modulo4.html` | Riconoscimento: l'AI | YOLO · due fasi · **classificatore di ruolo** · confronto v4→v5 |
| `modulo5.html` | Ricerca e miglioramento | Dataset · ciclo HITL · confronto col lavoro di riferimento · roadmap |
| `theme.css` | — | Design system condiviso (dark theme, responsive) |
| `modules.js` | — | Manifest dei moduli (per pills e navigazione tra moduli) |
| `present.js` | — | Harness condiviso (testata, navigazione, swipe, progress) |

## Navigazione

`←` `→` o `Spazio` per scorrere le slide · **swipe** su mobile · `ESC` torna alla dashboard ·
`1`–`5` saltano direttamente a un modulo. Le **pillole numerate in alto** permettono di passare
da un modulo all'altro **senza tornare alla dashboard**; `Avanti`/`Indietro` scavalcano automaticamente
il confine tra moduli (fine modulo N → inizio modulo N+1).

## Note tecniche

- `theme.css`, `modules.js`, `present.js` sono condivisi; ogni `moduloN.html` definisce solo le proprie
  slide (`window.SLIDES`) e chiama `BV.start()`.
- Babel standalone usa di default il runtime JSX *automatic* (emette `import "react/jsx-runtime"`, che
  **non gira senza bundler** → pagina bianca). Per questo registriamo e usiamo la preset **classic**:
  ```html
  <script>Babel.registerPreset('classic', { presets: [[Babel.availablePresets.react, { runtime: 'classic' }]] });</script>
  <script type="text/babel" data-presets="classic"> ... </script>
  ```
  Replicare questo schema quando si aggiunge un nuovo modulo.

## Pubblicazione (GitHub Pages)

Il sito è pubblicato dal repo **pubblico** `ballvision-slides` (Pages è gratis solo da repo pubblici;
da repo privato richiede un piano Pro/Team). Per aggiornare il sito live, sincronizzare questa cartella
nel repo pubblico e fare push su `main`:

```bash
# dalla root di ballvision.ai, verso il clone del repo pubblico
cp docs/presentazione/* ../ballvision-slides/
cd ../ballvision-slides && git add -A && git commit -m "update slides" && git push
```

Il workflow `.github/workflows/deploy.yml` (nel repo pubblico) ridistribuisce automaticamente su ogni push.
