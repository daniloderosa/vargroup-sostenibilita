<script>
  import Hero            from '$components/sections/Hero.svelte';
  import ScrollySection  from '$components/sections/ScrollySection.svelte';
  import InnovazioneChart from '$components/charts/InnovazioneChart.svelte';
  import GovernanceChart  from '$components/charts/GovernanceChart.svelte';
  import EnergyChart      from '$components/charts/EnergyChart.svelte';
  import Chapter4Chart    from '$components/charts/Chapter4Chart.svelte';
  import CommunityChart   from '$components/charts/CommunityChart.svelte';

  // ── SEZIONE 1 — Innovazione Digitale ───────────────────────────────────────
  const innovazioneIntro = `Nata oltre cinquant'anni fa a Empoli, Var Group è oggi una delle realtà più importanti nel panorama tecnologico italiano e internazionale: 875,7 milioni di euro di fatturato consolidato, 4.243 persone, 34 sedi in 15 paesi. Come Digital Integrator, accompagna le aziende in ogni fase dell'evoluzione digitale — dal cloud alla cybersecurity, dalle applicazioni di business all'intelligenza artificiale — con un'offerta che spazia su dieci aree di servizio. Nel 2024 è nata SustainIT, la Business Unit che porta l'expertise di Var Group al servizio della governance ESG delle imprese: un segnale che l'innovazione digitale e la sostenibilità non sono più percorsi separati.`;

  const innovazioneSteps = [
    {
      text: 'Ad oggi Var Group conta 18 sedi distribuite da Bolzano a Catania, con la sua sede principale e storica a Empoli, in Toscana.',
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

  // ── SEZIONE 2 — Etica e Governance ────────────────────────────────────────
  const governanceIntro = `Nel 2025 Var Group ha avviato una profonda trasformazione
del proprio modello organizzativo e di
governance, con l’obiettivo di rispondere in modo più
rapido e coerente alle sfide del mercato e alle aspettative
delle nuove generazioni. Al centro di questa evoluzione
ci sono due principi cardine: <strong>Leadership Diffusa</strong>
e <strong>Platform Organization</strong>. <br>La Leadership Diffusa si fonda sulla responsabilizzazione
delle persone: ciascun team e ciascun individuo
è chiamato a prendere decisioni in autonomia nel proprio
ambito di competenza, superando modelli gerarchici
tradizionali.<br>
Parallelamente, la struttura organizzativa è stata ripensata
secondo il modello della Platform Organization:
l’azienda è oggi articolata in “atomi” o microimprese
autonome che operano come unità imprenditoriali indipendenti,
scambiandosi servizi attraverso contratti
formali.`;

  const governanceSteps = [
    {
      text: '<strong>82 società controllate, zero casi di corruzione</strong> registrati nel 2025. Il Consiglio di Amministrazione è composto da <strong>9 membri</strong> ed è guidato da Francesca Moriani, Amministratrice Delegata.',
    },
    {
      text: 'Il <strong>Collegio Sindacale</strong> è composto da 5 membri ed è l\'organo di controllo indipendente. Vigila sulla correttezza della gestione e sull\'adeguatezza del sistema di controllo interno.',
    },
    {
      text: 'Il <strong>Comitato di Sostenibilità (COS)</strong> riunisce 19 responsabili aziendali — <strong>12 donne e 7 uomini</strong>. È l\'organo che guida l\'integrazione degli obiettivi ESG nelle strategie operative di Var Group.',
    },
  ];

  // ── SEZIONE 3 — Ambiente ───────────────────────────────────────────────────
  const ambienteIntro = `Var Group affronta il tema ambientale con trasparenza e determinazione: l'energia elettrica consumata è per il 94% da fonti rinnovabili, grazie agli impianti fotovoltaici del Gruppo Sesa e alle forniture certificate. Il quadro complessivo dei consumi energetici — 19.869 MWh nel 2025 — è dominato dalla flotta di oltre 850 veicoli che ogni giorno porta i tecnici Var Group dai clienti su tutto il territorio nazionale: un modello di servizio capillare che l'azienda sta progressivamente evolvendo. La strada verso la neutralità carbonica è già tracciata: nel 2024 Var Group ha organizzato la prima Convention della sua storia con calcolo e compensazione dell'impronta carbonica per ogni partecipante.`;

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
  ];

  // ── SEZIONE 4 — Le persone ─────────────────────────────────────────────────
  const personeIntro = `Al 30 aprile 2025, Var Group conta 4.243 persone: 391 in più rispetto all'anno precedente, una crescita del 10,4% che racconta un'azienda in espansione continua. La distribuzione è ancora fortemente concentrata al Nord (58%), ma il 12% lavora già fuori dai confini italiani — in Europa, nelle Americhe, in Asia. Il 29% del personale è donna, una quota che l'azienda ha iniziato ad affrontare con un piano dedicato e una Community DEI attiva dal 2023. La formazione è cresciuta in modo significativo: 73.183 ore erogate nel 2025, +15.950 ore rispetto all'anno prima, con una media di 17,5 ore per persona.`;

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
      text: 'Il <strong>29% delle persone in Var Group è donna</strong>. Un dato che riflette lo storico squilibrio di genere nel settore ICT — e che l\'azienda riconosce come punto di partenza, non di arrivo.',
    },
    {
      text: 'Guardando ai livelli di inquadramento, il divario si accentua salendo. Tra i dirigenti, le donne sono <strong>4 su 35 (11%)</strong>. Tra i quadri, <strong>81 su 436 (19%)</strong>. È alla guida esecutiva che il cammino è ancora lungo.',
    },
    
  ];

  // ── SEZIONE 5 — Supporto alle comunità ────────────────────────────────────
  const comunitaIntro = `Il bilancio di sostenibilità di Var Group non si chiude dentro l'azienda: nel 2025, oltre 450.000 euro sono stati destinati a più di 30 iniziative in Italia, Spagna e Svizzera. Le aree di intervento spaziano dalla salute (oncologia pediatrica, cure palliative) alla formazione digitale inclusiva, dall'educazione giovanile alla tutela ambientale, fino allo sport e alla cultura. Non è una lista di donazioni: è un sistema di partnership e sponsorizzazioni che in alcuni casi, come l'Hackathon Var Group o la collaborazione con Fondazione ASPHI, tocca direttamente il cuore del business tecnologico. Per ogni nuova persona che entra in Var Group, viene piantato un albero in Val di Fiemme.`;

  const comunitaSteps = [
    {
      text: '<strong>Oltre 30 iniziative</strong> in Italia, Spagna e Svizzera. Più di <strong>450.000 euro</strong> investiti in comunità, cultura, sport e formazione. Il bilancio di sostenibilità non finisce dentro l\'azienda.',
    },
    {
      text: 'La parte più consistente riguarda <strong>benessere sociale e salute</strong>: dall\'oncologia pediatrica (ASEOP) alle cure per bambini con gravi malattie (Vidas), dalla Croce Rossa all\'AIL. Donazioni concrete, non solo comunicazione.',
    },
    {
      text: 'Un impegno specifico sulla <strong>formazione digitale inclusiva</strong>: T-Station Academy per persone con disabilità, collaborazione con Fondazione ASPHI Onlus per rendere i processi aziendali più accessibili, sponsorizzazione delle Olimpiadi italiane di Informatica.',
    },
    {
      text: 'Otto iniziative dedicate all\'<strong>educazione e ai giovani</strong>: da Aid4Mada ad Aleimar, dall\'Associazione Alessia al TEDx Ancona. Var Group investe nella prossima generazione oltre i confini dell\'Italia.',
    },
    {
      text: 'L\'impegno ambientale si traduce in azioni concrete: collaborazione con <strong>WOWnature e Treedom</strong>, piantumazioni in Romania, e il progetto simbolo — un albero piantato in <strong>Val di Fiemme per ogni nuova persona</strong> che entra in Var Group.',
    },
    {
      text: 'Nell\'ottobre 2024, <strong>80 giovani talenti</strong> hanno partecipato all\'Hackathon Var Group in 32 ore di sviluppo intensivo, affiancati da 14 grandi aziende. Sport, cultura e innovazione completano il quadro: da Lube Volley a Var Digital Art.',
    },
  ];
