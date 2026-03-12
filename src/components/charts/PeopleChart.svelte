<script>
  import * as d3 from 'd3';
  import persone from '$data/persone.json';

  let { activeStep = 0 } = $props();
  let svgEl = $state(null);

  const W = 700, H = 460;
  const DOT_R = 4, DOT_STEP = 11;
  const MAR = { top: 90, bottom: 60, left: 20, right: 20 };

  // LCG seeded random per posizioni deterministiche
  function lcg(seed) {
    let s = seed;
    return () => { s = (1103515245 * s + 12345) & 0x7fffffff; return s / 0x7fffffff; };
  }
  const rand = lcg(42);

  // 100 dot rappresentativi
  const N = 100;
  const geoCounts = [58, 27, 12, 3];
  const geoColors = ['#1032cf', '#2a4eef', '#1268fb', '#00A651'];
  const geoLabels = ['Nord Italia', 'Centro Italia', 'Estero', 'Sud Italia'];
  const ageBands = [
    { label: '≤30', pct: 0.221, color: '#1268fb' },
    { label: '31–50', pct: 0.481, color: '#2a4eef' },
    { label: '>50', pct: 0.285, color: '#1032cf' },
  ];

  // Genera dots
  const dots = [];
  geoCounts.forEach((cnt, gi) => {
    for (let j = 0; j < cnt; j++) {
      const roll = rand();
      const ageGroup = roll < ageBands[0].pct ? 0 : roll < ageBands[0].pct + ageBands[1].pct ? 1 : 2;
      const isNewHire = rand() < 0.14;
      dots.push({ id: dots.length, geo: gi, ageGroup, isNewHire });
    }
  });

  // Posizioni scatter (step 0)
  const scatterPos = dots.map(() => ({
    x: MAR.left + DOT_R + rand() * (W - MAR.left - MAR.right - DOT_R * 2),
    y: MAR.top + rand() * (H - MAR.top - MAR.bottom),
  }));

  // Posizioni geo-group (step 1, 2)
  const geoPos = (() => {
    const positions = new Array(N);
    const availW = W - MAR.left - MAR.right;
    const secWidths = geoCounts.map(c => Math.round(availW * c / N));
    let xOff = MAR.left, idx = 0;
    geoCounts.forEach((cnt, gi) => {
      const secW = secWidths[gi];
      const cols = Math.max(1, Math.floor(secW / DOT_STEP));
      const xStart = xOff + (secW - cols * DOT_STEP) / 2 + DOT_STEP / 2;
      for (let j = 0; j < cnt; j++) {
        positions[idx++] = {
          x: xStart + (j % cols) * DOT_STEP,
          y: MAR.top + Math.floor(j / cols) * DOT_STEP,
        };
      }
      xOff += secW;
    });
    return positions;
  })();

  $effect(() => {
    if (!svgEl) return;
    const svg = d3.select(svgEl);
    svg.selectAll('*').interrupt();
    if (activeStep === 0) step0(svg);
    else if (activeStep === 1) step1(svg);
    else if (activeStep === 2) step2(svg);
    else step3(svg);
  });

  function ensureDots(svg) {
    return svg.selectAll('.dot')
      .data(dots, d => d.id)
      .join(
        enter => enter.append('circle')
          .attr('class', 'dot')
          .attr('r', DOT_R)
          .attr('cx', (_, i) => scatterPos[i].x)
          .attr('cy', (_, i) => scatterPos[i].y)
          .attr('fill', '#2a4eef')
          .attr('opacity', 0)
      );
  }

  function step0(svg) {
    svg.selectAll('.bar-g, .axis-g, .geo-label, .age-label, .counter-g').remove();

    const allDots = ensureDots(svg);
    allDots.transition().duration(700).delay((_, i) => i * 4)
      .attr('cx', (_, i) => scatterPos[i].x)
      .attr('cy', (_, i) => scatterPos[i].y)
      .attr('r', DOT_R)
      .attr('fill', '#2a4eef')
      .attr('opacity', 0.6);

    // Counter numerico in alto
    svg.selectAll('.counter-g').remove();
    const cg = svg.append('g').attr('class', 'counter-g')
      .attr('transform', `translate(${W / 2}, 42)`);
    cg.append('text')
      .attr('text-anchor', 'middle')
      .attr('font-family', 'Manrope, sans-serif')
      .attr('font-size', '36')
      .attr('font-weight', '200')
      .attr('fill', '#ffffff')
      .attr('letter-spacing', '-1')
      .text('4.243');
    cg.append('text')
      .attr('text-anchor', 'middle')
      .attr('y', 22)
      .attr('font-family', 'IBM Plex Mono, monospace')
      .attr('font-size', '10')
      .attr('fill', '#767676')
      .attr('letter-spacing', '1.5')
      .text('PERSONE · +10,4% vs 2024');
  }

  function step1(svg) {
    svg.selectAll('.bar-g, .axis-g, .age-label').remove();

    const allDots = ensureDots(svg);
    allDots.transition().duration(600).delay((_, i) => i * 3)
      .attr('cx', (_, i) => geoPos[i].x)
      .attr('cy', (_, i) => geoPos[i].y)
      .attr('fill', d => geoColors[d.geo])
      .attr('opacity', 0.8)
      .attr('r', DOT_R);

    // Labels di sezione geografica
    const availW = W - MAR.left - MAR.right;
    const secWidths = geoCounts.map(c => Math.round(availW * c / N));
    const geoLabelData = geoCounts.map((cnt, gi) => {
      const secW = secWidths[gi];
      const prevW = secWidths.slice(0, gi).reduce((a, b) => a + b, 0);
      return { label: geoLabels[gi], pct: persone.geografia[gi].pct, x: MAR.left + prevW + secW / 2, color: geoColors[gi] };
    });

    svg.selectAll('.geo-label').remove();
    geoLabelData.forEach(d => {
      const g = svg.append('g').attr('class', 'geo-label')
        .attr('transform', `translate(${d.x}, ${H - 35})`).attr('opacity', 0);
      g.append('text').attr('text-anchor', 'middle')
        .attr('font-family', 'Inter, sans-serif').attr('font-size', '10')
        .attr('fill', d.color).text(d.label);
      g.append('text').attr('text-anchor', 'middle').attr('y', 14)
        .attr('font-family', 'IBM Plex Mono, monospace').attr('font-size', '10')
        .attr('fill', '#505050').text(d.pct + '%');
      g.transition().duration(400).delay(300).attr('opacity', 1);
    });

    svg.selectAll('.counter-g').transition().duration(300).attr('opacity', 0).remove();
  }

  function step2(svg) {
    svg.selectAll('.bar-g, .axis-g, .geo-label').remove();

    const allDots = ensureDots(svg);
    allDots.transition().duration(500).delay((_, i) => i * 3)
      .attr('cx', (_, i) => geoPos[i].x)
      .attr('cy', (_, i) => geoPos[i].y)
      .attr('fill', d => ageBands[d.ageGroup].color)
      .attr('r', d => (d.ageGroup === 0 && d.isNewHire) ? DOT_R + 2 : DOT_R)
      .attr('opacity', d => (d.ageGroup === 0 && d.isNewHire) ? 1 : 0.55);

    // Label fasce età
    svg.selectAll('.age-label').remove();
    ageBands.forEach((b, bi) => {
      const g = svg.append('g').attr('class', 'age-label')
        .attr('transform', `translate(${W * (0.15 + bi * 0.35)}, ${H - 30})`).attr('opacity', 0);
      g.append('circle').attr('r', 5).attr('cx', 0).attr('cy', -2).attr('fill', b.color);
      g.append('text').attr('x', 10).attr('y', 2)
        .attr('font-family', 'Inter, sans-serif').attr('font-size', '10')
        .attr('fill', b.color).text(b.label);
      g.transition().duration(400).delay(300).attr('opacity', 1);
    });

    // Nota sui nuovi under 30
    svg.selectAll('.age-note').remove();
    svg.append('text').attr('class', 'age-note')
      .attr('x', W / 2).attr('y', 28)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'IBM Plex Mono, monospace').attr('font-size', '10')
      .attr('fill', '#1268fb').attr('opacity', 0)
      .text('● = nuovi ingressi under 30 (46% delle 596 assunzioni 2025)')
      .transition().duration(400).delay(500).attr('opacity', 0.9);
  }

  function step3(svg) {
    svg.selectAll('.dot').transition().duration(300).attr('r', 0).attr('opacity', 0);
    svg.selectAll('.geo-label, .age-label, .age-note, .counter-g')
      .transition().duration(250).attr('opacity', 0).remove();

    const data = persone.formazione.tipologie;
    const barH = 36, barGap = 18;
    const barAreaH = data.length * (barH + barGap) - barGap;
    const startY = (H - barAreaH) / 2 - 10;
    const maxW = W - 200;

    svg.selectAll('.bar-g').remove();

    data.forEach((d, i) => {
      const g = svg.append('g').attr('class', 'bar-g')
        .attr('transform', `translate(150, ${startY + i * (barH + barGap)})`);

      // Background bar
      g.append('rect').attr('x', 0).attr('y', 0).attr('height', barH)
        .attr('width', maxW).attr('rx', 2)
        .attr('fill', '#1c1c22');

      // Fill bar
      g.append('rect').attr('x', 0).attr('y', 0).attr('height', barH)
        .attr('width', 0).attr('rx', 2)
        .attr('fill', '#1032cf').attr('opacity', 0.9)
        .transition().duration(700).delay(i * 120)
        .attr('width', maxW * d.pct / 100);

      // Label sinistra
      g.append('text').attr('x', -10).attr('y', barH / 2 + 1)
        .attr('text-anchor', 'end').attr('dominant-baseline', 'central')
        .attr('font-family', 'Inter, sans-serif').attr('font-size', '11')
        .attr('fill', '#767676').text(d.tipo);

      // Percentuale destra
      g.append('text').attr('x', maxW + 10).attr('y', barH / 2 + 1)
        .attr('dominant-baseline', 'central')
        .attr('font-family', 'IBM Plex Mono, monospace').attr('font-size', '11')
        .attr('fill', '#ffffff').attr('opacity', 0)
        .text(d.pct + '%')
        .transition().duration(400).delay(i * 120 + 500).attr('opacity', 1);
    });

    // Title
    svg.selectAll('.bar-title').remove();
    svg.append('text').attr('class', 'bar-title')
      .attr('x', W / 2).attr('y', startY - 30)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'IBM Plex Mono, monospace').attr('font-size', '10')
      .attr('fill', '#505050').attr('letter-spacing', '1.5')
      .text('TIPOLOGIE DI FORMAZIONE 2025 · 73.183 ORE TOTALI');
  }
</script>

<div class="chart-wrapper">
  <svg
    bind:this={svgEl}
    viewBox="0 0 {W} {H}"
    width="100%"
    height="100%"
    preserveAspectRatio="xMidYMid meet"
    aria-label="Dot plot delle persone in Var Group: distribuzione geografica, fasce d'età e formazione"
  ></svg>
</div>

<style>
  .chart-wrapper { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
</style>
