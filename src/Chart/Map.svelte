<script>
  // With reference from: https://observablehq.com/@d3/world-choropleth?collection=@d3/charts
  import {
    scaleSequential,
    interpolateBlues,
    extent,
    InternMap,
    map,
    geoEqualEarth,
    geoPath,
  } from "d3";
  import { getContext } from "svelte";

  export let data; // network format; nodes and links
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

  const { dimensions: dimensionsStore } = getContext("Chart");
  $: dimensions = $dimensionsStore;

  // Compute values
  $: ids = map(data.nodes, idAccessor);
  $: values = map(data.nodes, valueAccessor).map((d) => (d == null ? NaN : +d));
  $: idToIdx = new InternMap(ids.map((id, i) => [id, i]));
  $: featureIds = map(features.features, featureIdAccessor);

  // Compute default domains
  $: if (colorDomain === undefined) colorDomain = extent(values);

  // Construct scales
  $: colorScale = colorScaleType(colorDomain, colorRange);
  $: if (unknownColor !== undefined) colorScale.unknown(unknownColor);

  let mapWidth;
  $: if (outline !== undefined) {
    // Projection function
    // scale for [longitude, latitude] -> [x, y] pixels
    projection = projection.fitHeight(dimensions.boundedHeight, outline); // to trigger reactivity

    // Get pixel dimensions of map based on the outline
    const [[x0, y0], [x1, y1]] = geoPath(projection).bounds(outline);

    mapWidth = x1 - x0;
  }

  // Construct path generator
  $: pathGenerator = geoPath(projection);

  // Returns the color for each geo feature
  function getColorFromIdx(i) {
    return colorScale(values[idToIdx.get(featureIds[i])]);
  }
</script>

<!-- Move to center -->
<g transform="translate({dimensions.boundedWidth / 2 - mapWidth / 2},0)">
  <!-- Render outline -->
  {#if outline}
    <path class="geo-outline" fill-opacity="0" d={pathGenerator(outline)} />
  {/if}
  <!-- Render geo features-->
  <g class="geo-features">
    {#each features.features as f, i}
      <path d={pathGenerator(f)} />
    {/each}
  </g>
  <!-- Render geo borders -->
  {#if borders}
    <path
      class="geo-borders"
      pointer-events="none"
      fill="none"
      stroke-linecap={borderStrokeLinecap}
      stroke-linejoin={borderStrokeLinejoin}
      stroke-width={borderStrokeWidth}
      d={pathGenerator(borders)}
    />
  {/if}
</g>

<style>
  .geo-features {
    fill: #edddce;
    stroke: #f9ece3;
    fill-opacity: 0.9;
  }
  .geo-borders {
    stroke: #f9ece3;
  }
</style>