</script>

<main>
  <Hero />

  <ScrollySection
    sectionNumber="01"
    sectionTitle="Innovazione Digitale"
    intro={innovazioneIntro}
    steps={innovazioneSteps}
  >
    {#snippet chart(step)}
      <InnovazioneChart activeStep={step} />
    {/snippet}
  </ScrollySection>

  <ScrollySection
    sectionNumber="02"
    sectionTitle="Etica e Governance"
    intro={governanceIntro}
    steps={governanceSteps}
  >
    {#snippet chart(step)}
      <GovernanceChart activeStep={step} />
    {/snippet}
  </ScrollySection>

  <ScrollySection
    sectionNumber="03"
    sectionTitle="L'ambiente"
    intro={ambienteIntro}
    steps={ambienteSteps}
  >
    {#snippet chart(step)}
      <EnergyChart activeStep={step} />
    {/snippet}
  </ScrollySection>

  <ScrollySection
    sectionNumber="04"
    sectionTitle="Le persone"
    intro={personeIntro}
    steps={personeSteps}
  >
    {#snippet chart(step)}
      <Chapter4Chart activeStep={step} />
    {/snippet}
  </ScrollySection>

  <ScrollySection
    sectionNumber="05"
    sectionTitle="Supporto alle comunità"
    intro={comunitaIntro}
    steps={comunitaSteps}
  >
    {#snippet chart(step)}
      <CommunityChart activeStep={step} />
    {/snippet}
  </ScrollySection>
</main>
