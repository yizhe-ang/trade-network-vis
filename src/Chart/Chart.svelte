<script>
  // Wrapper for a svg chart
  // That maintains a store of shared values
  import { setContext } from "svelte";
  import { writable } from "svelte/store";

  export let dimensions = {};
  export let scales = {};
  export let data = [];

  // Define stores
  let currentDimensions = writable(dimensions);
  let currentScales = writable(scales);
  let currentData = writable(data);

  // Update stores
  $: currentDimensions.set(dimensions);
  $: currentScales.set(scales);
  $: currentData.set(data);
  $: chartContext = {
    dimensions: currentDimensions,
    scales: currentScales,
    data: currentData,
  };

  $: setContext("Chart", chartContext);
</script>

<svg
  class="Chart"
  width={dimensions.width}
  height={dimensions.height}
  overflow="visible"
>
  <g transform={`translate(${dimensions.marginLeft}, ${dimensions.marginTop})`}>
    <slot />
  </g>
</svg>
