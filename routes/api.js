const express = require('express');
const router = express.Router();
const D3Node = require('d3-node');
const d3 = require('d3');
const DataSource = require('./../bin/DataSource');
const _ = require('lodash');

router.get(`/weather/:city`, function(req, res, next) {
    const d3n = new D3Node({d3Module: d3, selector: '#chart',  container: '<div id="chart"></div>'}); // initializes D3 with container element
    const svgParent = d3n.createSVG(100, 100);

    const margin = {top: 30, right: 20, bottom: 20, left: 0};
    const fullWidth = 1200;
    const fullHeight = 400;
    const width = fullWidth - margin.left - margin.right;
    const height = fullHeight - margin.top - margin.bottom;

    const ds = new DataSource(req.params.city);
    return ds.get()
        .then(data => {
            const formatDate = d3.timeFormat('%d-%b');
            const formatTime = d3.timeFormat('%d-%b %H:%M');
            const line = d3.line()
                .x(d => xScale(d.time))
                .y(d => yScale(d.temp));

            const linePlaceholder = d3.line()
                .x(d => xScale(d.time))
                .y(height);

            let svg = svgParent
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', `translate(${margin.left}, ${margin.top})`);

            // let yExtent = d3.extent(data, d => d.temp);
            let yScale = d3.scaleLinear()
                // .domain([yExtent[0] - 5, yExtent[1]])
                .domain([0, 35])
                .range([height, 0]);

            let yAxis = d3.axisRight(yScale)
                .tickSize(width)
                .ticks(3);
            svg.call(yAxis);

            let xScale = d3.scaleTime()
                .domain(d3.extent(data, d => d.time))
                .range([0, width]);

            let xAxis = d3.axisBottom(xScale)
                .ticks(d3.timeHour.every(24))
                .tickFormat(d => formatDate(d));
            svg.append('g')
                .attr('transform', `translate(0, ${height})`)
                .call(xAxis);


            let circlesBase = svg.append('g')
                .classed('circles', true)
                .attr('transform', `translate(0, ${height})`)
                .selectAll('.circle-group')
                .data(data)
                .enter()
                .append('g')
                    .classed('circle-group', true)
                    .attr('transform', d => `translate(${xScale(d.time)})`)
                    .attr('data-transform', d => `translate(${xScale(d.time)}, ${yScale(d.temp) - height})`);

            circlesBase.append('circle')
                    .attr('r', 3);

            circlesBase.append('text')
                .text(d => `${d.temp}°C on ${formatTime(d.time)}`)
                .attr('transform', 'translate(0, -10)');



            svg.append('path')
                .attr('data-d', () => line(data))
                .attr('d', () => linePlaceholder(data))
                .classed('path', true);

            svg.append('path')
                .attr('data-d', () => {
                    data.unshift({temp: yScale.domain()[0], time: data[0].time});
                    data.push({temp: yScale.domain()[0], time: data[data.length - 1].time});

                    return line(data);
                })
                .attr('d', () => linePlaceholder(data))
                .classed('area', true);

            res.send(d3n.chartHTML());
        })
});

module.exports = router;
