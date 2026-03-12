<script>
  import * as d3 from 'd3';
  import * as topojson from 'topojson-client';
  import sedi from '$data/sedi.json';
  import servizi from '$data/servizi.json';
  // world-atlas 110m topology loaded async to avoid blocking
  import worldTopo from 'world-atlas/countries-110m.json';

  let { activeStep = 0 } = $props();
  let svgEl = $state(null);

  const W = 660, H = 440;

  // ── Projections ───────────────────────────────────────────────────────────

  // Italy-focused: center on peninsula, scale 1500
  const italyProj = d3.geoMercator()
    .center([12.5, 40.8])
    .scale(1500)
    .translate([W / 2, H / 2 + 20]);

  // World overview
  const worldProj = d3.geoMercator()
    .center([12, 28])
    .scale(118)
    .translate([W / 2, H / 2 + 20]);

  const italyPath = d3.geoPath().projection(italyProj);
  const worldPath = d3.geoPath().projection(worldProj);

  // Pre-compute topology features
  const countries = topojson.feature(worldTopo, worldTopo.objects.countries);
  const ITALY_ID = '380'; // ISO 3166-1 numeric for Italy

  // ── International centroids [lon, lat] ────────────────────────────────────
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
    Americas:        '#61BD57',
    Europa:          '#33804C',
    'Africa/Europa': '#78B557',
    Asia:            '#87FF45',
  };

  // Cities to label in step 0
  const LABEL_SET = new Set(['Empoli', 'Milano', 'Roma', 'Torino', 'Napoli', 'Catania', 'Bolzano', 'Bologna']);

  // ── Tile grid constants ───────────────────────────────────────────────────
  const TW = 118, TH = 58, GAP_X = 10, GAP_Y = 12, TILE_COLS = 5;
  const TILE_START_X = (W - TILE_COLS * TW - (TILE_COLS - 1) * GAP_X) / 2;
  const TILE_START_Y = (H - 2 * TH - GAP_Y) / 2 - 10;

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

  // ── Reactive draw ─────────────────────────────────────────────────────────
  $effect(() => {
    if (!svgEl) return;
    const svg = d3.select(svgEl);
    svg.selectAll('*').interrupt();
    if      (activeStep === 0) step0(svg);
    else if (activeStep === 1) step1(svg);
    else if (activeStep === 2) step2(svg);
    else                       step3(svg);
  });

  // ── Step 0 — Italy map with city dots ────────────────────────────────────

  function step0(svg) {
    svg.selectAll('*').remove();

    // Draw country borders (Italy highlighted, rest faint)
    const mapG = svg.append('g').attr('class', 'map-g');

    mapG.selectAll('.country')
      .data(countries.features)
      .join('path')
        .attr('class', 'country')
        .attr('d', italyPath)
        .attr('fill', d => String(d.id) === ITALY_ID ? '#e8ede8' : '#f0f0ed')
        .attr('stroke', d => String(d.id) === ITALY_ID ? '#33804C' : '#d4d4cc')
        .attr('stroke-width', d => String(d.id) === ITALY_ID ? 1.2 : 0.4)
        .attr('opacity', d => String(d.id) === ITALY_ID ? 1 : 0.5);

    // City dots
    sedi.italia.forEach((city, i) => {
      const pos = italyProj([city.lon, city.lat]);
      if (!pos) return;
      const [cx, cy] = pos;
      const isHQ = !!city.hq;

      svg.append('circle').attr('class', 'city-dot')
        .attr('cx', cx).attr('cy', cy)
        .attr('r', 0)
        .attr('fill', isHQ ? '#C9E35C' : '#33804C')
        .attr('stroke', isHQ ? '#78B557' : 'none')
        .attr('stroke-width', 1.5)
        .attr('opacity', 0)
        .transition().duration(400).delay(i * 55)
        .attr('r', isHQ ? 9 : 6)
        .attr('opacity', isHQ ? 1 : 0.85);

      if (LABEL_SET.has(city.citta)) {
        const rightSide = cx > W / 2;
        svg.append('text').attr('class', 'city-label')
          .attr('x', cx + (rightSide ? 13 : -13))
          .attr('y', cy + 4)
          .attr('text-anchor', rightSide ? 'start' : 'end')
          .attr('font-family', 'Inter, sans-serif').attr('font-size', '9')
          .attr('fill', isHQ ? '#78B557' : '#555555')
          .attr('opacity', 0)
          .text(city.citta)
          .transition().delay(i * 55 + 350).duration(300).attr('opacity', 1);
      }
    });

    svg.append('text')
      .attr('x', W / 2).attr('y', H - 18)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'IBM Plex Mono, monospace').attr('font-size', '10')
      .attr('fill', '#888888').attr('opacity', 0)
      .text('18 sedi · HQ Empoli')
      .transition().delay(1300).duration(400).attr('opacity', 1);
  }

  // ── Step 1 — World map with all dots ─────────────────────────────────────

  function step1(svg) {
    svg.selectAll('*').remove();

    // World map background
    const mapG = svg.append('g').attr('class', 'map-g');

    mapG.selectAll('.country')
      .data(countries.features)
      .join('path')
        .attr('class', 'country')
        .attr('d', worldPath)
        .attr('fill', '#eeeee9')
        .attr('stroke', '#d4d4cc')
        .attr('stroke-width', 0.4)
        .attr('opacity', 0.8);

    // Italy dots at world scale (small cluster)
    sedi.italia.forEach((city, i) => {
      const pos = worldProj([city.lon, city.lat]);
      if (!pos) return;
      svg.append('circle').attr('class', 'city-dot')
        .attr('cx', pos[0]).attr('cy', pos[1])
        .attr('r', 0).attr('fill', '#33804C').attr('opacity', 0)
        .transition().duration(350).delay(i * 18)
        .attr('r', 4).attr('opacity', 0.8);
    });

    // International dots
    sedi.internazionale.forEach((country, i) => {
      const centroid = CENTROIDS[country.paese];
      if (!centroid) return;
      const pos = worldProj(centroid);
      if (!pos) return;
      const fill = AREA_COL[country.area] ?? '#33804C';
      svg.append('circle').attr('class', 'intl-dot')
        .attr('cx', pos[0]).attr('cy', pos[1])
        .attr('r', 0).attr('fill', fill).attr('opacity', 0)
        .transition().duration(400).delay(380 + i * 40)
        .attr('r', 5.5).attr('opacity', 0.9);
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
        .attr('font-family', 'Inter, sans-serif').attr('font-size', '8')
        .attr('letter-spacing', '2').attr('fill', '#888888').attr('opacity', 0)
        .text(label)
        .transition().delay(950).duration(500).attr('opacity', 1);
    });

    svg.append('text')
      .attr('x', W / 2).attr('y', H - 18)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'IBM Plex Mono, monospace').attr('font-size', '10')
      .attr('fill', '#888888').attr('opacity', 0)
      .text('34 sedi · 15 paesi · fatturato 875,7 M€')
      .transition().delay(1050).duration(400).attr('opacity', 1);
  }

  // ── Step 2 — Services grid (all neutral) ─────────────────────────────────

  function step2(svg) {
    svg.selectAll('*').remove();
    _drawTilesFresh(svg, false);
  }

  // ── Step 3 — Services grid (SustainIT highlighted) ───────────────────────
  // Key fix: if tiles already exist (coming from step2), DON'T remove them —
  // just transition colors in place to avoid disappear/reappear.

  function step3(svg) {
    const tilesExist = !svg.selectAll('.tile-g').empty();

    if (tilesExist) {
      // Smooth color transition from neutral to highlighted
      svg.selectAll('.tile-g').each(function(d, i) {
        const area = servizi.aree[i];
        const isS = area && area.sustainit;
        const g = d3.select(this);

        g.select('rect')
          .transition().duration(450).delay(i * 30)
          .attr('fill', isS ? '#33804C' : '#f5f5f2')
          .attr('stroke', isS ? '#33804C' : '#d4d4cc')
          .attr('opacity', isS ? 1 : 0.3);

        g.selectAll('text')
          .transition().duration(450).delay(i * 30)
          .attr('fill', isS ? '#ffffff' : '#aaaaaa');
      });

      // Add SustainIT footer label if not present
      if (svg.selectAll('.sustainit-label').empty()) {
        svg.append('text')
          .attr('class', 'sustainit-label')
          .attr('x', W / 2).attr('y', TILE_START_Y + 2 * TH + GAP_Y + 34)
          .attr('text-anchor', 'middle')
          .attr('font-family', 'IBM Plex Mono, monospace').attr('font-size', '10')
          .attr('fill', '#33804C').attr('opacity', 0)
          .text('SustainIT · ' + servizi.sustainit_lancio + ' · IT e governance ESG')
          .transition().delay(650).duration(400).attr('opacity', 1);
      }
    } else {
      // First render of tiles with highlight already applied
      svg.selectAll('*').remove();
      _drawTilesFresh(svg, true);

      svg.append('text')
        .attr('class', 'sustainit-label')
        .attr('x', W / 2).attr('y', TILE_START_Y + 2 * TH + GAP_Y + 34)
        .attr('text-anchor', 'middle')
        .attr('font-family', 'IBM Plex Mono, monospace').attr('font-size', '10')
        .attr('fill', '#33804C').attr('opacity', 0)
        .text('SustainIT · ' + servizi.sustainit_lancio + ' · IT e governance ESG')
        .transition().delay(650).duration(400).attr('opacity', 1);
    }
  }

  // Internal: draw fresh tile grid (used by step2 and step3 cold-start)
  function _drawTilesFresh(svg, highlight) {
    svg.append('text')
      .attr('x', W / 2).attr('y', TILE_START_Y - 28)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'Inter, sans-serif').attr('font-size', '9.5')
      .attr('letter-spacing', '1.5').attr('fill', '#888888')
      .text('10 AREE DI SERVIZIO');

    servizi.aree.forEach((area, i) => {
      const col = i % TILE_COLS;
      const row = Math.floor(i / TILE_COLS);
      const x = TILE_START_X + col * (TW + GAP_X);
      const y = TILE_START_Y + row * (TH + GAP_Y);
      const isS = area.sustainit;
      const dimmed = highlight && !isS;
      const highlighted = highlight && isS;

      const g = svg.append('g').attr('class', 'tile-g')
        .attr('transform', `translate(${x},${y})`);

      g.append('rect')
        .attr('width', TW).attr('height', TH).attr('rx', 3)
        .attr('fill', highlighted ? '#33804C' : '#f5f5f2')
        .attr('stroke', highlighted ? '#33804C' : '#d4d4cc')
        .attr('stroke-width', 1)
        .attr('opacity', 0)
        .transition().duration(300).delay(i * 45)
        .attr('opacity', dimmed ? 0.25 : 1);

      const lines = splitName(area.nome);
      const baseY = lines.length === 1 ? TH / 2 : TH / 2 - 7;
      const tFill = highlighted ? '#ffffff' : (dimmed ? '#aaaaaa' : '#444444');

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
