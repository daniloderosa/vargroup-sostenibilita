<script>
  import * as d3 from 'd3';
  import genere from '$data/genere.json';

  let { activeStep = 0 } = $props();
  let svgEl = $state(null);

  const W = 620, H = 460;

  $effect(() => {
    if (!svgEl) return;
    const svg = d3.select(svgEl);
    svg.selectAll('*').interrupt();
    if (activeStep === 0) step0(svg);
    else if (activeStep === 1) step1(svg);
    else step2(svg);
  });

  // STEP 0 — Waffle chart 10×10
  function step0(svg) {
    svg.selectAll('.bar-g, .rect-g, .parental-g, .title-label').remove();

    const CELL = 34, GAP = 5;
    const TOTAL = 10 * 10;
    const menCount = 71;
    const startX = (W - (10 * (CELL + GAP) - GAP)) / 2;
    const startY = (H - (10 * (CELL + GAP) - GAP)) / 2;

    const cells = d3.range(TOTAL).map(i => ({
      i,
      row: Math.floor(i / 10),
      col: i % 10,
      isMale: i < menCount,
    }));

    svg.selectAll('.waffle-cell')
      .data(cells, d => d.i)
      .join(
        enter => enter.append('rect')
          .attr('class', 'waffle-cell')
          .attr('x', d => startX + d.col * (CELL + GAP))
          .attr('y', d => startY + d.row * (CELL + GAP))
          .attr('width', CELL).attr('height', CELL).attr('rx', 2)
          .attr('fill', d => d.isMale ? '#1032cf' : '#F5A623')
          .attr('opacity', 0)
          .call(s => s.transition().duration(300).delay(d => (d.row * 10 + d.col) * 8).attr('opacity', 0.85))
      );

    // Labels
    svg.selectAll('.waffle-label').remove();
    [
      { pct: '71%', label: 'Uomini', color: '#1032cf', x: startX - 10, anchor: 'end' },
      { pct: '29%', label: 'Donne', color: '#F5A623', x: startX + 10 * (CELL + GAP) - GAP + 10, anchor: 'start' },
    ].forEach((d, i) => {
      const g = svg.append('g').attr('class', 'waffle-label')
        .attr('transform', `translate(${d.x}, ${startY + (H - startY * 2) / 2})`).attr('opacity', 0);
      g.append('text').attr('text-anchor', d.anchor).attr('font-family', 'Manrope, sans-serif')
        .attr('font-size', '28').attr('font-weight', '200').attr('fill', d.color).text(d.pct);
      g.append('text').attr('y', 26).attr('text-anchor', d.anchor)
        .attr('font-family', 'Inter, sans-serif').attr('font-size', '11').attr('fill', '#767676').text(d.label);
      g.transition().duration(400).delay(900 + i * 150).attr('opacity', 1);
    });
  }

  // STEP 1 — Stacked bars per livello
  function step1(svg) {
    svg.selectAll('.waffle-cell, .waffle-label, .rect-g, .parental-g, .title-label').remove();

    const data = genere.per_inquadramento;
    const barH = 44, barGap = 24;
    const startY = (H - data.length * (barH + barGap) + barGap) / 2;
    const maxW = W - 200;

    svg.selectAll('.bar-g').remove();
    data.forEach((d, i) => {
      const total = d.totale;
      const menW = (d.uomini / total) * maxW;
      const donneW = (d.donne / total) * maxW;
      const g = svg.append('g').attr('class', 'bar-g')
        .attr('transform', `translate(120, ${startY + i * (barH + barGap)})`);

      // Men bar
      g.append('rect').attr('height', barH).attr('width', 0).attr('rx', 0).attr('fill', '#1032cf').attr('opacity', 0.85)
        .transition().duration(600).delay(i * 100).attr('width', menW);

      // Women bar
      g.append('rect').attr('x', menW).attr('height', barH).attr('width', 0).attr('rx', 0).attr('fill', '#F5A623').attr('opacity', 0.85)
        .transition().duration(600).delay(i * 100 + 100).attr('width', donneW);

      // Livello label
      g.append('text').attr('x', -8).attr('y', barH / 2 + 1).attr('text-anchor', 'end')
        .attr('dominant-baseline', 'central').attr('font-family', 'Inter, sans-serif')
        .attr('font-size', '12').attr('fill', '#767676').text(d.livello);

      // Percentuale donne
      const donneP = Math.round(d.donne / d.totale * 100);
      g.append('text').attr('x', maxW + 10).attr('y', barH / 2 + 1)
        .attr('dominant-baseline', 'central').attr('font-family', 'IBM Plex Mono, monospace')
        .attr('font-size', '11').attr('fill', '#F5A623').attr('opacity', 0)
        .text(donneP + '% donne')
        .transition().duration(400).delay(i * 100 + 500).attr('opacity', 1);
    });

    // Legenda
    const lg = svg.append('g').attr('class', 'bar-g')
      .attr('transform', `translate(120, ${H - 32})`);
    [{ c: '#1032cf', l: 'Uomini', x: 0 }, { c: '#F5A623', l: 'Donne', x: 90 }].forEach(item => {
      lg.append('rect').attr('x', item.x).attr('width', 14).attr('height', 10).attr('fill', item.c);
      lg.append('text').attr('x', item.x + 18).attr('y', 9).attr('font-family', 'Inter, sans-serif').attr('font-size', '11').attr('fill', '#767676').text(item.l);
    });
  }

  // STEP 2 — Gender pay gap: due rettangoli proporzionali
  function step2(svg) {
    svg.selectAll('.waffle-cell, .waffle-label, .bar-g, .parental-g, .title-label').remove();

    const gap = genere.gender_pay_gap.italia_pct; // 12
    const fullW = W - 120, H_RECT = 90;
    const womenW = fullW * (1 - gap / 100);
    const startX = 60, midY = H / 2 - 60;

    svg.selectAll('.rect-g').remove();
    const rg = svg.append('g').attr('class', 'rect-g').attr('transform', `translate(${startX}, ${midY})`);

    // Uomo — barra piena
    rg.append('text').attr('x', 0).attr('y', -12).attr('font-family', 'Inter, sans-serif')
      .attr('font-size', '11').attr('fill', '#767676').text('Retribuzione media — Uomo');
    rg.append('rect').attr('width', 0).attr('height', H_RECT).attr('rx', 2)
      .attr('fill', '#1032cf').attr('opacity', 0.85)
      .transition().duration(700).attr('width', fullW);
    rg.append('text').attr('x', fullW / 2).attr('y', H_RECT / 2 + 6)
      .attr('text-anchor', 'middle').attr('dominant-baseline', 'central')
      .attr('font-family', 'Manrope, sans-serif').attr('font-size', '22').attr('font-weight', '300')
      .attr('fill', 'white').text('€ 1,00');

    const donnaY = midY + H_RECT + 30;
    const rg2 = svg.append('g').attr('class', 'rect-g').attr('transform', `translate(${startX}, ${donnaY})`);
    rg2.append('text').attr('x', 0).attr('y', -12).attr('font-family', 'Inter, sans-serif')
      .attr('font-size', '11').attr('fill', '#767676').text('Retribuzione media — Donna  (gap Italia: 12%)');
    rg2.append('rect').attr('width', 0).attr('height', H_RECT).attr('rx', 2)
      .attr('fill', '#F5A623').attr('opacity', 0.85)
      .transition().duration(700).delay(200).attr('width', womenW);
    rg2.append('text').attr('x', womenW / 2).attr('y', H_RECT / 2 + 6)
      .attr('text-anchor', 'middle').attr('dominant-baseline', 'central')
      .attr('font-family', 'Manrope, sans-serif').attr('font-size', '22').attr('font-weight', '300')
      .attr('fill', 'white').attr('opacity', 0).text('€ 0,88')
      .transition().duration(400).delay(700).attr('opacity', 1);

    // Linea gap + annotazione
    rg2.append('line').attr('x1', womenW).attr('y1', 0).attr('x2', fullW).attr('y2', 0)
      .attr('stroke', '#e05c5c').attr('stroke-width', 1.5).attr('stroke-dasharray', '3,3')
      .attr('opacity', 0).transition().duration(400).delay(900).attr('opacity', 0.8);
    rg2.append('line').attr('x1', womenW).attr('y1', H_RECT).attr('x2', fullW).attr('y2', H_RECT)
      .attr('stroke', '#e05c5c').attr('stroke-width', 1.5).attr('stroke-dasharray', '3,3')
      .attr('opacity', 0).transition().duration(400).delay(900).attr('opacity', 0.8);
    rg2.append('text').attr('x', (womenW + fullW) / 2).attr('y', H_RECT / 2 + 6)
      .attr('text-anchor', 'middle').attr('dominant-baseline', 'central')
      .attr('font-family', 'IBM Plex Mono, monospace').attr('font-size', '11')
      .attr('fill', '#e05c5c').attr('opacity', 0).text('–12%')
      .transition().duration(400).delay(1100).attr('opacity', 1);
  }


</script>

<div class="chart-wrapper">
  <svg
    bind:this={svgEl}
    viewBox="0 0 {W} {H}"
    width="100%"
    height="100%"
    preserveAspectRatio="xMidYMid meet"
    aria-label="Visualizzazioni parità di genere in Var Group: composizione (29% donne), inquadramento gerarchico, gender pay gap 12%"
  ></svg>
</div>

<style>
  .chart-wrapper { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
</style>
