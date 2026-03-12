## Project Configuration

- **Language**: None
- **Package Manager**: npm
- **Add-ons**: none

---

# CLAUDE.md — Data Journalism Scrollytelling

# Progetto: Var Group — Bilancio di Sostenibilità 2025

# Questo file è già compilato nelle sezioni [PROGETTO]. Non modificare le istruzioni tecniche.

---

## Identità del progetto

- **Titolo:** "Var Group — Crescere con responsabilità"
- **Sottotitolo:** "Una lettura interattiva del Bilancio di Sostenibilità 2025"
- **Argomento/storia:** Racconto visivo e narrativo del Bilancio di Sostenibilità Var Group 2025. Il prodotto è un demo tecnico destinato al management interno per mostrare le potenzialità del formato "storia interattiva con i dati". Il tono è editoriale e celebrativo, non analitico-critico.
- **Autore/i:** -
- **Fonte dati principale:** Bilancio di Sostenibilità Var Group 2025 (PDF). I dati sono stati estratti manualmente e salvati come file JSON in `src/lib/data/`. Non esistono CSV originali da fonte esterna.
- **Deploy target:** `daniloderosa.github.io/vargroup-sostenibilita` — GitHub Pages tramite `@sveltejs/adapter-static`
- **Repo:** `github.com/daniloderosa/vargroup-sostenibilita` (da creare)
- **Palette colori** _(estratta direttamente dal sito vargroup.com, marzo 2026)_:
  - `--color-brand-blue: #1032cf` — blu primario Var Group (CTA, link, elementi interattivi principali)
  - `--color-brand-blue-mid: #2a4eef` — blu medio (hover states, accenti secondari)
  - `--color-brand-blue-light: #1268fb` — blu elettrico (accenti chiari, grafici)
  - `--color-bg: #0d0d10` — quasi nero con tinta blu scurissima (sfondo principale dark)
  - `--color-surface: #141418`
  - `--color-surface-2: #1c1c22`
  - `--color-border: #2a2a35`
  - `--color-text: #ffffff` — testo primario (su sfondo scuro, esattamente come il sito)
  - `--color-text-muted: #767676` — testo secondario (usato su H2 nel sito reale)
  - `--color-text-faint: #505050`
  - `--color-text-dark: #141414` — testo su sfondo chiaro
  - `--color-highlight: #f4f4f4` — grigio chiarissimo (superfici card su bianco)
  - `--color-accent-green: #00A651` — verde (usato solo per dati ambientali/ESG positivi)
  - `--color-accent-orange: #F5A623` — arancio (accento su dati DEI, gender, comunità)

  > **Note colori:** il sito Var Group usa un'estetica dark con sfondo quasi nero e tipografia bianca per le sezioni hero, e bianco con testo scuro per le sezioni informative. Il blu brand (#1032cf / #2a4eef) è il colore dominante per gli elementi interattivi. Il verde (#00A651) non è nei CSS del sito ma è il colore istituzionale ESG del Gruppo — usarlo solo per le sezioni ambiente e sostenibilità.

- **Font display:** `Manrope` weight 200–700 _(font ufficiale del sito vargroup.com per tutti i titoli)_
- **Font body:** `Inter` weight 200–700 _(font ufficiale del sito vargroup.com per navigazione e testo)_
- **Font mono:** `IBM Plex Mono` (solo per annotazioni numeriche nei grafici, non presente sul sito ma adatto al contesto data journalism)

  > **Gerarchia tipografica reale del sito:**
  >
  > - H1: Manrope weight 300, 74px (hero) → nel nostro progetto: `clamp(3rem, 8vw, 5.5rem)`
  > - H2: Manrope weight 300, 46px → nel nostro progetto: `clamp(2rem, 5vw, 3.5rem)`
  > - H4: Manrope weight 400–500, 25px → nel nostro progetto: sezioni e label
  > - Body/Nav: Inter weight 400, 15–16px → nel nostro progetto: testo narrativo steps

---

## Pattern di layout — Full-width Stacked Scrollytelling

A differenza del layout affiancato (grafico a sinistra, testo a destra su colonna stretta), questo progetto usa sezioni **impilate verticalmente a larghezza piena**. Ogni sezione occupa almeno il 100% del viewport in altezza e tutta la larghezza disponibile.

### Come funziona ogni sezione scrolly

```
┌─────────────────────────────────────────────┐
│  INTESTAZIONE SEZIONE (titolo + numero)      │  ← posizione: static, entra in viewport
├─────────────────────────────────────────────┤
│                                             │
│   GRAFICO STICKY (60–70% larghezza)         │  ← position: sticky, top: 0, height: 100vh
│                                             │
│                         ┌───────────────┐   │
│                         │  STEP TEXT    │   │  ← colonna destra, 30–35% larghezza
│                         │  (scorre)     │   │
│                         └───────────────┘   │
│                                             │
│                         ┌───────────────┐   │
│                         │  STEP TEXT    │   │
│                         │  (scorre)     │   │
│                         └───────────────┘   │
│                                             │
└─────────────────────────────────────────────┘
```

Il grafico sticky cambia stato reattivamente in base all'`activeStep` corrente. Ogni sezione ha il proprio componente grafico indipendente. Le sezioni sono separate da transizioni di sfondo (cambio colore `--color-bg` per sezione, gestito con `IntersectionObserver` sulla sezione stessa).

### Struttura CSS base per ogni sezione scrolly

```css
.section-scrolly {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 340px;
  grid-template-rows: auto;
  min-height: 100vh;
  padding: 0;
}

.section-header {
  grid-column: 1 / -1;
  padding: 6rem 4rem 2rem;
}

.sticky-chart {
  position: sticky;
  top: 0;
  height: 100vh;
  align-self: start;
  padding: 2rem;
}

.steps-column {
  padding: 20vh 2rem 50vh;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.step {
  min-height: 80vh;
  display: flex;
  align-items: center;
}
```

---

## Struttura narrativa completa

### HERO — schermata di apertura

Nessun grafico. Occupazione: 100vh, layout centrato.

Contenuto:

- Kicker piccolo: "Bilancio di Sostenibilità 2025"
- Titolo H1 grande: "Crescere con responsabilità"
- Sottotitolo: "4.243 persone. 34 sedi nel mondo. Un percorso di crescita che non trascura nulla."
- Scroll indicator animato (freccia o linea pulsante)
- Sfondo: `--color-bg` con pattern SVG geometrico leggero (opacità 5-8%), niente immagini fotografiche

