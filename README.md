# trade-network-vis

Interactive visualization of the international trade network using [Svelte](https://svelte.dev/) and [d3](https://d3js.org/).

This repository is hosted [here](trade-network-vis.vercel.app).

This visualization contains monthly import and export data between 15 countries of interest, downloaded and processed from the International Monetary Fund's (IMF) [Direction of Trade Statistics (DOTS) Dataset](https://data.imf.org/?sk=9d6028d4-f14a-464c-a2f2-59b2cd424b85).


## Running Locally
Clone or download this repository...
```bash
git clone https://github.com/yizhe-ang/trade-network-vis.git
# or
npx degit yizhe-ang/trade-network-vis trade-network-vis

cd trade-network-vis
```
Install the dependencies...
```bash
npm install
```
Then run the application on a local server:
```bash
npm run dev
```