<script>
  import '$lib/styles/global.css';
  let { children } = $props();
</script>

<svelte:head>
  <title>Var Group — Bilancio di Sostenibilità 2025</title>
  <meta name="description" content="Una lettura interattiva del Bilancio di Sostenibilità 2025 di Var Group" />
</svelte:head>

{@render children()}
