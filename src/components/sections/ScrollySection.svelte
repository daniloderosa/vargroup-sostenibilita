<script>
  import { onMount } from 'svelte';
  import Scrolly from '$components/helpers/Scrolly.svelte';

  let { sectionNumber = '', sectionTitle, intro = '', steps = [], chart } = $props();

  let activeStep = $state(0);
  let isMobile = $state(false);

  onMount(() => {
    isMobile = window.innerWidth <= 768;
    const handler = () => { isMobile = window.innerWidth <= 768; };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  });

  // Su desktop: step reattivo dallo scrolly. Su mobile: mostrato per singolo step
  let displayStep = $derived(isMobile ? steps.length - 1 : activeStep);
</script>

{#if isMobile}
  <!-- ── MOBILE LAYOUT: titolo → intro → (testo + grafico) per ogni step ── -->
  <section class="section-scrolly section-mobile">
    <header class="section-header">
      {#if sectionNumber}<span class="section-number">{sectionNumber}</span>{/if}
      <h2>{sectionTitle}</h2>
    </header>

    {#if intro}
      <div class="section-intro">
        <p>{@html intro}</p>
      </div>
    {/if}

    <div class="mobile-steps">
      {#each steps as step, i}
        <div class="mobile-step">
          <div class="step-card active">
            <p>{@html step.text}</p>
            {#if step.subtext}<p class="subtext">{@html step.subtext}</p>{/if}
          </div>
          <div class="mobile-chart">
            {@render chart(i)}
          </div>
        </div>
      {/each}
    </div>
  </section>
{:else}
  <!-- ── DESKTOP LAYOUT: header → intro → [chart sticky | steps] ── -->
  <section class="section-scrolly">
    <header class="section-header">
      {#if sectionNumber}<span class="section-number">{sectionNumber}</span>{/if}
      <h2>{sectionTitle}</h2>
    </header>

    {#if intro}
      <div class="section-intro">
        <p>{@html intro}</p>
      </div>
    {/if}

    <div class="sticky-chart">
      {@render chart(displayStep)}
    </div>

    <div class="steps-column">
      <Scrolly bind:value={activeStep}>
        {#each steps as step, i}
          <div class="step">
            <div class="step-card" class:active={activeStep === i}>
              <p>{@html step.text}</p>
              {#if step.subtext}
                <p class="subtext">{@html step.subtext}</p>
              {/if}
            </div>
          </div>
        {/each}
      </Scrolly>
    </div>
  </section>
{/if}

<style>
  /* ── Desktop ─────────────────────────────────────────────────────── */
  .section-scrolly {
    position: relative;
    display: grid;
    grid-template-columns: 1fr 340px;
    min-height: 100vh;
    border-top: 1px solid var(--color-border);
  }

  .section-header {
    grid-column: 1 / -1;
    padding: 5rem 4rem 2rem;
  }

  .section-number {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--color-green-forest);
    display: block;
    margin-bottom: 0.75rem;
  }

  h2 {
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 300;
    color: var(--color-text);
    max-width: 700px;
  }

  /* ── Testo introduttivo centrato — piena larghezza ────────────────── */
  .section-intro {
    grid-column: 1 / -1;
    display: flex;
    justify-content: center;
    padding: 0 4rem 3.5rem;
    border-bottom: 1px solid var(--color-border);
    margin-bottom: 0;
  }

  .section-intro p {
    max-width: 760px;
    width: 100%;
    font-size: 1.05rem;
    line-height: 1.75;
    color: var(--color-text-muted);
    font-family: var(--font-body);
  }

  /* ── Grafico sticky ───────────────────────────────────────────────── */
  .sticky-chart {
    position: sticky;
    top: 0;
    height: 100vh;
    align-self: start;
    padding: 2rem;
    z-index: var(--z-sticky);
    will-change: transform;
  }

  /* ── Colonna testi ────────────────────────────────────────────────── */
  .steps-column {
    padding: 8vh 2rem 50vh;
    display: flex;
    flex-direction: column;
  }

  .step {
    min-height: var(--step-height);
    display: flex;
    align-items: center;
    padding: 1rem 0;
  }

  .step-card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 4px;
    padding: 1.5rem 1.75rem;
    transition: opacity 0.35s ease, border-color 0.35s ease;
    opacity: 0.3;
    width: 100%;
  }

  .step-card.active {
    opacity: 1;
    border-color: var(--color-green-forest);
  }

  .step-card p {
    font-size: 0.9rem;
    color: var(--color-text);
    line-height: 1.8;
  }

  .step-card :global(strong) {
    font-weight: 600;
    color: var(--color-green-deep);
  }

  .subtext {
    margin-top: 0.85rem;
    color: var(--color-text-faint) !important;
    font-size: 0.8rem !important;
    line-height: 1.6 !important;
  }

  /* ── Mobile ──────────────────────────────────────────────────────── */
  .section-mobile {
    display: block;
    border-top: 1px solid var(--color-border);
  }

  .section-mobile .section-header {
    padding: 3rem 1.25rem 1.5rem;
  }

  .section-mobile .section-intro {
    padding: 0 1.25rem 2rem;
    border-bottom: 1px solid var(--color-border);
  }

  .mobile-steps {
    padding: 0 1.25rem 3rem;
  }

  .mobile-step {
    padding: 1.5rem 0;
    border-bottom: 1px solid var(--color-border);
  }

  .mobile-step:last-child {
    border-bottom: none;
  }

  .mobile-step .step-card {
    opacity: 1;
    border-color: var(--color-border);
    margin-bottom: 1rem;
  }

  .mobile-chart {
    width: 100%;
    height: 64vw;
    min-height: 240px;
    max-height: 360px;
  }
</style>
