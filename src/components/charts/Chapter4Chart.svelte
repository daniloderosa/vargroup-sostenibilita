<script>
  import * as d3 from 'd3';
  import persone from '$data/persone.json';
  import genere from '$data/genere.json';

  let { activeStep = 0 } = $props();
  let svgEl = $state(null);

  const W = 700, H = 460;
  const DOT_R = 4, DOT_STEP = 11;
  const MAR = { top: 88, bottom: 56, left: 20, right: 20 };

  // ── LCG seeded random for deterministic positions ─────────────────────────
  function lcg(seed) {
    let s = seed;
    return () => { s = (1103515245 * s + 12345) & 0x7fffffff; return s / 0x7fffffff; };
  }
  const rand = lcg(42);

  // ── Dot data ──────────────────────────────────────────────────────────────
  const N = 100;
  const geoCounts = [58, 27, 12, 3];
  const geoColors = ['#175C4A', '#33804C', '#61BD57', '#C9E35C'];
  const geoLabels = ['Nord Italia', 'Centro Italia', 'Estero', 'Sud Italia'];
  const ageBands = [
    { label: '≤30',   pct: 0.221, color: '#C9E35C' },
    { label: '31–50', pct: 0.481, color: '#33804C' },
    { label: '>50',   pct: 0.285, color: '#175C4A' },
  ];

  const dots = [];
  geoCounts.forEach((cnt, gi) => {
    for (let j = 0; j < cnt; j++) {
      const roll = rand();
      const ageGroup = roll < ageBands[0].pct ? 0
                     : roll < ageBands[0].pct + ageBands[1].pct ? 1
                     : 2;
      const isNewHire = rand() < 0.14;
      dots.push({ id: dots.length, geo: gi, ageGroup, isNewHire });
    }
  });

  // ── Scatter positions (step 0) ────────────────────────────────────────────
  const scatterPos = dots.map(() => ({
    x: MAR.left + DOT_R + rand() * (W - MAR.left - MAR.right - DOT_R * 2),
    y: MAR.top + rand() * (H - MAR.top - MAR.bottom),
  }));

  // ── Geo-group positions (step 1) ──────────────────────────────────────────
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

  // ── Age-group positions (step 2) — physically repositioned ───────────────
  // 3 horizontal bands, each band stacked in columns
  const agePos = (() => {
    const positions = new Array(N);
    const bandW = Math.floor((W - MAR.left - MAR.right) / 3);
    // Gather dot indices per age band
    const byBand = [[], [], []];
    dots.forEach((d, i) => byBand[d.ageGroup].push(i));

    byBand.forEach((indices, bi) => {
      const xOff = MAR.left + bi * bandW;
      const cols = Math.max(1, Math.floor((bandW - 10) / DOT_STEP));
      const xStart = xOff + (bandW - cols * DOT_STEP) / 2 + DOT_STEP / 2;
      indices.forEach((dotIdx, j) => {
        positions[dotIdx] = {
          x: xStart + (j % cols) * DOT_STEP,
          y: MAR.top + Math.floor(j / cols) * DOT_STEP,
        };
      });
    });
    return positions;
  })();

  // ── Reactive draw ─────────────────────────────────────────────────────────
  $effect(() => {
    if (!svgEl) return;
    const svg = d3.select(svgEl);
    svg.selectAll('*').interrupt();
    if      (activeStep === 0) step0(svg);
    else if (activeStep === 1) step1(svg);
    else if (activeStep === 2) step2(svg);
    else if (activeStep === 3) step3(svg);
    else if (activeStep === 4) step4(svg);
    else                       step5(svg);
  });

  // ── Shared: ensure dots exist ─────────────────────────────────────────────
  function ensureDots(svg) {
    return svg.selectAll('.dot')
      .data(dots, d => d.id)
      .join(
        enter => enter.append('circle')
          .attr('class', 'dot')
          .attr('r', DOT_R)
          .attr('cx', (_, i) => scatterPos[i].x)
          .attr('cy', (_, i) => scatterPos[i].y)
          .attr('fill', '#33804C')
          .attr('opacity', 0)
      );
  }

  // ── Step 0 — Scatter totale ───────────────────────────────────────────────
  function step0(svg) {
    svg.selectAll('.bar-g,.geo-label,.age-label,.age-note,.waffle-cell,.waffle-label,.stacked-g,.pay-g,.bar-title,.counter-g').remove();

    const allDots = ensureDots(svg);
    allDots.transition().duration(700).delay((_, i) => i * 4)
      .attr('cx', (_, i) => scatterPos[i].x)
      .attr('cy', (_, i) => scatterPos[i].y)
      .attr('r', DOT_R)
      .attr('fill', '#33804C')
      .attr('opacity', 0.65);

    // Counter
    svg.selectAll('.counter-g').remove();
    const cg = svg.append('g').attr('class', 'counter-g')
      .attr('transform', `translate(${W / 2}, 42)`);
    cg.append('text')
      .attr('text-anchor', 'middle')
      .attr('font-family', 'Manrope, sans-serif').attr('font-size', '36').attr('font-weight', '200')
      .attr('fill', '#1a1a1a').attr('letter-spacing', '-1').text('4.243');
    cg.append('text')
      .attr('text-anchor', 'middle').attr('y', 22)
      .attr('font-family', 'IBM Plex Mono, monospace').attr('font-size', '10')
      .attr('fill', '#888888').attr('letter-spacing', '1.5')
      .text('PERSONE · +10,4% vs 2024');
  }

  // ── Step 1 — Geo groups ───────────────────────────────────────────────────
  function step1(svg) {
    svg.selectAll('.bar-g,.age-label,.age-note,.waffle-cell,.waffle-label,.stacked-g,.pay-g,.bar-title').remove();

    const allDots = ensureDots(svg);
    allDots.transition().duration(600).delay((_, i) => i * 3)
      .attr('cx', (_, i) => geoPos[i].x)
      .attr('cy', (_, i) => geoPos[i].y)
      .attr('fill', d => geoColors[d.geo])
      .attr('opacity', 0.85)
      .attr('r', DOT_R);

    const availW = W - MAR.left - MAR.right;
    const secWidths = geoCounts.map(c => Math.round(availW * c / N));
    svg.selectAll('.geo-label').remove();
    geoCounts.forEach((cnt, gi) => {
      const secW = secWidths[gi];
      const prevW = secWidths.slice(0, gi).reduce((a, b) => a + b, 0);
      const cx = MAR.left + prevW + secW / 2;
      const g = svg.append('g').attr('class', 'geo-label')
        .attr('transform', `translate(${cx}, ${H - 32})`).attr('opacity', 0);
      g.append('text').attr('text-anchor', 'middle')
        .attr('font-family', 'Inter, sans-serif').attr('font-size', '10')
        .attr('fill', geoColors[gi]).text(geoLabels[gi]);
      g.append('text').attr('text-anchor', 'middle').attr('y', 14)
        .attr('font-family', 'IBM Plex Mono, monospace').attr('font-size', '10')
        .attr('fill', '#888888').text(persone.geografia[gi].pct + '%');
      g.transition().duration(400).delay(300).attr('opacity', 1);
    });

    svg.selectAll('.counter-g').transition().duration(300).attr('opacity', 0).remove();
  }

  // ── Step 2 — Age groups (physically repositioned) ─────────────────────────
  function step2(svg) {
    svg.selectAll('.bar-g,.geo-label,.waffle-cell,.waffle-label,.stacked-g,.pay-g,.bar-title').remove();

    const allDots = ensureDots(svg);
    allDots.transition().duration(550).delay((_, i) => i * 4)
      .attr('cx', (_, i) => agePos[i].x)
      .attr('cy', (_, i) => agePos[i].y)
      .attr('fill', d => ageBands[d.ageGroup].color)
      .attr('r', d => (d.ageGroup === 0 && d.isNewHire) ? DOT_R + 2 : DOT_R)
      .attr('opacity', d => (d.ageGroup === 0 && d.isNewHire) ? 1 : 0.6);

    // Age band labels
    svg.selectAll('.age-label').remove();
    const bandW = Math.floor((W - MAR.left - MAR.right) / 3);
    ageBands.forEach((b, bi) => {
      const cx = MAR.left + bi * bandW + bandW / 2;
      const g = svg.append('g').attr('class', 'age-label')
        .attr('transform', `translate(${cx}, ${H - 32})`).attr('opacity', 0);
      g.append('circle').attr('r', 5).attr('cy', -2).attr('fill', b.color);
      g.append('text').attr('x', 10).attr('y', 2)
        .attr('font-family', 'Inter, sans-serif').attr('font-size', '11')
        .attr('fill', b.color).text(b.label);
      g.transition().duration(400).delay(350).attr('opacity', 1);
    });

    // Annotation under-30 new hires
    svg.selectAll('.age-note').remove();
    svg.append('text').attr('class', 'age-note')
      .attr('x', W / 2).attr('y', 26)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'IBM Plex Mono, monospace').attr('font-size', '9.5')
      .attr('fill', '#C9E35C').attr('opacity', 0)
      .text('● = nuovi ingressi under 30  (46% delle 596 assunzioni 2025)')
      .transition().duration(400).delay(500).attr('opacity', 1);
  }

  // ── Step 3 — Waffle chart 71/29 ───────────────────────────────────────────
  function step3(svg) {
    // Fade out dots
    svg.selectAll('.dot,.geo-label,.age-label,.age-note,.counter-g,.bar-g,.bar-title,.stacked-g,.pay-g')
      .transition().duration(300).attr('opacity', 0).remove();

    const CELL = 34, GAP = 5;
    const TOTAL = 100;
    const menCount = 71;
    const startX = (W - (10 * (CELL + GAP) - GAP)) / 2;
    const startY = (H - (10 * (CELL + GAP) - GAP)) / 2;

    const cells = d3.range(TOTAL).map(i => ({
      i, row: Math.floor(i / 10), col: i % 10, isMale: i < menCount,
    }));

    svg.selectAll('.waffle-cell')
      .data(cells, d => d.i)
      .join(
        enter => enter.append('rect')
          .attr('class', 'waffle-cell')
          .attr('x', d => startX + d.col * (CELL + GAP))
          .attr('y', d => startY + d.row * (CELL + GAP))
          .attr('width', CELL).attr('height', CELL).attr('rx', 2)
          .attr('fill', d => d.isMale ? '#33804C' : '#C9E35C')
          .attr('opacity', 0)
          .call(s => s.transition().duration(300).delay(d => (d.row * 10 + d.col) * 8).attr('opacity', 0.85))
      );

    svg.selectAll('.waffle-label').remove();
    [
      { pct: '71%', label: 'Uomini', color: '#33804C', x: startX - 12, anchor: 'end' },
      { pct: '29%', label: 'Donne',  color: '#C9E35C', x: startX + 10 * (CELL + GAP) - GAP + 12, anchor: 'start' },
    ].forEach((d, i) => {
      const g = svg.append('g').attr('class', 'waffle-label')
        .attr('transform', `translate(${d.x}, ${startY + (H - startY * 2) / 2})`).attr('opacity', 0);
      g.append('text').attr('text-anchor', d.anchor)
        .attr('font-family', 'Manrope, sans-serif').attr('font-size', '28').attr('font-weight', '200')
        .attr('fill', d.color).text(d.pct);
      g.append('text').attr('y', 26).attr('text-anchor', d.anchor)
        .attr('font-family', 'Inter, sans-serif').attr('font-size', '11').attr('fill', '#555555').text(d.label);
      g.transition().duration(400).delay(900 + i * 150).attr('opacity', 1);
    });
  }

  // ── Step 4 — Stacked bars per livello gerarchico ──────────────────────────
  function step4(svg) {
    svg.selectAll('.waffle-cell,.waffle-label,.pay-g,.bar-title').remove();

    const data = genere.per_inquadramento;
    const barH = 44, barGap = 24;
    const startY = (H - data.length * (barH + barGap) + barGap) / 2;
    const maxW = W - 200;

    svg.selectAll('.stacked-g').remove();
    data.forEach((d, i) => {
      const menW  = (d.uomini / d.totale) * maxW;
      const donneW = (d.donne  / d.totale) * maxW;
      const g = svg.append('g').attr('class', 'stacked-g')
        .attr('transform', `translate(120, ${startY + i * (barH + barGap)})`);

      g.append('rect').attr('height', barH).attr('width', 0).attr('rx', 0)
        .attr('fill', '#33804C').attr('opacity', 0.85)
        .transition().duration(600).delay(i * 100).attr('width', menW);

      g.append('rect').attr('x', menW).attr('height', barH).attr('width', 0).attr('rx', 0)
        .attr('fill', '#C9E35C').attr('opacity', 0.85)
        .transition().duration(600).delay(i * 100 + 100).attr('width', donneW);

      g.append('text').attr('x', -8).attr('y', barH / 2 + 1)
        .attr('text-anchor', 'end').attr('dominant-baseline', 'central')
        .attr('font-family', 'Inter, sans-serif').attr('font-size', '12').attr('fill', '#555555')
        .text(d.livello);

      const donneP = Math.round(d.donne / d.totale * 100);
      g.append('text').attr('x', maxW + 10).attr('y', barH / 2 + 1)
        .attr('dominant-baseline', 'central')
        .attr('font-family', 'IBM Plex Mono, monospace').attr('font-size', '11')
        .attr('fill', '#78B557').attr('opacity', 0)
        .text(donneP + '% donne')
        .transition().duration(400).delay(i * 100 + 500).attr('opacity', 1);
    });

    // Legend
    const lg = svg.append('g').attr('class', 'stacked-g')
      .attr('transform', `translate(120, ${H - 28})`);
    [{ c: '#33804C', l: 'Uomini', x: 0 }, { c: '#C9E35C', l: 'Donne', x: 90 }].forEach(item => {
      lg.append('rect').attr('x', item.x).attr('width', 14).attr('height', 10).attr('fill', item.c);
      lg.append('text').attr('x', item.x + 18).attr('y', 9)
        .attr('font-family', 'Inter, sans-serif').attr('font-size', '11').attr('fill', '#555555').text(item.l);
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
    aria-label="Visualizzazione delle persone in Var Group: 4.243 persone, distribuzione geografica, fasce d'età, parità di genere (29% donne), inquadramento gerarchico"
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
