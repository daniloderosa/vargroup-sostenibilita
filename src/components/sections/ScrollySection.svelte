<script>
  import { onMount } from 'svelte';
  import Scrolly from '$components/helpers/Scrolly.svelte';

  let { sectionNumber, sectionTitle, steps = [], chart } = $props();

  let activeStep = $state(0);
  let isMobile = $state(false);

  // onMount è eccezione consentita per rilevamento viewport (CLAUDE.md)
  onMount(() => {
    isMobile = window.innerWidth <= 768;
    const handler = () => { isMobile = window.innerWidth <= 768; };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  });

  // Su mobile, mostra sempre l'ultimo step del grafico
  let displayStep = $derived(isMobile ? steps.length - 1 : activeStep);
</script>

<section class="section-scrolly">
  <header class="section-header">
    <span class="section-number">{sectionNumber}</span>
    <h2>{sectionTitle}</h2>
  </header>

  <div class="sticky-chart">
    {@render chart(displayStep)}
  </div>

  <div class="steps-column">
    <Scrolly bind:value={activeStep}>
      {#each steps as step, i}
        <div class="step">
          <div class="step-card" class:active={activeStep === i || isMobile}>
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

<style>
  .section-scrolly {
    position: relative;
    display: grid;
    grid-template-columns: 1fr 340px;
    min-height: 100vh;
    border-top: 1px solid var(--color-border);
  }

  .section-header {
    grid-column: 1 / -1;
    padding: 5rem 4rem 2.5rem;
  }

  .section-number {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--color-brand-blue-light);
    display: block;
    margin-bottom: 0.75rem;
  }

  h2 {
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 300;
    color: var(--color-text);
    max-width: 700px;
  }

  .sticky-chart {
    position: sticky;
    top: 0;
    height: 100vh;
    align-self: start;
    padding: 2rem;
    z-index: var(--z-sticky);
    will-change: transform;
  }

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
    border-color: var(--color-brand-blue);
  }

  .step-card p {
    font-size: 0.9rem;
    color: var(--color-text);
    line-height: 1.8;
  }

  .step-card :global(strong) {
    font-weight: 600;
    color: var(--color-text);
  }

  .subtext {
    margin-top: 0.85rem;
    color: var(--color-text-muted) !important;
    font-size: 0.8rem !important;
    line-height: 1.6 !important;
  }

  @media (max-width: 768px) {
    .section-scrolly { display: block; }

    .section-header { padding: 3rem 1.25rem 1.5rem; }

    .sticky-chart {
      position: relative;
      top: auto;
      height: 60vw;
      min-height: 260px;
      max-height: 380px;
      width: 100%;
    }

    .steps-column { padding: 1.5rem 1.25rem 3rem; }

    .step {
      min-height: auto;
      padding: 1.25rem 0;
      border-bottom: 1px solid var(--color-border);
    }

    .step:last-child { border-bottom: none; }

    .step-card {
      opacity: 1;
      border-color: var(--color-border);
    }
  }
</style>
