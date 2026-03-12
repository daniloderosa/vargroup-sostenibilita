<script>
  import * as d3 from 'd3';
  import comunita from '$data/comunita.json';

  let { activeStep = 0 } = $props();
  let svgEl = $state(null);

  const W = 660, H = 460;

  const cats = comunita.categorie.map((c, i) => ({
    ...c,
    i,
    color: ['#2a4eef', '#1268fb', '#00A651', '#F5A623', '#1032cf'][i],
  }));

  // Posizioni cerchi categoria (pentagono allargato)
  const angles = cats.map((_, i) => (i / cats.length) * 2 * Math.PI - Math.PI / 2);
  const R_ORBIT = 150;
  const catPos = cats.map((c, i) => ({
    ...c,
    x: W / 2 + Math.cos(angles[i]) * R_ORBIT,
    y: H / 2 + Math.sin(angles[i]) * R_ORBIT,
    r: 22 + c.n * 2.2,
  }));

  $effect(() => {
    if (!svgEl) return;
    const svg = d3.select(svgEl);
    svg.selectAll('*').interrupt();
    if (activeStep === 0) step0(svg);
    else if (activeStep === 1) step1(svg, 0);
    else if (activeStep === 2) step2(svg, 1);
    else step3(svg);
  });

  function drawBubbles(svg, activeIdx = -1) {
    svg.selectAll('.cat-g').remove();

    catPos.forEach((c, i) => {
      const isActive = activeIdx === -1 || i === activeIdx;
      const g = svg.append('g').attr('class', `cat-g cat-${i}`)
        .attr('transform', `translate(${c.x},${c.y})`);

      g.append('circle').attr('r', c.r)
        .attr('fill', c.color)
        .attr('opacity', isActive ? 0.85 : 0.15);

      g.append('text').attr('text-anchor', 'middle').attr('y', -4)
        .attr('font-family', 'IBM Plex Mono, monospace').attr('font-size', '12')
        .attr('font-weight', '500')
        .attr('fill', isActive ? 'white' : '#505050')
        .text(c.n);

      // Label curta sotto
      const shortLabel = c.tipo.split(' ').slice(0, 2).join(' ');
      g.append('text').attr('text-anchor', 'middle').attr('y', c.r + 16)
        .attr('font-family', 'Inter, sans-serif').attr('font-size', '9.5')
        .attr('fill', isActive ? c.color : '#505050')
        .text(shortLabel);
    });
  }

  function step0(svg) {
    // Numero grande centrale
    svg.selectAll('.number-g').remove();
    const ng = svg.append('g').attr('class', 'number-g').attr('transform', `translate(${W / 2},${H / 2})`);
    ng.append('text').attr('text-anchor', 'middle').attr('y', -8)
      .attr('font-family', 'Manrope, sans-serif').attr('font-size', '42').attr('font-weight', '200')
      .attr('fill', '#F5A623').attr('letter-spacing', '-1').text('€ 450.000');
    ng.append('text').attr('text-anchor', 'middle').attr('y', 18)
      .attr('font-family', 'IBM Plex Mono, monospace').attr('font-size', '9.5').attr('fill', '#767676')
      .attr('letter-spacing', '1').text('VALORE INVESTITO IN COMUNITÀ');

    drawBubbles(svg, -1); // tutti attivi

    // Dot outline centrale
    ng.append('circle').attr('r', 60).attr('fill', 'none')
      .attr('stroke', '#2a2a35').attr('stroke-width', 1).attr('stroke-dasharray', '3,4');

    // Linee verso i nodi
    catPos.forEach(c => {
      svg.insert('line', '.cat-g')
        .attr('x1', W / 2).attr('y1', H / 2)
        .attr('x2', c.x).attr('y2', c.y)
        .attr('stroke', '#2a2a35').attr('stroke-width', 0.8).attr('opacity', 0.5);
    });
  }

  function step1(svg, idx) {
    svg.selectAll('.number-g').remove();
    drawBubbles(svg, idx);

    // Titolo categoria attiva + esempi
    svg.selectAll('.detail-g').remove();
    const cat = cats[idx];
    const dg = svg.append('g').attr('class', 'detail-g')
      .attr('transform', `translate(${W / 2},${H / 2})`);
    dg.append('text').attr('text-anchor', 'middle').attr('y', -18)
      .attr('font-family', 'Manrope, sans-serif').attr('font-size', '16').attr('font-weight', '300')
      .attr('fill', cat.color).text(cat.tipo);
    cat.esempi.slice(0, 3).forEach((e, i) => {
      dg.append('text').attr('text-anchor', 'middle').attr('y', 4 + i * 16)
        .attr('font-family', 'Inter, sans-serif').attr('font-size', '10').attr('fill', '#767676')
        .text(e);
    });
    if (cat.esempi.length > 3) {
      dg.append('text').attr('text-anchor', 'middle').attr('y', 4 + 3 * 16)
        .attr('font-family', 'IBM Plex Mono, monospace').attr('font-size', '9').attr('fill', '#505050')
        .text(`+ altri ${cat.esempi.length - 3}`);
    }
  }

  function step2(svg, idx) {
    svg.selectAll('.number-g, .detail-g').remove();
    drawBubbles(svg, idx);

    svg.selectAll('.detail-g').remove();
    const cat = cats[idx];
    const dg = svg.append('g').attr('class', 'detail-g')
      .attr('transform', `translate(${W / 2},${H / 2})`);
    dg.append('text').attr('text-anchor', 'middle').attr('y', -18)
      .attr('font-family', 'Manrope, sans-serif').attr('font-size', '16').attr('font-weight', '300')
      .attr('fill', cat.color).text(cat.tipo);
    cat.esempi.slice(0, 3).forEach((e, i) => {
      dg.append('text').attr('text-anchor', 'middle').attr('y', 4 + i * 16)
        .attr('font-family', 'Inter, sans-serif').attr('font-size', '10').attr('fill', '#767676')
        .text(e);
    });
  }

  function step3(svg) {
    svg.selectAll('.number-g, .detail-g').remove();
    drawBubbles(svg, -1);

    // Hackathon + alberi
    const dg = svg.append('g').attr('class', 'detail-g')
      .attr('transform', `translate(${W / 2},${H / 2})`);

    dg.append('text').attr('text-anchor', 'middle').attr('y', -20)
      .attr('font-family', 'Manrope, sans-serif').attr('font-size', '13').attr('font-weight', '300')
      .attr('fill', '#ffffff').text('Hackathon 2024: 80 giovani · 14 aziende · 32 ore');
    dg.append('text').attr('text-anchor', 'middle').attr('y', 0)
      .attr('font-family', 'Inter, sans-serif').attr('font-size', '10').attr('fill', '#767676')
      .text('Un albero piantato in Val di Fiemme');
    dg.append('text').attr('text-anchor', 'middle').attr('y', 14)
      .attr('font-family', 'Inter, sans-serif').attr('font-size', '10').attr('fill', '#767676')
      .text('per ogni nuova persona in Var Group');
  }
</script>

<div class="chart-wrapper">
  <svg
    bind:this={svgEl}
    viewBox="0 0 {W} {H}"
    width="100%"
    height="100%"
    preserveAspectRatio="xMidYMid meet"
    aria-label="Visualizzazione delle iniziative di comunità di Var Group: 30 iniziative, 5 categorie, valore 450.000 euro"
  ></svg>
</div>

<style>
  .chart-wrapper { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
</style>