Componente: `src/components/Hero.svelte`

---

### SEZIONE 1 — Innovazione Digitale: il punto di partenza

**Ruolo narrativo:** apre la storia con i numeri più forti — scale e presenza globale — e introduce il modello di business. Tono energico e di apertura.

**Grafico sticky:** `InnovazioneChart.svelte`
Step 0–1: dot map Italia/mondo delle 34 sedi. Step 2–3: transizione a griglia delle 10 aree di servizio con SustainIT evidenziata.

**Dati da inserire in `src/lib/data/sedi.json`:**

```json
{
  "italia": [
    { "citta": "Empoli", "lat": 43.7199, "lon": 10.946, "hq": true },
    { "citta": "Milano", "lat": 45.4654, "lon": 9.1859 },
    { "citta": "Roma", "lat": 41.8955, "lon": 12.4823 },
    { "citta": "Torino", "lat": 45.0703, "lon": 7.6869 },
    { "citta": "Bologna", "lat": 44.4949, "lon": 11.3426 },
    { "citta": "Verona", "lat": 45.4384, "lon": 10.9916 },
    { "citta": "Padova", "lat": 45.4064, "lon": 11.8768 },
    { "citta": "Treviso", "lat": 45.6669, "lon": 12.243 },
    { "citta": "Genova", "lat": 44.4056, "lon": 8.9463 },
    { "citta": "Parma", "lat": 44.8015, "lon": 10.3279 },
    { "citta": "Bolzano", "lat": 46.4984, "lon": 11.3548 },
    { "citta": "Perugia", "lat": 43.1107, "lon": 12.3908 },
    { "citta": "Jesi", "lat": 43.5218, "lon": 13.2449 },
    { "citta": "Chieti", "lat": 42.3517, "lon": 14.1676 },
    { "citta": "Napoli", "lat": 40.8518, "lon": 14.2681 },
    { "citta": "Bari", "lat": 41.1171, "lon": 16.8719 },
    { "citta": "Catania", "lat": 37.5079, "lon": 15.083 },
    { "citta": "Cagliari", "lat": 39.2238, "lon": 9.1217 }
  ],
  "internazionale": [
    { "paese": "USA", "area": "Americas" },
    { "paese": "Messico", "area": "Americas" },
    { "paese": "Brasile", "area": "Americas" },
    { "paese": "India", "area": "Asia" },
    { "paese": "Thailandia", "area": "Asia" },
    { "paese": "Germania", "area": "Europa" },
    { "paese": "Francia", "area": "Europa" },
    { "paese": "Spagna", "area": "Europa" },
    { "paese": "Svizzera", "area": "Europa" },
    { "paese": "Austria", "area": "Europa" },
    { "paese": "Romania", "area": "Europa" },
    { "paese": "Benelux", "area": "Europa" },
    { "paese": "Albania", "area": "Europa" },
    { "paese": "Andorra", "area": "Europa" },
    { "paese": "Tunisia", "area": "Africa/Europa" }
  ],
  "totale_sedi": 34,
  "sedi_italia": 18,
  "sedi_estero": 16,
  "paesi": 15,
  "fatturato_mln": 875.7
}
```

**Dati da inserire in `src/lib/data/servizi.json`:**

```json
{
  "aree": [
    { "nome": "Multimedia & Workspaces", "sustainit": false },
    { "nome": "Business Applications", "sustainit": false },
    { "nome": "Industry Solutions", "sustainit": false },
    { "nome": "Cyber Security", "sustainit": false },
    { "nome": "Digital As a Service", "sustainit": false },
    { "nome": "Digital Evolution", "sustainit": false },
    { "nome": "Industrial Digital Twin", "sustainit": false },
    { "nome": "Sustainability Solutions", "sustainit": true },
    { "nome": "Data Science", "sustainit": false },
    { "nome": "Digital Experience", "sustainit": false }
  ],
  "sustainit_lancio": "maggio 2024",
  "sustainit_nota": "Business Unit che incrocia IT e governance ESG"
}
```

**Step narrativi:**

| Step | activeStep | Testo                                                                                                                                                                                                                                     | Stato grafico                                                                                |
| ---- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| 0    | 0          | "Nata oltre cinquant'anni fa a Empoli, Var Group è oggi una delle realtà tecnologiche più importanti d'Italia. **875,7 milioni di euro** di fatturato, **4.243 persone**, 18 sedi distribuite da Bolzano a Catania."                      | Mappa Italia con 18 punti città, HQ Empoli evidenziato                                       |
| 1    | 1          | "Ma il perimetro si è allargato oltre confine: **34 sedi in 15 paesi**, con una presenza consolidata in Europa e avamposti nelle Americhe e in Asia. Il 12% delle persone lavora già all'estero."                                         | Mappa si allarga al mondo, i punti internazionali entrano con animazione per area geografica |
| 2    | 2          | "L'offerta copre **10 aree di servizio**: dal cloud alla cybersecurity, dalle applicazioni di business all'intelligenza artificiale. Come Digital Integrator, Var Group accompagna le imprese in ogni fase dell'evoluzione digitale."     | Transizione a griglia 10 tile, tutti visibili con colore neutro                              |
| 3    | 3          | "A maggio 2024 è nata **SustainIT**, la Business Unit che porta l'expertise digitale di Var Group al servizio della governance ESG delle imprese. Un segnale che innovazione tecnologica e sostenibilità non sono più percorsi separati." | Il tile SustainIT si accende in --color-accent-green; gli altri restano blu attenuati        |

---

### SEZIONE 2 — Etica e Governance

**Ruolo narrativo:** racconta la struttura di governo di Var Group in modo visivo e progressivo. Tre organi, tre livelli di competenza, una sorpresa nella composizione di genere che emerge solo al terzo step. Tono istituzionale ma non freddo — il COS è un elemento narrativo forte.

**Grafico sticky:** `GovernanceChart.svelte`
Dot matrix a rivelazione progressiva: prima il CdA (9 dot), poi il Collegio Sindacale (5 dot), poi il COS (19 dot). Ogni dot è colorato per genere (blu = uomo, arancio = donna). Etichette con nome e ruolo al rollover. I tre gruppi appaiono in sequenza da sinistra verso destra o dall'alto verso il basso, mantenendo proporzioni coerenti.

