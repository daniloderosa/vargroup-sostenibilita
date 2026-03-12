<!--
  Scrolly.svelte
  IntersectionObserver-based scrollytelling helper.
  Bind `value` to get the index of the currently visible step.

  Usage:
    <Scrolly bind:value={activeStep}>
      <div class="step">step 0</div>
      <div class="step">step 1</div>
    </Scrolly>
-->
<script>
  import { onMount, onDestroy } from 'svelte';

  let { value = $bindable(0), threshold = 0.5, children } = $props();

  let container;
  let observers = [];

  onMount(() => {
    const steps = Array.from(container.children);

    steps.forEach((step, i) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            value = i;
          }
        },
        { threshold }
      );
      observer.observe(step);
      observers.push(observer);
    });
  });

  onDestroy(() => {
    observers.forEach(o => o.disconnect());
  });
</script>

<div bind:this={container} class="scrolly-container" style="touch-action: pan-y;">
  {@render children?.()}
</div>

<style>
  .scrolly-container {
    position: relative;
  }
</style>
