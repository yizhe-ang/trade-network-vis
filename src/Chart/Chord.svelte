<script>
  // With reference from: https://observablehq.com/@d3/directed-chord-diagram?collection=@d3/d3-chord
  import { selectedCountry } from "../stores.js";
  import {
    arc,
    chordDirected,
    ribbonArrow,
    descending,
    scaleOrdinal,
    schemeCategory10,
  } from "d3";
  import { getContext } from "svelte";
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import uid from "../uid";

  export let data;

  let nameOnHover = null;

  // Define dimensions
  const { dimensions: dimensionsStore } = getContext("Chart");
  $: dimensions = $dimensionsStore;
  $: innerRadius =
    Math.min(dimensions.boundedWidth, dimensions.boundedHeight) * 0.5 - 15;
  $: outerRadius = innerRadius + 8;

  // Process data
  const textId = uid("text");
  // $: names = data.nodes.map((d) => d.id);
  const names = [
    "France",
    "United Kingdom",
    "Netherlands",
    "Germany",
    "Italy",
    "Russia",
    "India",
    "China",
    "South Korea",
    "Japan",
    "Singapore",
    "Indonesia",
    // "South Africa",
    "Brazil",
    "United States",
    "Canada",
  ];
  const groups = new Map([
    ["Europe", ["United Kingdom", "Netherlands", "Germany", "France", "Italy"]],
    ["Russia", ["Russia"]],
    ["Asia", ["India", "China", "Japan", "South Korea"]],
    ["Southeast Asia", ["Singapore", "Indonesia"]],
    // ["Africa", ["South Africa"]],
    ["South America", ["Brazil"]],
    ["North America", ["United States", "Canada"]],
  ]);
  let nameToGroup = new Map();
  for (const [g, ns] of groups.entries()) {
    for (const n of ns) {
      nameToGroup.set(n, g);
    }
  }

  const groupToColor = new Map([
    ["Europe", "url(#green)"],
    ["Russia", "url(#purple)"],
    ["Asia", "url(#yellow)"],
    ["Southeast Asia", "url(#blue)"],
    // ["Africa", "url(#orange)"],
    ["South America", "url(#orange)"],
    ["North America", "url(#red)"],
  ]);

  let matrix;
  $: {
    const index = new Map(names.map((name, i) => [name, i]));

    matrix = Array.from(index, () => new Array(names.length).fill(0));
    for (const { source, target, value } of data.links)
      matrix[index.get(source)][index.get(target)] += value;
  }

  // Define layout / generators
  $: chordLayout = chordDirected()
    .padAngle(12 / innerRadius)
    .sortSubgroups(descending) // FIXME: what is this for?
    .sortChords(descending);

  $: arcGenerator = arc().innerRadius(innerRadius).outerRadius(outerRadius);

  $: ribbonGenerator = ribbonArrow()
    .radius(innerRadius - 0.5)
    .padAngle(1 / innerRadius);

  // Define scales
  $: colorScale = scaleOrdinal(names, schemeCategory10);

  // Generate data for drawing
  const groupStartAngles = tweened(new Array(names.length).fill(0), {
    duration: 100,
    easing: cubicOut,
  });
  $: chords = chordLayout(matrix);
  $: groupStartAngles.set(chords.groups.map((d) => d.startAngle));

  function showChord(d, selectedNames) {
    return (
      selectedNames.includes(names[d.target.index]) ||
      selectedNames.includes(names[d.source.index]) ||
      selectedNames.every((n) => n === null)
    );
  }

  function getChordOpacity(d, selectedNames) {
    if (showChord(d, selectedNames)) {
      return 1;
    } else {
      return 0;
    }
  }

  function getChordFill(d, selectedNames) {
    return groupToColor.get(nameToGroup.get(names[d.target.index]));
  }
</script>