**Dati da inserire in `src/lib/data/governance.json`:**

```json
{
  "cda": [
    { "nome": "Giovanni Moriani", "ruolo": "Presidente", "genere": "M", "eta": 68, "anzianita": 27, "esecutivo": false },
    { "nome": "Francesca Moriani", "ruolo": "Amministratrice Delegata", "genere": "F", "eta": 48, "anzianita": 11, "esecutivo": true },
    { "nome": "Alessandro Gencarelli", "ruolo": "Consigliere", "genere": "M", "eta": 54, "anzianita": 5, "esecutivo": true },
    { "nome": "Enrico Corradini", "ruolo": "Consigliere", "genere": "M", "eta": 43, "anzianita": 11, "esecutivo": true },
    { "nome": "Fabio Falaschi", "ruolo": "Consigliere", "genere": "M", "eta": 62, "anzianita": 27, "esecutivo": true },
    { "nome": "Fabio Luraghi", "ruolo": "Consigliere", "genere": "M", "eta": 59, "anzianita": 11, "esecutivo": false },
    { "nome": "Fabio Stanga", "ruolo": "Consigliere", "genere": "M", "eta": 63, "anzianita": 14, "esecutivo": true },
    { "nome": "Mirko Gatto", "ruolo": "Consigliere", "genere": "M", "eta": 49, "anzianita": 11, "esecutivo": true },
    { "nome": "Eugenio Capasso", "ruolo": "Consigliere", "genere": "M", "eta": 61, "anzianita": 1, "esecutivo": true }
  ],
  "collegio_sindacale": [
    { "nome": "Fabrizio Rossi", "ruolo": "Presidente", "genere": "M", "eta": 67 },
    { "nome": "Fabrizio Berti", "ruolo": "Sindaco", "genere": "M", "eta": 53 },
    { "nome": "Lucia Perfetti", "ruolo": "Sindaco", "genere": "F", "eta": 39 },
    { "nome": "Massimo Innocenti", "ruolo": "Sindaco supplente", "genere": "M", "eta": 63 },
    { "nome": "Marco Ferri", "ruolo": "Sindaco supplente", "genere": "M", "eta": 56 }
  ],
  "cos": [
    { "nome": "Alessandro Di Stefano", "genere": "M", "eta": 33 },
    { "nome": "Alessandro Gencarelli", "genere": "M", "eta": 54 },
    { "nome": "Antonella Collalto", "genere": "F", "eta": 58 },
    { "nome": "Cecilia Felici", "genere": "F", "eta": 46 },
    { "nome": "Elisabetta Corsico", "genere": "F", "eta": 39 },
    { "nome": "Enrico Corradini", "genere": "M", "eta": 43 },
    { "nome": "Eugenio Capasso", "genere": "M", "eta": 62 },
    { "nome": "Fabio Stanga", "genere": "M", "eta": 63 },
    { "nome": "Francesca Belgrano", "genere": "F", "eta": 52 },
    { "nome": "Francesca Moriani", "genere": "F", "eta": 48 },
    { "nome": "Francesca Tomassetti", "genere": "F", "eta": 55 },
    { "nome": "Laura Colombo", "genere": "F", "eta": 49 },
    { "nome": "Luciano Antonio Cavalera", "genere": "M", "eta": 43 },
    { "nome": "Maurizio Fraccari", "genere": "M", "eta": 63 },
    { "nome": "Nadia Cozzi", "genere": "F", "eta": 57 },
    { "nome": "Sara Lazzeretti", "genere": "F", "eta": 53 },
    { "nome": "Silvia Esposito", "genere": "F", "eta": 48 },
    { "nome": "Simona Pelli", "genere": "F", "eta": 58 },
    { "nome": "Vanessa Sabato", "genere": "F", "eta": 35 }
  ],
  "societa_controllate": 82,
  "casi_corruzione": 0
}
```

**Step narrativi:**

| Step | activeStep | Testo | Stato grafico |
|------|-----------|-------|---------------|
| 0 | 0 | "Var Group è governata da un **Consiglio di Amministrazione di 9 membri**, con un'anzianità media di 14 anni. La guida operativa è affidata a **Francesca Moriani**, CEO, in Var Group dall'infanzia e da 11 anni in ruolo esecutivo. L'azienda controlla **82 società** e ha registrato **zero casi di corruzione** nel 2025." | Dot matrix 3×3 del CdA, colorati per genere (8 blu, 1 arancio per Francesca Moriani). Etichette visibili. |
| 1 | 1 | "Il **Collegio Sindacale** — 5 membri presieduti da Fabrizio Rossi — esercita la vigilanza sulla gestione societaria e garantisce la correttezza delle operazioni. La revisione contabile è affidata a KPMG S.p.A." | Il Collegio Sindacale appare accanto al CdA: 5 dot, 4 blu e 1 arancio (Lucia Perfetti). |
| 2 | 2 | "A febbraio 2025 nasce il **Comitato Operativo di Sostenibilità (COS)**: 19 persone che coprono tutte le funzioni strategiche del Gruppo — HR, Legal, Marketing, DEI, Operations. Il dato che emerge visivamente: **12 donne su 19 membri**. La governance della sostenibilità, in Var Group, ha una leadership prevalentemente femminile." | Il COS entra in scena: 19 dot, 12 arancio e 7 blu. Il contrasto con la composizione del CdA è immediato e intenzionale. |

---

### SEZIONE 3 — L'impronta ambientale

**Ruolo narrativo:** il capitolo più "onesto" del racconto. I dati mostrano un paradosso reale: elettricità quasi tutta rinnovabile, ma la flotta auto pesa enormemente. Funziona perché è credibile, non autocelebrativo.

**Grafico sticky:** `EnergyChart.svelte`
Inizia come donut/arc chart del mix energetico. Poi si scompone nelle fonti di emissione Scope 1+2.

**Dati da inserire in `src/lib/data/ambiente.json`:**

