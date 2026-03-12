<section class="hero">
  <!-- Geometric background pattern -->
  <svg class="hero-pattern" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1032cf" stroke-width="0.5" opacity="0.18"/>
      </pattern>
      <radialGradient id="fade" cx="50%" cy="50%" r="70%">
        <stop offset="0%" stop-color="#0d0d10" stop-opacity="0"/>
        <stop offset="100%" stop-color="#0d0d10" stop-opacity="1"/>
      </radialGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid)"/>
    <rect width="100%" height="100%" fill="url(#fade)"/>
  </svg>

  <div class="hero-content">
    <p class="kicker">Bilancio di Sostenibilità 2025</p>
    <h1>Crescere con<br/>responsabilità</h1>
    <p class="deck">4.243 persone. 34 sedi nel mondo.<br/>Un percorso di crescita che non trascura nulla.</p>
    <div class="scroll-indicator" aria-hidden="true">
      <span class="scroll-line"></span>
    </div>
  </div>
</section>

<style>
  .hero {
    position: relative;
    min-height: 100svh;
    display: flex;
    align-items: center;
    overflow: hidden;
  }

  .hero-pattern {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  .hero-content {
    position: relative;
    z-index: 1;
    padding: 6rem 4rem;
    max-width: 860px;
  }

  .kicker {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--color-brand-blue-light);
    margin-bottom: 2rem;
  }

  h1 {
    font-size: clamp(3rem, 8vw, 5.5rem);
    font-weight: 300;
    color: var(--color-text);
    margin-bottom: 1.75rem;
    line-height: 1.1;
  }

  .deck {
    font-size: clamp(1rem, 2vw, 1.2rem);
    color: var(--color-text-muted);
    line-height: 1.75;
    margin-bottom: 3.5rem;
  }

  .scroll-indicator {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .scroll-line {
    display: block;
    width: 1px;
    height: 70px;
    background: linear-gradient(to bottom, var(--color-brand-blue-light), transparent);
    animation: scrollPulse 2.2s ease-in-out infinite;
  }

  @keyframes scrollPulse {
    0%, 100% { opacity: 0.25; transform: scaleY(0.7) translateY(-10px); }
    50% { opacity: 1; transform: scaleY(1) translateY(0); }
  }

  @media (max-width: 768px) {
    .hero-content {
      padding: 5rem 1.25rem 3rem;
    }
    h1 { font-size: clamp(2.2rem, 10vw, 3rem); }
    .deck { font-size: 1rem; }
  }
</style>