<!-- Define color palette -->
<defs>
  <!-- Copyright 2021 Tom Shanley (ISC) https://observablehq.com/@tomshanley/cheysson-color-palettes -->
  <pattern
    id="red"
    x="0"
    y="0"
    width="3"
    height="3"
    patternUnits="userSpaceOnUse"
  >
    <rect class="pattern" width="100%" height="100%" fill="#edddce" />
    <line
      class="pattern"
      stroke="#d9636c"
      stroke-width="2px"
      y1="1"
      x2="100%"
      y2="1"
    /></pattern
  >
  <pattern
    id="green"
    x="0"
    y="0"
    width="3"
    height="3"
    patternUnits="userSpaceOnUse"
  >
    <rect class="pattern" width="100%" height="100%" fill="#edddce" />
    <line
      class="pattern"
      stroke="#869e80"
      stroke-width="2px"
      y1="1"
      x2="100%"
      y2="1"
    /></pattern
  >
  <pattern
    id="yellow"
    x="0"
    y="0"
    width="3"
    height="3"
    patternUnits="userSpaceOnUse"
  >
    <rect class="pattern" width="100%" height="100%" fill="#edddce" />
    <line
      class="pattern"
      stroke="#dec367"
      stroke-width="2px"
      y1="1"
      x2="100%"
      y2="1"
    /></pattern
  >
  <pattern
    id="blue"
    x="0"
    y="0"
    width="3"
    height="3"
    patternUnits="userSpaceOnUse"
  >
    <rect class="pattern" width="100%" height="100%" fill="#edddce" />
    <line
      class="pattern"
      stroke="#85aab1"
      stroke-width="2px"
      y1="1"
      x2="100%"
      y2="1"
    /></pattern
  >
  <pattern
    id="grey"
    x="0"
    y="0"
    width="3"
    height="3"
    patternUnits="userSpaceOnUse"
  >
    <rect class="pattern" width="100%" height="100%" fill="#edddce" />
    <line
      class="pattern"
      stroke="#edddce"
      stroke-width="2px"
      y1="1"
      x2="100%"
      y2="1"
    /></pattern
  >
  <pattern
    id="orange"
    x="0"
    y="0"
    width="3"
    height="3"
    patternUnits="userSpaceOnUse"
  >
    <rect class="pattern" width="100%" height="100%" fill="#edddce" />
    <line
      class="pattern"
      stroke="#ed8238"
      stroke-width="2px"
      y1="1"
      x2="100%"
      y2="1"
    /></pattern
  >
  <pattern
    id="purple"
    x="0"
    y="0"
    width="3"
    height="3"
    patternUnits="userSpaceOnUse"
  >
    <rect class="pattern" width="100%" height="100%" fill="#edddce" />
    <line
      class="pattern"
      stroke="#ab90a4"
      stroke-width="2px"
      y1="1"
      x2="100%"
      y2="1"
    /></pattern
  >
</defs>

<!-- To reset chart  -->
<rect
  on:click={() => {
    selectedCountry.set(null);
  }}
  width={dimensions.boundedWidth}
  height={dimensions.boundedHeight}
  fill-opacity="0"
/>
<!-- Move chart to center -->
<g
  transform="translate({dimensions.boundedWidth / 2},{dimensions.boundedHeight /
    2})"
>
  <!-- Define text circumference -->
  <path
    id={textId.id}
    fill="none"
    d={arc()({ outerRadius, startAngle: 0, endAngle: 2 * Math.PI })}
  />
  <!-- Draw chords -->
  <g class="chords">
    {#each chords as d (names[d.source.index] + names[d.target.index])}
      <path
        d={ribbonGenerator(d)}
        fill={getChordFill(d, [nameOnHover, $selectedCountry])}
        fill-opacity={getChordOpacity(d, [nameOnHover, $selectedCountry])}
      />
    {/each}
  </g>
  <!-- Draw circumference -->
  <g class="circumference">
    {#each chords.groups as d, i}
      <!-- svelte-ignore a11y-mouse-events-have-key-events -->
      <g
        class="arc"
        on:mouseover={() => {
          nameOnHover = names[d.index];
        }}
        on:mouseout={() => {
          nameOnHover = null;
        }}
        on:click={() => {
          // Update selected country
          selectedCountry.update((c) =>
            c === names[d.index] ? null : names[d.index]
          );
        }}
      >
        <!-- Draw arc -->
        <path
          d={arcGenerator(d)}
          fill={groupToColor.get(nameToGroup.get(names[d.index]))}
        />
        <!-- Draw group labels -->
        {#if (d.endAngle - d.startAngle) * outerRadius > 35}
          <text dy={-3} font-size={10}>
            <textPath
              xlink:href={textId.href}
              startOffset={$groupStartAngles[i] * outerRadius}
            >
              {names[d.index]}
            </textPath>
          </text>
        {/if}
      </g>
    {/each}
  </g>
</g>

<style>
  .chords {
    fill-opacity: 0.75;
    mix-blend-mode: multiply;
  }
  .arc path {
    /* stroke: #fff; */
    transition: all 0.1s cubic-bezier(0.215, 0.61, 0.355, 1);
    cursor: pointer;
  }
  .arc text {
    cursor: pointer;
  }
  .chords path {
    transition: all 0.1s cubic-bezier(0.215, 0.61, 0.355, 1);
  }
</style>
