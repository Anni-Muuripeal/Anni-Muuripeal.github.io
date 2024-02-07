import { fetchData } from './fetch.js';
let graphVisible = false; 
async function calculateTotalXP() {
  try {
    const data = await fetchData();
    const totalXP = data.transaction
      .filter(item => !item.path.includes('piscine') && !item.type.includes('up'))
      .reduce((sum, item) => sum + item.amount, 0);
    const totalXPElement = document.getElementById('totalXP');
    totalXPElement.textContent = totalXP;
    const XPgraph = document.getElementById('XPgraph');
    XPgraph.addEventListener('click', () => {
      if (graphVisible) {
        const graphElement = document.getElementById('graph');
        graphElement.innerHTML = '';
        graphVisible = false;
      } else {
        generateLineGraph(data.transaction);
        graphVisible = true;
      }
    });
  } catch (error) {
    errorMessage.textContent = 'Error calculating the total XP';
  }
}
function generateLineGraph(transactionData) {
  const svgWidth = 600;
  const svgHeight = 600;
  const margin = 50;
  const graphWidth = svgWidth - 2 * margin;
  const graphHeight = svgHeight - 2 * margin;
  const filteredData = transactionData.filter(item => !item.path.includes('piscine') && !item.type.includes('up'));
  const cumulativeData = filteredData.map((item, index) => {
    const xpAdded = item.amount ;
    const createdAt = new Date(item.createdAt);
    const cumulativeSum = filteredData
    .slice(0, index + 1)
    .reduce((sum, item) => sum + (item.amount || 0), 0);
    return { createdAt, xpAdded, cumulativeSum };
  });
  const xScale = d3.scaleTime()
    .domain(d3.extent(cumulativeData, value => value.createdAt))
    .range([0, graphWidth])
    .nice(d3.timeMonth.every(1));
  const yScale = d3.scaleLinear()
    .domain([0, d3.max(cumulativeData, value => value.cumulativeSum)])
    .range([graphHeight, 0]);
  const line = d3.line()
    .x(value => xScale(value.createdAt))
    .y(value => yScale(value.cumulativeSum));
  const svg = d3
    .select('#graph')
    .append('svg')
    .attr('class', 'graph')
    .attr('width', svgWidth)
    .attr('height', svgHeight);
  const graph = svg
    .append('g')
    .attr('transform', `translate(${margin},${margin})`);
  graph
    .append('path')
    .datum(cumulativeData)
    .attr('class', 'line')
    .attr('d', line);
  graph
    .attr('class', 'xpLabel')
    .selectAll('.xpLabel')
    .data(cumulativeData)
    .enter()
    .append('text')
    .attr('x', d => xScale(d.createdAt))
    .attr('y', d => yScale(d.cumulativeSum))
    .attr('dx', -35)
  graph
    .append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0, ${graphHeight})`)
    .call(d3.axisBottom(xScale)
      .tickFormat(d3.timeFormat('%b %y')));
  graph
    .append('g')
    .attr('class', 'y-axis')
    .call(d3.axisLeft(yScale)
      .tickFormat(d3.format('')))
    .append('text')
      .attr('class', 'y-axis-label')
      .text('XP')
      .attr('dy', -10)
}
document.addEventListener('DOMContentLoaded', calculateTotalXP);
