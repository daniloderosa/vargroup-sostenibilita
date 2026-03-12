<script>
  import * as d3 from 'd3';
  import comunita from '$data/comunita.json';

  let { activeStep = 0 } = $props();
  let svgEl = $state(null);

  const W = 660, H = 460;
  const CX = W / 2, CY = H / 2 + 10;

  // Green shades from PDF palette, one per category
  const CAT_COLORS = ['#175C4A', '#33804C', '#61BD57', '#78B557', '#C9E35C'];

  // Short display labels that fit inside/below the circle
  const SHORT_LABELS = [
    'Benessere\ne salute',
    'Inclusione\ndigitale',
    'Educazione\ne giovani',
    'Ambiente\ne territorio',
    'Sport\ne cultura',
  ];

  const cats = comunita.categorie.map((c, i) => ({
    ...c,
    i,
    color: CAT_COLORS[i],
    shortLabel: SHORT_LABELS[i],
  }));

  // Pentagon layout
  const R_ORBIT = 148;
  const angles = cats.map((_, i) => (i / cats.length) * 2 * Math.PI - Math.PI / 2);
  const catPos = cats.map((c, i) => ({
    ...c,
    x: CX + Math.cos(angles[i]) * R_ORBIT,
    y: CY + Math.sin(angles[i]) * R_ORBIT,
    r: 24 + c.n * 2.0, // radius proportional to n
  }));

  $effect(() => {
    if (!svgEl) return;
    const svg = d3.select(svgEl);
    svg.selectAll('*').interrupt();
    // step 0: all active, no detail
    // steps 1-5: each step highlights one category (step 1 → cat 0, etc.)
    const activeIdx = activeStep === 0 ? -1 : activeStep - 1;
    drawScene(svg, activeIdx);
  });

  function drawScene(svg, activeIdx) {
    svg.selectAll('*').remove();

    // Connector lines from center
    catPos.forEach(c => {
      svg.append('line')
        .attr('x1', CX).attr('y1', CY)
        .attr('x2', c.x).attr('y2', c.y)
        .attr('stroke', '#d4d4cc').attr('stroke-width', 0.8).attr('opacity', 0.6);
    });

    if (activeIdx === -1) {
      // Step 0: big number + all circles visible
      const ng = svg.append('g').attr('transform', `translate(${CX},${CY})`);
      ng.append('text').attr('text-anchor', 'middle').attr('y', -10)
        .attr('font-family', 'Manrope, sans-serif').attr('font-size', '38').attr('font-weight', '200')
        .attr('fill', '#33804C').attr('letter-spacing', '-1').text('€ 450.000');
      ng.append('text').attr('text-anchor', 'middle').attr('y', 18)
        .attr('font-family', 'IBM Plex Mono, monospace').attr('font-size', '9').attr('fill', '#888888')
        .attr('letter-spacing', '1').text('VALORE INVESTITO IN COMUNITÀ');
      ng.append('circle').attr('r', 58).attr('fill', 'none')
        .attr('stroke', '#d4d4cc').attr('stroke-width', 1).attr('stroke-dasharray', '3,4');
    } else {
      // Show active category detail at center
      const cat = cats[activeIdx];
      const dg = svg.append('g').attr('transform', `translate(${CX},${CY})`);

      dg.append('text').attr('text-anchor', 'middle').attr('y', -30)
        .attr('font-family', 'Manrope, sans-serif').attr('font-size', '14').attr('font-weight', '300')
        .attr('fill', cat.color).attr('opacity', 0)
        .text(cat.tipo)
        .transition().duration(400).attr('opacity', 1);

      cat.esempi.slice(0, 4).forEach((e, i) => {
        dg.append('text').attr('text-anchor', 'middle').attr('y', -10 + i * 16)
          .attr('font-family', 'Inter, sans-serif').attr('font-size', '10').attr('fill', '#555555')
          .attr('opacity', 0).text(e)
          .transition().delay(80 + i * 60).duration(300).attr('opacity', 1);
      });

      if (cat.esempi.length > 4) {
        dg.append('text').attr('text-anchor', 'middle').attr('y', -10 + 4 * 16)
          .attr('font-family', 'IBM Plex Mono, monospace').attr('font-size', '9').attr('fill', '#888888')
          .attr('opacity', 0).text('+ altri ' + (cat.esempi.length - 4))
          .transition().delay(350).duration(300).attr('opacity', 1);
      }
    }

    // Draw all category bubbles
    catPos.forEach((c, i) => {
      const isActive = activeIdx === -1 || i === activeIdx;
      const g = svg.append('g')
        .attr('class', 'cat-g cat-' + i)
        .attr('transform', `translate(${c.x},${c.y})`);

      g.append('circle').attr('r', 0)
        .attr('fill', c.color)
        .attr('opacity', isActive ? 0.88 : 0.15)
        .transition().duration(400).delay(i * 60)
        .attr('r', c.r);

      // Count at center of circle
      g.append('text').attr('text-anchor', 'middle').attr('dominant-baseline', 'central')
        .attr('y', -5)
        .attr('font-family', 'IBM Plex Mono, monospace').attr('font-size', '14').attr('font-weight', '500')
        .attr('fill', isActive ? 'white' : '#aaaaaa').attr('opacity', 0)
        .text(c.n)
        .transition().delay(i * 60 + 250).duration(300).attr('opacity', 1);

      g.append('text').attr('text-anchor', 'middle').attr('dominant-baseline', 'central')
        .attr('y', 9)
        .attr('font-family', 'Inter, sans-serif').attr('font-size', '7.5')
        .attr('fill', isActive ? 'white' : '#aaaaaa').attr('opacity', 0)
        .text('iniziative')
        .transition().delay(i * 60 + 280).duration(300).attr('opacity', 1);

      // Multi-line label below circle
      const labelLines = c.shortLabel.split('\n');
      const labelY = c.r + 14;
      labelLines.forEach((ln, li) => {
        g.append('text')
          .attr('text-anchor', 'middle')
          .attr('y', labelY + li * 13)
          .attr('font-family', 'Inter, sans-serif').attr('font-size', '9')
          .attr('fill', isActive ? c.color : '#aaaaaa').attr('opacity', 0)
          .text(ln)
          .transition().delay(i * 60 + 320).duration(300).attr('opacity', 1);
      });
    });
  }
</script>

<div class="chart-wrapper">
  <svg
    bind:this={svgEl}
    viewBox="0 0 {W} {H}"
    width="100%"
    height="100%"
    preserveAspectRatio="xMidYMid meet"
    aria-label="Visualizzazione delle iniziative di comunità di Var Group: 30+ iniziative, 5 categorie, oltre 450.000 euro investiti"
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
