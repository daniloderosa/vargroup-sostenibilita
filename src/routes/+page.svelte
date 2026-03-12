<script>
  import Hero           from '$components/sections/Hero.svelte';
  import ScrollySection from '$components/sections/ScrollySection.svelte';
  import Outro          from '$components/sections/Outro.svelte';
  import InnovazioneChart from '$components/charts/InnovazioneChart.svelte';
  import GovernanceChart  from '$components/charts/GovernanceChart.svelte';
  import EnergyChart      from '$components/charts/EnergyChart.svelte';
  import PeopleChart      from '$components/charts/PeopleChart.svelte';
  import GenderChart      from '$components/charts/GenderChart.svelte';
  import CommunityChart   from '$components/charts/CommunityChart.svelte';

  // ── SEZIONE 1 — Innovazione Digitale ────────────────────────────────────
  const innovazioneSteps = [
    {
      text: 'Nata oltre cinquant\'anni fa a Empoli, Var Group è oggi una delle realtà tecnologiche più importanti d\'Italia. <strong>875,7 milioni di euro</strong> di fatturato, <strong>4.243 persone</strong>, 18 sedi distribuite da Bolzano a Catania.',
    },
    {
      text: 'Ma il perimetro si è allargato oltre confine: <strong>34 sedi in 15 paesi</strong>, con una presenza consolidata in Europa e avamposti nelle Americhe e in Asia. Il 12% delle persone lavora già all\'estero.',
    },
    {
      text: 'L\'offerta copre <strong>10 aree di servizio</strong>: dal cloud alla cybersecurity, dalle applicazioni di business all\'intelligenza artificiale. Come Digital Integrator, Var Group accompagna le imprese in ogni fase dell\'evoluzione digitale.',
    },
    {
      text: 'A maggio 2024 è nata <strong>SustainIT</strong>, la Business Unit che porta l\'expertise digitale di Var Group al servizio della governance ESG delle imprese. Un segnale che innovazione tecnologica e sostenibilità non sono più percorsi separati.',
    },
  ];

  // ── SEZIONE 2 — Governance ed Etica ─────────────────────────────────────
  const governanceSteps = [
    {
      text: '<strong>82 società controllate, zero casi di corruzione</strong> registrati nel 2025. Il Consiglio di Amministrazione è composto da <strong>9 membri</strong>. Un solo membro è donna: Francesca Moriani, Amministratrice Delegata — la figura con più potere esecutivo nell\'intera organizzazione.',
    },
    {
      text: 'Il <strong>Collegio Sindacale</strong> è composto da 5 membri ed è l\'organo di controllo indipendente. Vigila sulla correttezza della gestione e sull\'adeguatezza del sistema di controllo interno.',
    },
    {
      text: 'Il <strong>Comitato di Sostenibilità (COS)</strong> riunisce 19 responsabili aziendali — <strong>12 donne e 7 uomini</strong>. È l\'organo che guida l\'integrazione degli obiettivi ESG nelle strategie operative di Var Group.',
    },
  ];

  // ── SEZIONE 3 — L'impronta ambientale ────────────────────────────────────
  const ambienteSteps = [
    {
      text: 'Nel 2025, Var Group ha consumato <strong>19.869 MWh di energia</strong>. Il 69,6% proviene da fonti fossili — una quota significativa per un\'azienda di servizi digitali. Da dove viene?',
    },
    {
      text: 'La risposta è la flotta auto: <strong>oltre 850 veicoli</strong> che raggiungono capillarmente la clientela su tutto il territorio nazionale. I carburanti da petrolio pesano da soli il <strong>62% dei consumi totali</strong> di energia.',
    },
    {
      text: 'Il paradosso: guardando solo all\'elettricità, il quadro è molto più positivo. Il <strong>94% dell\'energia elettrica consumata proviene da fonti rinnovabili</strong> — grazie agli impianti fotovoltaici del Gruppo Sesa e a forniture certificate.',
    },
    {
      text: 'Per le emissioni Scope 1+2, la flotta pesa per il <strong>60,6%</strong>, l\'elettricità delle sedi per il 35,4%, il gas per il 4%. Var Group non ha ancora un piano di transizione climatica formalizzato — ma nel 2024 ha organizzato la prima Convention carbon-neutral della sua storia.',
    },
  ];

  // ── SEZIONE 4 — Le persone crescono ──────────────────────────────────────
  const personeSteps = [
    {
      text: 'Al 30 aprile 2025, Var Group conta <strong>4.243 persone</strong>. Un anno fa erano 3.852. In dodici mesi, l\'organico è cresciuto del <strong>10,4%</strong>.',
    },
    {
      text: 'La maggior parte lavora in <strong>Nord Italia</strong> (58%), seguita dal Centro (27%). Il 12% opera all\'estero — in Europa, USA, Messico, Brasile, India e Thailandia — una quota in crescita che racconta l\'espansione internazionale.',
    },
    {
      text: 'Il 49% ha tra i 30 e i 50 anni. Ma la vera notizia è nelle nuove assunzioni: il <strong>46% dei 596 ingressi del 2025 riguarda under 30</strong>. Un segnale di investimento sui talenti giovani.',
    },
    {
      text: 'Nel 2025 ogni persona ha ricevuto in media <strong>17,5 ore di formazione</strong> — contro le 12,7 del 2024. In totale, <strong>73.183 ore</strong> erogate a 3.868 partecipanti. La formazione tecnica è la voce principale (39%).',
    },
  ];

  // ── SEZIONE 4b — Un'azienda sempre più inclusiva ─────────────────────────
  const genereSteps = [
    {
      text: 'Il <strong>29% delle persone in Var Group è donna</strong>. Un dato che riflette lo storico squilibrio di genere nel settore ICT — e che l\'azienda riconosce come punto di partenza, non di arrivo.',
    },
    {
      text: 'Guardando ai livelli di inquadramento, il divario si accentua salendo. Tra i dirigenti, le donne sono <strong>4 su 35 (11%)</strong>. Tra i quadri, <strong>81 su 436 (19%)</strong>. È alla guida esecutiva che il cammino è ancora lungo.',
    },
    {
      text: 'Il <strong>gender pay gap medio è del 12%</strong> in Italia: per ogni euro guadagnato da un uomo, una donna guadagna mediamente 88 centesimi. Un dato che Var Group include nel Piano Strategico di Sostenibilità 2026–2028 come priorità da affrontare.',
    },
  ];

  // ── SEZIONE 5 — Il valore per le comunità ────────────────────────────────
  const comunitaSteps = [
    {
      text: '<strong>Oltre 30 iniziative</strong> in Italia, Spagna e Svizzera. Più di <strong>450.000 euro</strong> investiti in comunità, cultura, sport e formazione. Il bilancio di sostenibilità non finisce dentro l\'azienda.',
    },
    {
      text: 'La parte più consistente riguarda <strong>benessere sociale e salute</strong>: dall\'oncologia pediatrica (ASEOP) alle cure per bambini con gravi malattie (Vidas), dalla Croce Rossa all\'AIL. Donazioni concrete, non solo comunicazione.',
    },
    {
      text: 'Un impegno specifico sulla <strong>formazione digitale inclusiva</strong>: T-Station Academy per persone con disabilità, collaborazione con Fondazione ASPHI Onlus, sponsorizzazione delle Olimpiadi italiane di Informatica.',
    },
    {
      text: 'Nell\'ottobre 2024, <strong>80 giovani talenti</strong> hanno partecipato all\'Hackathon Var Group in 32 ore di sviluppo intensivo, affiancati da 14 grandi aziende. E per ogni nuova persona che entra in Var Group, viene piantato <strong>un albero in Val di Fiemme</strong>.',
    },
  ];
