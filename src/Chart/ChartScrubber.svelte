<script>
  import { getContext, onMount } from "svelte";
  import { drag, select } from "d3";
  import { selectedYear } from "../stores.js";

  export let xScale;

  const { dimensions: dimensionsStore } = getContext("Chart");
  $: dimensions = $dimensionsStore;

  let scrubber;

  // export let selectedYear;
  let currentX = 0;

  onMount(() => {
    // Init drag
    const dragBehaviour = drag().on("start drag", (e) => {
      // Update value
      currentX = e.x;
      selectedYear.set(xScale.invert(currentX).getFullYear());
    });
    select(scrubber).call(dragBehaviour);
  });

  function getDateFromValue(value) {
    return new Date(value, 0);
  }
</script>

<!-- Draw handle -->
<rect
  class="handle"
  x={xScale(getDateFromValue($selectedYear))}
  width={xScale(getDateFromValue($selectedYear + 1)) -
    xScale(getDateFromValue($selectedYear))}
  height={dimensions.boundedHeight}
/>

<!-- Draw scrubber -->
<rect
  bind:this={scrubber}
  on:click
  class="scrubber"
  width={dimensions.boundedWidth}
  height={dimensions.boundedHeight}
/>

<style>
  .handle {
    fill: #b2a6af;
    fill-opacity: 0.2;
    transition: all 0.3s ease-out;
    pointer-events: none;
  }
  .scrubber {
    fill-opacity: 0;
    cursor: pointer;
  }
  .scrubber:active {
    fill-opacity: 0;
    cursor: grabbing;
  }
</style>
