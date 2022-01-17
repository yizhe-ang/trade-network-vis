<script>
  import { scaleSequential, geoEqualEarth } from "d3";
  import { selectedYear } from "../stores.js";
  import Chart from "./Chart.svelte";
  import Chord from "./Chord.svelte";
  import Map from "./Map.svelte";

  export let data;
  export let idAccessor = (d) => d.id; // given d in data, returns the feature id
  export let valueAccessor = () => undefined; // given d in data, returns the quantitative value
  export let colorScaleType = scaleSequential; // type of color scale
  export let colorDomain; // [min, max] values; input of color scale
  export let colorRange = interpolateBlues; // output of color scale
  export let projection = geoEqualEarth(); // a D3 projection; null for pre-projected geometry
  export let features; // a GeoJSON feature collection
  export let featureIdAccessor = (d) => d.id; // given a feature, returns its id
  export let borders; // a GeoJSON object for stroking borders
  export let outline =
    projection && projection.rotate ? { type: "Sphere" } : null; // a GeoJSON object for the background
  export let unknownColor = "#ccc"; // fill color for missing data
  export let borderStrokeLinecap = "round"; // stroke line cap for borders
  export let borderStrokeLinejoin = "round"; // stroke line join for borders
  export let borderStrokeWidth; // stroke width for borders
  // TODO: Option to draw graticules?

  // Define dimensions
  let width;
  let height;

  const margins = {
    marginTop: 30,
    marginRight: 10,
    marginBottom: 10,
    marginLeft: 10,
  };
  // Chart dimensions will change upon resizing
  $: dimensions = {
    width,
    height,
    ...margins,
    boundedHeight: Math.max(
      height - margins.marginTop - margins.marginBottom,
      0
    ),
    boundedWidth: Math.max(width - margins.marginLeft - margins.marginRight, 0),
  };
</script>

<div class="network-chart" bind:clientWidth={width} bind:clientHeight={height}>
  <div
    class="title"
    style="transform: translate(calc({dimensions.boundedWidth}px -
    100%), 20px)"
  >
    Global<br />Trade Network<br /><span class="title--bold"
      >{$selectedYear}</span
    >
  </div>
  {#if height && width}
    <Chart {dimensions}>
      <Map
        {data}
        {idAccessor}
        {valueAccessor}
        {colorRange}
        {features}
        {featureIdAccessor}
        {borders}
      />
      <Chord {data} />
    </Chart>
  {/if}
</div>

<style>
  .network-chart {
    height: 80vh;
    max-width: 800px;
    margin: 0 auto;
  }
  .title {
    position: absolute;
    text-align: right;
    font-size: 26px;
    line-height: 1.2;
  }
  .title--bold {
    font-weight: 700;
  }
</style>