```json
{
  "energia": {
    "totale_mwh": 19869.3,
    "fossili_mwh": 13826.8,
    "fossili_pct": 69.6,
    "rinnovabili_pct": 30.4,
    "elettricita_rinnovabili_pct": 94,
    "fonti_fossili_dettaglio": [
      { "fonte": "Carburanti flotta auto (gasolio, benzina, GPL)", "mwh": 12306.2, "pct_totale": 62 },
      { "fonte": "Gas naturale riscaldamento", "mwh": 1124.8, "pct_totale": 5.7 },
      { "fonte": "Elettricità da fonti fossili", "mwh": 395.8, "pct_totale": 2 }
    ]
  },
  "emissioni_scope1_2": {
    "flotta_auto_pct": 60.6,
    "elettricita_sedi_pct": 35.4,
    "gas_naturale_pct": 4.0
  },
  "flotta_auto_n": 850,
  "convention_2024": {
    "evento": "Convention Var Group 2024",
    "carbon_neutral": true,
    "nota": "Prima convention con calcolo e compensazione dell'impronta carbonica per partecipante"
  },
  "piano_transizione": false
}
```

**Step narrativi:**

| Step | activeStep | Testo | Stato grafico |
|------|-----------|-------|---------------|
| 0 | 0 | "Nel 2025, Var Group ha consumato **19.869 MWh di energia**. Il 69,6% proviene da fonti fossili — una quota significativa per un'azienda di servizi digitali. Da dove viene?" | Donut chart del mix totale fossile/rinnovabile |
| 1 | 1 | "La risposta è la flotta auto: **oltre 850 veicoli** che raggiungono capillarmente la clientela su tutto il territorio nazionale. I carburanti da petrolio pesano da soli il **62% dei consumi totali** di energia." | Il donut esplode e mostra le singole voci; la fetta carburanti flotta si evidenzia e ingrandisce |
| 2 | 2 | "Il paradosso: guardando solo all'elettricità, il quadro è molto più positivo. Il **94% dell'energia elettrica consumata proviene da fonti rinnovabili** — grazie agli impianti fotovoltaici del Gruppo Sesa e a forniture certificate. La sfida è altrove." | Transizione: arco separato per sola elettricità, con il 94% evidenziato in --color-accent-green |
| 3 | 3 | "Per le emissioni Scope 1+2, la flotta pesa per il **60,6%**, l'elettricità delle sedi per il 35,4%, il gas per il 4%. Var Group non ha ancora un piano di transizione climatica formalizzato — ma nel 2024 ha organizzato la prima Convention carbon-neutral della sua storia, con calcolo dell'impronta per ogni partecipante." | Donut o barchart delle emissioni per origine; nota editoriale onesta sull'assenza del piano di transizione |

---

### SEZIONE 4 — Le persone crescono

**Ruolo narrativo:** il cuore umano del racconto. Due grafici in sequenza: prima la crescita e la composizione dell'organico, poi la parità di genere con i suoi dati reali — positivi e ancora aperti. Tono energico nella prima parte, onesto nella seconda.

---

#### 4A — Organico, crescita e formazione

**Grafico sticky:** `PeopleChart.svelte`
Dot plot / beeswarm: ogni punto è una persona (campione aggregato rappresentativo). I punti si riorganizzano per area geografica, poi per fascia d'età. Al quarto step, transizione a horizontal bar chart delle tipologie di formazione.

**Dati da inserire in `src/lib/data/persone.json`:**

```json
{
  "totale_2025": 4243,
  "totale_2024": 3852,
  "variazione_pct": 10.4,
  "nuove_assunzioni_2025": 596,
  "geografia": [
    { "area": "Nord Italia", "n": 2456, "pct": 57.9 },
    { "area": "Centro Italia", "n": 1133, "pct": 26.7 },
    { "area": "Estero", "n": 509, "pct": 12.0 },
    { "area": "Sud Italia", "n": 127, "pct": 3.0 }
  ],
  "eta": [
    { "fascia": "≤30", "n_2024": 916, "n_2025": 939 },
    { "fascia": "31–50", "n_2024": 1871, "n_2025": 2043 },
    { "fascia": ">50", "n_2024": 1033, "n_2025": 1210 }
  ],
  "assunzioni_per_eta_pct": [
    { "fascia": "<30", "pct": 46 },
    { "fascia": "30–50", "pct": 42 },
    { "fascia": ">50", "pct": 12 }
  ],
  "formazione": {
    "ore_totali_2025": 73183,
    "ore_totali_2024": 63233,
    "media_ore_per_persona_2025": 17.5,
    "media_ore_per_persona_2024": 12.7,
    "media_uomini_2025": 19.1,
    "media_donne_2025": 13.5,
    "tipologie": [
      { "tipo": "Formazione tecnica", "pct": 39 },
      { "tipo": "Base/trasversale", "pct": 34 },
      { "tipo": "Sicurezza e compliance", "pct": 21 },
      { "tipo": "Diversità, Equità, Inclusione", "pct": 6 }
    ]
  },
  "turnover": {
    "uscita_pct_2025": 8.02,
    "uscita_pct_2024": 8.28,
    "entrata_pct_2025": 14.22,
    "entrata_pct_2024": 20.15
  }
}
```

**Step narrativi — 4A:**

| Step | activeStep | Testo | Stato grafico |
|------|-----------|-------|---------------|
| 0 | 0 | "Al 30 aprile 2025, Var Group conta **4.243 persone**. Un anno fa erano 3.852. In dodici mesi, l'organico è cresciuto del **10,4%**." | Counter animato del numero totale, poi dot plot grezzo (punti piccoli, disposizione casuale) |
| 1 | 1 | "La maggior parte lavora in **Nord Italia** (58%), seguita dal Centro (27%). Il 12% opera all'estero — in Europa, USA, Messico, Brasile, India e Thailandia — una quota in crescita che racconta l'espansione internazionale." | Dot plot raggruppato per area geografica, con colori distinti per area e label |
| 2 | 2 | "Il 49% ha tra i 30 e i 50 anni. Ma la vera notizia è nelle nuove assunzioni: il **46% dei 596 ingressi del 2025 riguarda under 30**. Un segnale di investimento sui talenti giovani." | I punti si ricolorano per fascia d'età; quelli delle nuove assunzioni under 30 evidenziati |
| 3 | 3 | "Nel 2025 ogni persona ha ricevuto in media **17,5 ore di formazione** — contro le 12,7 del 2024. In totale, 73.183 ore erogate a 3.868 partecipanti. La formazione tecnica è la voce principale (39%)." | Transizione verso horizontal bar chart delle tipologie di formazione |