</script>

<main>
  <Hero />

  <ScrollySection
    sectionNumber="01"
    sectionTitle="Innovazione Digitale: il punto di partenza"
    steps={innovazioneSteps}
  >
    {#snippet chart(step)}
      <InnovazioneChart activeStep={step} />
    {/snippet}
  </ScrollySection>

  <ScrollySection
    sectionNumber="02"
    sectionTitle="Governance ed Etica: le fondamenta"
    steps={governanceSteps}
  >
    {#snippet chart(step)}
      <GovernanceChart activeStep={step} />
    {/snippet}
  </ScrollySection>

  <ScrollySection
    sectionNumber="03"
    sectionTitle="L'impronta ambientale"
    steps={ambienteSteps}
  >
    {#snippet chart(step)}
      <EnergyChart activeStep={step} />
    {/snippet}
  </ScrollySection>

  <ScrollySection
    sectionNumber="04"
    sectionTitle="Le persone crescono"
    steps={personeSteps}
  >
    {#snippet chart(step)}
      <PeopleChart activeStep={step} />
    {/snippet}
  </ScrollySection>

  <ScrollySection
    sectionNumber=""
    sectionTitle="Un'azienda sempre più inclusiva"
    steps={genereSteps}
  >
    {#snippet chart(step)}
      <GenderChart activeStep={step} />
    {/snippet}
  </ScrollySection>

  <ScrollySection
    sectionNumber="05"
    sectionTitle="Il valore per le comunità"
    steps={comunitaSteps}
  >
    {#snippet chart(step)}
      <CommunityChart activeStep={step} />
    {/snippet}
  </ScrollySection>

  <Outro />
</main>
