<script>
  import * as d3 from 'd3';
  import governance from '$data/governance.json';

  let { activeStep = 0 } = $props();
  let svgEl = $state(null);

  const W = 720, H = 460;

  // Unico colore verde per tutti i dot (nessuna distinzione di genere)
  const COL_DOT = '#33804C';
  const COL_INIT = '#ffffff';

  const cdaPos = governance.cda.map((d, i) => ({
    ...d,
    x: 75 + (i % 3) * 80,
    y: 120 + Math.floor(i / 3) * 80,
  }));

  const csPos = governance.collegio_sindacale.map((d, i) => ({
    ...d,
    x: 335,
    y: 110 + i * 65,
  }));

  const cosPos = governance.cos.map((d, i) => ({
    ...d,
    x: 415 + (i % 5) * 53,
    y: 110 + Math.floor(i / 5) * 80,
  }));

  $effect(() => {
    if (!svgEl) return;
    const svg = d3.select(svgEl);
    svg.selectAll('*').interrupt();
    if (activeStep === 0) step0(svg);
    else if (activeStep === 1) step1(svg);
    else step2(svg);
  });

  // ── Helpers ──────────────────────────────────────────────────────────────

  function addSep(svg, x, opacity = 0.5) {
    svg.append('line')
      .attr('x1', x).attr('y1', 20)
      .attr('x2', x).attr('y2', H - 20)
      .attr('stroke', '#d4d4cc')
      .attr('stroke-width', 1)
      .attr('opacity', opacity);
  }

  // label = nome organo (sopra), count = numero componenti (sotto)
  // Spazio aumentato: label a y=28, count a y=64 (gap 36px)
  function addHeader(svg, label, count, cx, opacity = 1) {
    const g = svg.append('g').attr('opacity', opacity);
    g.append('text')
      .attr('x', cx).attr('y', 28)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'Inter, sans-serif')
      .attr('font-size', '9').attr('letter-spacing', '1.2')
      .attr('fill', '#888888')
      .text(label.toUpperCase());
    g.append('text')
      .attr('x', cx).attr('y', 64)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'Manrope, sans-serif')
      .attr('font-size', '26').attr('font-weight', '200')
      .attr('fill', '#1a1a1a')
      .text(count);
  }

  function initials(nome) {
    const parts = nome.split(' ');
    return (parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '');
  }

  // ── Step 0 — CdA only ────────────────────────────────────────────────────

  function step0(svg) {
    svg.selectAll('*').remove();

    addHeader(svg, 'Consiglio di Amministrazione', '9', 155);
    addSep(svg, 285, 0.2);

    svg.selectAll('.cda-dot')
      .data(cdaPos, d => d.nome)
      .join(enter =>
        enter.append('circle').attr('class', 'cda-dot')
          .attr('cx', d => d.x).attr('cy', d => d.y)
          .attr('r', 0)
          .attr('fill', COL_DOT)
          .attr('opacity', 0)
          .call(s => s.transition().duration(500).delay((_, i) => i * 60)
            .attr('r', 22).attr('opacity', 0.88))
      );

    svg.selectAll('.cda-init')
      .data(cdaPos, d => d.nome)
      .join(enter =>
        enter.append('text').attr('class', 'cda-init')
          .attr('x', d => d.x).attr('y', d => d.y)
          .attr('text-anchor', 'middle').attr('dominant-baseline', 'central')
          .attr('fill', COL_INIT).attr('font-size', '11')
          .attr('font-family', 'IBM Plex Mono, monospace')
          .attr('opacity', 0)
          .text(d => initials(d.nome))
          .call(s => s.transition().delay((_, i) => i * 60 + 400).duration(300).attr('opacity', 0.9))
      );

    svg.append('text')
      .attr('x', 155).attr('y', H - 30)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'IBM Plex Mono, monospace').attr('font-size', '10')
      .attr('fill', '#888888').attr('opacity', 0)
      .text('9 componenti · anzianità media 14 anni')
      .transition().delay(700).duration(400).attr('opacity', 1);
  }

  // ── Step 1 — + Collegio Sindacale ────────────────────────────────────────

  function step1(svg) {
    svg.selectAll('*').remove();

    addHeader(svg, 'Consiglio di Amministrazione', '9', 155, 0.35);
    addHeader(svg, 'Collegio Sindacale', '5', 335);
    addSep(svg, 285, 0.4);
    addSep(svg, 395, 0.15);

    // CdA — dimmed
    svg.selectAll('.cda-dot')
      .data(cdaPos, d => d.nome)
      .join(enter =>
        enter.append('circle').attr('class', 'cda-dot')
          .attr('cx', d => d.x).attr('cy', d => d.y)
          .attr('r', 22).attr('fill', COL_DOT).attr('opacity', 0.18)
      );

    // CS dots
    svg.selectAll('.cs-dot')
      .data(csPos, d => d.nome)
      .join(enter =>
        enter.append('circle').attr('class', 'cs-dot')
          .attr('cx', d => d.x).attr('cy', d => d.y)
          .attr('r', 0).attr('fill', COL_DOT).attr('opacity', 0)
          .call(s => s.transition().duration(500).delay((_, i) => i * 80)
            .attr('r', 18).attr('opacity', 0.88))
      );

    svg.selectAll('.cs-init')
      .data(csPos, d => d.nome)
      .join(enter =>
        enter.append('text').attr('class', 'cs-init')
          .attr('x', d => d.x).attr('y', d => d.y)
          .attr('text-anchor', 'middle').attr('dominant-baseline', 'central')
          .attr('fill', COL_INIT).attr('font-size', '10')
          .attr('font-family', 'IBM Plex Mono, monospace')
          .attr('opacity', 0)
          .text(d => initials(d.nome))
          .call(s => s.transition().delay((_, i) => i * 80 + 350).duration(300).attr('opacity', 0.9))
      );

    svg.selectAll('.cs-role')
      .data(csPos, d => d.nome)
      .join(enter =>
        enter.append('text').attr('class', 'cs-role')
          .attr('x', d => d.x + 30).attr('y', d => d.y)
          .attr('dominant-baseline', 'central')
          .attr('font-family', 'Inter, sans-serif').attr('font-size', '8.5')
          .attr('fill', '#888888').attr('opacity', 0)
          .text(d => d.ruolo)
          .call(s => s.transition().delay((_, i) => i * 80 + 500).duration(300).attr('opacity', 1))
      );

    svg.append('text')
      .attr('x', 335).attr('y', H - 30)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'IBM Plex Mono, monospace').attr('font-size', '10')
      .attr('fill', '#888888').attr('opacity', 0)
      .text('Organo di controllo indipendente')
      .transition().delay(700).duration(400).attr('opacity', 1);
  }

  // ── Step 2 — + Comitato di Sostenibilità ─────────────────────────────────

  function step2(svg) {
    svg.selectAll('*').remove();

    addHeader(svg, 'Consiglio di Amministrazione', '9', 155, 0.25);
    addHeader(svg, 'Collegio Sindacale', '5', 335, 0.45);
    addHeader(svg, 'Comitato di Sostenibilità', '19', 521);
    addSep(svg, 285, 0.28);
    addSep(svg, 395, 0.28);

    // CdA — very dimmed
    svg.selectAll('.cda-dot')
      .data(cdaPos, d => d.nome)
      .join(enter =>
        enter.append('circle').attr('class', 'cda-dot')
          .attr('cx', d => d.x).attr('cy', d => d.y)
          .attr('r', 22).attr('fill', COL_DOT).attr('opacity', 0.12)
      );

    // CS — medium dimmed
    svg.selectAll('.cs-dot')
      .data(csPos, d => d.nome)
      .join(enter =>
        enter.append('circle').attr('class', 'cs-dot')
          .attr('cx', d => d.x).attr('cy', d => d.y)
          .attr('r', 18).attr('fill', COL_DOT).attr('opacity', 0.32)
      );

    // COS dots — tutti verde, nessuna distinzione di genere
    svg.selectAll('.cos-dot')
      .data(cosPos, d => d.nome)
      .join(enter =>
        enter.append('circle').attr('class', 'cos-dot')
          .attr('cx', d => d.x).attr('cy', d => d.y)
          .attr('r', 0).attr('fill', COL_DOT).attr('opacity', 0)
          .call(s => s.transition().duration(400).delay((_, i) => i * 35)
            .attr('r', 14).attr('opacity', 0.88))
      );

    svg.selectAll('.cos-init')
      .data(cosPos, d => d.nome)
      .join(enter =>
        enter.append('text').attr('class', 'cos-init')
          .attr('x', d => d.x).attr('y', d => d.y)
          .attr('text-anchor', 'middle').attr('dominant-baseline', 'central')
          .attr('fill', COL_INIT).attr('font-size', '8')
          .attr('font-family', 'IBM Plex Mono, monospace')
          .attr('opacity', 0)
          .text(d => initials(d.nome))
          .call(s => s.transition().delay((_, i) => i * 35 + 350).duration(250).attr('opacity', 0.85))
      );

    svg.append('text')
      .attr('x', 521).attr('y', H - 30)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'IBM Plex Mono, monospace').attr('font-size', '10')
      .attr('fill', '#33804C').attr('opacity', 0)
      .text('12 donne · 7 uomini')
      .transition().delay(800).duration(400).attr('opacity', 1);
  }
</script>

<div class="chart-wrapper">
  <svg
    bind:this={svgEl}
    viewBox="0 0 {W} {H}"
    width="100%"
    height="100%"
    preserveAspectRatio="xMidYMid meet"
    aria-label="Struttura di governance Var Group: CdA (9 membri), Collegio Sindacale (5), Comitato di Sostenibilità (19, di cui 12 donne)"
  ></svg>
</div>

<style>
  .chart-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