---

#### 4B — Parità di genere

**Grafico sticky:** `GenderChart.svelte`
Inizia come waffle chart 71/29. Si trasforma in stacked bar per livello gerarchico. Poi mostra il gender pay gap come visual comparison.

**Dati da inserire in `src/lib/data/genere.json`:**

```json
{
  "composizione": { "uomini_pct": 71, "donne_pct": 29 },
  "per_inquadramento": [
    { "livello": "Dirigenti", "uomini": 31, "donne": 4, "totale": 35 },
    { "livello": "Quadri", "uomini": 355, "donne": 81, "totale": 436 },
    { "livello": "Impiegati", "uomini": 2569, "donne": 1136, "totale": 3705 },
    { "livello": "Operai", "uomini": 12, "donne": 4, "totale": 16 }
  ],
  "gender_pay_gap": {
    "italia_pct": 12,
    "estero_pct": 14,
    "nota": "Differenza percentuale tra retribuzione media femminile e maschile, espressa come % del livello maschile"
  },
  "community_dei_anno_fondazione": 2023,
  "formazione_dei_ore_pct": 6
}
```

**Step narrativi — 4B:**

| Step | activeStep | Testo | Stato grafico |
|------|-----------|-------|---------------|
| 0 | 0 | "Il **29% delle persone in Var Group è donna**. Un dato che riflette lo storico squilibrio di genere nel settore ICT — e che l'azienda riconosce come punto di partenza, non di arrivo. Nel COS della sostenibilità, invece, le donne sono già maggioranza." | Waffle chart 71/29, semplice e ad alto contrasto, colori --color-accent-orange (donna) e --color-brand-blue (uomo) |
| 1 | 1 | "Guardando ai livelli di inquadramento, il divario si accentua salendo. Tra i dirigenti, le donne sono **4 su 35** (11%). Tra i quadri, **81 su 436** (19%). È alla guida esecutiva che il cammino è ancora lungo." | Stacked bar per livello gerarchico, ordinate da dirigenti a operai. Barre donne in --color-accent-orange |
| 2 | 2 | "Il **gender pay gap medio è del 12%** in Italia: per ogni euro guadagnato da un uomo, una donna guadagna mediamente 88 centesimi. Un dato che Var Group include nel Piano Strategico di Sostenibilità 2026–2028 come priorità da affrontare." | Visual diretto: due rettangoli proporzionali (uomo = 100%, donna = 88%), differenza evidenziata con annotazione. Niente torte, niente barre classiche. |

---

### SEZIONE 5 — Il valore per le comunità

**Ruolo narrativo:** sezione più narrativa e "calda", meno grafico-intensiva. Può usare elementi più editoriali (grandi numeri tipografici, icone, testo più lungo). Chiude la storia con un senso di impegno verso l'esterno.

**Grafico sticky:** `CommunityChart.svelte`
Bubble chart / layout a cerchi: ogni categoria è un cerchio la cui **area è proporzionale al numero di iniziative** (N). I cerchi sono disposti in modo organico (non in griglia), colorati per tipo con `--color-accent-orange` come colore dominante. Al rollover mostra il nome della categoria, il numero di iniziative e un esempio. Nei passaggi successivi, i cerchi si evidenziano o attenuano secondo la categoria in focus.

**Dati da inserire in `src/lib/data/comunita.json`:**

```json
{
  "iniziative_totali": 30,
  "paesi": ["Italia", "Spagna", "Svizzera"],
  "valore_economico_eur": 450000,
  "categorie": [
    {
      "tipo": "Benessere sociale e salute",
      "esempi": [
        "ASEOP",
        "Istituto Oncologico Marchigiano",
        "AIL",
        "Croce Rossa Italiana",
        "Vidas – Casa Sollievo Bimbi"
      ],
      "n": 8
    },
    {
      "tipo": "Inclusione e formazione digitale",
      "esempi": [
        "T-Station Academy",
        "Fondazione ASPHI Onlus",
        "Olimpiadi di Informatica",
        "Hackathon Var Group 2024"
      ],
      "n": 7
    },
    {
      "tipo": "Educazione e giovani",
      "esempi": [
        "Aid4Mada",
        "Aleimar",
        "Associazione Alessia",
        "TEDx Ancona",
        "Campo estivo Protezione Civile"
      ],
      "n": 8
    },
    {
      "tipo": "Ambiente e territorio",
      "esempi": [
        "WOWnature (albero per ogni nuovo collega)",
        "Treedom",
        "Piantumazione in Romania"
      ],
      "n": 4
    },
    {
      "tipo": "Sport e cultura",
      "esempi": [
        "Lube Volley (Exclusive Innovation Partner)",
        "Var Digital Art",
        "SOLMI – Ship of Fools a Venezia"
      ],
      "n": 3
    }
  ],
  "hackathon_2024": {
    "partecipanti_giovani": 80,
    "aziende_coinvolte": 14,
    "durata_ore": 32
  },
  "alberi_piantati_note": "Un albero per ogni nuova persona che entra in Var Group, in Val di Fiemme"
}
```

**Step narrativi:**

| Step | activeStep | Testo                                                                                                                                                                                                                                                               | Stato grafico                                                                        |
| ---- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| 0    | 0          | "**Oltre 30 iniziative** in Italia, Spagna e Svizzera. Più di **450.000 euro** investiti in comunità, cultura, sport e formazione. Il bilancio di sostenibilità non finisce dentro l'azienda."                                                                      | Numero grande animato (450k€), poi layout iconografico delle categorie               |
| 1    | 1          | "La parte più consistente riguarda **benessere sociale e salute**: dall'oncologia pediatrica (ASEOP) alle cure per bambini con gravi malattie (Vidas), dalla Croce Rossa all'AIL. Donazioni concrete, non solo comunicazione."                                      | Evidenzia la categoria benessere sociale, le altre si attenuano                      |
| 2    | 2          | "Un impegno specifico sulla **formazione digitale inclusiva**: T-Station Academy per persone con disabilità, collaborazione con Fondazione ASPHI Onlus per rendere i processi aziendali più accessibili, sponsorizzazione delle Olimpiadi italiane di Informatica." | Evidenzia la categoria inclusione e formazione digitale                              |
| 3    | 3          | "Nell'ottobre 2024, **80 giovani talenti** hanno partecipato all'Hackathon Var Group in 32 ore di sviluppo intensivo, affiancati da 14 grandi aziende. E per ogni nuova persona che entra in Var Group, viene piantato un albero in Val di Fiemme."                 | Tutti i punti/icone si riattivano, con evidenza sull'Hackathon e sul progetto alberi |

