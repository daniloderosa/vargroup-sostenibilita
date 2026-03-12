<script>
  import * as d3 from 'd3';
  import comunita from '$data/comunita.json';

  let { activeStep = 0 } = $props();
  let svgEl = $state(null);

  const W = 660, H = 460;
  const CX = W / 2, CY = H / 2 + 10;

  const CAT_COLORS = ['#175C4A', '#33804C', '#61BD57', '#78B557', '#C9E35C'];

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

  const R_ORBIT = 148;
  const angles = cats.map((_, i) => (i / cats.length) * 2 * Math.PI - Math.PI / 2);
  const catPos = cats.map((c, i) => ({
    ...c,
    x: CX + Math.cos(angles[i]) * R_ORBIT,
    y: CY + Math.sin(angles[i]) * R_ORBIT,
    r: 24 + c.n * 2.0,
  }));

  // ── Disegno iniziale: eseguito una sola volta ──────────────────────────────
  // Crea linee, pallini, etichette con l'animazione d'entrata.
  // Stato iniziale: tutti i pallini attivi (activeIdx = -1).

  function initScene(svg) {
    // Linee connettori dal centro
    catPos.forEach(c => {
      svg.append('line')
        .attr('x1', CX).attr('y1', CY)
        .attr('x2', c.x).attr('y2', c.y)
        .attr('stroke', '#d4d4cc').attr('stroke-width', 0.8).attr('opacity', 0.6);
    });

    // Gruppi categoria
    catPos.forEach((c, i) => {
      const g = svg.append('g')
        .attr('class', `cat-g cat-idx-${i}`)
        .attr('transform', `translate(${c.x},${c.y})`);

      // Cerchio — animazione d'entrata su r, opacità già impostata
      g.append('circle').attr('class', 'cat-circle')
        .attr('r', 0)
        .attr('fill', c.color)
        .attr('opacity', 0.88)
        .transition().duration(400).delay(i * 60)
        .attr('r', c.r);

      // Numero iniziative
      g.append('text').attr('class', 'cat-count')
        .attr('text-anchor', 'middle').attr('dominant-baseline', 'central')
        .attr('y', -5)
        .attr('font-family', 'IBM Plex Mono, monospace').attr('font-size', '14').attr('font-weight', '500')
        .attr('fill', 'white').attr('opacity', 0)
        .text(c.n)
        .transition().delay(i * 60 + 250).duration(300).attr('opacity', 1);

      // "iniziative"
      g.append('text').attr('class', 'cat-sub')
        .attr('text-anchor', 'middle').attr('dominant-baseline', 'central')
        .attr('y', 9)
        .attr('font-family', 'Inter, sans-serif').attr('font-size', '7.5')
        .attr('fill', 'white').attr('opacity', 0)
        .text('iniziative')
        .transition().delay(i * 60 + 280).duration(300).attr('opacity', 1);

      // Etichetta multiriga sotto il cerchio
      const labelLines = c.shortLabel.split('\n');
      const labelY = c.r + 14;
      labelLines.forEach((ln, li) => {
        g.append('text').attr('class', 'cat-label')
          .attr('text-anchor', 'middle')
          .attr('y', labelY + li * 13)
          .attr('font-family', 'Inter, sans-serif').attr('font-size', '9')
          .attr('fill', c.color).attr('opacity', 0)
          .text(ln)
          .transition().delay(i * 60 + 320).duration(300).attr('opacity', 1);
      });
    });

    // Gruppo centrale — contenuto iniziale (step 0)
    const cg = svg.append('g').attr('class', 'center-g')
      .attr('transform', `translate(${CX},${CY})`);
    _renderCenter0(cg);
  }

  // ── Aggiornamento opacità: solo transizioni, nessuna rimozione ────────────

  function updateOpacities(svg, activeIdx) {
    catPos.forEach((c, i) => {
      const isActive = activeIdx === -1 || i === activeIdx;
      const g = svg.select(`.cat-idx-${i}`);

      g.select('.cat-circle')
        .transition().duration(350)
        .attr('opacity', isActive ? 0.88 : 0.15);

      g.selectAll('.cat-count, .cat-sub')
        .transition().duration(350)
        .attr('fill', isActive ? 'white' : '#aaaaaa');

      g.selectAll('.cat-label')
        .transition().duration(350)
        .attr('fill', isActive ? c.color : '#aaaaaa');
    });
  }

  // ── Aggiornamento centro: rimuove e ridisegna solo il gruppo centrale ──────

  function updateCenter(svg, activeIdx) {
    const cg = svg.select('.center-g');
    cg.selectAll('*').remove();

    if (activeIdx === -1) {
      _renderCenter0(cg);
    } else {
      const cat = cats[activeIdx];

      cg.append('text').attr('text-anchor', 'middle').attr('y', -30)
        .attr('font-family', 'Manrope, sans-serif').attr('font-size', '14').attr('font-weight', '300')
        .attr('fill', cat.color).attr('opacity', 0)
        .text(cat.tipo)
        .transition().duration(400).attr('opacity', 1);

      cat.esempi.slice(0, 4).forEach((e, i) => {
        cg.append('text').attr('text-anchor', 'middle').attr('y', -10 + i * 16)
          .attr('font-family', 'Inter, sans-serif').attr('font-size', '10').attr('fill', '#555555')
          .attr('opacity', 0).text(e)
          .transition().delay(80 + i * 60).duration(300).attr('opacity', 1);
      });

      if (cat.esempi.length > 4) {
        cg.append('text').attr('text-anchor', 'middle').attr('y', -10 + 4 * 16)
          .attr('font-family', 'IBM Plex Mono, monospace').attr('font-size', '9').attr('fill', '#888888')
          .attr('opacity', 0).text('+ altri ' + (cat.esempi.length - 4))
          .transition().delay(350).duration(300).attr('opacity', 1);
      }
    }
  }

  // Helper: contenuto centrale step 0
  function _renderCenter0(cg) {
    cg.append('text').attr('text-anchor', 'middle').attr('y', -10)
      .attr('font-family', 'Manrope, sans-serif').attr('font-size', '38').attr('font-weight', '200')
      .attr('fill', '#33804C').attr('letter-spacing', '-1').text('€ 450.000');
    cg.append('text').attr('text-anchor', 'middle').attr('y', 18)
      .attr('font-family', 'IBM Plex Mono, monospace').attr('font-size', '9').attr('fill', '#888888')
      .attr('letter-spacing', '1').text('VALORE INVESTITO IN COMUNITÀ');
    cg.append('circle').attr('r', 58).attr('fill', 'none')
      .attr('stroke', '#d4d4cc').attr('stroke-width', 1).attr('stroke-dasharray', '3,4');
  }

  // ── Effect: init una volta, poi solo aggiornamenti ────────────────────────

  $effect(() => {
    if (!svgEl) return;
    const svg = d3.select(svgEl);
    const activeIdx = activeStep === 0 ? -1 : activeStep - 1;

    // Prima render: disegna tutto e torna (stato iniziale già corretto)
    if (svg.selectAll('.cat-g').empty()) {
      initScene(svg);
      return;
    }

    // Cambi di step successivi: solo opacità + contenuto centrale
    updateOpacities(svg, activeIdx);
    updateCenter(svg, activeIdx);
  });
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
