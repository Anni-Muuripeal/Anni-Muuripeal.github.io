import { fetchData } from './fetch.js';
let graphVisible = false; 

async function calculateTotalAudits() {
    try {
        const data = await fetchData();
        const totalAudits = data.transaction
            .filter(item => item.type === 'up').length;
        const totalAuditsElement = document.getElementById('totalAudits');
        totalAuditsElement.textContent = totalAudits;
    
        const auditGraph = document.getElementById('auditGraph');
        auditGraph.addEventListener('click', () => {
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
        errorMessage.textContent = 'Error calculating the audits';
    }
}
function generateLineGraph(auditData) {
    const svgWidth = 600;
    const svgHeight = 400;
    const margin = 50;
    const graphWidth = svgWidth - 2 * margin;
    const graphHeight = svgHeight - 2 * margin;
  const auditsByMonth = {};
  auditData.forEach(item => {
    if (item.type === 'up') {
      const createdAt = new Date(item.createdAt);
      const monthYear = createdAt.toLocaleString('en-US', { month: 'short', year: '2-digit' });
      auditsByMonth[monthYear] = (auditsByMonth[monthYear] || 0) + 1;
    }
  });
  const months = Object.keys(auditsByMonth);
  const auditCounts = Object.values(auditsByMonth);
  const xScale = d3.scaleBand()
    .domain(months)
    .range([0, graphWidth])
    .padding(0.1);
  const yScale = d3.scaleLinear()
    .domain([0, d3.max(auditCounts) + 1])
    .range([graphHeight, 0]);
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
    .attr('class', 'bar')
    .selectAll('.bar')
    .data(auditCounts)
    .enter()
    .append('rect')
    .attr('x', (d, i) => xScale(months[i]))
    .attr('y', d => yScale(d))
    .attr('width', xScale.bandwidth())
    .attr('height', d => graphHeight - yScale(d))
  graph
    .append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0, ${graphHeight})`)
    .call(d3.axisBottom(xScale));
  graph
    .append('g')
    .attr('class', 'y-axis')
    .call(d3.axisLeft(yScale)
      .tickFormat(d3.format('.0f')));
}
document.addEventListener('DOMContentLoaded', calculateTotalAudits);