<script>
  import {
    curveStep,
    scaleTime,
    scaleLinear,
    scaleQuantize,
    min,
    max,
    extent,
    timeFormat,
  } from "d3";
  import { selectedYear, selectedCountry } from "../stores.js";
  import Chart from "./Chart.svelte";
  import Line from "./Line.svelte";
  import Axis from "./Axis.svelte";
  import Bars from "./Bars.svelte";
  import ChartScrubber from "./ChartScrubber.svelte";
  import { textcolor } from "../utils.js";

  export let data;

  // Define dimensions
  let width;
  let height;

  const margins = {
    marginTop: 20,
    marginRight: 10,
    marginBottom: 40,
    marginLeft: 50,
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

  // Extract data
  $: ({ imports: importData, exports: exportData } = data);

  // Define line parameters
  const interpolation = curveStep;
  const xAccessor = (d) => d.date;
  const yAccessor = (d) => d.value;

  $: xScale = scaleTime()
    .domain(extent(importData, xAccessor))
    .range([0, dimensions.boundedWidth]);

  $: yExtent = extent([...importData, ...exportData], yAccessor);

  $: yScale = scaleLinear()
    .domain(yExtent)
    .range([dimensions.boundedHeight, 0]);
  // .nice();

  $: lineXAccessorScaled = (d) => xScale(xAccessor(d));
  $: lineYAccessorScaled = (d) => yScale(yAccessor(d));

  // Define bar parameters
  const colorAccessor = (d) => d.bot;
  const barY1Accessor = (d) => d.import;
  const barY2Accessor = (d) => d.export;

  $: botData = importData.map((d, i) => ({
    date: d.date,
    import: d.value,
    export: exportData[i].value,
    bot: exportData[i].value - d.value,
  }));

  $: colorExtent = max([
    Math.abs(max(botData, colorAccessor)),
    Math.abs(min(botData, colorAccessor)),
  ]);

  // $: colorScale = scaleDiverging()
  //   .domain([-colorExtent, 0, colorExtent])
  //   .interpolator(interpolatePiYG);

  const colorRange = [];
  for (let i = 1; i <= 7; i++) {
    colorRange.push(`url(#diverging-${i})`);
  }
  $: colorScale = scaleQuantize()
    .domain([-colorExtent, colorExtent])
    .range(colorRange);

  $: widthAccessor =
    xScale(xAccessor(botData[1])) - xScale(xAccessor(botData[0]));
  $: barXAccessorScaled = (d) => xScale(xAccessor(d)) - widthAccessor / 2;
  $: barYAccessorScaled = (d) => {
    const y1 = yScale(barY1Accessor(d));
    const y2 = yScale(barY2Accessor(d));

    return y1 < y2 ? y1 : y2;
  };
  $: heightAccessor = (d) =>
    Math.abs(yScale(barY1Accessor(d)) - yScale(barY2Accessor(d)));
  $: colorAccessorScaled = (d) => colorScale(colorAccessor(d));

  // Scrubber parameters
  const delay = 1000;
  $: [firstValue, lastValue] = extent(importData, xAccessor).map((d) =>
    d.getFullYear()
  );
  let buttonText = "Play";
  let timer;
</script>

<div class="temporal-chart" bind:clientWidth={width} bind:clientHeight={height}>
  <!-- Draw Title -->
  <div class="title">
    <span class="title--bold">{$selectedCountry || "World"}'s</span> <br />
    Balance of Trade {@html textcolor("-", "#e16767")
      .outerHTML}{@html textcolor("+", "#e8d463").outerHTML}<br /> Over Time
    <button
      on:click={() => {
        // Pause
        if (buttonText === "Pause") {
          clearInterval(timer);
          buttonText = "Play";
          // Play
        } else {
          // Restart
          if ($selectedYear >= lastValue) {
            $selectedYear = firstValue;
            // Step
          } else {
            selectedYear.update((d) => d + 1);
          }

          timer = setInterval(() => {
            selectedYear.update((d) => d + 1);

            // Pause when reach the end
            if ($selectedYear >= lastValue) {
              $selectedYear = lastValue;
              clearInterval(timer);
              buttonText = "Play";
            }
          }, delay);

          buttonText = "Pause";
        }
      }}
    >
      {buttonText === "Play" ? "▶" : "❚❚"}
    </button>
  </div>

  {#if height && width}
    <Chart {dimensions}>
      <defs>
        <!-- Copyright 2021 Tom Shanley (ISC) https://observablehq.com/@tomshanley/cheysson-color-palettes -->
        <pattern
          id="diverging-1"
          x="0"
          y="0"
          width="5"
          height="5"
          patternUnits="userSpaceOnUse"
        >
          <rect
            class="pattern"
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="#e16767"
          /></pattern
        >
        <pattern
          id="diverging-2"
          x="0"
          y="0"
          width="3"
          height="3"
          patternUnits="userSpaceOnUse"
        >
          <rect class="pattern" width="100%" height="100%" fill="#edddce" />
          <line
            class="pattern"
            stroke="#e16767"
            stroke-width="2px"
            y1="1"
            x2="100%"
            y2="1"
          /></pattern
        >
        <pattern
          id="diverging-3"
          x="0"
          y="0"
          width="5"
          height="5"
          patternUnits="userSpaceOnUse"
        >
          <rect class="pattern" width="100%" height="100%" fill="#edddce" />
          <line
            class="pattern"
            y1="1.5"
            x2="100%"
            y2="1.5"
            stroke="#e16767"
            stroke-width="1.5px"
          /></pattern
        >
        <pattern
          id="diverging-4"
          x="0"
          y="0"
          width="5"
          height="5"
          patternUnits="userSpaceOnUse"
        >
          <rect
            class="pattern"
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="#edddce"
          /></pattern
        >
        <pattern
          id="diverging-5"
          x="0"
          y="0"
          width="5"
          height="5"
          patternUnits="userSpaceOnUse"
        >
          <rect class="pattern" width="100%" height="100%" fill="#edddce" />
          <line
            class="pattern"
            y1="1.5"
            x2="100%"
            y2="1.5"
            stroke="#e8d463"
            stroke-width="1.5px"
          /></pattern
        >
        <pattern
          id="diverging-6"
          x="0"
          y="0"
          width="4"
          height="4"
          patternUnits="userSpaceOnUse"
        >
          <rect class="pattern" width="100%" height="100%" fill="#edddce" />
          <line
            class="pattern"
            stroke="#e8d463"
            stroke-width="3px"
            y1="2"
            x2="100%"
            y2="2"
          /></pattern
        >
        <pattern
          id="diverging-7"
          x="0"
          y="0"
          width="5"
          height="5"
          patternUnits="userSpaceOnUse"
        >
          <rect
            class="pattern"
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="#e8d463"
          /></pattern
        >
      </defs>

      <!-- Draw axes -->
      <text class="axis-label">imports/exports in billion USD</text>
      <Axis
        dimension="x"
        scale={xScale}
        formatTick={timeFormat("%Y")}
        numberOfTicks={12}
        drawAxisLine={false}
      />
      <Axis
        dimension="y"
        scale={yScale}
        formatTick={(t) => {
          return t / 1_000;
        }}
        numberOfTicks={4}
        drawAxisLine={false}
        drawGrid={true}
      />

      <!-- Draw scrubber -->
      <ChartScrubber
        on:click={() => {
          // Pause the animation
          clearInterval(timer);
          buttonText = "Play";
        }}
        {xScale}
      />

      <!-- Draw bars -->
      <Bars
        data={botData}
        xAccessor={barXAccessorScaled}
        yAccessor={barYAccessorScaled}
        {widthAccessor}
        {heightAccessor}
        colorAccessor={colorAccessorScaled}
      />

      <!-- Draw lines -->
      <Line
        data={importData}
        xAccessor={lineXAccessorScaled}
        yAccessor={lineYAccessorScaled}
        {interpolation}
      />
      <Line
        data={exportData}
        xAccessor={lineXAccessorScaled}
        yAccessor={lineYAccessorScaled}
        {interpolation}
      />
    </Chart>
  {/if}
</div>

<style>
  .temporal-chart {
    height: 20vh;
    max-width: 800px;
    margin: 0 auto;
  }
  .title {
    position: absolute;
    transform: translate(20px, calc(-100% - 5px));
  }
  .title span {
    font-size: 18px;
  }
  .title--bold {
    font-weight: 700;
  }
  .title button {
    cursor: pointer;
    padding-bottom: 0;
    padding: 0 5px;
    padding-top: 5px;
    margin: 0;
    margin-left: 5px;
    border: none;
    background: #ebddd8;
    transition: box-shadow 0.3s;
  }
  .title button:hover {
    box-shadow: 0 0 11px rgba(33, 33, 33, 0.2);
  }
  .axis-label {
    font-size: 0.7em;
    transform: translate(0, -5px);
    fill: #b2a6af;
  }
</style>
