<section class="outro">
  <div class="outro-content">
    <p class="kicker">Piano Strategico di Sostenibilità 2026–2028</p>
    <h2>7 obiettivi,<br/>un percorso condiviso</h2>
    <p class="deck">
      Il Piano è in costruzione. I temi: innovazione sostenibile, benessere delle persone,
      riduzione della carbon footprint, filiera responsabile, governance etica.
    </p>

    <div class="sdg-grid">
      {#each sdgs as sdg}
        <div class="sdg-card">
          <span class="sdg-number">{sdg.goal}</span>
          <span class="sdg-label">{sdg.label}</span>
        </div>
      {/each}
    </div>
  </div>

  <footer class="outro-footer">
    <div class="footer-inner">
      <p class="footer-source">
        Fonte dati: Bilancio di Sostenibilità Var Group 2025.<br/>
        Dati riferiti al periodo maggio 2024 – aprile 2025.
      </p>
      <p class="footer-credit">
        Demo interattivo — <span class="footer-author">Danilo De Rosa</span> · 2026
      </p>
    </div>
  </footer>
</section>

<script>
  const sdgs = [
    { goal: 'SDG 5',  label: 'Parità di genere' },
    { goal: 'SDG 8',  label: 'Lavoro dignitoso e crescita' },
    { goal: 'SDG 9',  label: 'Industria, innovazione, infrastrutture' },
    { goal: 'SDG 10', label: 'Ridurre le disuguaglianze' },
    { goal: 'SDG 13', label: 'Lotta al cambiamento climatico' },
    { goal: 'SDG 16', label: 'Pace, giustizia e istituzioni solide' },
    { goal: 'SDG 17', label: 'Partnership per gli obiettivi' },
  ];
</script>

<style>
  .outro {
    border-top: 1px solid var(--color-border);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .outro-content {
    padding: 6rem 4rem 4rem;
    max-width: 860px;
  }

  .kicker {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--color-brand-blue-light);
    margin-bottom: 1.5rem;
  }

  h2 {
    font-size: clamp(2.5rem, 6vw, 4.5rem);
    font-weight: 300;
    line-height: 1.1;
    color: var(--color-text);
    margin-bottom: 1.75rem;
  }

  .deck {
    font-size: 1rem;
    color: var(--color-text-muted);
    line-height: 1.8;
    max-width: 560px;
    margin-bottom: 3.5rem;
  }

  .sdg-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
    max-width: 800px;
  }

  .sdg-card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 4px;
    padding: 1.25rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    transition: border-color 0.2s ease;
  }

  .sdg-card:hover {
    border-color: var(--color-brand-blue);
  }

  .sdg-number {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    letter-spacing: 0.1em;
    color: var(--color-brand-blue-light);
    text-transform: uppercase;
  }

  .sdg-label {
    font-size: 0.85rem;
    color: var(--color-text);
    line-height: 1.4;
  }

  .outro-footer {
    border-top: 1px solid var(--color-border);
    padding: 2rem 4rem;
  }

  .footer-inner {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 2rem;
    flex-wrap: wrap;
  }

  .footer-source {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: var(--color-text-faint);
    line-height: 1.7;
  }

  .footer-credit {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: var(--color-text-faint);
    white-space: nowrap;
  }

  .footer-author { color: var(--color-text-muted); }

  @media (max-width: 768px) {
    .outro-content { padding: 4rem 1.25rem 3rem; }
    h2 { font-size: clamp(2rem, 10vw, 3rem); }
    .sdg-grid { grid-template-columns: 1fr 1fr; }
    .outro-footer { padding: 2rem 1.25rem; }
    .footer-inner { flex-direction: column; align-items: flex-start; }
  }
</style>
