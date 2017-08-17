(() => {
    const apiUrl = '/api/weather';
    const duration = 500;

    return axios.get(apiUrl)
        .then(data => {
            d3.select('#container')
                .html(data.data)
                .selectAll('circle')
                .transition()
                    .duration(duration)
                    .attr('cy', function() {
                        return d3.select(this).attr('data-cy');
                    });

            d3.select('.path')
                .transition()
                    .duration(duration)
                    .attr('d', function() {
                        return d3.select(this).attr('data-d')
                    });
        });
})();