---

### OUTRO — La strada davanti

Sezione statica, nessun grafico sticky. Layout a colonna centrata, tipografia grande.

Contenuto:

- Titolo: "7 obiettivi, un percorso condiviso"
- Sottotitolo editoriale breve (2-3 righe): "Il Piano Strategico di Sostenibilità 2026–2028 è in costruzione. I temi: innovazione sostenibile, benessere delle persone, riduzione della carbon footprint, filiera responsabile, governance etica."
- Griglia dei 7 SDG Priority Goals (icone + numero + nome breve): Goal 5, 8, 9, 10, 13, 16, 17
- Footer: fonte dati, anno, credit

---

## File dati da creare in `src/lib/data/`

Al bootstrap del progetto, Claude deve creare i seguenti file JSON prima di scrivere qualunque componente grafico:

| File              | Contenuto                                                                                      |
| ----------------- | ---------------------------------------------------------------------------------------------- |
| `sedi.json`       | 18 sedi italiane con lat/lon + 15 paesi esteri + totali (struttura completa in Sezione 1)      |
| `servizi.json`    | 10 aree di servizio con flag `sustainit` (struttura completa in Sezione 1)                     |
| `governance.json` | CdA (9), Collegio Sindacale (5), COS (19), certificazioni (struttura completa in Sezione 2)    |
| `ambiente.json`   | Energia, emissioni, flotta, convention (struttura completa in Sezione 3)                       |
| `persone.json`    | Organico, geografia, età, formazione, turnover (struttura completa in Sezione 4A)              |
| `genere.json`     | Composizione, inquadramento, pay gap, community DEI (struttura completa in Sezione 4B)         |
| `comunita.json`   | Iniziative, categorie con N, hackathon (struttura completa in Sezione 5)                       |

**Regola importante:** i dati sono già strutturati in questo file. Claude non deve inventare valori — deve copiare esattamente le strutture JSON definite nelle sezioni sopra e usarle nei componenti.

---

## Componenti da creare

```
src/
├── components/
│   ├── charts/
│   │   ├── InnovazioneChart.svelte   ← sezione 1 (mappa sedi + griglia servizi)
│   │   ├── GovernanceChart.svelte    ← sezione 2 (CdA + Collegio Sindacale + COS)
│   │   ├── EnergyChart.svelte        ← sezione 3 (mix energetico + emissioni)
│   │   ├── PeopleChart.svelte        ← sezione 4A (organico, geo, età, formazione)
│   │   ├── GenderChart.svelte        ← sezione 4B (waffle, stacked bar, pay gap)
│   │   └── CommunityChart.svelte     ← sezione 5 (bubble chart iniziative)
│   ├── sections/
│   │   ├── Hero.svelte               ← apertura
│   │   ├── ScrollySection.svelte     ← wrapper riutilizzabile per ogni sezione scrolly
│   │   └── Outro.svelte              ← chiusura
│   ├── helpers/
│   │   └── Scrolly.svelte            ← già nel template, non ricreare
│   └── ui/
│       ├── SectionHeader.svelte      ← titolo + numero sezione
│       ├── StepCard.svelte           ← card del testo scrolly
│       └── StatCallout.svelte        ← numero grande con etichetta
└── lib/
    ├── data/                         ← tutti i JSON sopra
    └── styles/
        ├── tokens.css                ← variabili CSS (vedi sotto)
        └── global.css
```

**`ScrollySection.svelte` è un wrapper riutilizzabile** che accetta come props:

- `chartComponent` — il componente grafico da montare come sticky
- `steps` — array di oggetti `{ text, subtext? }`
- `sectionNumber` — numero progressivo (01, 02, ecc.)
- `sectionTitle` — titolo della sezione
- `bind:activeStep`

---

## BOOTSTRAP — Istruzioni per progetto nuovo (cartella vuota)

> Se nella cartella non esiste ancora un `package.json`, segui questi passi nell'ordine esatto.
> Se il progetto esiste già, salta questa sezione.

### Passo 1 — Inizializza SvelteKit

```bash
npx sv create . --template minimal --no-add-ons
```

Quando chiede: TypeScript → No, ESLint → No, Prettier → Sì, Playwright → No.

### Passo 2 — Installa le dipendenze del progetto

```bash
npm install d3 layerchart svelteplot
npm install --save-dev @sveltejs/adapter-static svelte-preprocess autoprefixer postcss
```

### Passo 3 — Aggiorna svelte.config.js

Sostituisci il contenuto con:

```js
import adapterStatic from "@sveltejs/adapter-static";
import { sveltePreprocess } from "svelte-preprocess";
import autoprefixer from "autoprefixer";

const preprocess = sveltePreprocess({
  postcss: { plugins: [autoprefixer] },
});

export default {
  compilerOptions: { runes: true },
  preprocess,
  kit: {
    adapter: adapterStatic({ strict: false }),
    paths: {
      base: "/vargroup-sostenibilita", // ← nome esatto della repo GitHub
    },
    alias: {
      $components: "./src/components",
      $data: "./src/lib/data",
      $styles: "./src/lib/styles",
      $utils: "./src/lib/utils",
    },
  },
};
```

> **Nota `paths.base`:** è obbligatorio per GitHub Pages con repo non root. Tutti i path di asset e link interni devono usare `base` da `$app/paths`.

### Passo 4 — Aggiorna vite.config.js

```js
import { defineConfig } from "vite";
import { sveltekit } from "@sveltejs/kit/vite";

export default defineConfig({
  plugins: [sveltekit()],
  server: { open: true, port: 5173 },
});
```

### Passo 5 — Crea src/routes/+layout.js (necessario per adapter-static)

```js
export const prerender = true;
```

### Passo 6 — Crea la struttura delle cartelle

```bash
mkdir -p src/components/charts src/components/sections src/components/helpers src/components/ui
mkdir -p src/lib/data src/lib/styles src/lib/utils
mkdir -p static/data
```

