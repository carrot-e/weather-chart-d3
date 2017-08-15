const express = require('express');
const router = express.Router();
const D3Node = require('d3-node');

router.get('/', function(req, res, next) {
    const d3n = new D3Node({ selector: '#chart', container: '<div id="chart"></div>' }); // initializes D3 with container element
    const d3 = d3n.d3;
    const svg = d3n.createSVG(100, 100);
    // d3.select(d3n.document.querySelector('#chart')).append('span'); // insert span tag into #chart

    // d3.select(d3n.document.querySelector('#chart'))
    svg
        .append('circle')
        .attr('cx', 20)
        .attr('cy', 20)
        .attr('r', 10)
        .style('fill', 'red');

    res.render('index', { title: 'Express', chart: d3n.chartHTML() });
});

module.exports = router;
