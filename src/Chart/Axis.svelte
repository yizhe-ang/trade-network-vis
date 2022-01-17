<script>
  // TODO: How to support d3 axis-like transitions?
  import { getContext } from "svelte";
  import * as d3 from "d3";

  export let dimension = "x"; // support more positions? (right, top etc.)
  export let scale = null;
  export let label;
  export let formatTick = d3.format(","); // should I use d3 scale formatting by default?
  export let numberOfTicks;
  export let drawAxisLine = true;
  export let drawGrid = false;
  // export let tickGap = 80

  const { dimensions: dimensionsStore } = getContext("Chart");
  $: dimensions = $dimensionsStore;

  // Define number of ticks
  $: if (numberOfTicks === undefined) {
    numberOfTicks =
      dimension == "x"
        ? dimensions.boundedWidth < 600
          ? dimensions.boundedWidth / 100 // should we allow user to specify tickGap?
          : dimensions.boundedWidth / 250
        : dimensions.boundedHeight / 70;
  }

  $: ticks = scale.ticks(numberOfTicks);
</script>

<g
  class="Axis Axis--dimension-{dimension}"
  transform={`translate(0, ${dimension == "x" ? dimensions.boundedHeight : 0})`}
>
  <!-- Draw line -->
  {#if drawAxisLine}
    <line
      class="Axis__line"
      x2={dimension == "x" ? dimensions.boundedWidth : 0}
      y2={dimension == "y" ? dimensions.boundedHeight : 0}
    />
  {/if}

  <!-- Draw ticks -->
  {#each ticks as tick}
    <!-- To include tick marks too? -->
    <text
      class="Axis__tick"
      transform={`translate(${(dimension == "x"
        ? [scale(tick), 15]
        : [-16, scale(tick)]
      ).join(", ")})`}
    >
      {formatTick(tick)}
    </text>

    <!-- Draw grid -->
    {#if drawGrid}
      <line
        class="Axis__grid"
        transform={`translate(${(dimension == "x"
          ? [scale(tick), 0]
          : [0, scale(tick)]
        ).join(", ")})`}
        x2={dimension == "x" ? 0 : dimensions.boundedWidth}
        y2={dimension == "y" ? 0 : dimensions.boundedHeight}
      />
    {/if}
  {/each}

  <!-- Draw label -->
  {#if label}
    <text
      class="Axis__label"
      style="transform: translate({(dimension == 'x'
        ? [dimensions.boundedWidth / 2, 60]
        : [-56, dimensions.boundedHeight / 2]
      )
        .map((d) => d + 'px')
        .join(', ')}) {dimension == 'y' ? 'rotate(-90deg)' : ''}"
    >
      {label}
    </text>
  {/if}
</g>

<style>
  .Axis__line {
    stroke: #b2a6af;
    stroke-opacity: 0.5;
  }

  .Axis__grid {
    /* stroke: #b2a6af; */
    stroke: #b2a6af;
    stroke-opacity: 0.2;
    pointer-events: none;
  }

  .Axis__label {
    text-anchor: middle;
    font-size: 0.8em;
    letter-spacing: 0.01em;
  }

  .Axis__tick {
    font-size: 0.7em;
    fill: #b2a6af;
    transition: all 0.3s ease-out;
  }

  .Axis--dimension-x .Axis__tick {
    text-anchor: middle;
  }

  .Axis--dimension-y .Axis__tick {
    dominant-baseline: middle;
    text-anchor: end;
  }
</style>