### Passo 7 — Crea src/lib/styles/tokens.css

```css
:root {
  /* ── Colori estratti da vargroup.com (marzo 2026) ── */

  /* Sfondo e superfici — estetica dark del sito ufficiale */
  --color-bg: #0d0d10;
  --color-surface: #141418;
  --color-surface-2: #1c1c22;
  --color-border: #2a2a35;

  /* Testo */
  --color-text: #ffffff;
  --color-text-muted: #767676;
  --color-text-faint: #505050;
  --color-text-dark: #141414;

  /* Blu brand Var Group — colore dominante del sito */
  --color-brand-blue: #1032cf;
  --color-brand-blue-mid: #2a4eef;
  --color-brand-blue-light: #1268fb;

  /* Accenti per dati ESG (non presenti nel sito, ma coerenti con il contesto) */
  --color-accent-green: #00a651; /* ambiente, sostenibilità */
  --color-accent-orange: #f5a623; /* DEI, genere, comunità */
  --color-accent-red: #e05c5c; /* warning, gap negativi */

  /* Superficie chiara (per card su sfondo bianco, se necessario) */
  --color-surface-light: #f4f4f4;

  /* ── Font — estratti da vargroup.com (marzo 2026) ── */
  /* Titoli: Manrope (Google Fonts, weights 200–700) */
  --font-display: "Manrope", system-ui, sans-serif;
  /* Body/UI: Inter (Google Fonts, weights 200–700) */
  --font-body: "Inter", system-ui, sans-serif;
  /* Dati numerici nei grafici */
  --font-mono: "IBM Plex Mono", monospace;

  /* ── Layout scrollytelling full-width ── */
  --step-width: 340px;
  --step-height: 80vh;
  --sticky-top: 0px;
  --section-gap: 0px;

  /* ── Z-index ── */
  --z-sticky: 10;
  --z-overlay: 20;
  --z-tooltip: 30;
}
```

### Passo 8 — Crea src/lib/styles/global.css

```css
@import "./tokens.css";

/* Font ufficiali Var Group — Manrope (display) + Inter (body) */
@import url("https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700&family=Inter:wght@200;300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap");

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
  scroll-behavior: smooth;
}

body {
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-body);
  line-height: 1.65;
  -webkit-font-smoothing: antialiased;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: var(--font-display);
  line-height: 1.15;
  letter-spacing: -0.03em;
  font-weight: 300; /* Var Group usa weight leggero sui titoli */
}

h4,
h5,
h6 {
  font-weight: 400;
}

strong {
  font-weight: 600;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

### Passo 9 — Copia il componente Scrolly.svelte

Il componente `Scrolly.svelte` è già definito nel template base. Crearlo in `src/components/helpers/Scrolly.svelte` con il codice standard del template (IntersectionObserver, bind:value, ecc.).

### Passo 10 — Crea i file JSON dati

Copiare esattamente le strutture JSON definite nella sezione "Struttura narrativa" di questo file in `src/lib/data/`. Un file per sezione:

- `sedi.json` — 34 sedi (18 IT + 16 estero) con lat/lon per le sedi italiane
- `servizi.json` — 10 aree di servizio con flag `sustainit`
- `governance.json` — CdA (9), Collegio Sindacale (5), COS (19), dati governance
- `ambiente.json` — energia, emissioni, flotta, convention
- `persone.json` — organico, geografia, età, formazione, turnover
- `genere.json` — composizione, inquadramento, pay gap, community DEI
- `comunita.json` — iniziative, categorie con N, hackathon

### Passo 11 — Crea il GitHub Actions workflow per il deploy

Creare `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: build
      - uses: actions/deploy-pages@v4
```

Nelle impostazioni della repo GitHub: Settings → Pages → Source → **GitHub Actions**.

### Passo 12 — Avvia il server di sviluppo

```bash
npm run dev
```

Il browser si apre su `http://localhost:5173` con lo scheletro funzionante.

---

## Stack tecnico di riferimento

| Cosa                            | Strumento                                      |
| ------------------------------- | ---------------------------------------------- |
| Framework                       | SvelteKit 2+ con Svelte 5 (runes)              |
| Build                           | Vite 6+                                        |
| Grafici principali              | LayerChart + D3 v7                             |
| Grafici esplorativi/alternativi | Svelteplot                                     |
| Scrollytelling                  | `Scrolly.svelte` custom (IntersectionObserver) |
| CSS                             | Custom properties, nessun framework CSS        |
| Deploy                          | `@sveltejs/adapter-static` → GitHub Pages      |

---

## Convenzioni di codice

### Svelte 5 — usa sempre le runes

```svelte
<script>
  // CORRETTO — Svelte 5
  let { data, activeStep } = $props();
  let visible = $state(false);
  let total = $derived(data.length);
  $effect(() => { console.log('step:', activeStep); });

  // SBAGLIATO — vecchia API Svelte 4, non usare mai
  // export let data;
  // $: total = data.length;
  // onMount(() => { ... });
</script>
```

### Pattern grafico base con LayerChart

```svelte
<script>
  import { LayerCake, Svg } from 'layerchart';
  let { data, activeStep } = $props();
</script>

<div class="chart-wrapper" aria-label="[descrizione per screen reader]">
  <LayerCake {data} x="anno" y="valore">
    <Svg>
      <!-- layer qui -->
    </Svg>
  </LayerCake>
</div>

<style>
  .chart-wrapper { width: 100%; height: 100%; }
</style>
```

### Importare JSON con Vite

```js
// Metodo diretto — Vite gestisce i JSON nativamente
import persone from "$data/persone.json";
// oppure
import ambiente from "../lib/data/ambiente.json";
```

Non usare `fetch()` a runtime per i file dati — importarli staticamente.

### Animazioni D3 sullo step change

```svelte
<script>
  import * as d3 from 'd3';

  let { activeStep } = $props();
  let svgEl;

  $effect(() => {
    if (!svgEl) return;
    // interrompi animazioni precedenti prima di avviarne nuove
    d3.select(svgEl).selectAll('*').interrupt();

    // poi avvia la nuova transizione basata su activeStep
    if (activeStep === 0) drawStep0();
    if (activeStep === 1) drawStep1();
    // ecc.
  });
</script>
```

---

## Performance e accessibilità

