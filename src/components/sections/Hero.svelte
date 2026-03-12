<section class="hero">

  <!-- Concentric rings radiating from bottom-right corner -->
  <svg class="hero-rings" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
       viewBox="0 0 900 900" preserveAspectRatio="xMaxYMax meet">
    <!-- cx=900, cy=900 = corner del box SVG, allineato al corner basso-destra dell'hero -->
    <circle cx="900" cy="900" r="90"  fill="none" stroke="#C9E35C" stroke-width="1.8" opacity="1"/>
    <circle cx="900" cy="900" r="175" fill="none" stroke="#78B557" stroke-width="1.4" opacity="1"/>
    <circle cx="900" cy="900" r="280" fill="none" stroke="#61BD57" stroke-width="1.2" opacity="1"/>
    <circle cx="900" cy="900" r="400" fill="none" stroke="#33804C" stroke-width="1.0" opacity="1"/>
    <circle cx="900" cy="900" r="540" fill="none" stroke="#78B557" stroke-width="0.8" opacity="1"/>
    <circle class="ring-outer" cx="900" cy="900" r="700" fill="none" stroke="#33804C" stroke-width="0.8" opacity="1"/>
    <circle class="ring-outer" cx="900" cy="900" r="880" fill="none" stroke="#33804C" stroke-width="0.6" opacity="1"/>
    
  </svg>

  <div class="hero-content">
    <p class="kicker">Bilancio di Sostenibilità 2025 - VAR Group</p>
    <h2>Responsible Governance:</h2>
    <h1>
      <span style="color: var(--color-green-deep);">verso una </span><br>
      <span style="color: var(--color-green-forest);">realtà innovativa,</span>
      <span style="color: var(--color-green-mid);"> sostenibile e inclusiva</span>
    </h1>
    <p class="deck">4.243 persone. 34 sedi nel mondo.<br>Un percorso di crescita che non trascura nulla.</p>
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
    background-color: var(--color-bg);
  }

  /* SVG rings: posizionato nell'angolo basso-destra, clippato dall'overflow:hidden del genitore */
  .hero-rings {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 900px;
    height: 900px;
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
    color: var(--color-green-deep);
    margin-bottom: 2rem;
  }

  h2 {
    font-family: var(--font-display);
    font-size: clamp(2rem, 4vw, 2.8rem);
    font-weight: 300;
    color: var(--color-green-deep);
    margin-bottom: 0.4rem;
    line-height: 1.1;
    letter-spacing: -0.03em;
  }

  h1 {
    font-family: var(--font-display);
    font-size: clamp(3rem, 8vw, 5.5rem);
    font-weight: 300;
    color: var(--color-text);
    margin-bottom: 1.75rem;
    line-height: 1.1;
    letter-spacing: -0.03em;
  }

  .deck {
    font-family: var(--font-body);
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
    background: linear-gradient(to bottom, var(--color-green-forest), transparent);
    animation: scrollPulse 2.2s ease-in-out infinite;
  }

  @keyframes scrollPulse {
    0%, 100% { opacity: 0.25; transform: scaleY(0.7) translateY(-10px); }
    50%       { opacity: 1;    transform: scaleY(1)   translateY(0);     }
  }

  @media (max-width: 768px) {
    .hero-content {
      padding: 5rem 1.25rem 3rem;
    }
    h1   { font-size: clamp(2.2rem, 10vw, 3rem); }
    h2   { font-size: clamp(1.6rem, 7vw, 2.2rem); }
    .deck { font-size: 1rem; }

    /* Rings più piccoli su mobile, i due esterni nascosti */
    .hero-rings {
      width: 500px;
      height: 500px;
    }
    .hero-rings .ring-outer {
      display: none;
    }
  }
</style>
