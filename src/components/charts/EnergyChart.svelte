<script>
  import * as d3 from 'd3';
  import ambiente from '$data/ambiente.json';

  let { activeStep = 0 } = $props();
  let svgEl = $state(null);

  const W = 620, H = 460;
  const CX = W / 2, CY = H / 2 - 20;
  const OR = 150, IR = 85; // outer/inner radius donut

  $effect(() => {
    if (!svgEl) return;
    const svg = d3.select(svgEl);
    svg.selectAll('*').interrupt();
    if (activeStep === 0) step0(svg);
    else if (activeStep === 1) step1(svg);
    else if (activeStep === 2) step2(svg);
    else step3(svg);
  });

  const arc = d3.arc().innerRadius(IR).outerRadius(OR);
  const arcExp = d3.arc().innerRadius(IR).outerRadius(OR + 22); // espanso
  const pie = d3.pie().value(d => d.value).sort(null).padAngle(0.015);

  function drawDonut(svg, data, cx, cy, iR, oR, explodeIdx = -1) {
    const arcFn = d3.arc().innerRadius(iR).outerRadius(oR);
    const arcExpFn = d3.arc().innerRadius(iR).outerRadius(oR + 22);
    const slices = pie(data);

    const g = svg.append('g').attr('class', 'donut-g').attr('transform', `translate(${cx},${cy})`);

    slices.forEach((s, i) => {
      const isExp = i === explodeIdx;
      const path = g.append('path')
        .attr('class', `slice-${i}`)
        .attr('d', arcFn({ startAngle: s.startAngle, endAngle: s.startAngle }))
        .attr('fill', s.data.color)
        .attr('opacity', isExp ? 1 : (explodeIdx >= 0 ? 0.45 : 0.88))
        .attr('stroke', '#0d0d10').attr('stroke-width', 1.5);

      path.transition().duration(700).delay(i * 120)
        .attrTween('d', () => {
          const interp = d3.interpolate(s.startAngle, s.endAngle);
          return t => isExp
            ? arcExpFn({ startAngle: s.startAngle, endAngle: interp(t) })
            : arcFn({ startAngle: s.startAngle, endAngle: interp(t) });
        });

      // Percentuale label
      const mid = (s.startAngle + s.endAngle) / 2;
      const labelR = (oR + (isExp ? oR + 38 : oR + 22));
      const lx = Math.sin(mid) * (labelR * 0.62);
      const ly = -Math.cos(mid) * (labelR * 0.62);
      g.append('text')
        .attr('x', lx).attr('y', ly)
        .attr('text-anchor', 'middle').attr('dominant-baseline', 'central')
        .attr('font-family', 'IBM Plex Mono, monospace').attr('font-size', isExp ? '13' : '11')
        .attr('fill', 'white').attr('font-weight', isExp ? '500' : '400').attr('opacity', 0)
        .text(s.data.label)
        .transition().duration(300).delay(i * 120 + 500).attr('opacity', 0.9);
    });

    return g;
  }

  function step0(svg) {
    svg.selectAll('.donut-g, .elec-g, .scope-g, .caption').remove();

    const data = [
      { value: ambiente.energia.fossili_pct, color: '#F5A623', label: '69,6%' },
      { value: ambiente.energia.rinnovabili_pct, color: '#00A651', label: '30,4%' },
    ];

    drawDonut(svg, data, CX, CY, IR, OR);

    // Centro label
    const cg = svg.append('g').attr('class', 'donut-g').attr('transform', `translate(${CX},${CY})`);
    cg.append('text').attr('text-anchor', 'middle').attr('y', -10)
      .attr('font-family', 'Manrope, sans-serif').attr('font-size', '15').attr('font-weight', '300')
      .attr('fill', '#ffffff').text('19.869 MWh');
    cg.append('text').attr('text-anchor', 'middle').attr('y', 10)
      .attr('font-family', 'IBM Plex Mono, monospace').attr('font-size', '9').attr('fill', '#767676')
      .text('energia totale');

    // Legenda
    const lg = svg.append('g').attr('class', 'donut-g').attr('transform', `translate(${W * 0.06}, ${H - 35})`);
    [{ c: '#F5A623', l: 'Fonti fossili (69,6%)', x: 0 }, { c: '#00A651', l: 'Rinnovabili (30,4%)', x: 190 }]
      .forEach(d => {
        lg.append('rect').attr('x', d.x).attr('width', 12).attr('height', 12).attr('fill', d.c);
        lg.append('text').attr('x', d.x + 16).attr('y', 10).attr('font-family', 'Inter, sans-serif')
          .attr('font-size', '11').attr('fill', '#767676').text(d.l);
      });
  }

  function step1(svg) {
    svg.selectAll('.donut-g, .elec-g, .scope-g, .caption').remove();

    const fonti = ambiente.energia.fonti_fossili_dettaglio;
    const renPct = ambiente.energia.rinnovabili_pct;
    const data = [
      { value: fonti[0].pct_totale, color: '#F5A623', label: '62%' },   // flotta
      { value: fonti[1].pct_totale, color: '#e05c5c', label: '5,7%' },  // gas
      { value: fonti[2].pct_totale, color: '#e08c5c', label: '2%' },    // elec fossile
      { value: renPct, color: '#00A651', label: '30,4%' },
    ];

    drawDonut(svg, data, CX, CY, IR, OR, 0); // esplode la fetta flotta

    // Annotazione flotta
    const cg = svg.append('g').attr('class', 'donut-g').attr('transform', `translate(${CX},${CY})`);
    cg.append('text').attr('text-anchor', 'middle').attr('y', -8)
      .attr('font-family', 'IBM Plex Mono, monospace').attr('font-size', '10').attr('fill', '#F5A623').text('Flotta auto');
    cg.append('text').attr('text-anchor', 'middle').attr('y', 10)
      .attr('font-family', 'IBM Plex Mono, monospace').attr('font-size', '9').attr('fill', '#767676').text('>850 veicoli');

    const cap = svg.append('text').attr('class', 'caption').attr('x', W / 2).attr('y', H - 12)
      .attr('text-anchor', 'middle').attr('font-family', 'IBM Plex Mono, monospace').attr('font-size', '10')
      .attr('fill', '#505050').text('I carburanti della flotta pesano il 62% dei consumi totali di energia');
  }

  function step2(svg) {
    svg.selectAll('.donut-g, .elec-g, .scope-g, .caption').remove();

    // Donut solo elettricità: 94% rinnov
    const OR2 = 130, IR2 = 74;
    const data = [
      { value: 94, color: '#00A651', label: '94%' },
      { value: 6, color: '#2a2a35', label: '' },
    ];

    const elec = svg.append('g').attr('class', 'elec-g').attr('transform', `translate(${CX},${CY})`);
    const slices = pie(data);
    slices.forEach((s, i) => {
      const arcFn = d3.arc().innerRadius(IR2).outerRadius(OR2);
      elec.append('path')
        .attr('d', arcFn({ startAngle: s.startAngle, endAngle: s.startAngle }))
        .attr('fill', s.data.color).attr('opacity', 0.9)
        .attr('stroke', '#0d0d10').attr('stroke-width', 1.5)
        .transition().duration(700).delay(i * 80)
        .attrTween('d', () => {
          const interp = d3.interpolate(s.startAngle, s.endAngle);
          return t => arcFn({ startAngle: s.startAngle, endAngle: interp(t) });
        });
    });

    // Label centrale
    elec.append('text').attr('text-anchor', 'middle').attr('y', -16)
      .attr('font-family', 'Manrope, sans-serif').attr('font-size', '38').attr('font-weight', '200')
      .attr('fill', '#00A651').attr('letter-spacing', '-1').attr('opacity', 0).text('94%')
      .transition().duration(500).delay(600).attr('opacity', 1);
    elec.append('text').attr('text-anchor', 'middle').attr('y', 14)
      .attr('font-family', 'IBM Plex Mono, monospace').attr('font-size', '10').attr('fill', '#767676')
      .attr('opacity', 0).text('da fonti rinnovabili')
      .transition().duration(400).delay(900).attr('opacity', 1);

    svg.append('text').attr('class', 'elec-g').attr('x', W / 2).attr('y', H - 26)
      .attr('text-anchor', 'middle').attr('font-family', 'IBM Plex Mono, monospace').attr('font-size', '10')
      .attr('fill', '#00A651').text('Quota elettricità rinnovabile: la sfida vera è la flotta auto');
  }

  function step3(svg) {
    svg.selectAll('.donut-g, .elec-g, .scope-g, .caption').remove();

    const scopes = ambiente.emissioni_scope1_2;
    const data = [
      { value: scopes.flotta_auto_pct, color: '#F5A623', label: '60,6%\nFlotta auto' },
      { value: scopes.elettricita_sedi_pct, color: '#2a4eef', label: '35,4%\nElettr. sedi' },
      { value: scopes.gas_naturale_pct, color: '#e05c5c', label: '4%\nGas' },
    ];

    const OR3 = 145, IR3 = 80;
    const slices = pie(data);
    const sc = svg.append('g').attr('class', 'scope-g').attr('transform', `translate(${CX},${CY})`);

    slices.forEach((s, i) => {
      const arcFn = d3.arc().innerRadius(IR3).outerRadius(OR3);
      const arcLbl = d3.arc().innerRadius(OR3 + 20).outerRadius(OR3 + 20);
      sc.append('path')
        .attr('d', arcFn({ startAngle: s.startAngle, endAngle: s.startAngle }))
        .attr('fill', s.data.color).attr('opacity', 0.88)
        .attr('stroke', '#0d0d10').attr('stroke-width', 1.5)
        .transition().duration(700).delay(i * 120)
        .attrTween('d', () => {
          const interp = d3.interpolate(s.startAngle, s.endAngle);
          return t => arcFn({ startAngle: s.startAngle, endAngle: interp(t) });
        });

      const [lx, ly] = arcLbl.centroid(s);
      const lines = s.data.label.split('\n');
      const tg = sc.append('text').attr('x', lx).attr('y', ly - 6)
        .attr('text-anchor', lx > 0 ? 'start' : 'end').attr('opacity', 0);
      lines.forEach((ln, li) => {
        tg.append('tspan').attr('x', lx).attr('dy', li === 0 ? 0 : 14)
          .attr('font-family', li === 0 ? 'IBM Plex Mono, monospace' : 'Inter, sans-serif')
          .attr('font-size', li === 0 ? '12' : '10').attr('fill', li === 0 ? s.data.color : '#767676').text(ln);
      });
      tg.transition().duration(300).delay(i * 120 + 500).attr('opacity', 1);
    });

    sc.append('text').attr('text-anchor', 'middle').attr('y', -8)
      .attr('font-family', 'IBM Plex Mono, monospace').attr('font-size', '10').attr('fill', '#767676').text('Scope 1+2');

    // Nota onesta
    svg.append('text').attr('class', 'scope-g').attr('x', W / 2).attr('y', H - 12)
      .attr('text-anchor', 'middle').attr('font-family', 'IBM Plex Mono, monospace').attr('font-size', '9.5')
      .attr('fill', '#505050').text('Piano di transizione climatica: non ancora formalizzato (2025)');
  }
</script>

<div class="chart-wrapper">
  <svg
    bind:this={svgEl}
    viewBox="0 0 {W} {H}"
    width="100%"
    height="100%"
    preserveAspectRatio="xMidYMid meet"
    aria-label="Visualizzazione dei consumi energetici e delle emissioni di Var Group: mix energetico, fonti fossili, elettricità rinnovabile, emissioni Scope 1+2"
  ></svg>
</div>

<style>
  .chart-wrapper { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
</style>
