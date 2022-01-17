<script>
  import { max } from "d3";

  export let data;
  export let keyAccessor = () => {};
  export let xAccessor = () => {};
  export let yAccessor = () => {};
  export let widthAccessor = () => {};
  export let heightAccessor = () => {};
  export let colorAccessor = () => {};
  export let style = "";

  export const callAccessor = (accessor, d, i) =>
    typeof accessor === "function" ? accessor(d, i) : accessor;
</script>

<g class="bars">
  {#each data as d, i (keyAccessor(d) || i)}
    <rect
      {style}
      key={keyAccessor(d, i)}
      x={callAccessor(xAccessor, d, i)}
      y={callAccessor(yAccessor, d, i)}
      width={max([callAccessor(widthAccessor, d, i), 0])}
      height={max([callAccessor(heightAccessor, d, i), 0])}
      fill={max([callAccessor(colorAccessor, d, i), 0])}
      stroke={max([callAccessor(colorAccessor, d, i), 0])}
    />
  {/each}
</g>

<style>
  .bars rect {
    transition: all 0.3s ease-out;
    pointer-events: none;
  }
</style>
