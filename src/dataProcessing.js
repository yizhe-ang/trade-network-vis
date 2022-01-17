import { ascending, rollups, sum } from "d3";

export const processTradeData = (d) => ({
  countrySource: d.countrySource,
  countryTarget: d.countryTarget,
  type: d.type,
  value: +d.value,
  date: new Date(d.year, d.month - 1),
});

export const computeLinks = (data, { year, type = "export" } = {}) => {
  let out = data;

  // Filter by year
  out = out.filter((d) => d.date.getFullYear() === year);
  // Filter by type
  out = out.filter((d) => d.type === type);

  // Perform aggregation
  out = rollups(
    out,
    (v) => sum(v, (d) => d.value), // sum values
    (d) => d.countrySource + "|" + d.countryTarget // group by (source, target)
  );

  // Desired format
  out = out.map((d) => ({
    source: d[0].split("|")[0],
    target: d[0].split("|")[1],
    value: d[1],
  }));

  return out;
};

export const computeTemporalData = (data, country) => {
  function agg(data) {
    return (
      rollups(
        data,
        (v) => sum(v, (d) => d.value), // sum values
        (d) => d.date // group by date
      )
        // Process to desired format
        .map((d) => ({ date: d[0], value: d[1] }))
        .sort((a, b) => ascending(a.date, b.date))
    );
  }

  if (country !== null) {
    data = data.filter((d) => d.countrySource === country);
  }
  const importData = data.filter((d) => d.type === "import");
  const exportData = data.filter((d) => d.type === "export");

  const importValuesByDate = agg(importData);
  const exportValuesByDate = agg(exportData);

  return { imports: importValuesByDate, exports: exportValuesByDate };
};
