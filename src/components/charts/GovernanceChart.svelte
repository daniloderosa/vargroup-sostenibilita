<script>
  import * as d3 from 'd3';
  import governance from '$data/governance.json';

  let { activeStep = 0 } = $props();
  let svgEl = $state(null);

  const W = 720, H = 460;
  const COL_M = '#1032cf';
  const COL_F = '#F5A623';

  // Pre-compute positions
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
      .attr('stroke', '#2a2a35')
      .attr('stroke-width', 1)
      .attr('opacity', opacity);
  }

  function addHeader(svg, label, count, cx, opacity = 1) {
    const g = svg.append('g').attr('opacity', opacity);
    g.append('text')
      .attr('x', cx).attr('y', 34)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'Inter, sans-serif')
      .attr('font-size', '9').attr('letter-spacing', '1.2')
      .attr('fill', '#767676')
      .text(label.toUpperCase());
    g.append('text')
      .attr('x', cx).attr('y', 56)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'Manrope, sans-serif')
      .attr('font-size', '26').attr('font-weight', '200')
      .attr('fill', 'white')
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
          .attr('fill', d => d.genere === 'F' ? COL_F : COL_M)
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
          .attr('fill', 'white').attr('font-size', '11')
          .attr('font-family', 'IBM Plex Mono, monospace')
          .attr('opacity', 0)
          .text(d => initials(d.nome))
          .call(s => s.transition().delay((_, i) => i * 60 + 400).duration(300).attr('opacity', 0.9))
      );

    svg.selectAll('.cda-name')
      .data(cdaPos, d => d.nome)
      .join(enter =>
        enter.append('text').attr('class', 'cda-name')
          .attr('x', d => d.x).attr('y', d => d.y + 33)
          .attr('text-anchor', 'middle')
          .attr('font-family', 'Inter, sans-serif').attr('font-size', '9')
          .attr('fill', '#505050').attr('opacity', 0)
          .text(d => d.nome.split(' ')[0])
          .call(s => s.transition().delay((_, i) => i * 60 + 500).duration(300).attr('opacity', 1))
      );

    svg.append('text')
      .attr('x', 155).attr('y', H - 30)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'IBM Plex Mono, monospace').attr('font-size', '10')
      .attr('fill', '#505050').attr('opacity', 0)
      .text('1 donna (AD) · 8 uomini')
      .transition().delay(700).duration(400).attr('opacity', 1);
  }

  // ── Step 1 — + Collegio Sindacale ────────────────────────────────────────

  function step1(svg) {
    svg.selectAll('*').remove();

    addHeader(svg, 'Consiglio di Amministrazione', '9', 155, 0.4);
    addHeader(svg, 'Collegio Sindacale', '5', 335);
    addSep(svg, 285, 0.5);
    addSep(svg, 395, 0.18);

    // CdA — dimmed
    svg.selectAll('.cda-dot')
      .data(cdaPos, d => d.nome)
      .join(enter =>
        enter.append('circle').attr('class', 'cda-dot')
          .attr('cx', d => d.x).attr('cy', d => d.y)
          .attr('r', 22)
          .attr('fill', d => d.genere === 'F' ? COL_F : COL_M)
          .attr('opacity', 0.2)
      );

    // CS dots
    svg.selectAll('.cs-dot')
      .data(csPos, d => d.nome)
      .join(enter =>
        enter.append('circle').attr('class', 'cs-dot')
          .attr('cx', d => d.x).attr('cy', d => d.y)
          .attr('r', 0)
          .attr('fill', d => d.genere === 'F' ? COL_F : COL_M)
          .attr('opacity', 0)
          .call(s => s.transition().duration(500).delay((_, i) => i * 80)
            .attr('r', 18).attr('opacity', 0.88))
      );

    svg.selectAll('.cs-init')
      .data(csPos, d => d.nome)
      .join(enter =>
        enter.append('text').attr('class', 'cs-init')
          .attr('x', d => d.x).attr('y', d => d.y)
          .attr('text-anchor', 'middle').attr('dominant-baseline', 'central')
          .attr('fill', 'white').attr('font-size', '10')
          .attr('font-family', 'IBM Plex Mono, monospace')
          .attr('opacity', 0)
          .text(d => initials(d.nome))
          .call(s => s.transition().delay((_, i) => i * 80 + 350).duration(300).attr('opacity', 0.9))
      );

    svg.selectAll('.cs-role')
      .data(csPos, d => d.nome)
      .join(enter =>
        enter.append('text').attr('class', 'cs-role')
          .attr('x', d => d.x).attr('y', d => d.y + 28)
          .attr('text-anchor', 'middle')
          .attr('font-family', 'Inter, sans-serif').attr('font-size', '8.5')
          .attr('fill', '#767676').attr('opacity', 0)
          .text(d => d.ruolo)
          .call(s => s.transition().delay((_, i) => i * 80 + 500).duration(300).attr('opacity', 1))
      );

    svg.append('text')
      .attr('x', 335).attr('y', H - 30)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'IBM Plex Mono, monospace').attr('font-size', '10')
      .attr('fill', '#505050').attr('opacity', 0)
      .text('1 donna · 4 uomini')
      .transition().delay(700).duration(400).attr('opacity', 1);
  }

  // ── Step 2 — + Comitato di Sostenibilità ─────────────────────────────────

  function step2(svg) {
    svg.selectAll('*').remove();

    addHeader(svg, 'Consiglio di Amministrazione', '9', 155, 0.28);
    addHeader(svg, 'Collegio Sindacale', '5', 335, 0.55);
    addHeader(svg, 'Comitato di Sostenibilità', '19', 521);
    addSep(svg, 285, 0.35);
    addSep(svg, 395, 0.35);

    // CdA — very dimmed
    svg.selectAll('.cda-dot')
      .data(cdaPos, d => d.nome)
      .join(enter =>
        enter.append('circle').attr('class', 'cda-dot')
          .attr('cx', d => d.x).attr('cy', d => d.y)
          .attr('r', 22)
          .attr('fill', d => d.genere === 'F' ? COL_F : COL_M)
          .attr('opacity', 0.15)
      );

    // CS — medium dimmed
    svg.selectAll('.cs-dot')
      .data(csPos, d => d.nome)
      .join(enter =>
        enter.append('circle').attr('class', 'cs-dot')
          .attr('cx', d => d.x).attr('cy', d => d.y)
          .attr('r', 18)
          .attr('fill', d => d.genere === 'F' ? COL_F : COL_M)
          .attr('opacity', 0.38)
      );

    // COS dots
    svg.selectAll('.cos-dot')
      .data(cosPos, d => d.nome)
      .join(enter =>
        enter.append('circle').attr('class', 'cos-dot')
          .attr('cx', d => d.x).attr('cy', d => d.y)
          .attr('r', 0)
          .attr('fill', d => d.genere === 'F' ? COL_F : COL_M)
          .attr('opacity', 0)
          .call(s => s.transition().duration(400).delay((_, i) => i * 35)
            .attr('r', 14).attr('opacity', 0.88))
      );

    svg.selectAll('.cos-init')
      .data(cosPos, d => d.nome)
      .join(enter =>
        enter.append('text').attr('class', 'cos-init')
          .attr('x', d => d.x).attr('y', d => d.y)
          .attr('text-anchor', 'middle').attr('dominant-baseline', 'central')
          .attr('fill', 'white').attr('font-size', '8')
          .attr('font-family', 'IBM Plex Mono, monospace')
          .attr('opacity', 0)
          .text(d => initials(d.nome))
          .call(s => s.transition().delay((_, i) => i * 35 + 350).duration(250).attr('opacity', 0.85))
      );

    svg.append('text')
      .attr('x', 521).attr('y', H - 30)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'IBM Plex Mono, monospace').attr('font-size', '10')
      .attr('fill', COL_F).attr('opacity', 0)
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
