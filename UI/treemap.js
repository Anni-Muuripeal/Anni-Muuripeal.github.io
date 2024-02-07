import { fetchData } from './fetch.js';
let graphVisible = false; 

// Generate the project treemap
async function generateProjectTreemap() {
  try {
    const data = await fetchData();
    const treemapGraph = document.getElementById('treemapGraph');
    treemapGraph.addEventListener('click', () => {
      if (graphVisible) {
        const graphElement = document.getElementById('graph');
        graphElement.innerHTML = '';
        graphVisible = false;
      } else {
        generateProjectGraph(data.transaction);
        graphVisible = true;
      }
    });
  } catch (error) {
    errorMessage.textContent = 'Error generating the treemap';
  }
}

function generateProjectGraph(transactionData) {
  const filteredData = transactionData.filter(item => item.object && item.object.type === 'project' && !item.type.includes('up'));

  // The data for the treemap
  const treemapData = filteredData.map(item => {
    const amount = item.amount;
    const pathParts = item.path.split('/');
    const name = pathParts[pathParts.length - 1];
    return { name, amount };
  });

  const width = 1000;
  const height = 400;

  // Treemap layout
  const root = d3.treemap()
    .size([width, height])
    .padding(1)
    .round(true)
  (d3.hierarchy({ children: treemapData })
    .sum(d => d.amount)
    .sort((a, b) => b.amount - a.amount));

  // Treemap SVG
  const svg = d3.select('#graph')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  // Cell for each leaf of the hierarchy
  const leaf = svg.selectAll("g")
    .data(root.leaves())
    .join("g")
      .attr("transform", d => `translate(${d.x0},${d.y0})`);

  // Tooltip
  const format = d3.format(",d");
  leaf.append("title")
      .text(d => `${d.ancestors().reverse().map(d => d.data.name).join(".")}\n${format(d.data.amount)}`);

  // Colored rectangle
  leaf.append("rect")
      .attr("fill", "#ffcadc")
      .attr("stroke", "#ff009d")
      .attr("width", d => d.x1 - d.x0)
      .attr("height", d => d.y1 - d.y0);

  // Multiline text
  leaf.append("text")
    .attr("class", "tspan")
    .selectAll("tspan")
    .data(d => d.data.name.split(/(?=[A-Z][a-z])|\s+/g).concat(format(d.value)))
    .join("tspan")
      .attr("x", 3)
      .attr("y", (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`)
      .text(d => d);
}

document.addEventListener('DOMContentLoaded', generateProjectTreemap);
