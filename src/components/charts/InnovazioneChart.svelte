<script>
  import * as d3 from 'd3';
  import sedi from '$data/sedi.json';
  import servizi from '$data/servizi.json';

  let { activeStep = 0 } = $props();
  let svgEl = $state(null);

  const W = 660, H = 440;

  // ── Projections (lon, lat) — D3 uses [lon, lat] order ────────────────────
  const italyProj = d3.geoMercator()
    .center([13, 42.5])
    .scale(1700)
    .translate([300, 225]);

  const worldProj = d3.geoMercator()
    .center([10, 25])
    .scale(110)
    .translate([300, 220]);

  // International centroids [lon, lat]
  const CENTROIDS = {
    'USA':        [-100,    40  ],
    'Messico':    [-102.6,  23.6],
    'Brasile':    [ -51.9, -14.2],
    'India':      [  79,    20.6],
    'Thailandia': [ 100.9,  15.9],
    'Germania':   [  10.5,  51.2],
    'Francia':    [   2.2,  46.2],
    'Spagna':     [  -3.7,  40.5],
    'Svizzera':   [   8.2,  46.8],
    'Austria':    [  14.6,  47.5],
    'Romania':    [  24.9,  45.9],
    'Benelux':    [   4.5,  50.8],
    'Albania':    [  20.2,  41.2],
    'Andorra':    [   1.5,  42.5],
    'Tunisia':    [   9.6,  33.9],
  };

  const AREA_COL = {
    Americas:        '#1268fb',
    Europa:          '#2a4eef',
    'Africa/Europa': '#2a4eef',
    Asia:            '#1032cf',
  };

  // Cities to label in step 0
  const LABEL_SET = new Set(['Empoli', 'Milano', 'Roma', 'Torino', 'Napoli', 'Catania', 'Bolzano']);

  // ── Tile grid constants ──────────────────────────────────────────────────
  const TW = 118, TH = 58, GAP_X = 10, GAP_Y = 12, TILE_COLS = 5;
  const TILE_START_X = (W - TILE_COLS * TW - (TILE_COLS - 1) * GAP_X) / 2;
  const TILE_START_Y = (H - 2 * TH - GAP_Y) / 2 - 10;

  // Split long service names into up to 2 lines
  function splitName(name) {
    if (name.length <= 16) return [name];
    const mid = Math.floor(name.length / 2);
    let best = -1, bestDist = Infinity;
    for (let i = 0; i < name.length; i++) {
      if (name[i] === ' ') {
        const d = Math.abs(i - mid);
        if (d < bestDist) { bestDist = d; best = i; }
      }
    }
    return best === -1 ? [name] : [name.slice(0, best), name.slice(best + 1)];
  }

  // ── Reactive draw ────────────────────────────────────────────────────────
  $effect(() => {
    if (!svgEl) return;
    const svg = d3.select(svgEl);
    svg.selectAll('*').interrupt();
    if      (activeStep === 0) step0(svg);
    else if (activeStep === 1) step1(svg);
    else if (activeStep === 2) step2(svg);
    else                       step3(svg);
  });

  // ── Step 0 — Italy ───────────────────────────────────────────────────────
  function step0(svg) {
    svg.selectAll('*').remove();

    // Faint background text for context
    svg.append('text')
      .attr('x', W / 2).attr('y', H / 2 + 70)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'Manrope, sans-serif')
      .attr('font-size', '96').attr('font-weight', '200')
      .attr('fill', '#1c1c22').attr('opacity', 0.9)
      .text('ITALIA');

    sedi.italia.forEach((city, i) => {
      const pos = italyProj([city.lon, city.lat]);
      if (!pos) return;
      const [cx, cy] = pos;
      const isHQ = !!city.hq;

      svg.append('circle').attr('class', 'city-dot')
        .attr('cx', cx).attr('cy', cy)
        .attr('r', 0)
        .attr('fill', isHQ ? '#F5A623' : '#1032cf')
        .attr('opacity', 0)
        .transition().duration(400).delay(i * 55)
        .attr('r', isHQ ? 9 : 6)
        .attr('opacity', isHQ ? 1 : 0.85);

      if (LABEL_SET.has(city.citta)) {
        const rightSide = cx > 300;
        svg.append('text').attr('class', 'city-label')
          .attr('x', cx + (rightSide ? 14 : -14))
          .attr('y', cy + 4)
          .attr('text-anchor', rightSide ? 'start' : 'end')
          .attr('font-family', 'Inter, sans-serif').attr('font-size', '9')
          .attr('fill', isHQ ? '#F5A623' : '#767676')
          .attr('opacity', 0)
          .text(city.citta)
          .transition().delay(i * 55 + 350).duration(300).attr('opacity', 1);
      }
    });

    svg.append('text')
      .attr('x', W / 2).attr('y', H - 22)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'IBM Plex Mono, monospace').attr('font-size', '10')
      .attr('fill', '#505050').attr('opacity', 0)
      .text('18 sedi · HQ Empoli')
      .transition().delay(1200).duration(400).attr('opacity', 1);
  }

  // ── Step 1 — World ───────────────────────────────────────────────────────
  function step1(svg) {
    svg.selectAll('*').remove();

    // Italy dots at world scale
    sedi.italia.forEach((city, i) => {
      const pos = worldProj([city.lon, city.lat]);
      if (!pos) return;
      svg.append('circle').attr('class', 'city-dot')
        .attr('cx', pos[0]).attr('cy', pos[1])
        .attr('r', 0).attr('fill', '#2a4eef').attr('opacity', 0)
        .transition().duration(350).delay(i * 18)
        .attr('r', 4).attr('opacity', 0.7);
    });

    // International dots
    sedi.internazionale.forEach((country, i) => {
      const centroid = CENTROIDS[country.paese];
      if (!centroid) return;
      const pos = worldProj(centroid);
      if (!pos) return;
      const fill = AREA_COL[country.area] ?? '#1032cf';
      svg.append('circle').attr('class', 'intl-dot')
        .attr('cx', pos[0]).attr('cy', pos[1])
        .attr('r', 0).attr('fill', fill).attr('opacity', 0)
        .transition().duration(400).delay(380 + i * 40)
        .attr('r', 5).attr('opacity', 0.9);
    });

    // Area labels
    [
      { label: 'AMERICAS', lon: -80, lat:  2 },
      { label: 'EUROPA',   lon:  15, lat: 58 },
      { label: 'ASIA',     lon:  93, lat:  6 },
    ].forEach(({ label, lon, lat }) => {
      const pos = worldProj([lon, lat]);
      if (!pos) return;
      svg.append('text')
        .attr('x', pos[0]).attr('y', pos[1])
        .attr('text-anchor', 'middle')
        .attr('font-family', 'Manrope, sans-serif').attr('font-size', '9')
        .attr('letter-spacing', '2').attr('fill', '#505050').attr('opacity', 0)
        .text(label)
        .transition().delay(950).duration(500).attr('opacity', 1);
    });

    svg.append('text')
      .attr('x', W / 2).attr('y', H - 22)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'IBM Plex Mono, monospace').attr('font-size', '10')
      .attr('fill', '#505050').attr('opacity', 0)
      .text('34 sedi · 15 paesi · fatturato 875,7 M€')
      .transition().delay(1050).duration(400).attr('opacity', 1);
  }

  // ── Shared tile grid renderer ─────────────────────────────────────────────
  function drawTiles(svg, highlight = false) {
    svg.append('text')
      .attr('x', W / 2).attr('y', TILE_START_Y - 28)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'Inter, sans-serif').attr('font-size', '9.5')
      .attr('letter-spacing', '1.5').attr('fill', '#767676')
      .text('10 AREE DI SERVIZIO');

    servizi.aree.forEach((area, i) => {
      const col = i % TILE_COLS;
      const row = Math.floor(i / TILE_COLS);
      const x = TILE_START_X + col * (TW + GAP_X);
      const y = TILE_START_Y + row * (TH + GAP_Y);
      const isS = area.sustainit;
      const dimmed     = highlight && !isS;
      const highlighted = highlight && isS;

      const g = svg.append('g').attr('class', 'tile-g')
        .attr('transform', `translate(${x},${y})`);

      g.append('rect')
        .attr('width', TW).attr('height', TH).attr('rx', 3)
        .attr('fill', highlighted ? '#00A651' : '#141418')
        .attr('stroke', highlighted ? '#00A651' : '#2a2a35')
        .attr('stroke-width', 1)
        .attr('opacity', 0)
        .transition().duration(300).delay(i * 45)
        .attr('opacity', dimmed ? 0.22 : 1);

      const lines = splitName(area.nome);
      const baseY  = lines.length === 1 ? TH / 2 : TH / 2 - 7;
      const tFill  = highlighted ? 'white' : (dimmed ? '#3a3a48' : '#767676');

      lines.forEach((line, li) => {
        g.append('text')
          .attr('x', TW / 2)
          .attr('y', baseY + li * 14)
          .attr('text-anchor', 'middle').attr('dominant-baseline', 'central')
          .attr('font-family', 'Inter, sans-serif').attr('font-size', '9.5')
          .attr('fill', tFill).attr('opacity', 0)
          .text(line)
          .transition().duration(300).delay(i * 45 + 190).attr('opacity', 1);
      });
    });
  }

  // ── Step 2 — Services (neutral) ──────────────────────────────────────────
  function step2(svg) {
    svg.selectAll('*').remove();
    drawTiles(svg, false);
  }

  // ── Step 3 — Services (SustainIT highlighted) ────────────────────────────
  function step3(svg) {
    svg.selectAll('*').remove();
    drawTiles(svg, true);

    svg.append('text')
      .attr('x', W / 2).attr('y', TILE_START_Y + 2 * TH + GAP_Y + 34)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'IBM Plex Mono, monospace').attr('font-size', '10')
      .attr('fill', '#00A651').attr('opacity', 0)
      .text(`SustainIT · ${servizi.sustainit_lancio} · IT e governance ESG`)
      .transition().delay(650).duration(400).attr('opacity', 1);
  }
</script>

<div class="chart-wrapper">
  <svg
    bind:this={svgEl}
    viewBox="0 0 {W} {H}"
    width="100%"
    height="100%"
    preserveAspectRatio="xMidYMid meet"
    aria-label="Mappa delle sedi Var Group in Italia (18) e nel mondo (34 totali in 15 paesi), poi griglia delle 10 aree di servizio con SustainIT evidenziata"
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
