const express = require('express');
const router = express.Router();
const D3Node = require('d3-node');
const d3 = require('d3');
const DataSource = require('./../bin/DataSource');

router.get(`/weather`, function(req, res, next) {
    const d3n = new D3Node({d3Module: d3, selector: '#chart',  container: '<div id="chart"></div>'}); // initializes D3 with container element
    const svgParent = d3n.createSVG(100, 100);

    const margin = {top: 20, right: 20, bottom: 30, left: 30};
    const fullWidth = 1200;
    const fullHeight = 600;
    const width = fullWidth - margin.left - margin.right;
    const height = fullHeight - margin.top - margin.bottom;

    const ds = new DataSource();
    return ds.get()
        .then((data) => {
            const formatTime = d3.timeFormat('%d-%b');
            const line = d3.line()
                .x(d => xScale(d.time))
                .y(d => yScale(d.temp));

            let svg = svgParent
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', `translate(${margin.left}, ${margin.top})`);

            let yExtent = d3.extent(data, d => d.temp);
            let yScale = d3.scaleLinear()
                .domain([yExtent[0] - 5, yExtent[1]])
                .range([height, 0]);

            let yAxis = d3.axisLeft(yScale);
            svg.call(yAxis);

            let xScale = d3.scaleTime()
                .domain(d3.extent(data, d => d.time))
                .range([0, width]);

            let xAxis = d3.axisBottom(xScale)
                .ticks(d3.timeHour.every(24))
                .tickFormat(d => formatTime(d));
            svg.append('g')
                .attr('transform', `translate(0, ${height})`)
                .call(xAxis);


            svg.selectAll('circle')
                .data(data)
                .enter()
                .append('circle')
                .attr('r', 5)
                .attr('cx', d => xScale(d.time))
                .attr('cy', d => yScale(d.temp))
                .style('fill', 'steelblue');

            svg
                .append('path')
                .attr('d', () => {
                    data.unshift({temp: yScale.domain()[0], time: data[0].time});
                    data.push({temp: yScale.domain()[0], time: data[data.length - 1].time});
                    return line(data);
                })
                .style('stroke', (d, i) => ['#fa3', '#96b'][i])
                .style('stroke-width', 2)
                .style('fill', 'steelblue');

            res.send(d3n.chartHTML());
        })
});

module.exports = router;
