<script>
  import * as d3 from 'd3';
  import ambiente from '$data/ambiente.json';

  let { activeStep = 0 } = $props();
  let svgEl = $state(null);

  const W = 660, H = 460;
  const CX = W / 2, CY = H / 2 + 10;

  $effect(() => {
    if (!svgEl) return;
    const svg = d3.select(svgEl);
    svg.selectAll('*').interrupt();
    if (activeStep === 0) step0(svg);
    else if (activeStep === 1) step1(svg);
    else step2(svg);
  });

  // ── Helpers ───────────────────────────────────────────────────────────────

  function drawDonut(svg, data, cx, cy, oR, iR, showDesc = false, animate = true) {
    const pie = d3.pie().value(d => d.value).sort(null).padAngle(0.018);
    const arcFn = d3.arc().outerRadius(oR).innerRadius(iR);
    const labelR = oR + (showDesc ? 58 : 38);
    const labelArc = d3.arc().outerRadius(labelR).innerRadius(labelR);
    const slices = pie(data);

    slices.forEach((s, i) => {
      const path = svg.append('path')
        .attr('class', 'donut-slice')
        .attr('transform', `translate(${cx},${cy})`)
        .attr('fill', s.data.color)
        .attr('opacity', animate ? 0 : 0.88);

      if (animate) {
        path
          .attr('d', arcFn({ startAngle: s.startAngle, endAngle: s.startAngle }))
          .transition().duration(650).delay(i * 110)
          .attr('d', arcFn(s))
          .attr('opacity', 0.88);
      } else {
        path.attr('d', arcFn(s));
      }

      // Percentage label
      const [lx, ly] = labelArc.centroid(s);
      svg.append('text')
        .attr('class', 'donut-label')
        .attr('transform', `translate(${cx + lx},${cy + ly})`)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .attr('font-family', 'IBM Plex Mono, monospace')
        .attr('font-size', '11.5').attr('font-weight', '500')
        .attr('fill', '#1a1a1a')
        .attr('opacity', 0)
        .text(s.data.label)
        .transition().delay(i * 110 + 500).duration(300).attr('opacity', 1);

      // Description label (second line)
      if (showDesc && s.data.desc) {
        svg.append('text')
          .attr('class', 'donut-label')
          .attr('transform', `translate(${cx + lx},${cy + ly + 15})`)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'central')
          .attr('font-family', 'Inter, sans-serif')
          .attr('font-size', '8.5')
          .attr('fill', '#555555')
          .attr('opacity', 0)
          .text(s.data.desc)
          .transition().delay(i * 110 + 620).duration(300).attr('opacity', 1);
      }
    });
  }

  // ── Step 0 — Mix totale fossile / rinnovabile ─────────────────────────────

  function step0(svg) {
    svg.selectAll('*').remove();

    const data = [
      { value: ambiente.energia.fossili_pct,     color: '#C9E35C', label: '69,6%', desc: 'Fonti fossili' },
      { value: ambiente.energia.rinnovabili_pct,  color: '#33804C', label: '30,4%', desc: 'Fonti rinnovabili' },
    ];

    drawDonut(svg, data, CX, CY, 148, 86, true, true);

    // Center text
    svg.append('text')
      .attr('x', CX).attr('y', CY - 14)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'Manrope, sans-serif')
      .attr('font-size', '30').attr('font-weight', '200')
      .attr('fill', '#1a1a1a').attr('opacity', 0)
      .text('19.869')
      .transition().delay(400).duration(400).attr('opacity', 1);

    svg.append('text')
      .attr('x', CX).attr('y', CY + 12)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'IBM Plex Mono, monospace')
      .attr('font-size', '10').attr('fill', '#888888').attr('opacity', 0)
      .text('MWh · energia totale 2025')
      .transition().delay(500).duration(400).attr('opacity', 1);

    // Section label
    svg.append('text')
      .attr('x', CX).attr('y', 32)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'Inter, sans-serif')
      .attr('font-size', '9').attr('letter-spacing', '1.4')
      .attr('fill', '#888888')
      .text('MIX ENERGETICO 2025');
  }

  // ── Step 1 — Dettaglio fonti con descrizione ───────────────────────────────

  function step1(svg) {
    svg.selectAll('*').remove();

    const fonti = ambiente.energia.fonti_fossili_dettaglio;
    const data = [
      { value: fonti[0].pct_totale, color: '#C9E35C', label: '62%',   desc: 'Carburanti flotta auto' },
      { value: fonti[1].pct_totale, color: '#78B557', label: '5,7%',  desc: 'Gas riscaldamento' },
      { value: fonti[2].pct_totale, color: '#61BD57', label: '2%',    desc: 'Elettricità fossile' },
      { value: ambiente.energia.rinnovabili_pct, color: '#33804C', label: '30,4%', desc: 'Fonti rinnovabili' },
    ];

    drawDonut(svg, data, CX, CY, 148, 86, true, true);

    // Center: flotta highlight
    svg.append('text')
      .attr('x', CX).attr('y', CY - 16)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'IBM Plex Mono, monospace')
      .attr('font-size', '10').attr('fill', '#33804C').attr('opacity', 0)
      .text('Flotta auto')
      .transition().delay(400).duration(400).attr('opacity', 1);

    svg.append('text')
      .attr('x', CX).attr('y', CY + 2)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'Manrope, sans-serif')
      .attr('font-size', '22').attr('font-weight', '200')
      .attr('fill', '#1a1a1a').attr('opacity', 0)
      .text('>850 veicoli')
      .transition().delay(480).duration(400).attr('opacity', 1);

    svg.append('text')
      .attr('x', CX).attr('y', CY + 22)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'IBM Plex Mono, monospace')
      .attr('font-size', '9').attr('fill', '#888888').attr('opacity', 0)
      .text('sul territorio nazionale')
      .transition().delay(560).duration(400).attr('opacity', 1);

    svg.append('text')
      .attr('x', CX).attr('y', 32)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'Inter, sans-serif')
      .attr('font-size', '9').attr('letter-spacing', '1.4')
      .attr('fill', '#888888')
      .text('DETTAGLIO FONTI ENERGETICHE');
  }

  // ── Step 2 — 94% elettricità da rinnovabili (arco gauge) ──────────────────

  function step2(svg) {
    svg.selectAll('*').remove();

    const pct = ambiente.energia.elettricita_rinnovabili_pct; // 94
    const R = 138, strokeW = 24;
    const tau = Math.PI * 2;

    // Background arc
    const bgArc = d3.arc()
      .innerRadius(R - strokeW / 2)
      .outerRadius(R + strokeW / 2)
      .startAngle(-Math.PI * 0.75)
      .endAngle(Math.PI * 0.75);

    svg.append('path')
      .attr('transform', `translate(${CX},${CY})`)
      .attr('d', bgArc())
      .attr('fill', '#d4d4cc');

    // Foreground arc — animated fill
    const endTarget = -Math.PI * 0.75 + (pct / 100) * Math.PI * 1.5;
    const fgArc = d3.arc()
      .innerRadius(R - strokeW / 2)
      .outerRadius(R + strokeW / 2)
      .startAngle(-Math.PI * 0.75);

    const fg = svg.append('path')
      .attr('transform', `translate(${CX},${CY})`)
      .attr('d', fgArc.endAngle(-Math.PI * 0.75)())
      .attr('fill', '#33804C');

    fg.transition().duration(1100).delay(200)
      .attrTween('d', () => {
        const interp = d3.interpolate(-Math.PI * 0.75, endTarget);
        return t => fgArc.endAngle(interp(t))();
      });

    // Big percentage
    svg.append('text')
      .attr('x', CX).attr('y', CY - 18)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'Manrope, sans-serif')
      .attr('font-size', '58').attr('font-weight', '200')
      .attr('fill', '#33804C').attr('letter-spacing', '-2')
      .attr('opacity', 0).text('94%')
      .transition().delay(700).duration(400).attr('opacity', 1);

    svg.append('text')
      .attr('x', CX).attr('y', CY + 24)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'IBM Plex Mono, monospace')
      .attr('font-size', '10').attr('fill', '#555555')
      .attr('opacity', 0).text("dell'elettricità da fonti rinnovabili")
      .transition().delay(850).duration(400).attr('opacity', 1);

    // Footer note
    svg.append('text')
      .attr('x', CX).attr('y', H - 22)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'IBM Plex Mono, monospace').attr('font-size', '9.5')
      .attr('fill', '#888888').attr('opacity', 0)
      .text('Fotovoltaico Gruppo Sesa + forniture certificate')
      .transition().delay(1000).duration(400).attr('opacity', 1);

    svg.append('text')
      .attr('x', CX).attr('y', 32)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'Inter, sans-serif')
      .attr('font-size', '9').attr('letter-spacing', '1.4')
      .attr('fill', '#888888')
      .text('ELETTRICITÀ DA FONTI RINNOVABILI');
  }
</script>

<div class="chart-wrapper">
  <svg
    bind:this={svgEl}
    viewBox="0 0 {W} {H}"
    width="100%"
    height="100%"
    preserveAspectRatio="xMidYMid meet"
    aria-label="Mix energetico Var Group 2025: 19.869 MWh totali, 69,6% da fonti fossili (di cui 62% carburanti flotta auto), 30,4% rinnovabili. Il 94% dell'elettricità consumata proviene da fonti rinnovabili."
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
