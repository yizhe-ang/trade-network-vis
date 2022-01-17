<script>
  import { selectedYear, selectedCountry } from "./stores.js";
  import { onMount } from "svelte";
  import { csv, json, interpolateYlGnBu, ascending } from "d3";
  import {
    computeLinks,
    processTradeData,
    computeTemporalData,
  } from "./dataProcessing";
  import TemporalChart from "./Chart/TemporalChart.svelte";
  import NetworkChart from "./Chart/NetworkChart.svelte";
  import {
    feature as topojsonFeature,
    mesh as topojsonMesh,
  } from "topojson-client";

  // Define data
  const dataPath = "data/trading.csv";
  const topoJsonPath = "data/countries-50m.json";

  let data;

  let networkData;
  let nodes;
  let geoFeatures;
  // let borders;

  let temporalData;

  let isMounted = false;

  // Re-filter data when selected date or country changes
  $: if (isMounted)
    networkData = { nodes, links: computeLinks(data, { year: $selectedYear }) };
  $: if (isMounted) temporalData = computeTemporalData(data, $selectedCountry);

  onMount(async () => {
    // Load and preprocess data
    data = await csv(dataPath, processTradeData);

    // Load geo data
    const topoJson = await json(topoJsonPath);
    geoFeatures = topojsonFeature(topoJson, topoJson.objects.countries);
    // borders = topojsonMesh(
    //   topoJson,
    //   topoJson.objects.countries,
    //   (a, b) => a !== b
    // );

    // Set initial year
    selectedYear.set(
      [...new Set(data.map((d) => d.date.getFullYear()))].sort(ascending)[0]
    );

    // Process data for network viz
    nodes = [...new Set(data.map((d) => d.countrySource))].sort().map((id) => ({
      id,
    }));

    const links = computeLinks(data, { year: $selectedYear });

    networkData = { nodes, links };

    // Process data for temporal chart
    temporalData = computeTemporalData(data, $selectedCountry);

    // Update flag
    isMounted = true;
  });
</script>

<svelte:head>
  <title>Global Trade Network</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Vollkorn:wght@400;700&display=swap"
    rel="stylesheet"
  />
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
  />
</svelte:head>

<main>
  {#if isMounted}
    <div class="charts">
      <NetworkChart
        data={networkData}
        idAccessor={(d) => d.id}
        valueAccessor={undefined}
        colorRange={interpolateYlGnBu}
        features={geoFeatures}
        featureIdAccessor={(d) => d.properties.name}
      />
      <TemporalChart data={temporalData} />
    </div>

    <!-- Footer -->
    <div class="footer-wrapper">
      <div class="footer">
        <div class="footer--text">
          This visualization contains monthly import and export data between 15
          countries of interest, downloaded and processed from the International
          Monetary Fund's (IMF) <a
            href="https://data.imf.org/?sk=9d6028d4-f14a-464c-a2f2-59b2cd424b85"
            >Direction of Trade Statistics (DOTS) Dataset</a
          >.
        </div>
        <div class="footer--github-icon">
          <a href="https://github.com/yizhe-ang/trade-network-vis"
            ><i class="fa fa-github" /></a
          >
        </div>
      </div>
    </div>
  {/if}
</main>

<style>
  :global(body) {
    padding: 0;
    margin: 0;
  }
  main {
    font-family: "Vollkorn", serif;
  }
  .charts {
    position: relative;
    max-width: 100%;
    margin: 0 auto;
    background-color: #f9ece3;
  }
  .footer-wrapper {
    max-width: 100%;
    background: #ebddd8;
  }
  .footer {
    max-width: 500px;
    margin: 0 auto;
    padding: 50px 20px 30px 20px;
  }
  .footer--text {
    padding-bottom: 30px;
  }
  .footer--text a {
    color: #7d9ea5;
  }
  .footer--github-icon {
    text-align: center;
  }
  .footer--github-icon i {
    font-size: 32px;
    color: black;
  }
</style>