- Animazioni solo su `transform` e `opacity`, mai su `width`/`height`/`top`/`left`
- Ogni grafico deve avere `aria-label` con descrizione testuale del contenuto
- Contrasto minimo WCAG AA: 4.5:1 su testo normale, 3:1 su testo grande
- Usare `--color-primary: #00A651` su sfondo `--color-bg: #080d0a` → verifica contrasto prima di usare per testo corpo
- Transizioni D3: interrompere sempre con `.interrupt()` quando `activeStep` cambia mid-animation
- `will-change: transform` solo su `.sticky-chart`, non su altri elementi
- Il font Playfair Display corsivo si usa solo per citazioni o elementi decorativi, non per testo lungo

---

## Responsive design — regole per mobile

Il prodotto deve essere fruibile su smartphone. Il pattern scrollytelling sticky non funziona bene su mobile: il grafico sticky occuperebbe troppo spazio e il testo sarebbe inaccessibile. Su mobile si adotta un **layout lineare a colonna singola**: prima il grafico, poi il testo, senza sticky.

### Breakpoint unico

```css
/* Tutto ciò che è ≤768px è "mobile" */
@media (max-width: 768px) { ... }
```

### Comportamento per sezione su mobile

```css
@media (max-width: 768px) {
  .section-scrolly {
    display: block; /* niente grid, tutto in colonna */
  }

  .sticky-chart {
    position: relative; /* rimuove sticky */
    top: auto;
    height: 60vw; /* altezza proporzionale allo schermo */
    min-height: 260px;
    max-height: 380px;
    width: 100%;
  }

  .steps-column {
    padding: 2rem 1.25rem;
  }

  .step {
    min-height: auto; /* niente 80vh su mobile */
    padding: 1.5rem 0;
    opacity: 1; /* tutti gli step visibili, niente fade */
    border-bottom: 1px solid var(--color-border);
  }

  .step:last-child {
    border-bottom: none;
  }

  .section-header {
    padding: 3rem 1.25rem 1.5rem;
  }
}
```

### Istruzione critica per Claude in Code: comportamento mobile degli step

Su mobile, il componente `Scrolly.svelte` continua a funzionare ma l'`activeStep` non guida più un grafico sticky. Il grafico viene mostrato **una volta sola, fisso**, nella sua versione "finale" o più rappresentativa (di norma l'ultimo stato). I blocchi di testo si leggono tutti in sequenza.

Implementazione suggerita nel componente `ScrollySection.svelte`:

```svelte
<script>
  import { onMount } from 'svelte';  // eccezione: onMount è ok per rilevare viewport

  let isMobile = $state(false);

  // Rileva mobile una volta al mount
  onMount(() => {
    isMobile = window.innerWidth <= 768;
  });

  // Su mobile, mostra sempre l'ultimo step del grafico
  let displayStep = $derived(isMobile ? steps.length - 1 : activeStep);
</script>
```

### Tipografia mobile

```css
@media (max-width: 768px) {
  h1 {
    font-size: clamp(2rem, 10vw, 3rem);
  }
  h2 {
    font-size: clamp(1.5rem, 7vw, 2.25rem);
  }
  .step-text {
    font-size: 0.95rem;
  }
  .stat-number {
    font-size: clamp(2.5rem, 12vw, 4rem);
  }
}
```

### Hero su mobile

La hero section su mobile riduce il padding e aumenta il contrasto del testo (il sito Var Group usa testo bianco su sfondo scuro/gradient, che funziona bene su mobile):

```css
@media (max-width: 768px) {
  .hero {
    padding: 5rem 1.25rem 3rem;
    min-height: 100svh; /* svh invece di vh su mobile per evitare barra browser */
  }
  .hero h1 {
    font-size: clamp(2.2rem, 10vw, 3rem);
  }
  .hero .deck {
    font-size: 1rem;
  }
}
```

### Touch e performance mobile

- Usare `min-height: 100svh` invece di `100vh` sulle sezioni hero (su mobile la barra del browser toglie spazio)
- Evitare animazioni D3 complesse su mobile: rilevare `isMobile` e usare transizioni CSS semplificate o nessuna transizione
- I grafici su mobile devono avere `viewBox` SVG corretto per adattarsi in larghezza senza overflow
- Usare `touch-action: pan-y` sul container scrolly per non bloccare lo scroll touch
- Non usare `hover` states come unico feedback — ogni elemento interattivo deve avere stato `active` (`:active` CSS) per il touch

---

## Note operative per Claude in Code

- **Svelte 5 sempre** — segnala e correggi qualsiasi uso della vecchia API ($:, export let, onMount salvo eccezioni dichiarate)
- **Non inventare dati** — tutti i valori numerici sono definiti in questo file e nei JSON; non aggiungere numeri non presenti
- **Componenti piccoli e componibili** — preferire 3 componenti semplici a 1 monolitico
- **CSS scoped nel componente** — usare `<style>` nel `.svelte`, non classi utility globali
- **`ScrollySection.svelte` è il wrapper standard** — ogni sezione narrativa deve usarlo, non ricreare il pattern sticky/steps da zero
- **`paths.base` è obbligatorio** — tutti gli `href` e i path di import asset devono rispettarlo; usare `import { base } from '$app/paths'`
- **Font:** usare sempre `var(--font-display)` (Manrope) per titoli e `var(--font-body)` (Inter) per testo — mai hardcodare nomi di font nel CSS dei componenti
- **Colori:** usare sempre le custom properties — mai scrivere hex direttamente nei componenti. Il colore interattivo principale è `var(--color-brand-blue)` (#1032cf). Per dati ambientali usare `var(--color-accent-green)`, per DEI/genere `var(--color-accent-orange)`
- **Mobile first nei grafici:** ogni grafico SVG deve avere `viewBox` impostato e `width="100%"` — mai larghezze fisse in pixel. Testare sempre il comportamento a 375px di larghezza
- **`@media (max-width: 768px)`** deve essere presente in ogni componente che usa layout a griglia o position sticky
- Se nella cartella esiste già un `package.json`, la sezione BOOTSTRAP va ignorata completamente
- Costruire prima i JSON dati, poi i componenti grafici, poi assemblare le sezioni in `+page.svelte`
- Per ogni grafico, prima di scrivere codice: confermare struttura dati attesa, range assi, colori da usare
